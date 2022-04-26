var mongoose = require("mongoose");

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

module.exports = ScheduleModel;