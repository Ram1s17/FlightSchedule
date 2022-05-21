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
				alert('Аккаунт успешно создан!');
			}).fail(function(jqXHR, textStatus, error) {
				if (jqXHR.status === 501) {
					alert("Модератор с таким логином уже существует!");
				} else {					
					alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);	
				}
			});
		}
		else
            alert("Логин не задан!");
	});

	$(".update-moderator-button").on("click", function(e) {
        e.preventDefault();
		if ($(".input-field").val() !== null && $(".input-field").val().trim() !== "") {
			var username = $(".input-field").val();
            $.get("/user/" + username, function(user){
                if (user != null) {
                    if (user.role != "Администратор") {
                        var newUsername = prompt("Введите новый логин модератора", $(".input-username-field").val());
                        if (newUsername !== null && newUsername.trim() !== "") {
                            $.ajax({
                                'url': '/users/' + username,
                                'type': 'PUT',
                                'data': {'username': newUsername}
                            }).done(function(responde) {
                                alert('Логин успешно изменен!');
                            }).fail(function(jqXHR, textStatus, error) {
                                alert("Ошибка! Статус: " + jqXHR.status + " – " + jqXHR.textStatus);	
                            });
                            location.reload();
                        }
                        else 
                            alert("Новый логин не задан!");
                    }
                    else {
                        alert("Изменение аккаунта администратора запрещено!");
                        $(".input-field").val("");
                    }
                }
                else {
                    alert("Модератор с данным логином отсутствует в системе!");
                    $(".input-field").val("");
                }
            });
		}
        else
            alert("Логин не задан!");
	});

	$(".delete-moderator-button").on("click", function(e) {
		e.preventDefault();
		if ($(".input-field").val() !== null && $(".input-field").val().trim() !== "") {
			var username = $(".input-field").val();
            $.get("/user/" + username, function(user){
                if (user != null) {
                    if (user.role != "Администратор") {
                        if (confirm("Вы уверены, что хотите удалить аккаунт модератора " + username + "?")) {
                            $.ajax({
                                'url': '/users/' + username,
                                'type': 'DELETE',
                            }).done(function(responde) {
                                alert('Аккаунт успешно удален!');
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
                    alert("Модератор с данным логином отсутствует в системе!");
                    $(".input-field").val("");
                }
            });
		}
        else
            alert("Логин не задан!");
	});
}

$(document).ready(function() {
	$.getJSON("/users.json", function (UsersObjects) {
		main(UsersObjects);
	});
});