var MongoClient = require('mongodb').MongoClient;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

DbInterface = function(host, port) {
	var mongoClient = new MongoClient(new Server(host, port));
	mongoClient.open(function(){});
	this.db = mongoClient.db("sma");
};

DbInterface.prototype.getCollection = function (collection, callback) {
	this.db.collection(collection, function (error, requested_collection) {
		if (error) {
			callback(error);
		} else {
			callback(null, requested_collection);
		}
	});
};

DbInterface.prototype.findAll = function (collection, callback) {
	this.getCollection(collection, function (error, requested_collection) {
		if (error) {
			callback(error);
		} else {
			requested_collection.find().toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

DbInterface.prototype.find = function(collection, id, callback) {
	this.getCollection(collection, function (error, requested_collection) {
		if (error) {
			callback(error);
		} else {
			requested_collection.find({"id":id}).toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

DbInterface.prototype.save = function (collection, items, callback) {
	this.getCollection(collection, function (error, requested_collection) {
		if (error) {
			callback(error);
		} else {
			if (typeof(items.length) == "undefined") {
				items = [items];
			}
			console.log(items);
			requested_collection.insert(items, {safe: true}, function (error, results) {
				console.log("new user added");
			});
		}
	});
};

exports.DbInterface = DbInterface;