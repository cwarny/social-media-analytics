var express = require("express"),
	fs = require("fs"),
	xml2js = require("xml2js"),
	uu = require("underscore"),
	config = require("./config"),
	ReferrerProvider = require('./referrerprovider').ReferrerProvider,
	http = require("http"),
	path = require("path"),
	gapi = require("./gapi");

var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure('development', function() {
	app.use(express.errorHandler());
});

app.configure(function () {
	app.set("port", process.env.PORT || 3000);
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(allowCrossDomain);
	app.use(app.router);
});

var currentToken;
app.post("/auth.json", function(req,res) {
	var body = req.body,
		username = body.username,
		password = body.password;

	if (username == "sma" && password == "password") {
		currentToken = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		res.send({
			success: true,
			token: currentToken
		});
	} else {
		res.send({
			success: false,
			message: "Invalid username/password"
		});
	}
});

function validTokenProvided(req,res) {

	var userToken = req.body.token || req.param("token") || req.headers.token;

	if (!currentToken || userToken != currentToken) {
		res.send(401, {error: "Invalid token. You provided: " + userToken});
		return false;
	}

	return true;
}

app.get('/authenticate', function (req, res) {
	res.json({url: gapi.url});
});

app.get('/oauth2callback', function(req, res) {
	var code = req.query.code;
	gapi.client.getToken(code, function (err, tokens) {
		
		// Here, store the tokens in the users collection of the sma database 
		
		gapi.client.credentials = tokens;
		getData();
	});

	res.json(true);
});

var getData = function () {
	gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function (err, results) {
		my_email = results.email;
		my_profile.name = results.name;

		// Store data in database
	});
}

var referrerProvider = new ReferrerProvider('localhost', 27017);

app.get("/referrers", function (req, res) {
	if (validTokenProvided(req,res)) {
		referrerProvider.findAll(function(error,r) {
      		res.json({"referrers":r});
    	});
	}
});

app.get("/referrers/:id", function (req, res) {
	if (validTokenProvided(req,res)) {
		referrerProvider.find(parseInt(req.params.id), function(error,r) {
			res.json({"referrer":r[0]});
		});
	}
});

app.put("/fetch", function (req,res) {
	getMetricsInputs.set_Filters("ga:source==t.co");
	getMetricsInputs.set_EndDate(req.body.endDate);
	getMetricsInputs.set_StartDate(req.body.startDate);
	getMetricsInputs.set_Metrics("ga:visits");
	getMetricsInputs.set_Dimensions("ga:fullReferrer,ga:dateHour");
	getMetricsInputs.set_ProfileId(req.body.profileId);

	var parser = new xml2js.Parser();

	getMetricsChoreo.execute(
	    getMetricsInputs,
	    function (results) {
	    	var xml = results.get_Response();
	    	parser.parseString(xml, function (err,result) {

	    		var newReferrers = {};
	    		for (var entry in result.feed.entry) {
	    			var fullreferrer = entry["dxp:dimension"][0].$.value;
	    			var datehour = entry["dxp:dimension"][1].$.value;
	    			var count = entry["dxp.metric"][0].$.value;
	    			var visit = {datehour:datehour,count:count};

	    			if (uu.has(newReferrers,fullreferrer)) {
	    				newReferrers[fullreferrer].push(visit);
	    			} else {
	    				newReferrers[fullreferrer] = [visit];
	    			}
	    		}
	    		newReferrers = uu.map(newReferrers, function(v,k) {return {"fullreferrer":k,"visits":v}});

	    		fs.readFile("../api/referrers.json", function (err,data) {
	    			if (err) throw err;
	    			var referrers = JSON.parse(data).referrers;

	    			for (var ref in newReferrers) {
	    				if (uu.has(uu.pluck(referrers, "fullreferrer")), ref.fullreferrer) {
	    					referrers[ref].visits.concat(ref.visits);
	    				} else {
	    					referrers[ref].visits = visits;
	    				}
	    			}

	    			referrers = referrers.concat(newReferrers);

	    			fs.writeFile("../api/referrers.json", JSON.stringify({"referrers":referrers}), function (err) {
	    				if (err) throw err;
						console.log("Saved");
						res.json(true);
	    			});
	    		});
	    	});
	    },
	    function (error) {
	    	res.send(error.type); res.send(error.message);
	    }
	);
});

app.listen(process.env.PORT || 3000);
console.log('Express server started on port %s', server.address().port);