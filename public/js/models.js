App.Referrer = DS.Model.extend({
	profile_image_url: DS.attr("string"),
	screen_name: DS.attr("string"),
	followers_count: DS.attr("number"),
	tweets: DS.hasMany("tweet"),
	profile: DS.belongsTo("profile"),
	startDate: Ember.computed.alias("profile.startDate"),
	endDate: Ember.computed.alias("profile.endDate"),
	totalClicks: function () {
		return d3.sum(this.get("tweets").getEach("totalClicks"));
	}.property("tweets.@each.totalClicks"),
	date_last_tweet: function () {
		return new Date(d3.max(this.get("tweets").getEach("created_at")));
	}.property("tweets.@each.created_at"),
	isExpanded: false,
	onlyOneTweet: function () {
		return this.get("tweets.length") === 1;
	}.property("tweets.@each")
});

App.Tweet = DS.Model.extend({
	fullreferrer: DS.attr("string"),
	clicks: DS.attr(),
	text: DS.attr("string"),
	referrer: DS.belongsTo("referrer"),
	created_at: DS.attr("string"),
	id_str: DS.attr("string"),
	entities: DS.attr(),

	conversation_url: function () {
		return "https://twitter.com/" + this.get("referrer.screen_name") + "/status/" + this.get("id_str");
	}.property("referrer.screen_name","id_str"),

	date: function () {
		return new Date(this.get("created_at"));
	}.property("created_at"),

	totalClicks: function () {
		var startDate = this.get("referrer.profile.startDate");
		var endDate = this.get("referrer.profile.endDate");
		var clicks = this.get("clicks").filter(function (d) {
			return new Date(startDate) < d.created_at && new Date(endDate) > d.created_at;
		});
		return d3.sum(clicks, function (d) {return d.count;});
	}.property("clicks","referrer.profile.startDate","referrer.profile.endDate")
});

App.Account = DS.Model.extend({
	webproperties: DS.hasMany("webproperty"),
	name: DS.attr("string"),
});

App.Webproperty = DS.Model.extend({
	profiles: DS.hasMany("profile"),
	name: DS.attr("string")
});

App.Profile = DS.Model.extend({
	referrers: DS.hasMany("referrer"),
	name: DS.attr("string"),
	startDate: DS.attr("string"),
	endDate: DS.attr("string")
});