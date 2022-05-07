var main = function () {
	"use strict";
    $("#authorization-button").on("click", function() {
		var username = $("input[type='text']").val();
		if (username !== null && username.trim() !== "") {
			$.ajax({
				'url': '/users/' + username,
				'type': 'GET'
			}).done(function(response) {
				window.location.replace('users/' + username + '/');
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				alert("ОШИБКА! Пользователь не существет! (Cтатус ошибки: " + jqXHR.status + " – " + jqXHR.textStatus + ")");	
			});
		}
		else
			alert("Имя пользователя не задано!");
	});

    $('input').keydown(function(e) {
        if(e.keyCode === 13) {
            $("#authoization-button").click();
        }
    });
};

$(document).ready(function() {
	main();
});