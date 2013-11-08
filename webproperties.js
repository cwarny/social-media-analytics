var MongoClient = require("mongodb").MongoClient,
	Connection = require("mongodb").Connection,
	Server = require("mongodb").Server,
	BSON = require("mongodb").BSON,
	ObjectID = require("mongodb").ObjectID;


Webproperties = function(host, port) {
	var mongoClient = new MongoClient(new Server(host, port));
	mongoClient.open(function (){});
	this.db = mongoClient.db("sma");
};

Webproperties.prototype.getCollection = function (callback) {
	this.db.collection("webproperties", function (error, webproperties) {
		if (error) {
			callback(error);
		} else {
			callback(null, webproperties);
		}
	});
};

Webproperties.prototype.findAll = function (accountId, callback) {
	this.getCollection(function (error, webproperties) {
		if (error) {
			callback(error);
		} else {
			webproperties.find({accountId: accountId}).toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

Webproperties.prototype.find = function(id, callback) {
	this.getCollection(function (error, webproperties) {
		if (error) {
			callback(error);
		} else {
			webproperties.find({"id":id}).toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results[0]);
				}
			});
		}
	});
};

Webproperties.prototype.save = function (items, callback) {
	this.getCollection(function (error, webproperties) {
		if (error) {
			callback(error);
		} else {
			if (typeof(items.length) == "undefined") {
				items = [items];
			}
			webproperties.insert(items, {safe: true}, function (error, results) {
				if (error) {
					callback(error)
				} else {
					callback(null, results);
				}
			});
		}
	});
};

exports.Webproperties = Webproperties;