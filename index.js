'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  getUrls = require("get-urls"),
  striptags = require('striptags'),
  sopifyLink = 'https://7b6015fe2c1b20468f01807de06fd4ed:8ee4c9e3a828d5c8e5461476b8b04b70@loqta-ps.myshopify.com/admin/products.json?handle=' ,
  app = express().use(bodyParser.json()); // creates express http server

  //some global variable
  let   content = '';
  let firstLink = '';
  let productSerach = '';
  let smallDescriptionOpenTag = "[smallDescription]",
      smallDesc = '',
      smallDescriptionCloseTag = "[/smallDescription]";
  let predefinedArray = ['www.loqta.ps','http://loqta.ps','http://loqta.ps/collection'];
  let saleLink = 'https://loqta.ps/collections/sale';

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "EAAB6BRIcobUBAKTHINdnouB2XbyZC6UKqR0FgmoeVjM9IM9jTgDqQZABRBf10OFxZBZBnKBZCsYTdXBKMj75CZCvZC95lMrlrv0qxv9wBddrmZAxl53ZAZCEfQlQEbrOc3fFKvKUFNZAb3UZCaSpUpo6LxB5PVrIP5DwJbrwGgSpwD1AUgZDZD"

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
              if(changes.field=="feed" && changes.value.item=="comment" && changes.value.verb=="add"){
                //get message info for post id
                request({
                  uri: 'https://graph.facebook.com/v2.11/'+changes.value.post_id,
                  qs: { access_token: "EAAB6BRIcobUBAKTHINdnouB2XbyZC6UKqR0FgmoeVjM9IM9jTgDqQZABRBf10OFxZBZBnKBZCsYTdXBKMj75CZCvZC95lMrlrv0qxv9wBddrmZAxl53ZAZCEfQlQEbrOc3fFKvKUFNZAb3UZCaSpUpo6LxB5PVrIP5DwJbrwGgSpwD1AUgZDZD" },
                  method: 'GET'
                }, function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                     content = JSON.parse(body);
                    var setValues = getUrls(content.message).values();
                     firstLink = setValues.next().value;
                   productSerach = firstLink.substr(firstLink.lastIndexOf('/') + 1);
                    if(!predefinedArray.includes(firstLink)){
                   ////send auto comment
                   var messageData = {
                       message: "احنا متجر الكتروني بغزة وطلبك بيوصل لعندك ،السعر رح تلاقي بالرابط\n " + firstLink
                     };

                   callPrivateReplyorComment(messageData,changes.value.comment_id,"comments");

//////////////////send private messageData and get short description
                productSerach = productSerach.replace(')','');

                request({
                  uri: sopifyLink+productSerach,
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
              }else if (firstLink == saleLink) {

                var messageData = {
                    message: "أهلا وسهلا فيكم بمتجر لقطة في غزة ،، لحقوا جمعة التخفيضات واطلبوا يلي بدكم اياه من الرابط \n"+"www.loqta.ps";
                  };

                callPrivateReplyorComment(messageData,changes.value.comment_id,"comments");

              }
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
      qs: { access_token: "EAAB6BRIcobUBAKTHINdnouB2XbyZC6UKqR0FgmoeVjM9IM9jTgDqQZABRBf10OFxZBZBnKBZCsYTdXBKMj75CZCvZC95lMrlrv0qxv9wBddrmZAxl53ZAZCEfQlQEbrOc3fFKvKUFNZAb3UZCaSpUpo6LxB5PVrIP5DwJbrwGgSpwD1AUgZDZD" },
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
