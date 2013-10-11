var MongoClient = require("mongodb").MongoClient,
	Connection = require("mongodb").Connection,
	Server = require("mongodb").Server,
	BSON = require("mongodb").BSON,
	ObjectID = require("mongodb").ObjectID;


Accounts = function(host, port) {
	var mongoClient = new MongoClient(new Server(host, port));
	mongoClient.open(function (){});
	this.db = mongoClient.db("sma");
};

Accounts.prototype.getCollection = function (callback) {
	this.db.collection("accounts", function (error, accounts) {
		if (error) {
			callback(error);
		} else {
			callback(null, accounts);
		}
	});
};

Accounts.prototype.findAll = function (userId, callback) {
	this.getCollection(function (error, accounts) {
		if (error) {
			callback(error);
		} else {
			accounts.find({userId: userId}).toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

Accounts.prototype.save = function (items, callback) {
	this.getCollection(function (error, accounts) {
		if (error) {
			callback(error);
		} else {
			if (typeof(items.length) == "undefined") {
				items = [items];
			}
			accounts.insert(items, {safe: true}, function (error, results) {
				if (error) {
					callback(error)
				} else {
					callback(null, results);
				}
			});
		}
	});
};

exports.Accounts = Accounts;