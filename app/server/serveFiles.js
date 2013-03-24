var http = require('http');
var fs = require('fs');

//router
var server = http.createServer(function (request, response) {
  if (request.url === '/') {
    fs.readFile('../client/index.html', function (err, data) {
      if (err) throw err;
      response.end(data);
    });
  } else if (request.url === '/headtrackr.js') {
    fs.readFile('headtrackr.js', function (err, data) {
      if (err) throw err;
      response.end(data);
    });
  } else if (request.url === '/tracking.js') {
    fs.readFile('tracking.js', function (err, data) {
      if (err) throw err;
      response.end(data);
    });
  } else if (request.url === '/raphael.js') {
    fs.readFile('raphael.js', function (err, data) {
      if (err) throw err;
      response.end(data);
    });
  } else if (request.url === '/style.css') {
    fs.readFile('style.css', function (err, data) {
      if (err) throw err;
      response.end(data);
    });
  }
});

server.listen(8000);