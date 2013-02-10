var count = "0"

function addNewTopic(data) {
	$.ajax('/newtopic', {
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data, ["topic", "link", "vote"], "\t"),
		success: function () {
			$.getJSON('/json', function (data) {
				var topic = [];
				var i=0;
				$.each(data, function(key,val) {
					if(i == 0) {
						var id = "topic"+count;
						topic.push('<span id="'+id+'" class="topic">'+val+'&nbsp;&nbsp;</span>');
					} else if (i == 1) {
						var id = "link"+count;
						topic.push('(<a href="'+val+'" id="'+id+'" class="link">'+val+'</a>)<br>');
					} else {
						var id = "vote"+count;
						topic.push('<span id="'+id+'" class="vote">'+val+' votes &nbsp;&nbsp;&nbsp;</span>');
					}
					i++;
				});
				var repid = "reply"+count;
				var repboxid = repid+"box";
				topic.push('<span id="'+repid+'" onclick=showBox(this) class="reply">Reply</span>');
				topic.push('<input type="textarea" id="'+repboxid+'" rows="100" cols="200" style="visibility:hidden" value=Reply here class="replybox">');
				$('<li/>', {
					'class': 'litopic',
					html: topic.join('')
				}).appendTo('#topiclist');
			});
		},
		error: function() {alert("Sorry, we cannot add your topic!");}
	});
	count++;
};

function showBox(e) {
	var id = e.id+"box";
	var box = document.getElementById(id);
	box.style.visibility="visible";
}
$(document).ready(function() {
	$.get('/jsonall', function(data) {
		var topic = [];
		var i = 0;
		data = data.split(";");
		$.each(data, function(index, value) {
			i = 0;
			topic = [];
			value = JSON.parse(value);
			$.each(data, function(key,val) {
				if(i == 0) {
					var id = "topic"+count;
					topic.push('<span id="'+id+'" class="topic">'+val+'&nbsp;&nbsp;</span>');
				} else if (i == 1) {
					var id = "link"+count;
					topic.push('(<a href="'+val+'" id="'+id+'" class="link">'+val+'</a>)<br>');
				} else {
					var id = "vote"+count;
					topic.push('<span id="'+id+'" class="vote">'+val+' votes &nbsp;&nbsp;&nbsp;</span>');
				}
				i++;
			});
			var repid = "reply"+count;
			var repboxid = repid+"box";
			topic.push('<span id="'+repid+'" onclick=showBox(this) class="reply">Reply</span>');
			topic.push('<input type="textarea" id="'+repboxid+'" rows="100" cols="200" style="visibility:hidden" value=Reply here class="replybox">');
			$('<li/>', {
                        	'class': 'litopic',
                                html: topic.join('')
                        }).appendTo('#topiclist');
		});
	});


	$('#add').click(function() {
		var topicInfo = document.getElementById("topictitle");
		var linkInfo = document.getElementById("addlink");
		var topicvalue = new Object();
		topicvalue.topic = topicInfo.value;
		topicvalue.link = linkInfo.value;
		topicvalue.vote = 0;
		addNewTopic(topicvalue);
	});
});
