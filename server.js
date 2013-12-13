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
	refresh = require("google-refresh-token"),
	schedule = require("node-schedule"),
	mongodb = require("mongodb"),
	fetchData = require("./fetchData");

var MONGODB_URI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
	db,
	users,
	accounts;

var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY,
	TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET,
	TWITTER_REDIRECT_URL = process.env.TWITTER_REDIRECT_URL,
	GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL; 

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
				if (user.length > 0) done(err, user[0]);
				else {
					console.log("New user");
					profile.access_token_google = accessToken;
					profile.refresh_token_google = refreshToken;
					profile.new = true;
					users.insert(profile, {safe: true}, function (err, user) {
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
		callbackURL: TWITTER_REDIRECT_URL
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
			accessType: "offline",
			approvalPrompt: "force"
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
			if (results.length === undefined) results = [results];
			accounts.insert(results, {safe: true}, function (err, results) {
				users.findAndModify({id: req.user.id}, [], {$set: {new: false}}, {new: true}, function (err, user) {
					res.json(user);
				});
			});
		});
	} else {
		res.json({
			success: false
		});
	}
});