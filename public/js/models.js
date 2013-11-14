App.User = DS.Model.extend({
	profile_image_url: DS.attr("string"),
	screen_name: DS.attr("string")
});

App.Referrer = DS.Model.extend({
	fullreferrer: DS.attr("string"),
	clicks: DS.attr(),
	text: DS.attr("string"),
	user: DS.belongsTo("user"),
	created_at: DS.attr("string"),
	children: DS.attr(),
	totalClicks: function() {
		return d3.sum(this.get("clicks").getEach("count"))
	}.property("clicks.@each")
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
	name: DS.attr("string")
});