$(document).ready(function () {
	var POLLING_INTERVAL_MSEC = 500;
	var SCROLL_MSEC = POLLING_INTERVAL_MSEC / 2;
	var AUTOSCROLL_ENABLED = false;
	
	//
	// Prepare the comboboxes with loggers and levels
	//
	
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
		});
		
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
	
	
	//
	// Log messages
	//
	
	var interval = null;
	
	function readMessages() {
		$.ajax({
			url: 'weblogviewapi',
			type: 'GET',
			dataType: 'json',
		}).done(function(data) {
			var messages = $('#messages');
			for (var i in data) {
				messages.append(data[i]);
			}
			
			// Scroll to bottom
			if (AUTOSCROLL_ENABLED) {
				$('html, body').animate({
					   scrollTop: $(document).height()},
					   SCROLL_MSEC,
					   "swing"
					);
			}
			
		}).fail(function(jqxhr, status, err) {
	        clearInterval(interval);
	        console.log('Polling stopped, API error');
	        $('#messages').append('-- STOP -- error: ' + status + '\n');
	        $('#log_view').html("View log");
	        log_view_enabled = false;
	    });
	}
		
	var log_view_enabled = false;
	$('#log_view').click(function(){
		console.log('log_view click()');
		if(log_view_enabled) {
			clearInterval(interval);
	        console.log('Polling stopped');
	        log_view_enabled = false;
	        $('#log_view').html("View log");
	        $('#messages').append('-- STOP --\n');
		} else {
			$.ajax({
				url: 'weblogviewapi',
				type: 'POST'
			}).fail(function(jqxhr, status, err) {
		        alert('Cannot activate web appender: ' + status + err);
		    }).success(function(jqxhr, status, err) {
		    	console.log('WebAppender activated, polling started');
		    	interval = setInterval(readMessages, POLLING_INTERVAL_MSEC);
		    	$('#log_view').html("Stop");
		    	log_view_enabled = true;
		    	$('#messages').append('-- START --\n');
		    });
		}
	});
	
	
	//
	// Attach click listeners to other elements
	//
	
	$('#log_clear').click(function(){
		$('#messages').empty();
	});
	
	$('#scroll_checkbox').prop('checked', AUTOSCROLL_ENABLED);
	$('#scroll_checkbox').change(function() {
		AUTOSCROLL_ENABLED = $(this).is(":checked");
	});
	
});
