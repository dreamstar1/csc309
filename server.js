http = require('http');
fs = require('fs');
path = require('path');

PORT = 31365;

STATIC_PREFIX = '/static/';

MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.txt': 'text/plain'
};

var topics = [];
var count = 0;

function serveFile(filePath, response) {
  fs.exists(filePath, function(exists) {
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
  if (request.url.indexOf(STATIC_PREFIX) == 0) {
		//reuse code from C2.
		var cache = {'/static':''};
		fs.realpath(request.url, cache, function(err, resolvedPath){
			fs.readFile(resolvedPath, function(err,data) {
				response.writeHead(200);
				response.end(data);
			});
		});
  } else {
    switch(request.url){
	case '/':
		serveFile('./index.html', response); break;
	case '/index.js':
 		serveFile('./index.js', response); break;
	case '/format.css':
		serveFile('./format.css', response); break;
	case '/newtopic':
		if (request.method == 'POST') {
			var topic = '';
			request.on('data', function(buf) {
				topic += buf;
			});
			request.on('end', function() {
				response.writeHead(200);
				response.end();
				topics[count] = JSON.parse(topic);
				count++;
			});
		} else {
			response.writeHead(405);
		} break;
	case '/json':
		if (request.method == "GET") {
			response.writeHead(200, {'Content-Type':'application/json'});
			response.end(JSON.stringify(topics[count - 1]));
		} else {
			response.wirteHead(405);
		}
		break;
	default:
		response.writeHead(404);
		response.end('Not Found');  
	}
  }
}).listen(PORT);

console.log('Server running at http://127.0.0.1:' + PORT + '/');
