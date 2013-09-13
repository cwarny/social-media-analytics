var express = require("express");
var fs = require("fs");
var xml2js = require('xml2js');
var config = require("./config")
var tsession = require("temboo/core/temboosession");

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

    // Intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(allowCrossDomain);
});

app.get("/visits", function (req, res){
	fs.readFile("../api/visits.json", function (err,data) {
		if (err) throw err;
		return res.json(JSON.parse(data));
	});
});

app.get("/visits/:id", function (req, res) {
	fs.readFile("../api/visits.json", function (err,data) {
		if (err) throw err;
		var visits = JSON.parse(data).visits;
		if (visits.length <= req.params.id || req.params.id < 0) {
			res.statusCode = 404;
			return res.send('Error 404: No visit found');
		}
		return res.json({"visit": visits[req.params.id]});
	});
});

app.post("/fetch", function (req,res) {
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

	    		var newVisits = [];
	    		for (var entry in result.feed.entry) {
	    			var fullReferrer = entry["dxp:dimension"][0].$.value;
	    			var dateHour = entry["dxp:dimension"][1].$.value;
	    			var visits = entry["dxp.metric"][0].$.value;
	    			newVisits.push({fullReferrer:fullReferrer, dateHour:dateHour, visits:visits});
	    		}

	    		fs.readFile("../api/visits.json", function (err,data) {
	    			if (err) throw err;
	    			var visits = JSON.parse(data).visits;
	    			visits = visits.concat(newVisits);

	    			fs.writeFile("../api/visits.json", JSON.stringify(visits), function (err) {
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