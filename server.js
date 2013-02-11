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
//       {"ID":"0", "Title":"INTERESTING", "Link":"google.com", "Vote":"1", "replies":[
// 	{"Text":"0x0","ID":"0-0","Vote":"0","replies":[{"Text":"0x0x0","ID":"0-0-0","Vote":"0","replies":[{"Text":"0x0x0x0","ID":"0-0-0-0","Vote":"0","replies":[]}]},{"Text":"0x0x1","ID":"0-0-1","Vote":"0","replies":[]}]},{"Text":"0x1","ID":"0-1","Vote":"0","replies":[]}
// 
//       ]},
//       
//       
//       {"ID":"13", "Title":"AWESOME STUFF", "Link":"reddit.com", "Vote":"2", "replies":[]}
    ]
}
   

MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.txt': 'text/plain'
};

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
  else if (request.url == '/format.css') {
	serveFile('./format.css', response); 
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
	var str = qs.parse(topicQuery);
	var newNode = {
	  "ID" : str.ID,
	  "Title" : str.Title,
	  "Link" : str.Link,
	  "Vote" : 0,
	  "replies" : []
	};
	JSONDatabase.Topics.push(newNode);
      });
    }
    else if (request.url == '/postComment'){
      var commentQuery = "";
      request.on('data', function(data){
	commentQuery += data;
      });
      request.on('end', function(){
	var content = qs.parse(commentQuery)
	var pathIndex = content.ID.split('-');
	var allReplies = JSONDatabase.Topics[pathIndex[0]];
	var i = 0;
	for (i=1; i<pathIndex.length; i++){
	  allReplies = allReplies.replies[pathIndex[i]];
	}
	var child = {
	      "Text" : content.Reply,
	      "ID" : content.ID+ "-" +allReplies.replies.length,
	      "Vote" : 0,
	      "replies" : []
	};
	allReplies.replies.push(child);
	response.end(JSON.stringify(allReplies));
      });
    }
  } 
  else if (request.url == '/alltopics')  {
    response.writeHead(200, {'Content-Type':'text/plain'});
    response.end(JSON.stringify(JSONDatabase));
  }
  else if (request.url.substring(0,9) == '/comments'){
    var topicID = request.url.substring(9);
    response.writeHead(200, {'Content-Type':'text/plain'});
    var allTopics = JSONDatabase.Topics;
    var i = 0;
    for (i=0; i<allTopics.length; i++){
      if (allTopics[i].ID == topicID){
	response.end(JSON.stringify(allTopics[i].replies));
	console.log(JSON.stringify(allTopics));
      }
    }            
  }
  else {
    response.writeHead(404);
    response.end('Resource not found.');
  }
}).listen(PORT);

console.log('Server running at http://127.0.0.1:' + PORT + '/');

