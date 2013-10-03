var App = Ember.Application.create();

App.Router.map(function() {
	// this.resource("welcome"),
	this.resource("accounts", function () {
		this.resource("webproperties", {path: "/:account_id"}, function () {
			this.resource("profiles", {path: "/:webproperties_id"}, function () {
				this.resource("referrers", function () {
					this.resource("referrer", {path: "/:referrer_id"});
				});
			});
		})
	});
});

// App.ApplicationView = Ember.View.extend({ // ApplicationView is the client-side equivalent of server-side layout.jade
// 	template: Ember.TEMPLATES["index"]
// });

// The redirect causes problems when refreshing a page: at each refresh, the ember app is reinitialized, and therefore the user is redirected to the welcome page after each refresh
App.ApplicationRoute = Ember.Route.extend({
	model: function () {
		return $.get("/user").then(function (response) {
			console.log(response.user);
			return response.user;
		})
	}
	// redirect: function () {
	// 	this.transitionTo("welcome");
	// }
});

App.Account = Ember.Object.extend({
	init: function () {
		this.set("webproperties", App.Webproperty.findAll(this.get("id")));
	}
});

App.Account.reopenClass({
	findAll: function () {
		return $.get("/accounts").then(function (response) {
			if (response.success) {
				return response.accounts.map(function (a) {
					return App.Account.create(a);
				});
			}
		});
	}
});

App.AccountsRoute = Ember.Route.extend({
	model: function () {
		return App.Account.findAll();
	}
});

App.Webproperty = Ember.Object.extend({
	init: function () {
		this.set("profiles", App.Profile.findAll(this.get("id")));
	}
});

App.Webproperty.reopenClass({
	findAll: function (id) {
		return $.get("/webproperties/" + id).then(function (response) {
			if (response.success) {
				return response.webproperties.map(function (wp) {
					return App.Webproperty.create(wp);
				});
			}
		});
	}
});

App.Profile = Ember.Object.extend();

App.Profile.reopenClass({
	findAll: function (id) {
		return $.get("/profiles/" + id).then(function (response) {
			if (response.success) {
				return response.profiles.map(function (p) {
					return App.Profile.create(p);
				});
			}
		});
	}
});

App.Referrer = Ember.Object.extend({
	totalVisits: function() {
		return d3.sum(this.get("visits").getEach("count"));
	}.property("visits.@each")
});

App.Referrer.reopenClass({
	findAll: function () {
		return $.get("/referrers").then(function (response) {
			if (response.success) {
				return response.referrers.map(function (r) {
					return App.Referrer.create(r);
				});
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	},

	find: function (id) {
		return $.get("/referrers/" + id).then(function (response) {
			if (response.success) {
				return App.Referrer.create(response.referrer);
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");	
			}
		});
	}
});

App.ReferrersRoute = Ember.Route.extend({
	model: function () {
		console.log(this.get("profileId"));
		return App.Referrer.findAll();
	},
	renderTemplate: function () {
		this.render({
			into: "accounts",
			outlet: "referrers"
		});
	}
});

App.ReferrerRoute = Ember.Route.extend({
	model: function (params) {
		return App.Referrer.find(params.referrer_id);
	},
	renderTemplate: function () {
		this.render({
			into: "referrers",
			outlet: "referrer"
		});
	}
});

App.BarGraph = Ember.View.extend({
	classNames: ["chart"],
	chart: BarChart()
			.width(400)
			.height(200),

	didInsertElement: function() {
		Ember.run.once(this, "updateChart");
	},

	updateChart: function() {
		d3.select(this.$()[0])
			.data([this.get("data")])
			.call(this.get("chart"));
	}.observes("data")
});