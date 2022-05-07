var main = function (UsersObjects) {
	"use strict"
    $(".moderators-list").append($("<ul>"));
	for (var i = 1; i < UsersObjects.length; i++) {
        $(".moderators-list ul").append($("<li>").text(UsersObjects[i].username));
    }
	$(".add-moderator-button").on("click", function() {
		var username = $(".input-field[type='text']").val();
		if (username !== null && username.trim() !== "") {
			var newUser = {"username": username};
			$.post("/users", newUser, function(result) {
				console.log(result);
			}).done(function(response) {
				alert('Аккаунт создан!');
			}).fail(function(jqXHR, textStatus, error) {
				if (jqXHR.status === 501) {
					alert("Такой пользователь уже существует!");
				} else {					
					alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);	
				}
			});
		}
		else
            alert("Имя пользователя не задано!");
	});

	$(".update-moderator-button").on("click", function(e) {
        e.preventDefault();
		if ($(".input-field").val() !== null && $(".input-field").val().trim() !== "") {
			var username = $(".input-field").val();
            $.get("/user/" + username, function(user){
                if (user != null) {
                    if (user.role != "Администратор") {
                        var newUsername = prompt("Введите новое имя пользователя", $(".input-username-field").val());
                        if (newUsername !== null && newUsername.trim() !== "") {
                            $.ajax({
                                'url': '/users/' + username,
                                'type': 'PUT',
                                'data': {'username': newUsername}
                            }).done(function(responde) {
                                alert('Имя пользователя успешно изменено!');
                            }).fail(function(jqXHR, textStatus, error) {
                                alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);	
                            });
                            location.reload();
                        }
                        else 
                            alert("Новое имя пользователя не задано!");
                    }
                    else {
                        alert("Изменение аккаунта администратора запрещено!");
                        $(".input-field").val("");
                    }
                }
                else {
                    alert("Данный пользователь отсутствует в системе!");
                    $(".input-field").val("");
                }
            });
		}
        else
            alert("Имя пользователя не задано!");
	});

	$(".delete-moderator-button").on("click", function(e) {
		e.preventDefault();
		if ($(".input-field").val() !== null && $(".input-field").val().trim() !== "") {
			var username = $(".input-field").val();
            $.get("/user/" + username, function(user){
                if (user != null) {
                    if (user.role != "Администратор") {
                        if (confirm("Вы уверены, что хотите удалить пользователя " + username + "?")) {
                            $.ajax({
                                'url': '/users/' + username,
                                'type': 'DELETE',
                            }).done(function(responde) {
                                $(".input-username-field").val("");
                                alert('Пользователь успешно удален!');
                            }).fail(function(jqXHR, textStatus, error) {
                                alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);	
                            });
                            location.reload();
                        }
                    }
                    else {
                        alert("Удаление аккаунта администратора запрещено!");
                        $(".input-field").val("");
                    }
                }
                else {
                    alert("Данный пользователь отсутствует в системе!");
                    $(".input-field").val("");
                }
            });
		}
        else
            alert("Имя пользователя не задано!");
	});
}

$(document).ready(function() {
	$.getJSON("/users.json", function (UsersObjects) {
		main(UsersObjects);
	});
});