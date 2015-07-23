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
		
		
//		var comboHtml = '<select id="combo.' + loggerName + '">';
//
//		for(var l in levels) {
//			comboHtml += '<option value="' + levels[l] + '">' + levels[l] + "</option>";
//		}
		// http://stackoverflow.com/questions/12750307/jquery-select-change-event-get-selected-option
		s.on('change', function(e) {
			var loggerName = this.id;
			var loggerLevel = this.value;
			
			$.ajax({
				url: 'weblogapi',
				type: 'POST',
				dataType: 'json',
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
});