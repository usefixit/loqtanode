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
    uri: 'https://graph.facebook.com/v2.9/650177341837555_719451778243444/private_replies',
    qs: { access_token: "EAAY9O9xDRkYBAHt0N3EesVsuzIjp2cJ2xAfEZB2B8ZCSwoiZAgTtpfqlQZCJLqeYJ69DEb8wXeTWGBv0OPjqmyM61uRrBZCs7F8GPUlC96qZAHT4T3Cv60eGxZBZB7Uc0qcNvLV3dNgJsfHZCx3aipP3MpXNI6cJZB0h3n2vlgWYy6ZBOBR81qpzHZCCywhUnyzD8psZD" },
    method: 'POST',
    json: {'message':body}

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
