'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server


// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

 let body = req.body;



   // Returns a '200 OK' response to all requests
   res.status(200).send(body);


});
