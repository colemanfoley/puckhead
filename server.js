var http = require('http');
var fs = require('fs');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  if (request.url === '/') {
    fs.readFile('index.html', function (err, data) {
      if (err) throw err;
      response.end(data);
    });
  } else if (request.url ==='/headtrackr.js') {
    fs.readFile('headtrackr.js', function (err, data) {
      if (err) throw err;
      response.end(data);
    });
  } else {
    fs.readFile('tracking.js', function (err, data) {
      if (err) throw err;
      response.end(data);
    });
  }

});

server.listen(8000);
