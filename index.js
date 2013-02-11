// TODO: Implement Multilevel Comment, Vote increment, Sort topics based on votes

var topicCount = 0;

function loadReplies(topicId){
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

function showCommentBox(id){
  $('#active').remove();
  $('#'+id).append('<div id="active"></div>'); 
  $('#active').append('<button id="replybutton" onclick=addReply("'+id+'")>Post</button>');
  $('#active').append('<textarea id="replybox" rows="2" cols="50"></textarea>');
}

function addReply(e) {
	var id = "replybox";
	var replyInfo = document.getElementById(id);
	var querystring = "ID="+e+"&Reply="+replyInfo.value;
	$.post('/postComment', querystring);
	var topicId = e.split('-')[0];
	loadReplies(topicId);
}

function loadTopics() {	
    $.get('/alltopics', function (json) {
      var parsed = $.parseJSON(json);
      $('#topiclist').empty();
      $.each(parsed.Topics, function(index, value){
	$('#topiclist').append('<div id =' +value.ID+ ' class="topic">'+value.Title+'</div>');
	$('#'+value.ID).append('<a class="link" href="'+value.Link+'">('+value.Link+')</a>');
	$('#'+value.ID).append('<div id="vote" class="vote"> '+value.Vote+' votes </div>');
	$('#'+value.ID).append('<div id="replyButton' +value.ID+'"onclick=showCommentBox("'+value.ID+'") class="reply">Reply</div>');
	$('#'+value.ID).append('<div id="commentButton'+value.ID+'"onclick=loadReplies("'+value.ID+'") class="commentButton">comments</div>');
	$('#'+value.ID).append('<div id="commentSection'+value.ID+'"></div>');
      });
   });
};

function addTopic(){
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
	  var querystring = "ID="+topicCount+"&Title="+topicTitle.value+"&Link="+link.value; 
	  $.post('/postTopic', querystring);
	  topicCount++;
	  loadTopics();
	}
	
};
