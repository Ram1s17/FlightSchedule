var main = function () {
	"use strict"
    $("#autho-button").on("click", function(e) {
		e.preventDefault();
		var username = $(".autho-box input[type='text']").val();
		if (username !== null && username.trim() !== "") {
			$.ajax({
				'url': '/users/' + username,
				'type': 'GET'
			}).done(function(response) {
				window.location.replace('users/' + username + '/');
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				alert("ОШИБКА! Пользователь не существет!");	
			});
		}
		else
			alert("Имя пользователя не задано!");
	});
    $('input').keydown(function(e) {
        if(e.keyCode === 13) {
            $("#autho-button").click();
        }
    });
};

$(document).ready(function() {
	main();
});