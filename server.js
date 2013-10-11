var express = require("express"),
	app = express(),
	passport = require("passport"),
	path = require("path"),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	googleapis = require('googleapis'),
	request = require("request"),
	async = require("async"),
	uu = require("underscore"),
	Twitter = require("./Twitter").Twitter,
	Referrers = require('./referrers').Referrers,
	Users = require('./users').Users;
	Accounts = require('./accounts').Accounts;

var twitter = new Twitter({
	consumerKey: "ZSQCknnf5fXbnF8xvj5PmQ",
	consumerSecret: "MtBrBUJR1kijGAiQLRfOclmEQ9JdDphH2aMB3xtT6g",
	accessToken: "347348265-hkdqdSxQHppceJIELJoTNcW3l1SbKA60SRkWPPjL",
	accessTokenSecret: "D1wgG5MUROZYQtPRZK2gYwzFcaZl61a93XfRVfdfc"
});

var referrers = new Referrers('localhost', 27017),
	users = new Users('localhost', 27017),
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
	// res.render("layout", {user: req.user});
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
		res.redirect("/#/explore");
	}
);

app.get("/accounts", function (req, res) {
	if (req.isAuthenticated()) {
		accounts.findAll(req.user.id, function (error, a) {
			res.json({
				success: true,
				accounts: a
			});
		});
	} else {
		res.json({
			success: false,
			message: "Not authenticated"
		});
	}
});

app.get("/analytics/google/reporting/:id", function (req, res) {
	var accessToken = req.user.access_token;
	var today = new Date();
	request("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A" + req.params.id + "&dimensions=ga%3AfullReferrer%2Cga%3AdateHour&metrics=ga%3Avisits&filters=ga%3Asource%3D%3Dt.co&start-date=2013-01-01&end-date=" + today.getFullYear() + "-" + nf(today.getMonth() + 1,2) + "-" + nf(today.getDate() + 1) + "&access_token=" + accessToken, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var rows = JSON.parse(body).rows;
			res.json(rows);
		}
	});
});

app.get("/referrers", function (req, res) {
	if (req.isAuthenticated()) {
		referrers.findAll(req.user.id, function (error, r) {
			res.json({
				success: true,
				referrers: r
			});
		});
	} else {
		res.json({
			success: false,
			message: "Not authenticated"
		});
	}
});

app.get("/referrers/:id", function (req, res) {
	if (req.isAuthenticated()) {
		referrers.find(req.user.id, parseInt(req.params.id), function (error,r) {
			res.json({
				success: true,
				referrer: r[0]
			});
		});
	} else {
		res.json({
			success: false,
			message: "Not authenticated"
		});
	}
});

var server = app.listen(process.env.PORT || 3000);
console.log("Express server started on port %s", server.address().port);


// Utility functions

function nf (num,dec) {
	return ("0" + num).slice(-dec);
}

function processNewUser (accessToken, refreshToken, profile, done) {
	profile.access_token = accessToken;
	profile.refresh_token = refreshToken;
	request("https://www.googleapis.com/analytics/v3/management/accounts?access_token=" + accessToken + "&access_type_token=bearer", function (error, response, body) {
		var ga_accounts = JSON.parse(body).items;
		async.map(ga_accounts, 
			function (account, callback1) {
				request("https://www.googleapis.com/analytics/v3/management/accounts/" + account.id + "/webproperties" + "?access_token=" + accessToken + "&access_type_token=bearer", function (error, response, body) {
					var webproperties = JSON.parse(body).items;
					async.map(webproperties, 
						function (webproperty, callback2) {
							request("https://www.googleapis.com/analytics/v3/management/accounts/" + account.id + "/webproperties/" + webproperty.id + "/profiles" + "?access_token=" + accessToken + "&access_type_token=bearer", function (error, response, body) {
								var profiles = JSON.parse(body).items;
								async.map(profiles, 
									function (profile, callback3) {
										var today = new Date();
										request("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A" + profile.id + "&dimensions=ga%3AfullReferrer%2Cga%3AdateHour&metrics=ga%3Avisits&filters=ga%3Asource%3D%3Dt.co&start-date=2013-01-01&end-date=" + today.getFullYear() + "-" + nf(today.getMonth() + 1,2) + "-" + nf(today.getDate() + 1,2) + "&access_token=" + accessToken, function (error, response, body) {
											var body = JSON.parse(body);
											var referrers = [];
											if (body.hasOwnProperty("rows")) {
												var rows = body.rows;
												referrers = reformatReferrers(rows);
											}
											async.map(referrers, 
												function (referrer, callback4) {
													console.log(referrer);
													twitter.search({q: "http://" + referrer.fullreferrer},
														function (err, response, body) {
															console.log("ERROR [%s]", err);
														},
														function (data) {
															console.log(data);
															referrer.tweet = JSON.parse(data).statuses[0];
															callback4(null,referrer);
														}
													)
												}, 
												function (err, results) {
													profile.referrers = referrers;
													callback3(null,profile);
												}
											)
										})
									}, function (err, results) {
										webproperty.profiles = results;
										callback2(null,webproperty);
									}
								)
							})
						}, function (err, results) {
							account.webproperties = results;
							account.userId = profile.id;
							callback1(null,account)
						}
					)
				})
			}, function (err, results) {
				accounts.save(results, function (err, accounts) {
					users.save(profile, function (err, user) {
						done(err,user[0]);
					})
				});
			}
		)
	})
}

function reformatReferrers (rows) {
	var referrers = {};
	for (var i=0; i<rows.length; i++) {
		if (referrers.hasOwnProperty(rows[i][0])) {
			referrers[rows[i][0]].push({datehour: rows[i][1], count: rows[i][2]});
		} else {
			referrers[rows[i][0]] = [{datehour: rows[i][1], count: rows[i][2]}];
		}
	}
	return uu.map(uu.pairs(referrers), function(pair) {return {id: Math.ceil(Math.random() * 100), fullreferrer: pair[0], visits: pair[1]}})
}