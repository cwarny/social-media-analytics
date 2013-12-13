var async = require("async"),
	uu = require("underscore"),
	refresh = require("google-refresh-token"),
	fetchData = require("./fetchData"),
	mongodb = require("mongodb");

var MONGODB_URI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
	db,
	users,
	accounts;

mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
	if (err) throw err;
	db = database;
	users = db.collection("users");
	accounts = db.collection("accounts");
	
	users.find().toArray(function (err, results) {
		async.each(results, function (user, cb) {
			console.log("User id: " + user.id);
			refresh(user.refresh_token_google, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, function (err, json, res) {
				if (err || json.error) cb(err);
				else {
					user.access_token_google = json.accessToken;
					fetchData(user, function (err, results) {
						async.each(results, function (account, cb) {
							console.log("Account id: " + account.id);
							accounts.find({id: account.id}).toArray(function (err, results) {
								if (!err && results.length > 0 && account.hasOwnProperty("webproperties")) {
									async.each(account.webproperties, function (webproperty, cb) {
										console.log("Webproperty id: " + webproperty.id);
										if (webproperty.hasOwnProperty("profiles") && uu.contains(uu.pluck(results[0].webproperties, "id"), webproperty.id)) {
											async.map(webproperty.profiles, function (profile, cb) {
												if (profile.hasOwnProperty("referrers") && uu.contains(uu.pluck(uu.findWhere(results[0].webproperties, {id: webproperty.id}).profiles, "id"), profile.id)) {
													console.log("Profile id: " + profile.id);
													var old_referrers = uu.findWhere(uu.findWhere(results[0].webproperties, {id: webproperty.id}).profiles, {id: profile.id}).referrers;
													if (old_referrers === undefined) old_referrers = [];
													var new_referrers = profile.referrers;
													var new_clicks_count = 0;
													new_referrers = new_referrers.filter(function (referrer) {
														var r = uu.findWhere(old_referrers, {fullreferrer: referrer.fullreferrer});
														if (r) {
															referrer.clicks.forEach(function (c) {
																if (!uu.contains(uu.pluck(r.clicks, "created_at"), c.created_at)) {
																	new_clicks_count++;
																	r.clicks.push(c);
																}
															});
															return false;
														} else {
															return true;
														}
													});
													console.log("Number of new referrers: " + new_referrers.length);
													console.log("Number of new clicks: " + new_clicks_count);
													profile.referrers = uu.union(old_referrers,new_referrers);
												}
												cb(null, profile);
											}, function (err, profiles) {
												accounts.update({"webproperties.id":webproperty.id},{$set:{"webproperties.$.profiles": profiles}}, function (err, results) {
													console.log("Webproperty updated.");
													cb(err);
												});
											});
										} else {
											accounts.update({id: account.id}, {$push: {webproperties: webproperty}}, function (err, results) {
												console.log("New webproperty saved.");
												cb(err);
											});
										}
									}, function (err) {
										cb(err);
									});
								} else {
									accounts.save(account, function (err, res) {
										console.log("New account saved.");
										cb(err);
									});
								}
							});
						}, function (err) {
							cb(err);
						});
					});
				}
			});
		}, function (err) {
			console.log("Done updating.");
		});
	});
});