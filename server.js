var express = require("express"),
	app = express(),
	passport = require("passport"),
	path = require("path"),
	GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
	googleapis = require("googleapis"),
	request = require("request"),
	async = require("async"),
	uu = require("underscore"),
	util = require("util"),
	twitterAPI = require("node-twitter-api"),
	Users = require("./users").Users,
	Accounts = require("./accounts").Accounts;

var credentials = [
	{
		consumer_key:"669NaQjJ3prRexOFBfoA",
		consumer_secret:"sCpxu93VDaMr2FdpJ6qvCC4IyZOjirA7LJ3KFt5E",
		access_token: "347348265-E594Wcn9HMKKCkQWZHNQgXoBsyLYOUVcdZrNDxOJ",
		access_token_secret: "hnJ2QfN9rvtOoHcnPueWtLXEaodN7zk5ek9KfG2B884"
	},
	{
		consumer_key:"ZSQCknnf5fXbnF8xvj5PmQ",
		consumer_secret:"MtBrBUJR1kijGAiQLRfOclmEQ9JdDphH2aMB3xtT6g",
		access_token: "347348265-hkdqdSxQHppceJIELJoTNcW3l1SbKA60SRkWPPjL",
		access_token_secret: "D1wgG5MUROZYQtPRZK2gYwzFcaZl61a93XfRVfdfc"
	},
	{
		consumer_key:"aQkA8hC8h4Trg6HkhcpsCQ",
		consumer_secret:"BVVay4EH1pbVwLPVK7u5cw2gAovlQWzcfMRKErZavA",
		access_token: "347348265-yAev2rxPrHjwMMvA3s2lWv5JCJBdKxgqH17J1shQ",
		access_token_secret: "lUlGUTsReYQrhzDQzR25fRzxWR3z34spmxd4jXQEU"
	},
	{
		consumer_key:"o46YVuxoaSAXvObObeXw",
		consumer_secret:"TeQFAvud0InVJkD3hHVki1zY3bxqhlEqF3UTuQc",
		access_token: "347348265-mM3OgkDKe6K2OoHSqHJMUvefKQsSvQ9gZfzQLK34",
		access_token_secret: "v91qeIMKebcOqNMAAszy6YadiGAf57bWaX0wys4Ox4"
	},
	{
		consumer_key:"1j38Lof7ffvBor64utpEdQ",
		consumer_secret:"d8m0ceCV3LVR1wtMf2j8AvkKActmkjnG8llNerwl6aI",
		access_token: "347348265-Sz2pziQsQvUmJYAPu9At24BZPndR07Z5qsWJmTtG",
		access_token_secret: "MymTefV8vFEUmHe23pKU0QTdMwLI70LGckHIJJnmA9D2y"
	},
	{
		consumer_key:"krs1M635qyXe2wARwiZGA",
		consumer_secret:"MUBnfK3Zw8TiiVgtFF3sgtheQgULwh88AF9fLFeUncw",
		access_token: "347348265-ZS3yz4yO4cggQwboDLH4MzETCNdMUkQtmOeANkQb",
		access_token_secret: "VYJ1QoNoHbqgVR4ASUGgo9y5iOywqwiRXrtl57NrLbBYH"
	},
	{
		consumer_key:"7Dx0GLiOZ6c2wITdayZTw",
		consumer_secret:"OjBc9rZBB3gIQLYvyAHp4mIwxKuDmvRa95UPXewrer8",
		access_token: "347348265-dAmHs4jSr3IaKcOx0LmTh1Lfi04WmAgY2AvFBf5H",
		access_token_secret: "D55dYJNxFkrvILjPVyd1zFzXLScYvPbbae43CgnLxwGAU"
	},
	{
		consumer_key:"OZEQHrFcMmtUTuApDUFEA",
		consumer_secret:"gPyymP4FQNrCMmE6dBJmq62GtgXTQO7q2rL9oPF6alU",
		access_token: "347348265-cZ4JYFLeYb2k0HIGbMk90JoWJwqM2sZuqlSKYf5t",
		access_token_secret: "uhkBU1XMamP3h04ZShIOw9sFkJrGuxMnbWFbs4c8XoCuj"
	}
];

var n = 0;

var twitter = new twitterAPI({
	consumerKey: credentials[n].consumer_key,
	consumerSecret: credentials[n].consumer_secret
});

