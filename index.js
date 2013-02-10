/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {	
    $.get('/jsonall', function (json) {
        $('#topic1').append(json);
    });


	//simon's code for appending new topic, needs to be editted
	$('#add').click(function() {
		var topicTitle = document.getElementById("topic");
		var link = document.getElementById("addlink");
		$('#topiclist').append('<div id = 1>'+topicTitle.value+'</div>');
		$('$topiclist').append('(< class="title" href="'+link.value+'">link</a>');
		$('#topiclist').append('<div id="vote"> vote:0 </div>');
	});

});

    
