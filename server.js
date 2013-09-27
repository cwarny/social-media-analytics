var express = require("express"),
	app = express(),
	passport = require("passport"),
	path = require("path"),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	googleapis = require('googleapis'),
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

var GOOGLE_CLIENT_ID = "898266335618-fhhc3qu7ad057j5a70m1mr3ikttud14k.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "ktNpbeUU1DBsRFkTm08nySaH";

passport.use(new GoogleStrategy({
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/auth/google/callback",
	access_type: "offline",
	approval_prompt: "force"
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
	console.log(req.user);
	res.render("layout", {user: req.user});
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

app.get("/analytics/google", 
	googleapis
		.discover("analytics", "v3")
		.execute(function (err, client) {
			var params = { shortUrl: 'http://goo.gl/DdUKX' };
			var req1 = client.analytics.url.get(params);
			req1.execute(function (err, response) {
				console.log('Long url is', response.longUrl);
			});

			var req2 = client.plus.people.get({ userId: '+burcudogan' });
			req2.execute();
		});
);

app.get("/auth/google/callback", 
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect("/");
	}
);

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