var users = new Users('localhost', 27017),
	accounts = new Accounts('localhost', 27017);

app.configure(function () {
	app.set("port", process.env.PORT || 3000);
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");
	app.set("view options", {layout: false});
	app.use(require("stylus").middleware(__dirname + "/public"));
	app.use(express.static(path.join(__dirname, "public")));
	app.use(express.favicon());
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.session({secret: 'keyboard cat'}));
	app.use(passport.initialize());
  	app.use(passport.session());
	app.use(app.router);
});

var GOOGLE_CLIENT_ID = "898266335618-fhhc3qu7ad057j5a70m1mr3ikttud14k.apps.googleusercontent.com",
	GOOGLE_CLIENT_SECRET = "ktNpbeUU1DBsRFkTm08nySaH",
	GOOGLE_REDIRECT_URL = "http://localhost:3000/auth/google/callback";

passport.use(new GoogleStrategy({
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	callbackURL: GOOGLE_REDIRECT_URL,
	access_type: "offline"
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			users.find(profile.id, function (err, user) {
				if (user.length > 0) {
					done(err, user[0]);
				} else {
					console.log("Processing new user.");
					processNewUser(accessToken, refreshToken, profile, done);
				}
			});
		});
	}
));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	users.find(id, function (err, user) {
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

app.get("/login", function (req, res) {
	res.render("login");
});

app.get("/logout", function (req, res){
	req.logout();
	res.redirect("/");
});

app.get("/auth/google", 
	passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/analytics.readonly"] }),
	function (req, res) {

	}
);

app.get("/auth/google/callback", 
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect("/#/accounts");
	}
);

app.get("/accounts", function (req, res) {
	if (req.isAuthenticated()) {
		accounts.findAll(req.user.id, function (error, a) {
			res.json({accounts: a});
		});
	} else {
		res.json({
			success: false
		});
	}
});

app.get("/analytics/google/reporting/:id", function (req, res) {
	var accessToken = req.user.access_token;
	var today = new Date();
	request("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A" + req.params.id + "&dimensions=ga%3AfullReferrer%2Cga%3AdateHour&metrics=ga%3Avisits&filters=ga%3Asource%3D%3Dt.co&start-date=2013-01-01&end-date=" + today.getFullYear() + "-" + nf(today.getMonth() + 1,2) + "-" + nf(today.getDate() + 1) + "&access_token=" + accessToken, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			var rows = JSON.parse(body).rows;
			res.json(rows);
		}
	});
});

var server = app.listen(process.env.PORT || 3000);
console.log("Express server started on port %s", server.address().port);


// Utility functions

function nf (num,dec) {
	return ("0" + num).slice(-dec);
}

function processNewUser (accessToken, refreshToken, user, done) {
	user.access_token = accessToken;
	user.refresh_token = refreshToken;
	request("https://www.googleapis.com/analytics/v3/management/accounts?access_token=" + accessToken + "&access_type_token=bearer", function (error, response, body) {
		var ga_accounts = JSON.parse(body).items;
		grabWebproperties(user, ga_accounts, done);
	})
}

function grabWebproperties (user, ga_accounts, done) {
	console.log("Step 1");
	async.mapSeries(ga_accounts, 
		function (account, callback1) {
			console.log("Account: " + account.name);
			request("https://www.googleapis.com/analytics/v3/management/accounts/" + account.id + "/webproperties?access_token=" + user.access_token + "&access_type_token=bearer", function (error, response, body) {
				var webproperties = JSON.parse(body).items;
				grabProfiles(user, account, webproperties, callback1);
			})
		}, function (err, results) {
			accounts.save(results, function (err, accounts) {
				users.save(user, function (err, user) {
					done(err,user[0]);
				})
			});
		}
	)
}

