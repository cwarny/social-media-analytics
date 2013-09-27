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

Users.prototype.findOrCreate = function (accessToken, refreshToken, profile, callback) {
	this.getCollection(function (error, users) {
		if (error) {
			callback(error);
		} else {
			users.findAndModify(
				{"id": profile.id},
				[],
				{
					"$set": {
						access_token: accessToken,
						refresh_token: refreshToken,
						profile: profile,
						new: false,
					}
				},
				{
					new: true,
					upsert: true
				},
				function (error, results) {
					if (error) {
						callback(error);
					} else {
						if (!results.updatedExisting) {
							users.findAndModify(
								{"id": profile.id},
								[],
								{
									"$set": {
										new: true
									}
								},
								{
									new: true,
									upsert: true
								},
								function (error, results) {
									if (error) {
										callback(error);
									} else {
										callback(null,results.value)
									}
								}
							);
						} else {
							callback(null,results.value);
						}
					}
				}
			);
		}
	});
};

exports.Users = Users;