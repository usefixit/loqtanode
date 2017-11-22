'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

app.post('/webhook', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-  Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  var data = req.body;
  callPrivateReply(data,"650177341837555_719477084907580");

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

callPrivateReply(data,"650177341837555_719468541575101");
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
  res.sendStatus(200);
});


function callPrivateReply(messageData,comment_id) {
  request({
    uri: 'https://graph.facebook.com/v2.11/'+comment_id+'/private_replies',
    qs: { access_token: "EAAY9O9xDRkYBAEYcDmKisZAFTEBommDrSUowgiigI6FmeTWFp254sWpCMFX9gqb8GMrnZBzA4EIhwXdOrxr21fY5Dr8ktHrzkcotvEeXXWtWszaBRI0TtgNMRiQ5FCTOiQHaZBx2oNGrtsVIxygzKVPC6hCm0U3lfsnycIoxuBTJOuHAGaZARCebs7ZB12BIZD" },
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
