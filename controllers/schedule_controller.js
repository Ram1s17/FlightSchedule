var ScheduleModel = require("../models/schedule.js"),
	mongoose = require("mongoose"),
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

ScheduleController.search = function (req, res) {
	var date = req.params.date;
	ScheduleModel.findOne({"date":new Date(date)}, function (err, schedule) {
		if (err !== null) { 
			console.log("ERROR" + err);
			res.status(500).json(err);
		} else {
			if (schedule !=  null) {
				res.status(200).json(schedule);
			} else {
				res.json(schedule);
			}
		}
	});
};

ScheduleController.createNewScheduleWithFlight = function(req, res) {
	var newScheduleWithFlight = new ScheduleModel(req.body);
	newScheduleWithFlight.save(function(err, result) {
		if (err !== null) {
			res.json(500, err); 
		} else {
			res.json(200, result);
		}
	});

};

ScheduleController.createNewDepartureFlight = function (req, res) {
	var date = req.params.date;
	var newDepartureFlight = req.body;
	ScheduleModel.updateOne({"date":new Date(date)}, {$push: {"departure": newDepartureFlight}}, function (err, flight) {
		if (err !== null) {
			res.status(500).json(err);
		} 
		else {
			res.status(200).json(flight);
		}
	});
};
	
ScheduleController.createNewArrivalFlight = function (req, res) {
	var date = req.params.date;
	var newArrivalFlight = req.body;
	ScheduleModel.updateOne({"date":new Date(date)}, {$push: {"arrival": newArrivalFlight}}, function (err, flight) {
		if (err !== null) {
			res.status(500).json(err);
		} 
		else {
			res.status(200).json(flight);
		}
	});
};

ScheduleController.updateDepartureFlight = function(req, res) {
	var updatedFlight = req.body;
	ScheduleModel.updateOne({"departure": {$elemMatch: {"_id": new mongoose.Types.ObjectId(updatedFlight.flight_id)}}},
							{$set: {"departure.$[ind].type_of_flight": updatedFlight.type_of_flight,
							"departure.$[ind].direction": updatedFlight.direction,
							"departure.$[ind].airline": updatedFlight.airline,
							"departure.$[ind].flight": updatedFlight.flight,
							"departure.$[ind].departure_time": new Date(updatedFlight.departure_time),
							"departure.$[ind].type_of_airplane": updatedFlight.type_of_airplane,
							"departure.$[ind].execution_period": updatedFlight.execution_period}},
							{"arrayFilters": [{"ind._id": new mongoose.Types.ObjectId(updatedFlight.flight_id)}]},  function (err, flight) {
		if (err !== null) {
			res.status(500).json(err);
		}
		else {
			res.status(200).json(flight);
		}
    });
};

ScheduleController.updateArrivalFlight = function(req, res) {
	var updatedFlight = req.body;
	ScheduleModel.updateOne({"arrival": {$elemMatch: {"_id": new mongoose.Types.ObjectId(updatedFlight.flight_id)}}},
							{$set: {"arrival.$[ind].type_of_flight": updatedFlight.type_of_flight,
							"arrival.$[ind].departure_city": updatedFlight.departure_city,
							"arrival.$[ind].airline": updatedFlight.airline,
							"arrival.$[ind].flight": updatedFlight.flight,
							"arrival.$[ind].arrival_time": new Date(updatedFlight.arrival_time),
							"arrival.$[ind].type_of_airplane": updatedFlight.type_of_airplane,
							"arrival.$[ind].execution_period": updatedFlight.execution_period}},
							{"arrayFilters": [{"ind._id": new mongoose.Types.ObjectId(updatedFlight.flight_id)}]},  function (err, flight) {
		if (err !== null) {
			res.status(500).json(err);
		}
		else {
			res.status(200).json(flight);
		}
    });
};

ScheduleController.destroySchedule = function(req, res) {
    var date = req.params.date;
    ScheduleModel.deleteOne({"date": new Date(date)}, function (err, schedule) {
        if (err !== null) {
            res.status(500).json(err);
        } 
        else {
            res.status(200).json(schedule);
        }
    });
};

ScheduleController.destroyDepartureSchedule = function(req, res) {
    var date = req.params.date;
    ScheduleModel.updateOne({"date": new Date(date)}, {$pull: {"departure": {}}}, function (err, schedule) {
        if (err !== null) {
            res.status(500).json(err);
        } 
        else {
            ScheduleModel.deleteOne({"departure": {$eq: []}, "arrival": {$eq: []}}, function (err1, schedule1) {
				if (err1 !== null) {
					res.status(500).json(err1);
				} 
				else {
					res.status(200).json(schedule1);
				}
			});
        }
    });
};

ScheduleController.destroyArrivalSchedule = function(req, res) {
    var date = req.params.date;
    ScheduleModel.updateOne({"date": new Date(date)}, {$pull: {"arrival": {}}}, function (err, schedule) {
        if (err !== null) {
            res.status(500).json(err);
        } 
        else {
            ScheduleModel.deleteOne({"departure": {$eq: []}, "arrival": {$eq: []}}, function (err1, schedule1) {
				if (err1 !== null) {
					res.status(500).json(err1);
				} 
				else {
					res.status(200).json(schedule1);
				}
			});
        }
    });
};

ScheduleController.deleteDepartureFlight = function(req, res) {
    var date = req.params.date;
	var flight_id = req.body.flight_id;
    ScheduleModel.updateOne({"date": new Date(date)}, {$pull: {"departure": {"_id": new mongoose.Types.ObjectId(flight_id)}}}, function (err, schedule) {
        if (err !== null) {
            res.status(500).json(err);
        } 
        else {
            ScheduleModel.deleteOne({"departure": {$eq: []}, "arrival": {$eq: []}}, function (err1, schedule1) {
				if (err1 !== null) {
					res.status(500).json(err1);
				} 
				else {
					res.status(200).json(schedule1);
				}
			});
        }
    });
};

ScheduleController.deleteArrivalFlight = function(req, res) {
    var date = req.params.date;
	var flight_id = req.body.flight_id;
    ScheduleModel.updateOne({"date": new Date(date)}, {$pull: {"arrival": {"_id": new mongoose.Types.ObjectId(flight_id)}}}, function (err, schedule) {
        if (err !== null) {
            res.status(500).json(err);
        } 
        else {
            ScheduleModel.deleteOne({"departure": {$eq: []}, "arrival": {$eq: []}}, function (err1, schedule1) {
				if (err1 !== null) {
					res.status(500).json(err1);
				} 
				else {
					res.status(200).json(schedule1);
				}
			});
        }
    });
};

module.exports = ScheduleController;