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
};

ScheduleController.searchByDepartureFlight = function (req, res) {
	var date = req.query.date;
	var flight = req.query.flight;
	ScheduleModel.aggregate([{$match: {"date": new Date(date)}}, {$unwind: "$departure"}, {$project: {"departure": 1}}, 
							{$match: {"departure.flight": {$regex: flight, $options: "i"}}}], function (err, schedule) {
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


ScheduleController.searchByArrivalFlight = function (req, res) {
	var date = req.query.date;
	var flight = req.query.flight;
	ScheduleModel.aggregate([{$match: {"date": new Date(date)}}, {$unwind: "$arrival"}, {$project: {"arrival": 1}}, 
							{$match: {"arrival.flight": {$regex: flight, $options: "i"}}}], function (err, schedule) {
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

ScheduleController.searchByDirection = function (req, res) {
	var date = req.query.date;
	var direction = req.query.direction;
	ScheduleModel.aggregate([{$match: {"date": new Date(date)}}, {$unwind: "$departure"}, {$project: {"departure": 1}}, 
							{$match: {"departure.direction": {$regex: direction, $options: "i"}}}], function (err, schedule) {
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
	ScheduleModel.aggregate([{$match: {"date": new Date(date)}}, {$unwind: "$arrival"}, {$project: {"arrival": 1}}, 
							{$match: {"arrival.departure_city": {$regex: departure_city, $options: "i"}}}], function (err, schedule) {
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