// TODO: Implement Multilevel Comment, Vote increment, Sort topics based on votes


var topicCount = 0;
function showBox(e) {
	var id = "replybox" + e;
	var box = document.getElementById(id);
	box.style.visibility="visible";
}
function showBut(e) {
	var id = "replybutton" + e;
	var button = document.getElementById(id);
	button.style.visibility="visible";
}

function addReply(e) {
	var id = "replybox" + e
	var replyInfo = document.getElementById(id);
	var querystring = "ID="+e+"&Reply="+replyInfo.value;
	$.post('/postComment', querystring);
}

function recurse(ID, sublist){
  if (sublist.length == 0){
    return;
  }
  else{
    $('#'+ID).append('<div id='+sublist.ID+'>'+sublist.Text+'</div><br><br>');
    recurse(sublist.ID, sublist.replies);
  }
}
function loadReplies(topicId){
  var path = '/comments' + topicId;
  $.get(path, function (json){
    var parsed = $.parseJSON(json);
    var id = 'commentSection'+topicId;
    $('#'+id).empty();
    $.each(parsed, function(index, value){
      recurse(id, value);
    });
  });
}

function loadTopics() {	
    $.get('/alltopics', function (json) {
      var parsed = $.parseJSON(json);
      $('#topiclist').empty();
      $.each(parsed.Topics, function(index, value){
	$('#topiclist').append('<div id =' +value.ID+ '>'+value.Title+'</div>');
	$('#'+value.ID).append('<a class="link" href="'+value.Link+'">('+value.Link+')</a>');
	$('#'+value.ID).append('<div id="vote"> '+value.Vote+' votes </div>');
	$('#'+value.ID).append('<div id= "reply'+value.ID+'"onclick=showBox('+value.ID+');showBut('+value.ID+') class="reply">Reply</div>');
	$('#'+value.ID).append('<div id="comments'+value.ID+'"onclick=loadReplies('+value.ID+') class="commentButton">comments</div>');
	$('#'+value.ID).append('<button id="replybutton'+value.ID+'"onclick=addReply('+value.ID+');loadReplies('+value.ID+') style="visibility:hidden">Post</button>');
	$('#'+value.ID).append('<input type="textarea" id="replybox'+value.ID+'"rows="100" cols="200" style="visibility:hidden" value=Reply here class="replybox">');
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
	  var querystring = "ID="+topicCount+"&Title="+topicTitle.value+"&Link="+link.value+"&Vote=0"+"&replies=[]"; 
	  $.post('/postTopic', querystring);
	  topicCount++;
	  loadTopics();
	}
	
};

