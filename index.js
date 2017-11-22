'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
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
        console.log(webhookEvent);
      });

      request({
     uri: 'https://graph.facebook.com/v2.9/650177341837555_719477614907527/private_replies',
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
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }

  });
