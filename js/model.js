App.Visit = DS.Model.extend({
	referrer: DS.belongsTo("App.Referrer"),
	datehour: DS.attr("string"),
	count: DS.attr("number")
});

App.Tweet = DS.Model.extend({
	referrer: DS.belongsTo("App.Referrer"),
	text: DS.attr("string"),
	user: DS.belongsTo("App.User"),
	created_at: DS.attr("string"),
	children: DS.hasMany("App.Tweet"), // Order them by created_at
	totalChildren: function () {
		return this.get("children").get("length");
	}.property("children.@each")
});

App.User = DS.Model.extend({
	tweets: DS.hasMany("App.Tweet"),
	profile_image_url: DS.attr("string"),
	url: DS.attr("string"),
	followers_count: DS.attr("number"),
	description: DS.attr("string"),
	name: DS.attr("string"),
	screen_name: DS.attr("string")
})

App.Referrer = DS.Model.extend({
	fullreferrer: DS.attr("string"),
	visits: DS.hasMany("App.Visit"),
	tweet: DS.belongsTo("App.Tweet"),
	totalVisits: function() {
		return this.get("visits").get("length");
	}.property("visits.@each")
});