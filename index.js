'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

 let body = req.body;

 // Checks this is an event from a page subscription
 if (body.object === 'page') {

   // Iterates over each entry - there may be multiple if batched
   body.entry.forEach(function(entry) {

     // Gets the message. entry.messaging is an array, but
     // will only ever contain one message, so we get index 0
     let webhookEvent = entry.messaging[0];
     request({
        uri: 'https://graph.facebook.com/v2.9/650177341837555_719477084907580/private_replies',
        qs: { access_token: "EAAY9O9xDRkYBAEYcDmKisZAFTEBommDrSUowgiigI6FmeTWFp254sWpCMFX9gqb8GMrnZBzA4EIhwXdOrxr21fY5Dr8ktHrzkcotvEeXXWtWszaBRI0TtgNMRiQ5FCTOiQHaZBx2oNGrtsVIxygzKVPC6hCm0U3lfsnycIoxuBTJOuHAGaZARCebs7ZB12BIZD" },
        method: 'POST',
        json: {"message":"offfff"}

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
        } else {
          console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
      });     });

   // Returns a '200 OK' response to all requests
   res.status(200).send('EVENT_RECEIVED');
 } else {
   // Returns a '404 Not Found' if event is not from a page subscription
   res.sendStatus(404);
 }

});
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

 // Your verify token. Should be a random string.
 let VERIFY_TOKEN = "EAACEdEose0cBADA7gR84fou2KqfRYD6sPTMK983I75kbir8gZB30kMJp8YpRCqMGDBsJpzWsoD0Jju3UXLGC21ZC5wY3LNH9cXFVK3NG8NqsBYx61nNqw5OLa1LZAhIIc2BeX3u6VzpZAY5DqvZBoLn7DOUZBakgs6p1xtcCfdN3MZC0Ugr3fnjoZAkncHeBevQZD";

 // Parse the query params
 let mode = req.query['hub.mode'];
 let token = req.query['hub.verify_token'];
 let challenge = req.query['hub.challenge'];

 // Checks if a token and mode is in the query string of the request
 if (mode && token) {

   // Checks the mode and token sent is correct
   if (mode === 'subscribe' && token === VERIFY_TOKEN) {

     // Responds with the challenge token from the request
     console.log('WEBHOOK_VERIFIED');
     res.status(200).send(challenge);

   } else {
     // Responds with '403 Forbidden' if verify tokens do not match
     res.sendStatus(403);
   }
 }
});
