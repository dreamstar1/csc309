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
	loadTopic(e);
	loadReplies(e.split('-')[0]);
}

function refreshPage(){
  alert("refresh");
  $.get('/alltopics', function (json) {
      var parsed = $.parseJSON(json).Topics;
      $('#topiclist').empty();
      $.each(parsed, function(index, value){
	loadTopic(index);
      });
  });
}

function loadTopic(e) {	
    $.get('/alltopics', function (json) {
	var parsed = $.parseJSON(json).Topics;
	$('#'+e).remove();
	$('#topiclist').append('<div id =' +e+ ' class="topic">'+parsed[e].Title+'</div>');
	$('#'+e).append('<a class="link" href="'+parsed[e].Link+'">('+parsed[e].Link+')</a>');
	$('#'+e).append('<div id="vote" class="vote"> '+parsed[e].Vote+' votes </div>');
	$('#'+e).append('<div id="replyButton' +e+'"onclick=showCommentBox("'+e+'") class="reply">Reply</div>');
	$('#'+e).append('<div id="commentButton'+e+'"onclick=loadReplies("'+e+'") class="commentButton">comments</div>');
	$('#'+e).append('<div id="commentSection'+e+'"></div>');
   });
};

function addTopic(){
	$.get('/alltopics', function (json) {
	  var parsed = $.parseJSON(json);
	  var len = parsed.Topics.length;
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
	    loadTopic(len);
	  }
	});  
};
