/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


http = require('http');
fs = require('fs');
path = require('path');
var qs = require('querystring');

PORT = 31410;


var JSONDatabase = {
    "Topics": 
    [
      {"ID":"12", "Title":"INTERESTING", "Link":"google.com", "Vote":"1", "replies":[]},
      
      
      
      
      {"ID":"13", "Title":"AWESOME STUFF", "Link":"reddit.com", "Vote":"2", "replies":[]}
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
  else if (request.method == 'POST'){
    if (request.url == '/postTopic'){
      var topicQuery = "";
      request.on('data', function(data){
	topicQuery += data;
      });
      request.on('end', function(){
	JSONDatabase.Topics.push(qs.parse(topicQuery));
      });
    }
    else if (request.url == '/postComment'){
      var commentQuery = "";
      request.on('data', function(data){
	commentQuery += data;
      });
      request.on('end', function(){
	var content = qs.parse(commentQuery)
	var child = {
	  "Text" : content.Reply,
	  "ID" : "reply"+content.ID,
	  "Votes" : 0,
	  "replies" : []
	};
	var allTopics = JSONDatabase.Topics;
	var i = 0;
	for (i=0; i<allTopics.length; i++){
	  if (allTopics[i].ID == content.ID){
	    allTopics[i].replies.push(child);
	    console.log(allTopics[i].replies);
	  }
	}
      });
    }
  } 
  else if (request.url == '/jsonall'){
      if (request.method == 'GET') {
            response.writeHead(200, {
                'Content-Type':'text/plain'
            });
            response.end(JSON.stringify(JSONDatabase));
      }
  }
  else {
    response.writeHead(404);
    response.end('Resource not found.');
  }
}).listen(PORT);

console.log('Server running at http://127.0.0.1:' + PORT + '/');

