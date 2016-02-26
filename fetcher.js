var express = require('express');
var api = require('instagram-node').instagram();
var https = require('https');
var http = require('http');
var app = express();
var server = http.createServer(app);
var queryig = require("./queryig.js");


// app.configure(function() {
//   // The usual...
// });

api.use({
  client_id: '1867c1408b824ad28f3659ca735fca19',
  client_secret: 'aac2ea75aa304d55ab214d5c142ba3fe'
});

var redirect_uri = 'http://localhost:3000/handleauth';

exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      queryig.startProcess(result.access_token);
      res.send('You made it!! Fetching images...');
    }
  });
};

// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/handleauth', exports.handleauth);

server.listen(3000);
console.log('Express server started on port %s', server.address().port);

// http.createServer(app).listen(app.get('port'), function(){
//   console.log("Express server listening on port " + app.get('port'));
// });
// app.listen(3000)
module.exports = app;