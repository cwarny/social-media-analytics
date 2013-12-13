var request = require("request"),
	async = require("async"),
	uu = require("underscore"),
	twitterAPI = require("node-twitter-api"),
	mongodb = require("mongodb");

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

var twitter = new twitterAPI({
	consumerKey: TWITTER_CONSUMER_KEY,
	consumerSecret: TWITTER_CONSUMER_SECRET
});

// Fetching data

module.exports = function (user, cb) {
	mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
		if (err) throw err;
		db = database;
		users = db.collection("users");
		accounts = db.collection("accounts");

		request("https://www.googleapis.com/analytics/v3/management/accounts?access_token=" + user.access_token_google + "&access_type_token=bearer", function (error, response, body) {
			var ga_accounts = JSON.parse(body).items;
			if (ga_accounts) grabWebproperties(user, ga_accounts, cb);
			else cb(null, []);
		});
	});
}

function grabWebproperties (user, ga_accounts, cb) {
	async.mapSeries(ga_accounts,
		function (account, callback1) {
			console.log("Fetching data for: " + account.id);
			request("https://www.googleapis.com/analytics/v3/management/accounts/" + account.id + "/webproperties?access_token=" + user.access_token_google + "&access_type_token=bearer", function (error, response, body) {
				var webproperties = JSON.parse(body).items;
				if (webproperties) grabProfiles(user, account, webproperties, callback1);
				else callback1(null, account);
			});
		}, function (err, results) {
			console.log("Done fetching data");
			cb(err, results);
		}
	)
}

function grabProfiles (user, account, webproperties, callback1) {
	async.mapSeries(webproperties, 
		function (webproperty, callback2) {
			request("https://www.googleapis.com/analytics/v3/management/accounts/" + account.id + "/webproperties/" + webproperty.id + "/profiles?access_token=" + user.access_token_google + "&access_type_token=bearer", function (error, response, body) {
				var profiles = JSON.parse(body).items;
				if (profiles) grabReferrers(user, webproperty, profiles, callback2);
				else callback2(null, webproperty);
			});
		}, function (err, results) {
			account.webproperties = results;
			account.userId = user.id;
			callback1(err, account);
		}
	)
}

function grabReferrers (user, webproperty, profiles, callback2) {
	async.mapSeries(profiles, 
		function (profile, callback3) {
			var today = new Date();
			var yesterday = new Date();
			yesterday.setDate(today.getDate()-1);
			request("https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A" + profile.id + "&dimensions=ga%3AfullReferrer%2Cga%3AdateHour&metrics=ga%3Avisits&filters=ga%3Asource%3D%3Dt.co&max-results=400&start-date=" + yesterday.getFullYear() + "-" + nf(yesterday.getMonth() + 1,2) + "-" + nf(yesterday.getDate(),2) + "&end-date=" + today.getFullYear() + "-" + nf(today.getMonth() + 1,2) + "-" + nf(today.getDate(),2) + "&access_token=" + user.access_token_google, function (error, response, body) {
				var body = JSON.parse(body);
				var referrers = [];
				if (body.hasOwnProperty("rows")) referrers = reformatReferrers(body.rows);
				if (referrers.length > 0) grabTweets(user, profile, referrers, callback3);
				else callback3(null, profile);
			});
		}, function (err, results) {
			webproperty.profiles = results;
			callback2(err, webproperty);
		}
	)
}

function grabTweets (user, profile, referrers, callback3) {
	async.mapSeries(referrers,
		function (referrer, callback4) {
			twitter.search({
				q: "http://" + referrer.fullreferrer
			},
			user.twitter_tokens.token,
			user.twitter_tokens.tokenSecret,
			function (err, data, response) {
				if (err) {
					console.error(err);
					callback4(err,referrer);
				} else {
					if (data && data.statuses !== undefined && data.statuses.length > 0) {
						var tweet = data.statuses[0];
						if (tweet.hasOwnProperty("retweeted_status")) tweet = tweet.retweeted_status;
						callback4(err,uu.extend(referrer,tweet));
					} else {
						callback4(err,referrer);
					}
				}
			}
			);
		},
		function (err, results) {
			profile.referrers = results;
			callback3(err, profile);
		}
	)
}

// Utility functions

function nf (num,dec) {
	return ("0" + num).slice(-dec);
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
	});
}