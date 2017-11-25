'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  getUrls = require("get-urls"),
  striptags = require('striptags'),
  app = express().use(bodyParser.json()); // creates express http server

  //some global variable
  let   content = '';
  let firstLink = '';
  let productSerach = '';
  let smallDescriptionOpenTag = "[smallDescription]",
      smallDesc = '',
      smallDescriptionCloseTag = "[/smallDescription]";

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

        // Iterate over each entry
        body.entry.forEach(function(pageEntry) {
    //Newsfeed changes webhook request

    if(pageEntry.hasOwnProperty('changes')){
            pageEntry.changes.forEach(function(changes){
              var  changeComment = changes.value;
              if(changeComment.hasOwnProperty('comment_id') && changes.value.verb=="add"){
                //get message info for post id
                request({
                  uri: 'https://graph.facebook.com/v2.11/'+changes.value.post_id,
                  qs: { access_token: "EAAY9O9xDRkYBACkqBn52XD75gbZCNbTj0BempuU0NnHmLlZC8GujSyiswlw5jN3OD1IDHylZASjzZBsL4lk1Q5kPOZAezhw32z2mYovwzSBnRFGem3Sb1clFWqPSD5F9UbWdOcpfiK0TTBuQ8MdhCSdMuwd6mqMf0qkGbfyZAKUAZDZD" },
                  method: 'GET'
                }, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                     content = JSON.parse(body);
                    var setValues = getUrls(content.message).values();
                     firstLink = setValues.next().value;
                   productSerach = firstLink.substr(firstLink.lastIndexOf('/') + 1);

                   ////send auto comment
                   var messageData = {
                       message: "احنا متجر الكتروني بغزة وطلبك بيوصل لعندك ،السعر رح تلاقي بالرابط\n " + firstLink
                     };

                   callPrivateReplyorComment(messageData,changes.value.comment_id,"comments");

//////////////////send private messageData and get short description
                request({
                  uri: ''+productSerach,
                  method: 'GET'
                }, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                       let productinfo = JSON.parse(body);
                       if(productinfo.hasOwnProperty('products')){
                       if(productinfo.products.length > 0){
                        let description =  striptags(productinfo.products[0].body_html);
                        let smallDescStartIndex = description.indexOf(smallDescriptionOpenTag);
                        let smallDescEndIndex = description.indexOf(smallDescriptionCloseTag);
                        smallDesc = description.substring(smallDescStartIndex, smallDescEndIndex).replace(/(\[.+\])/gi, '').trim();

                        var messageData = {
                        message: smallDesc + "\n"+"اطلبه الان من الرابط"+"\n"+firstLink
                        };
                //send private message
                callPrivateReplyorComment(messageData,changes.value.comment_id,"private_replies");

                }}
                  } else {
                    console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
                  }
                });
                ///////////////////////////////

                   ///////////////////////////
                  } else {
                    console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
                  }
                });

              }
            });
          }

     });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    }

res.status(200).send('EVENT_RECEIVED');

  });

  function callPrivateReplyorComment(messageData,comment_id,action) {
    request({
      uri: 'https://graph.facebook.com/v2.9/'+comment_id+'/'+action,
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
