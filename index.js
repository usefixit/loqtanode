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

 request({
    uri: 'https://graph.facebook.com/v2.9/650177341837555_719477084907580/private_replies',
    qs: { access_token: "EAAY9O9xDRkYBAEYcDmKisZAFTEBommDrSUowgiigI6FmeTWFp254sWpCMFX9gqb8GMrnZBzA4EIhwXdOrxr21fY5Dr8ktHrzkcotvEeXXWtWszaBRI0TtgNMRiQ5FCTOiQHaZBx2oNGrtsVIxygzKVPC6hCm0U3lfsnycIoxuBTJOuHAGaZARCebs7ZB12BIZD" },
    method: 'POST',
    json: body

 }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });

   // Returns a '200 OK' response to all requests
   res.status(200).send('EVENT_RECEIVED');


});
