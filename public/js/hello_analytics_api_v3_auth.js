var clientId = '898266335618-fhhc3qu7ad057j5a70m1mr3ikttud14k.apps.googleusercontent.com';
var apiKey = 'AIzaSyDN7bglcSAiykKx1GodBfzWjP1E0x1CLlk';
var scopes = 'https://www.googleapis.com/auth/userinfo.profile';

function handleClientLoad() {
	// 1. Set the API Key
	gapi.client.setApiKey(apiKey);

	// 2. Call the function that checks if the user is Authenticated. This is defined in the next section
	window.setTimeout(checkAuth,1);
}

function checkAuth() {
	// Call the Google Accounts Service to determine the current user's auth status.
	// Pass the response to the handleAuthResult callback function
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate:true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	if (authResult) {
		console.log(authResult);
		// The user has authorized access
		// Load the Analytics Client. This function is defined in the next section.
		loadAnalyticsClient();
	} else {
		// User has not Authenticated and Authorized
		handleUnAuthorized();
	}
}


// Authorized user
function handleAuthorized() {
	document.getElementById('authorize-button').remove();
}


// Unauthorized user
function handleUnAuthorized() {
	var authorizeButton = document.getElementById('authorize-button');

	// Show the 'Authorize Button'
	authorizeButton.type = 'button';

	// When the 'Authorize' button is clicked, call the handleAuthClick function
	authorizeButton.onclick = handleAuthClick;
}

function handleAuthClick(event) {
	gapi.auth.authorize({client_id: clientId, scope: scopes}, handleAuthResult);
	return false;
}

function loadAnalyticsClient() {
	// Load the Analytics client and set handleAuthorized as the callback function
	gapi.client.load('analytics', 'v3', handleAuthorized);
}