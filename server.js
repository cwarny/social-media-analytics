var express = require("express"),
	app = express(),
	passport = require("passport"),
	path = require("path"),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
	DbInterface = require('./dbinterface').DbInterface

var dbInterface = new DbInterface('localhost', 27017);

var GOOGLE_CLIENT_ID = "898266335618-fhhc3qu7ad057j5a70m1mr3ikttud14k.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "ktNpbeUU1DBsRFkTm08nySaH";

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (obj, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

var currentToken;
passport.use(new GoogleStrategy({
	clientID: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			currentToken = accessToken;
			return done(null, profile);
		});
	}
));

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
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
  	app.use(passport.session());
	app.use(app.router);
});

app.get("/", function (req, res) {
	res.render("layout", {user: req.user});
});

app.get("/login", function (req, res) {
	res.render("login");
});

app.get('/logout', function (req, res){
	req.logout();
	res.redirect('/');
});

app.get("/auth/google", 
	passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'] }),
	function (req, res) {

	});

app.get("/auth/google/callback", 
	passport.authenticate('google', { failureRedirect: "/"}),
	function (req, res) {
		res.redirect("/#/referrers");
	});

app.get("/referrers", function (req, res) {
	if (req.isAuthenticated()) {
		console.log("authenticated");
		dbInterface.findAll("referrers", function (error, r) {
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
	referrerProvider.find("referrers", parseInt(req.params.id), function(error,r) {
		res.json({"referrer":r[0]});
	});
});

var server = app.listen(process.env.PORT || 3000);
console.log('Express server started on port %s', server.address().port);

function ensureAuthenticated (req, res, next) {
	if (req.isAuthenticated()) {
		return next(); 
	}
	res.redirect("http://localhost:3000/login")
}