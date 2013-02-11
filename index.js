// TODO: Implement Vote increment, Sort topics based on votes

var topicCount = 0;

function loadReplies(topicId){
  hideCommentBox();
  var path = '/comments' + topicId;
  $.get(path, function (json){
    var parsed = $.parseJSON(json);
    var id = 'commentSection'+topicId
    $('#'+id).empty();
    $.each(parsed, function(index, value){
	recurse(topicId, value);
    });
  });
}


function recurse(ID, sublist){
  if (sublist.ID==undefined){
    return;
  }
  else{
      $('#commentSection'+ID).append('<div id='+sublist.ID+' class="comment">'+sublist.Text+'</div>');
      $('#'+sublist.ID).append('<div id="vote" class="vote"> '+sublist.Vote+' votes </div>');
      $('#'+sublist.ID).append('<div id="replyButton'+sublist.ID+'"onclick=showCommentBox("'+sublist.ID+'") class="reply">Reply</div>');
      $('#'+sublist.ID).append('<div id="commentSection'+sublist.ID+'"></div>');
      $.each(sublist.replies, function(index, value){
	recurse(sublist.ID, value);
      });
  }
}

function hideCommentBox(){
  $('#active').remove();
}

function showCommentBox(id){
  hideCommentBox();
  $('#'+id).append('<div id="active"></div>'); 
  $('#active').append('<button id="replybutton" onclick=addReply("'+id+'")>Post</button>');
  $('#active').append('<textarea id="replybox" rows="2" cols="50"></textarea>');
}

function addReply(e) {
	var id = "replybox";
	var replyInfo = document.getElementById(id);
	var querystring = "ID="+e+"&Reply="+replyInfo.value;
	$.post('/postComment', querystring);
	loadReplies(e.split('-')[0]);
}

function refreshPage(){
  $.get('/alltopics', function (json) {
      var parsed = $.parseJSON(json).Topics;
      $('#topiclist').empty();
      for(var i=0; i<parsed.length; i++){
	loadTopic(i, parsed);
      }
  });
}

function loadTopic(e, parsed) {	
	$('#'+parsed[e].ID).remove();
	$('#topiclist').append('<div id =' +parsed[e].ID+ ' class="topic">'+parsed[e].Title+'</div>');
	$('#'+parsed[e].ID).append('<a class="link" href="'+parsed[e].Link+'">('+parsed[e].Link+')</a>');
	$('#'+parsed[e].ID).append('<div id="vote" class="vote"> '+parsed[e].Vote+' votes </div>');
	$('#'+parsed[e].ID).append('<div id="replyButton' +parsed[e].ID+'"onclick=showCommentBox("'+parsed[e].ID+'") class="reply">Reply</div>');
	$('#'+parsed[e].ID).append('<div id="commentButton'+parsed[e].ID+'"onclick=loadReplies("'+parsed[e].ID+'") class="commentButton">comments</div>');
	$('#'+parsed[e].ID).append('<div id="commentSection'+parsed[e].ID+'"></div>');
}

function addTopic(){
	$.get('/alltopics', function (json) {
	  var parsed = $.parseJSON(json).Topics;
	  var len = parsed.length;
	  var topicTitle = document.getElementById("topic");
	  var link = document.getElementById("addlink");
	  if (link.value == ''){
	    alert("Please enter link");
	  }
	  else if (link.value.substring(0, 7) !== 'http://' &&
		  link.value.substring(0, 8) !== 'https://'){
	    alert("Please provide a valid http link");
	  }
	  else{
	    var querystring = "ID="+len+"&Title="+topicTitle.value+"&Link="+link.value; 
	    $.post('/postTopic', querystring);
	    refreshPage();
	    loadTopic(len, parsed);
	  }
	});  
};
