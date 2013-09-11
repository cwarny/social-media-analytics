var express = require("express");
var xml2js = require('xml2js');
var config = require("./config")
var tsession = require("temboo/core/temboosession");

var session = new tsession.TembooSession("cwarny", config.credentials.temboo.app.key.name, config.credentials.temboo.app.key.value);
var Google = require("temboo/Library/Google/Analytics");
var getMetricsChoreo = new Google.GetMetrics(session);
var getMetricsInputs = getMetricsChoreo.newInputSet();

getMetricsInputs.setCredential('GoogleAnalytics');

var app = express();

app.use(express.bodyParser());
app.use(express.methodOverride());

var allowCrossDomain = function(req, res, next) {
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

app.use(allowCrossDomain);

var users = {
	users: [
		{
			id: 0,
			first: 'Ryan',
			last: 'Florence',
			avatar: 'https://si0.twimg.com/profile_images/3123276865/5c069e64eb7f8e971d36a4540ed7cab2.jpeg'
		},
		{
			id: 1,
			first: 'Tom',
			last: 'Dale',
			avatar: 'https://si0.twimg.com/profile_images/1317834118/avatar.png'
		},
		{
			id: 2,
			first: 'Yehuda',
			last: 'Katz',
			avatar: 'https://si0.twimg.com/profile_images/3250074047/46d910af94e25187832cb4a3bc84b2b5.jpeg'
		}
	]
};

app.get("/users", function(req, res){
	res.json(users);
});

app.get("/users/:id", function(req, res) {
	if(users.length <= req.params.id || req.params.id < 0) {
		res.statusCode = 404;
		return res.send('Error 404: No user found');
	}

	var user = users[req.params.id];
	res.json(user);
});

app.post("/users", function(req, res) {
	if(!req.body.hasOwnProperty('first') || !req.body.hasOwnProperty('last') || !req.body.hosOwnProperty('avatar')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}

	var newUser = {
		first : req.body.first,
		last : req.body.last,
		avatar : req.body.avatar
	};

	users.push(newUser);
	res.json(true);
});

app.post("/search", function(req,res) {

	getMetricsInputs.set_Filters("ga:source==t.co");
	getMetricsInputs.set_EndDate("2013-09-11");
	getMetricsInputs.set_StartDate("2013-08-01");
	getMetricsInputs.set_Metrics("ga:visits");
	getMetricsInputs.set_Dimensions("ga:fullReferrer,ga:dateHour");
	getMetricsInputs.set_ProfileId("75218327");

	var parser = new xml2js.Parser();

	getMetricsChoreo.execute(
	    getMetricsInputs,
	    function(results){
	    	var xml = results.get_Response();
	    	parser.parseString(xml, function(err,result) {
	    		res.json(result);
	    	})
	    },
	    function(error){
	    	res.send(error.type); res.send(error.message);
	    }
	);
});

app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000');