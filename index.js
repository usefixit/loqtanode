'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

app.post('/webhook', function (req, res) {
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    data.entry.forEach(function(pageEntry) {
//Newsfeed changes webhook request

if(pageEntry.hasOwnProperty('changes')){
        pageEntry.changes.forEach(function(changes){
          if(changes.field=="feed" && changes.value.item=="comment" && changes.value.verb=="add"){
            var messageData = {
 message: "hello"
              };

callPrivateReply(messageData,changes.value.comment_id);
          }
        });
      }
//Messenger webhook request

      if(pageEntry.hasOwnProperty('messaging')){
        //messenger code goes here
      }
    });

// Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});


function callPrivateReply(messageData,comment_id) {
  request({
    uri: 'https://graph.facebook.com/v2.11/'+comment_id+'/private_replies',
    qs: { access_token: "EAAY9O9xDRkYBAK3MQGxVsf1ZCZAcJNXww76aIeRfSXZBUrFlZAyeDpLAdIS22OPScDcjZBPGBP7i4fKNhDJJZCU1r3vnnF7YqsyIDr0358UNDBBaEnZCHlpLMrchH3Av600lG12jRuFuuQV1ekmqBoICYs049NznUxfPZBh78Ewz7gZDZD" },
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
