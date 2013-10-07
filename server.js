var express = require("express"),
	app = express(),
	passport = require("passport"),
	path = require("path"),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	googleapis = require('googleapis'),
	request = require("request"),
	uu = require("underscore"),
	Referrers = require('./referrers').Referrers,
	Users = require('./users').Users;

var referrers = new Referrers('localhost', 27017);
var users = new Users('localhost', 27017);

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
			users.findOrCreate(accessToken, refreshToken, profile, function (err, user) {
				done(null, user);
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
		request("https://www.googleapis.com/analytics/v3/management/accounts?access_token=" + req.user.access_token + "&access_type_token=bearer", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var accounts = JSON.parse(body).items;
				res.json({
					success: true,
					accounts: accounts
				});
			}
		});
	} else {
		res.json({
			success: false,
			message: "Not authenticated"
		});
	}
});

app.get("/accounts/:id", function (req, res) {
	if (req.isAuthenticated()) {
		request("https://www.googleapis.com/analytics/v3/management/accounts/" + req.params.id + "/webproperties" + "?access_token=" + req.user.access_token + "&access_type_token=bearer", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var webproperties = JSON.parse(body).items;
				res.json({
					success: true,
					account: {id: req.params.id, webproperties: webproperties}
				});
			}
		});
	} else {
		res.json({
			success: false,
			message: "Not authenticated"
		});
	}
});

app.get("/webproperties/:id", function (req, res) {
	if (req.isAuthenticated()) {
		var accountId = req.params.id.split("-")[1];
		request("https://www.googleapis.com/analytics/v3/management/accounts/" + accountId + "/webproperties/" + req.params.id + "/profiles" + "?access_token=" + req.user.access_token + "&access_type_token=bearer", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var profiles = JSON.parse(body).items;
				res.json({
					success: true,
					webproperty: {id: req.params.id, profiles: profiles}
				});
			}
		});
	} else {
		res.json({
			success: false,
			message: "Not authenticated"
		});
	}
});

app.get("/analytics/google/reporting/", function (req, res) {
	var accessToken = req.user.access_token;
	var id = JSON.parse(body).items[0].id;
	request("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A" + id + "&dimensions=ga%3AfullReferrer%2Cga%3AdateHour&metrics=ga%3Avisits&filters=ga%3Asource%3D%3Dt.co&start-date=2013-08-28&end-date=2013-08-30&access_token=" + accessToken, function (error, response, body) {
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
		referrers.find(req.user.id, parseInt(req.params.id), function(error,r) {
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