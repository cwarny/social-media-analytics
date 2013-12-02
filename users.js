var MongoClient = require("mongodb").MongoClient,
	Connection = require("mongodb").Connection,
	Server = require("mongodb").Server,
	BSON = require("mongodb").BSON,
	ObjectID = require("mongodb").ObjectID;


Users = function(host, port) {
	var mongoClient = new MongoClient(new Server(host, port));
	mongoClient.open(function (){});
	this.db = mongoClient.db("sma");
};

Users.prototype.getCollection = function (callback) {
	this.db.collection("users", function (error, users) {
		if (error) {
			callback(error);
		} else {
			callback(null, users);
		}
	});
};

Users.prototype.findAll = function (callback) {
	this.getCollection(function (error, users) {
		if (error) {
			callback(error);
		} else {
			users.find().toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null,results);
				}
			});
		}
	});
}

Users.prototype.find = function (id, callback) {
	this.getCollection(function (error, users) {
		if (error) {
			callback(error);
		} else {
			users.find({"id": id}).toArray(function (error, results) {
				if (error) {
					callback(error);
				} else {
					callback(null,results);
				}
			});
		}
	});
}

Users.prototype.save = function (profile, callback) {
	this.getCollection(function (error, users) {
		if (error) {
			callback(error);
		} else {
			profile.new = true;
			users.insert(profile, {safe: true}, function (error, results) {
				if (error) {
					callback(error)
				} else {
					callback(null, results);
				}
			});
		}
	});
};

Users.prototype.update = function (id, callback) {
	this.getCollection(function (error, users) {
		if (error) {
			callback(error);
		} else {
			users.update({id: id}, {$set: {new: false}}, function (error) {
				if (error) callback(error);
				else callback(null);
			});
		}
	});
};

Users.prototype.saveTwitterTokens = function (id, tokens, callback) {
	this.getCollection(function (error, users) {
		if (error) {
			callback(error);
		} else {
			users.update({id: id}, {$set: {twitter_tokens: tokens}}, function (error) {
				if (error) callback(error);
				else callback(null);
			});
		}
	});
};

exports.Users = Users;