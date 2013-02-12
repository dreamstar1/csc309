// TODO: Implement Vote increment, Sort topics based on votes
var old_id = -1;
function loadReplies(topicId){
	hideCommentBox();
	old_id = -1;
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
		$('#'+sublist.ID).append('<br><span id="vote'+sublist.ID+'" class="vote"> '+sublist.Vote+' votes </span>&nbsp;&nbsp;');
		$('#'+sublist.ID).append('<span id="replyButton'+sublist.ID+'" onclick=showCommentBox("'+sublist.ID+'") class="reply">Reply</span>&nbsp;&nbsp;&nbsp;&nbsp;');
		$('#'+sublist.ID).append('<span id="voteButton'+sublist.ID+'" onclick=voteUp("'+sublist.ID+'") class="voteup">like</span>');
		$('#'+sublist.ID).append('<div id="commentSection'+sublist.ID+'"></div>');
		$.each(sublist.replies, function(index, value){
			recurse(sublist.ID, value);
		});
	}
}

function voteUp(id) {
 /**
 * Post to server with /voteup  request to increase the vote count 
 */
	$.post('/voteup', ""+id);
	refreshPage();
	loadReplies(id.split('-')[0]);
}

function hideCommentBox(){
 /**
 * Hides the comment box from view 
 */  
	$('#active').remove();
}

function showCommentBox(id){
 /**
 * Given an id, show the comment box and the reply button 
 */
	hideCommentBox();
	if (old_id != id) {
		$('#'+id).append('<div id="active"></div>'); 
		$('#active').append('<button id="replybutton" onclick=addReply("'+id+'")>Post</button>');
		$('#active').append('<textarea id="replybox" rows="2" cols="50"></textarea>');
		old_id = id
	} else {
		old_id = -1;
	}
}

function addReply(e) {
 /**
 * Post to server with /postreply  request to post the reply
 */
	var id = "replybox";
	var replyInfo = document.getElementById(id);
	var querystring = "ID="+e+"&Reply="+replyInfo.value;
	$.post('/postReply', querystring);
	refreshPage();
	loadReplies(e.split('-')[0]);
}

function refreshPage(){
 /**
 * Refreshes the page by reloading the topiclist
 */
	$.post('/sortTopic');
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
	$('#'+parsed[e].ID).append('&nbsp;&nbsp;&nbsp;<a class="link" href="'+parsed[e].Link+'">('+parsed[e].Link+')</a><br>');
	$('#'+parsed[e].ID).append('<span id="vote'+parsed[e].ID+'" class="vote"> '+parsed[e].Vote+' votes </span>&nbsp;&nbsp;&nbsp;');
	$('#'+parsed[e].ID).append('<span id="replyButton' +parsed[e].ID+'"onclick=showCommentBox("'+parsed[e].ID+'") class="reply">Reply</span>&nbsp;&nbsp;&nbsp;');
	$('#'+parsed[e].ID).append('<span id="commentButton'+parsed[e].ID+'"onclick=controlComments("'+parsed[e].ID+'") class="commentButton">'+parsed[e].comments+' comments</span>');
	$('#'+parsed[e].ID).append('<div id="commentSection'+parsed[e].ID+'"></div>');
	loadReplies(e);
}

function addTopic(){
 /**
 * 
 */
	$.get('/alltopics', function (json) {
		var parsed = $.parseJSON(json).Topics;
		var len = parsed.length;
		var topicTitle = document.getElementById("topic");
		var link = document.getElementById("addlink");
		if (link.value == ''){
			alert("Please enter link");
		}
		else if (link.value.substring(0, 7) !== 'http://' && link.value.substring(0, 8) !== 'https://'){
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
