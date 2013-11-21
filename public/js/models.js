App.User = DS.Model.extend({
	profile_image_url: DS.attr("string"),
	screen_name: DS.attr("string"),
	followers_count: DS.attr("number")
});

App.Referrer = DS.Model.extend({
	fullreferrer: DS.attr("string"),
	clicks: DS.attr(),
	text: DS.attr("string"),
	user: DS.belongsTo("user"),
	created_at: DS.attr("string"),
	children: DS.attr(),
	profile: DS.belongsTo("profile"),
	startDate: Ember.computed.alias("profile.startDate"),
	endDate: Ember.computed.alias("profile.endDate"),
	totalClicks: function () {
		var self = this;
		var clicks = this.get("clicks").filter(function (d) {
			var date = d.created_at.slice(0,4) + "-" + d.created_at.slice(4,6) + "-" + d.created_at.slice(6,8) + " " + d.created_at.slice(8,10) + ":00";
			return new Date(self.get("startDate")) < new Date(date) && new Date(self.get("endDate")) > new Date(date);
		});
		return d3.sum(clicks, function (d) {return d.count;});
	}.property("clicks","startDate","endDate")
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
	startDate: "11/11/2013",
	endDate: "11/13/2013"
});