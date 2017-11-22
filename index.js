'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server


// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

   console.log("here");



   // Returns a '200 OK' response to all requests
   res.status(200);


});
