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
app.get("/departure_flights", ScheduleController.searchByDepartureFlight);
app.get("/arrival_flights", ScheduleController.searchByArrivalFlight);
app.get("/directions", ScheduleController.searchByDirection);
app.get("/cities", ScheduleController.searchByDepartureCity);
app.get("/schedule/:date", ScheduleController.search);
app.post("/newScheduleWithFlight", ScheduleController.createNewScheduleWithFlight);
app.post("/newDepartureFlight/:date", ScheduleController.createNewDepartureFlight);
app.post("/newArrivalFlight/:date", ScheduleController.createNewArrivalFlight);
app.put("/departureFlight", ScheduleController.updateDepartureFlight);
app.put("/arrivalFlight", ScheduleController.updateArrivalFlight);
app.delete("/departureFlight/:date", ScheduleController.deleteDepartureFlight);
app.delete("/arrivalFlight/:date", ScheduleController.deleteArrivalFlight);
app.delete("/departureSchedule/:date", ScheduleController.destroyDepartureSchedule);
app.delete("/arrivalSchedule/:date", ScheduleController.destroyArrivalSchedule);
app.delete("/schedule/:date", ScheduleController.destroySchedule);

app.get("/users.json", UserController.index);
app.get("/user/:username", UserController.search);
app.get("/users/:username", UserController.show);
app.post("/users", UserController.create);
app.put("/users/:username", UserController.update);
app.delete("/users/:username", UserController.destroy);