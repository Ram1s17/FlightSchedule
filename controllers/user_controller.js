var UserModel = require("../models/user.js"),
    UserController = {};

UserController.index = function(req, res) {
    UserModel.find(function (err, users) {
        if (err !== null) {
            res.json(500, err);
        } else {
            res.status(200).json(users);
        }
    });
};

UserController.show = function(req, res) {
    UserModel.find({'username': req.params.username}, function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length !== 0) {
            if (result[0].role == "Администратор") {
                //res.sendfile('./client/admin_panel.html');
                console.log("Зашел администратор!");
            }
            else {
                //res.sendfile('./client/moderator_panel.html');
                console.log("Зашел модератор");
            }
        } else {
            res.send(404);
        }
    });
};

module.exports = UserController;