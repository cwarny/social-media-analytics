var MongoClient = require("mongodb").MongoClient,
	Connection = require("mongodb").Connection,
	Server = require("mongodb").Server,
	BSON = require("mongodb").BSON,
	ObjectID = require("mongodb").ObjectID;


Profiles = function(host, port) {
	var mongoClient = new MongoClient(new Server(host, port));
	mongoClient.open(function (){});
	this.db = mongoClient.db("sma");
};

Profiles.prototype.getCollection = function (callback) {
	this.db.collection("profiles", function (error, profiles) {
		if (error) {
			callback(error);
		} else {
			callback(null, profiles);
		}
	});
};

Profiles.prototype.findAll = function (webpropertyId, callback) {
	this.getCollection(function (error, profiles) {
		if (error) {
			callback(error);
		} else {
			profiles.find({webpropertyId: webpropertyId}).toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results);
				}
			});
		}
	});
};

Profiles.prototype.find = function(id, callback) {
	this.getCollection(function (error, profiles) {
		if (error) {
			callback(error);
		} else {
			profiles.find({"id":id}).toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null, results[0]);
				}
			});
		}
	});
};

Profiles.prototype.save = function (items, callback) {
	this.getCollection(function (error, profiles) {
		if (error) {
			callback(error);
		} else {
			if (typeof(items.length) == "undefined") {
				items = [items];
			}
			profiles.insert(items, {safe: true}, function (error, results) {
				if (error) {
					callback(error)
				} else {
					callback(null, results);
				}
			});
		}
	});
};

exports.Profiles = Profiles;