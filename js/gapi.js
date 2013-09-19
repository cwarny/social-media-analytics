var googleapis = require('googleapis'),
	OAuth2Client = googleapis.OAuth2Client,
	client = '898266335618-fhhc3qu7ad057j5a70m1mr3ikttud14k.apps.googleusercontent.com',
	secret = 'ktNpbeUU1DBsRFkTm08nySaH',
	redirect = 'http://localhost:4000/oauth2callback',
	oauth2Client = new OAuth2Client(client, secret, redirect),
	profile_auth_url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
		// approval_prompt: "force"
	});

var callback = function(clients) {
	exports.cal = clients.calendar;
	exports.oauth = clients.oauth2;
	exports.client = oauth2Client;
	exports.url = profile_auth_url;
};

googleapis
	.discover('oauth2', 'v2')
	.execute(function(err, client){
		if (!err) callback(client);
	});