function grabProfiles (user, account, webproperties, callback1) {
	console.log("Step 2");
	async.mapSeries(webproperties, 
		function (webproperty, callback2) {
			console.log("Webproperty: " + webproperty.name);
			request("https://www.googleapis.com/analytics/v3/management/accounts/" + account.id + "/webproperties/" + webproperty.id + "/profiles?access_token=" + user.access_token + "&access_type_token=bearer", function (error, response, body) {
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
	console.log("Step 3");
	async.mapSeries(profiles, 
		function (profile, callback3) {
			console.log("Profile: " + profile.name);
			var today = new Date();
			request("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A" + profile.id + "&dimensions=ga%3AfullReferrer%2Cga%3AdateHour&metrics=ga%3Avisits&filters=ga%3Asource%3D%3Dt.co&start-date=2013-11-11&end-date=" + today.getFullYear() + "-" + nf(today.getMonth() + 1,2) + "-" + nf(today.getDate(),2) + "&access_token=" + user.access_token, function (error, response, body) {
				var body = JSON.parse(body);
				var referrers = [];
				if (body.hasOwnProperty("rows")) {
					var rows = body.rows;
					referrers = reformatReferrers(rows);
				}
				grabTweets(profile, referrers, callback3);
			})
		}, function (err, results) {
			webproperty.profiles = results;
			callback2(err,webproperty);
		}
	)
}

var theTweet;

function grabTweets (profile, referrers, callback3) {
	console.log("Step 4");
	async.mapSeries(referrers, 
		function (referrer, callback4) {
			console.log(referrer.fullreferrer);
			twitter.search({
					q: "http://" + referrer.fullreferrer
				},
				credentials[n].access_token,
				credentials[n].access_token_secret,
				function (err, data, response) {
					if (err) {
						n++;
						if (n === credentials.length) n = 0;
						console.log("SWITCHING CREDENTIALS: " + n);
						twitter = new twitterAPI({
							consumerKey: credentials[n].consumer_key,
							consumerSecret: credentials[n].consumer_secret
						});
						grabTweets(profile,referrers,callback3);
					} else {
						if (data && data.statuses !== undefined && data.statuses.length > 0) {
							theTweet =  data.statuses[0];
							if (theTweet.hasOwnProperty("retweeted_status")) theTweet = theTweet.retweeted_status;
							theTweet = [theTweet];
							// referrer = uu.extend(referrer,tweet);
							// callback4(err,referrer);
							build_tweet_tree(referrer, theTweet, 0, callback4);
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

function build_tweet_tree (referrer, tweets, depth, callback4) {
	console.log("Step 5");
	depth++;
	console.log(depth);
	async.mapSeries(tweets, 
		function (tweet, callback) {
			findChildren(referrer, tweet, depth, callback4, callback)
		},
		function (err, results) {
			callback4(err,uu.extend(referrer,theTweet[0]));
		}
	);
}

function findChildren (referrer, tweet, depth, callback4, callback) {
	console.log("id: " + tweet.id_str);
	async.series([
			function (cb) {
				get_retweets(tweet,cb);
			},
			function (cb) {
				get_replies(tweet,cb);
			}
		],
		function (err, results) {
			if (err) {
				n++;
				if (n === credentials.length) n = 0;
				console.log("SWITCHING CREDENTIALS: " + n);
				twitter = new twitterAPI({
					consumerKey: credentials[n].consumer_key,
					consumerSecret: credentials[n].consumer_secret
				});
				findChildren(referrer,tweet,depth,callback4,callback);
			} else {
				tweet.children = uu.flatten(results);
				if (depth < 3) {
					build_tweet_tree(referrer, tweet.children, depth, callback4);
				} else {
					callback(err,tweet.children);
				}
			}
		}
	);
}

function get_retweets (tweet,cb) {
	if (tweet.retweet_count > 0) {
		twitter.statuses("retweets",
			{
				id: tweet.id_str
			},
			credentials[n].access_token,
			credentials[n].access_token_secret,
			function (err, data, response) {
				if (data instanceof Array) {
					console.log("RETWEETS: " + data.length);
					console.log(data);
					cb(err,data);
				} else {
					cb(err,[]);
				}
			}
		);
	} else {
		cb(null,[]);
	}
}

function get_replies (tweet,cb) {
	var q = util.format("@%s", tweet.user.screen_name);
	twitter.search({
			q: q
		},
		credentials[n].access_token,
		credentials[n].access_token_secret,
		function (err, data, response) {
			if (data && data.statuses !== undefined && data.statuses.length > 0) {
				var statuses = data.statuses.filter(function (d) {
					return d.in_reply_to_status_id_str == tweet.id_str;
				});
				console.log("REPLIES: " + statuses.length);
				console.log(statuses);
				cb(err, statuses);
			} else {
				cb(err, []);
			}
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
	})
}