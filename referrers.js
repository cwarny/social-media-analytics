var MongoClient = require('mongodb').MongoClient;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

Referrers = function(host, port) {
	var mongoClient = new MongoClient(new Server(host, port));
	mongoClient.open(function (){});
	this.db = mongoClient.db("sma");
};

Referrers.prototype.getCollection = function (callback) {
	this.db.collection("referrers", function (error, referrers) {
		if (error) {
			callback(error);
		} else {
			callback(null, referrers);
		}
	});
};

Referrers.prototype.findAll = function (profileId, callback) {
	this.getCollection(function (error, referrers) {
		if (error) {
			callback(error);
		} else {
			referrers.find({profileId: profileId}).toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

Referrers.prototype.find = function(id, callback) {
	this.getCollection(function (error, referrers) {
		if (error) {
			callback(error);
		} else {
			referrers.find({"id":id}).toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

Referrers.prototype.save = function (items, callback) {
	this.getCollection(function (error, referrers) {
		if (error) {
			callback(error);
		} else {
			if (typeof(items.length) == "undefined") {
				items = [items];
			}
			referrers.insert(items, {safe: true}, function (error, results) {
				if (error) {
					callback(error)
				} else {
					callback(null, results);
				}
			});
		}
	});
};

exports.Referrers = Referrers;