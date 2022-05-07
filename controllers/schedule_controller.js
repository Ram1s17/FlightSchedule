var ScheduleModel = require("../models/schedule.js"),
    ScheduleController = {};

ScheduleController.index = function(req, res) {
    ScheduleModel.find({}, function (err, schedule) {
		if (err !== null) {
			res.json(500, err);
		}
		else {
			res.status(200).json(schedule);
		}
	});
}

ScheduleController.searchByFlight = function (req, res) {
	var date = req.query.date;
	var flight = req.query.flight;
	ScheduleModel.find({"date": new Date(date), "departure.flight": flight}, {"departure": {$elemMatch: {"flight": flight}}}, function (err, schedule) {
		if (err !== null) { 
			console.log("ERROR" + err);
			res.status(500).json(err);
		} else {
			if (schedule.length > 0) {
				res.status(200).json(schedule);
			} else {
				ScheduleModel.find({"date": new Date(date), "arrival.flight": flight}, {"arrival": {$elemMatch: {"flight": flight}}}, function (err1, schedule1) {
					if (err !== null) { 
						console.log("ERROR" + err1);
						res.status(500).json(err1);
					} else {
						if (schedule1.length > 0) {
							res.status(200).json(schedule1);
						} else {
							res.json(schedule1);
						}
					}
				});
			}
		}
	});
};

ScheduleController.searchByDirection = function (req, res) {
	var date = req.query.date;
	var direction = req.query.direction;
	ScheduleModel.find({"date": new Date(date), "departure.direction": direction}, {"departure": {$elemMatch: {"direction": direction}}}, function (err, schedule) {
		if (err !== null) { 
			console.log("ERROR" + err);
			res.status(500).json(err);
		} else {
			if (schedule.length > 0) {
				res.status(200).json(schedule);
			} else {
				res.json(schedule);
			}
		}
	});
};

ScheduleController.searchByDepartureCity = function (req, res) {
	var date = req.query.date;
	var departure_city = req.query.departure_city;
	ScheduleModel.find({"date": new Date(date), "arrival.departure_city": departure_city}, {"arrival": {$elemMatch: {"departure_city": departure_city}}}, function (err, schedule) {
		if (err !== null) { 
			console.log("ERROR" + err);
			res.status(500).json(err);
		} else {
			if (schedule.length > 0) {
				res.status(200).json(schedule);
			} else {
				res.json(schedule);
			}
		}
	});
};

module.exports = ScheduleController;