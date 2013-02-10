/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


http = require('http');
fs = require('fs');
path = require('path');

PORT = 31410;


var topicsDatabase = {
    "Topics": [
                {"Title" : "HEY TEST ONE"},
                {"Title" : "TEST 2"}
    ]
}
   

MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.txt': 'text/plain'
};

var vote = 0;
var count = 0;
function serveFile(filePath, response) {
  path.exists(filePath, function(exists) {
    if (!exists) {
      response.writeHead(404);
      response.end();
      return;
    }

    fs.readFile(filePath, function(error, content) {
      if (error) {
        response.writeHead(500);
        response.end();
        return;
      }

      var extension = path.extname(filePath);
      var mimeType = MIME_TYPES[extension];
      response.writeHead(200,
                         {'Content-Type': mimeType ? mimeType : 'text/html'});
      response.end(content, 'uft-8');
    });
  });
}


http.createServer(function(request, response) {
  console.log(request.url);
  if (request.url == '/') {
    serveFile('./index.html', response);
  }
  else if (request.url == '/index.js') {
    serveFile('./index.js', response);
  } 
  else if (request.url == '/inc') {
        vote++;
  } 
  else if (request.url == '/postTopic'){
      request.on('data', function(chunk){
      console.log("chunk");
      });
            
  } 
  else if (request.url == '/jsonall'){
      if (request.method == 'GET') {
            var len = topicsDatabase.Topics.length;
            var data = '';
            response.writeHead(200, {
                'Content-Type':'text/plain'
            });
            for (var i=0;i<len;i++){
                data += JSON.stringify(topicsDatabase.Topics[i]) + ';';
            }
            response.end(data);
      }
  }
  else {
    response.writeHead(404);
    response.end('Resource not found.');
  }
}).listen(PORT);

console.log('Server running at http://127.0.0.1:' + PORT + '/');

