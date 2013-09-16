var MongoClient = require('mongodb').MongoClient;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ReferrerProvider = function(host, port) {
	var mongoClient = new MongoClient(new Server(host, port));
	mongoClient.open(function(){});
	this.db = mongoClient.db("sma");
};

ReferrerProvider.prototype.getCollection = function(callback) {
	this.db.collection('referrers', function(error, referrer_collection) {
	if(error) callback(error);
	else callback(null, referrer_collection);
	});
};

ReferrerProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error, referrer_collection) {
	if(error) callback(error)
	else {
		referrer_collection.find().toArray(function(error, results) {
		if(error) callback(error)
		else callback(null, results)
		});
	}
	});
};

ReferrerProvider.prototype.find = function(id, callback) {
	this.getCollection(function(error, referrer_collection) {
	if(error) callback(error)
	else {
		referrer_collection.find({"id":id}).toArray(function(error, results) {
		if(error) callback(error)
		else callback(null, results)
		});
	}
	});
};

ReferrerProvider.prototype.save = function(referrers, callback) {
	this.getCollection(function(error, referrer_collection) {
	if(error) callback(error);
	else {
		if (typeof(referrers.length)=="undefined") referrers = [referrers];
		referrer_collection.insert(referrers, function() {
		callback(null, referrers);
		});
	}
	});
};

exports.ReferrerProvider = ReferrerProvider;