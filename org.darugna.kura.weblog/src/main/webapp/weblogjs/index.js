$(document).ready(function () {
	
	function createComboBox(loggerName, loggerLevel) {
		var s = $('<select />', {id: loggerName});
		
		levels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
		for(var l in levels) {
			var props = {value: levels[l], text: levels[l]};
			if (levels[l] == loggerLevel) {
				props['selected'] = 'selected';
			}
		    $('<option />', props).appendTo(s);
		}
		
		// http://stackoverflow.com/questions/12750307/jquery-select-change-event-get-selected-option
		s.on('change', function(e) {
			var loggerName = this.id;
			var loggerLevel = this.value;
			
			$.ajax({
				url: 'weblogapi',
				type: 'POST',
				data: {name: loggerName, level: loggerLevel}
			}).fail(function(jqxhr, status, err) {
		        alert('Cannot set ' + loggerName + ': ' + loggerLevel);
		    })
		})
		
		return s;
	}
	
	
	
	$.ajax({
		url: 'weblogapi',
		type: 'GET',
		dataType: 'json',
	})
	.done(function(data) {
		//console.log(data);
		for (var i in data) {
			console.log(data[i]);
			var row = $('<tr />');
			$('<td />', {text: data[i].name}).appendTo(row);
			
			comboTd = $('<td />');
			combo = createComboBox(data[i].name ,data[i].level);
			combo.appendTo(comboTd);
			comboTd.appendTo(row);
			
			row.appendTo('#lltable');
		}
		
	})
	.fail(function(jqxhr, status, err) {
        alert(jqxhr);
//    })
//    .always(function(jqxhr, status, err) {
//		alert('Always');
    });
	
	
	$('#levels_showhide').click(function(){
		levels_table = $('#levels');
		levels_table.toggle();
		if (levels_table.is(":visible")){
			$('#levels_showhide').html("Hide levels");
		} else {
			$('#levels_showhide').html("Show levels");
		}
	});
	
	// get the messages
	var interval = null;
	
	function readMessages() {
		console.log('readMessages()');
		$.ajax({
			url: 'weblogviewapi',
			type: 'GET',
			dataType: 'json',
		}).done(function(data) {
			console.log(data);
			for (var i in data) {
				console.log(data[i]);
				$('#messages').append($("<p></p>").text(data[i]));
			}
		}).fail(function(jqxhr, status, err) {
	        alert(jqxhr);
	        clearInterval(interval);
	        console.log('Polling stopped');
	    });
	}
		
	
	$('#log_view').click(function(){
		console.log('log_view click()');
		$.ajax({
			url: 'weblogviewapi',
			type: 'POST'
		}).fail(function(jqxhr, status, err) {
	        alert('Cannot activate web appender: ' + err);
	    }).success(function(jqxhr, status, err) {
	    	console.log('WebAppender activated, polling started');
	    	interval = setInterval(readMessages, 2000);
	    	$('#log_view').prop("disabled",true);
	    });
	});
});