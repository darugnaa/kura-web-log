$(document).ready(function () {
	
	function createComboBox(loggerName, loggerLevel) {
		var s = $('<select />');
		
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
    })
    .always(function(jqxhr, status, err) {
		alert('Always');
    });
});