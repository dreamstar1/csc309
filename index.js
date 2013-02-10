
function loadTopics() {	
    $.get('/jsonall', function (json) {
      var parsed = $.parseJSON(json);
      $.each(parsed.Topics, function(index, value){
	$('#topiclist').append('<div id = 1>'+value.Title+'</div>');
	$('#topiclist').append('<a class="title" href="'+value.Link+'">('+value.Link+')</a>');
	$('#topiclist').append('<div id="vote"> Vote:'+value.Vote+' </div><br>');
      });
   });
};

//simon's code for appending new topic, needs to be editted
function addTopic(){
	var topicTitle = document.getElementById("topic");
	var link = document.getElementById("addlink");
	$('#topiclist').append('<div id = 1>'+topicTitle.value+'</div>');
	$('#topiclist').append('<a class="title" href="'+link.value+'">('+link.value+')</a>');
	$('#topiclist').append('<div id="vote"> Vote:0 </div><br>');
	var querystring = "Title="+topicTitle.value+"&Link="+link.value+"&Vote=0"; 
	$.post('/postTopic', querystring);

};

    
