$(document).ready(function () {
	$.ajax({
		url: 'weblogapi',
		type: 'GET',
		dataType: 'json',
	})
	.done(function(data) {
		alert('DATA');
	})
	.fail(function(jqxhr, status, err) {
        alert(jqxhr);
    })
    .always(function(jqxhr, status, err) {
		alert('Always');
    });
});