'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "EAAY9O9xDRkYBACkqBn52XD75gbZCNbTj0BempuU0NnHmLlZC8GujSyiswlw5jN3OD1IDHylZASjzZBsL4lk1Q5kPOZAezhw32z2mYovwzSBnRFGem3Sb1clFWqPSD5F9UbWdOcpfiK0TTBuQ8MdhCSdMuwd6mqMf0qkGbfyZAKUAZDZD"

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
  // Creates the endpoint for our webhook
  app.post('/webhook', (req, res) => {

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Iterate over each entry
        data.entry.forEach(function(pageEntry) {
    //Newsfeed changes webhook request

    if(pageEntry.hasOwnProperty('changes')){
            pageEntry.changes.forEach(function(changes){
              if(changes.field=="feed" && changes.value.item=="comment" && changes.value.verb=="add"){
                var messageData = {
                    message: "hello auto cmmenter"
                  };

    callPrivateReply(messageData,changes.value.comment_id);
              }
            });
          }

     });
});

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }

  });
  function callCommentReply(messageData,comment_id) {
  request({
    uri: 'https://graph.facebook.com/v2.11/'+comment_id+'/comments',
    qs: { access_token: "EAAY9O9xDRkYBACkqBn52XD75gbZCNbTj0BempuU0NnHmLlZC8GujSyiswlw5jN3OD1IDHylZASjzZBsL4lk1Q5kPOZAezhw32z2mYovwzSBnRFGem3Sb1clFWqPSD5F9UbWdOcpfiK0TTBuQ8MdhCSdMuwd6mqMf0qkGbfyZAKUAZDZD" },
    method: 'POST',
    json: messageData

}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}
