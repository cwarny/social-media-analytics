var express = require("express"),
	app = express(),
	passport = require("passport"),
	path = require("path"),
	GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
	TwitterStrategy = require("passport-twitter").Strategy,
	request = require("request"),
	async = require("async"),
	uu = require("underscore"),
	util = require("util"),
	twitterAPI = require("node-twitter-api"),
	// Users = require("./users").Users,
	// Accounts = require("./accounts").Accounts,
	refresh = require("google-refresh-token")
	schedule = require("node-schedule"),
	mongodb = require("mongodb");

var MONGODB_URI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://@ds053658.mongolab.com:53658/heroku_app20069404",
	db,
	users,
	accounts;

var TWITTER_CONSUMER_KEY = "669NaQjJ3prRexOFBfoA",
	TWITTER_CONSUMER_SECRET = "sCpxu93VDaMr2FdpJ6qvCC4IyZOjirA7LJ3KFt5E"
	GOOGLE_CLIENT_ID = "898266335618-fhhc3qu7ad057j5a70m1mr3ikttud14k.apps.googleusercontent.com",
	GOOGLE_CLIENT_SECRET = "st_nsM_HJ-RSLce5eKg1vlD0",
	GOOGLE_REDIRECT_URL = "http://socialr-s.herokuapp.com/auth/google/callback";

// var users = new Users("localhost", 27017),
// 	accounts = new Accounts("localhost", 27017);

app.configure(function () {
	app.set("port", process.env.PORT || 3000);
	app.use(express.static(path.join(__dirname, "public")));
	app.use(express.favicon());
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.session({secret: "keyboard cat"}));
	app.use(passport.initialize());
  	app.use(passport.session());
	app.use(app.router);
});

mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
	if (err) throw err;
	db = database;
	users = db.collection("users");
	accounts = db.collection("accounts");
	var server = app.listen(process.env.PORT || 3000);
	console.log("Express server started on port %s", server.address().port);
});

var twitter = new twitterAPI({
	consumerKey: TWITTER_CONSUMER_KEY,
	consumerSecret: TWITTER_CONSUMER_SECRET
});

passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: GOOGLE_REDIRECT_URL
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			users.find({id: profile.id}).toArray(function (err, user) {
				console.log(user);
				if (user.length > 0) done(err, user[0]);
				else {
					profile.access_token_google = accessToken;
					profile.refresh_token_google = refreshToken;
					profile.new = true;
					users.insert(profile, {safe: true}, function (err, user) {
						var d = new Date();
						sched(d.getHours(), d.getMinutes(), profile.id);
						done(err,user[0]);
					});
				}
			});
		});
	}
));

passport.use("twitter-authz", new TwitterStrategy({
		consumerKey: TWITTER_CONSUMER_KEY,
		consumerSecret: TWITTER_CONSUMER_SECRET,
		callbackURL: "http://socialr-s.herokuapp.com/connect/twitter/callback"
	},
	function (token, tokenSecret, profile, done) {
		return done(null,{token: token, tokenSecret: tokenSecret});
	}
));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	users.find({id: id}).toArray(function (err, user) {
		done(err, user[0]);
	});
});

app.get("/", function (req, res) {
	res.sendfile("index.html");
});

app.get("/user", function (req, res) {
	if (req.isAuthenticated()) {
		res.json({
			authenticated: true,
			user: req.user
		})
	} else {
		res.json({
			authenticated: false,
			user: null
		});
	}
});

app.get("/logout", function (req, res){
	req.logout();
	res.redirect("/");
});

app.get("/auth/google", 
	passport.authenticate("google", 
		{ 
			scope: ["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/analytics.readonly"],
			accessType: "offline"
		}),
	function (req, res) {

	}
);

app.get("/auth/google/callback", 
	passport.authenticate("google", { failureRedirect: "/" }),
	function (req, res) {
		res.redirect("/");
	}
);

app.get("/accounts", function (req, res) {
	if (req.isAuthenticated()) {
		accounts.find({userId: req.user.id}).toArray(function (err, results) {
			res.json({accounts: results});
		});
	} else {
		res.json({
			success: false
		});
	}
});

app.get("/connect/twitter",
	passport.authorize("twitter-authz", { failureRedirect: "/" })
);

app.get("/connect/twitter/callback",
	passport.authorize("twitter-authz", { failureRedirect: "/" }),
	function (req, res) {
		if (req.isAuthenticated()) {
			users.update({id: req.user.id}, {$set: {twitter_tokens: req.account}}, function (err) {
				res.redirect("/");
			});
		} else {
			res.json({
				success: false
			});
		}
	}
);

app.get("/data", function (req, res) {
	if (req.isAuthenticated()) {
		fetchData(req.user, function (err, results) {
			if (typeof(results.length) == "undefined") results = [results];
			accounts.insert(results, {safe: true}, function (err, results) {
				users.update({id: req.user.id}, {$set: {new: false}}, function (err) {
					res.send();
				});
			});
		});
	} else {
		res.json({
			success: false
		});
	}
});

// Every day, update user data

