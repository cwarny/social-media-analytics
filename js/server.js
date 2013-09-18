var express = require("express");
var fs = require("fs");
var xml2js = require("xml2js");
var tsession = require("temboo/core/temboosession");
var uu = require("underscore");
var config = require("./config");
var ReferrerProvider = require('./referrerprovider').ReferrerProvider;

var session = new tsession.TembooSession("cwarny", config.credentials.temboo.app.key.name, config.credentials.temboo.app.key.value);
var Google = require("temboo/Library/Google/Analytics");
var getMetricsChoreo = new Google.GetMetrics(session);
var getMetricsInputs = getMetricsChoreo.newInputSet();

getMetricsInputs.setCredential('GoogleAnalytics');

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

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(allowCrossDomain);
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
	return true;

	var userToken = req.body.token || req.param("token") || req.headers.token;

	if (!currentToken || userToken != currentToken) {
		res.send(401, {error: "Invalid token. You provided: " + userToken});
		return false;
	}

	return true;
}

var referrerProvider = new ReferrerProvider('localhost', 27017);

app.get("/referrers", function (req, res){
	console.log(req.param("message"));
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
console.log('Listening on port 3000');