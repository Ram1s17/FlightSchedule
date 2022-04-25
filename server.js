var express = require("express"),
	http = require("http"),
    mongoose = require("mongoose"),
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

var scheduleSchema = mongoose.Schema({	
	_id: Date,
	departure: [
	    {
		    type_of_flight: String,
		    direction: String,
		    airline: String,
		    flight: String,
		    departure_time: Date,
		    type_of_airplane: String,
		    execution_period: String
	    }
	],
	arrival: [
	    {
		    type_of_flight: String,
		    departure_city: String,
		    airline: String,
		    flight: String,
		    arrival_time: Date,
		    type_of_airplane: String,
		    execution_period: String
	    }
	]
});

var ScheduleModel = mongoose.model("Schedule", scheduleSchema, "schedule_by_dates");

app.get("/data.json", function (req, res) {
	ScheduleModel.find({}, function (err, toDos) {
		if (err !== null) {
			console.log("ERROR" + err);
		}
		else {
			res.json(toDos);
		}
	});
});
