App.Click = DS.Model.extend({
	created_at: DS.attr("string"),
	count: DS.attr("number")
});

App.User = DS.Model.extend({
	profile_image_url: DS.attr("string"),
	screen_name: DS.attr("string")
});

App.Referrer = DS.Model.extend({
	fullreferrer: DS.attr("string"),
	clicks: DS.hasMany("click",{async:true}),
	text: DS.attr("string"),
	user: DS.belongsTo("user"),
	created_at: DS.attr("string")
});

App.Account = DS.Model.extend({
	webproperties: DS.hasMany("webproperty",{async:true}),
	name: DS.attr("string"),
});

App.Webproperty = DS.Model.extend({
	profiles: DS.hasMany("profile",{async:true}),
	name: DS.attr("string")
});

App.Profile = DS.Model.extend({
	referrers: DS.hasMany("referrer",{async:true}),
	name: DS.attr("string")
});