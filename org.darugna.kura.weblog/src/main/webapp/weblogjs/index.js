$(document).ready(function () {
	
	function createComboBox(loggerName, loggerLevel) {
		var comboHtml = '<select id="combo.' + loggerName + '">';

		levels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
		for(var l in levels) {
			comboHtml += '<option value="' + levels[l] + '">' + levels[l] + "</option>";
		}
		
		return comboHtml;
	}
	
	
	
	$.ajax({
		url: 'weblogapi',
		type: 'GET',
		dataType: 'json',
	})
	.done(function(data) {
		console.log(data);
		for (var i in data) {
			console.log(i);
			
			var txt = '<tr><td>';
			txt += data[i].name;
			txt += '</td><td>';
			txt += createComboBox(data[i].name ,data[i].level);
			txt += '</td></tr>';
//    		for (var key in data[i]){
//    			txt+= '<tr>';
//    			txt+= '<td>'+key+'</td>';
//    			txt+= '<td>'+data[i][key]+'</td>';
//    			txt+= '</tr>';
//    		}
//    		txt+= '</tr>';
			$.parseHTML(txt)
    		$('#lltable').append(txt);
		}
		
	})
	.fail(function(jqxhr, status, err) {
        alert(jqxhr);
    })
    .always(function(jqxhr, status, err) {
		alert('Always');
    });
});