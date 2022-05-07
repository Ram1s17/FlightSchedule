var express = require("express"),
	http = require("http"),
    mongoose = require("mongoose"),
    ScheduleController = require("./controllers/schedule_controller.js"),
	UserController = require("./controllers/user_controller.js"),
	app = express();

app.use('/', express.static(__dirname + "/client"));
app.use(express.urlencoded({ extended: true}));

mongoose.connect('mongodb://localhost/flight_schedule', {
		useNewUrlParser: true,
		//useCreateIndex: true,
		useUnifiedTopology: true 
}).then(res => {
	console.log("DB connected!")
}).catch(err => {
	console.log(Error, err.message);
});

http.createServer(app).listen(3000);

app.get("/data.json", ScheduleController.index);
app.get("/flights", ScheduleController.searchByFlight);
app.get("/directions", ScheduleController.searchByDirection);
app.get("/cities", ScheduleController.searchByDepartureCity);

app.get("/users/:username", UserController.show);