function sched(h, m, userId) {
	schedule.scheduleJob({hour: h, minute: m}, function () {
		console.log("Update for " + userId + " started...");
		users.find({id: userId}).toArray(function (err, user) {
			refresh(user[0].refresh_token_google, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, function (err, json, res) {
				if (!err & !json.error) {
					user[0].access_token_google = json.accessToken;
					fetchData(user[0], function (err, results) {
						async.each(results, function (account, cb) {
							console.log("Account id: " + account.id);
							accounts.find({id: account.id}, function (err, results) {
								if (!err) {
									async.each(account.webproperties, function (webproperty, cb) {
										if (uu.contains(uu.pluck(results[0].webproperties, "id"), webproperty.id)) {
											console.log("Webproperty id: " + webproperty.id);
											async.map(webproperty.profiles, function (profile, cb) {
												if (uu.contains(uu.pluck(uu.findWhere(results[0].webproperties, {id: webproperty.id}).profiles, "id"), profile.id)) {
													console.log("Profile id: " + profile.id);
													var old_referrers = uu.findWhere(uu.findWhere(results[0].webproperties, {id: webproperty.id}).profiles, {id: profile.id}).referrers;
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
									accounts.save(a, function (err, res) {
										console.log("New account saved.");
										cb(err);
									});
								}
							});
						}, function (err) {
							console.log("Done updating.");
						});
					});
				}
			});
		});
	});
}


// Utility functions

function nf (num,dec) {
	return ("0" + num).slice(-dec);
}

// Fetching data

function fetchData (user, cb) {
	request("https://www.googleapis.com/analytics/v3/management/accounts?access_token=" + user.access_token_google + "&access_type_token=bearer", function (error, response, body) {
		var ga_accounts = JSON.parse(body).items;
		grabWebproperties(user, ga_accounts, cb);
	});
}

function grabWebproperties (user, ga_accounts, cb) {
	async.mapSeries(ga_accounts,
		function (account, callback1) {
			console.log("Fetching data for: " + account.id);
			request("https://www.googleapis.com/analytics/v3/management/accounts/" + account.id + "/webproperties?access_token=" + user.access_token_google + "&access_type_token=bearer", function (error, response, body) {
				var webproperties = JSON.parse(body).items;
				grabProfiles(user, account, webproperties, callback1);
			})
		}, function (err, results) {
			console.log("Done fetching data");
			cb(err,results);
		}
	)
}

function grabProfiles (user, account, webproperties, callback1) {
	async.mapSeries(webproperties, 
		function (webproperty, callback2) {
			request("https://www.googleapis.com/analytics/v3/management/accounts/" + account.id + "/webproperties/" + webproperty.id + "/profiles?access_token=" + user.access_token_google + "&access_type_token=bearer", function (error, response, body) {
				var profiles = JSON.parse(body).items;
				grabReferrers(user, webproperty, profiles, callback2);
			})
		}, function (err, results) {
			account.webproperties = results;
			account.userId = user.id;
			callback1(err,account)
		}
	)
}

function grabReferrers (user, webproperty, profiles, callback2) {
	async.mapSeries(profiles, 
		function (profile, callback3) {
			var today = new Date();
			var yesterday = new Date();
			yesterday.setDate(today.getDate()-1);
			request("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A" + profile.id + "&dimensions=ga%3AfullReferrer%2Cga%3AdateHour&metrics=ga%3Avisits&filters=ga%3Asource%3D%3Dt.co&start-date=" + yesterday.getFullYear() + "-" + nf(yesterday.getMonth() + 1,2) + "-" + nf(yesterday.getDate(),2) + "&end-date=" + today.getFullYear() + "-" + nf(today.getMonth() + 1,2) + "-" + nf(today.getDate(),2) + "&access_token=" + user.access_token_google, function (error, response, body) {
				var body = JSON.parse(body);
				var referrers = [];
				if (body.hasOwnProperty("rows")) {
					var rows = body.rows;
					referrers = reformatReferrers(rows);
				}
				grabTweets(user, profile, referrers, callback3);
			})
		}, function (err, results) {
			webproperty.profiles = results;
			callback2(err,webproperty);
		}
	)
}

function grabTweets (user, profile, referrers, callback3) {
	async.mapSeries(referrers,
		function (referrer, callback4) {
			twitter.search({
				q: "http://" + referrer.fullreferrer
			},
			user.twitter_tokens.token,
			user.twitter_tokens.tokenSecret,
			function (err, data, response) {
				if (err) {
					console.log(err);
				} else {
					if (data && data.statuses !== undefined && data.statuses.length > 0) {
						var tweet = data.statuses[0];
						if (tweet.hasOwnProperty("retweeted_status")) tweet = tweet.retweeted_status;
						if (tweet.retweet_count > 0) {
							get_retweets(user, referrer, tweet, callback4);
						} else {
							callback4(err,uu.extend(referrer,tweet));
						}
					} else {
						callback4(err,referrer);
					}
				}
			}
			)
		},
		function (err, results) {
			profile.referrers = results;
			callback3(err,profile);
		}
	)
}

function get_retweets (user, referrer, tweet, callback4) {
	twitter.statuses("retweets",
		{
			id: tweet.id_str
		},
		user.twitter_tokens.token,
		user.twitter_tokens.tokenSecret,
		function (err, data, response) {
			if (data instanceof Array) tweet.retweets = data;
			callback4(err,uu.extend(referrer,tweet));
		}
	);
}

function reformatReferrers (rows) {
	var referrers = {};
	for (var i=0; i<rows.length; i++) {
		if (referrers.hasOwnProperty(rows[i][0])) {
			referrers[rows[i][0]].push({created_at: rows[i][1], count: rows[i][2]});
		} else {
			referrers[rows[i][0]] = [{created_at: rows[i][1], count: rows[i][2]}];
		}
	}
	return uu.map(uu.pairs(referrers), function (pair) {
		return {
			fullreferrer: pair[0], 
			clicks: pair[1]
		}
	});
}