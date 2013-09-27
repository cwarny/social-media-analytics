var App = Ember.Application.create();

App.Router.map(function() {
	this.resource("welcome"),
	this.resource("login"),
	this.resource("referrers", function() {
		this.resource("referrer", {path: "/:referrer_id"});
	})
});

App.ApplicationView = Ember.View.extend({ // ApplicationView is the client-side equivalent of server-side layout.jade
	template: Ember.TEMPLATES["index"]
});

// The redirect causes problems when refreshing a page: at each refresh, the ember app is reinitialized, and therefore the user is redirected to the welcome page after each refresh
App.ApplicationRoute = Ember.Route.extend({
	redirect: function () {
		this.transitionTo("welcome");
	}
});

App.WelcomeRoute = Ember.Route.extend();

App.Referrer = Ember.Object.extend({
	totalVisits: function() {
		return d3.sum(this.get("visits").getEach("count"));
	}.property("visits.@each")
});

App.Referrer.reopenClass({
	findAll: function () {
		return $.get("/referrers").then(function (response) {
			if (response.success) {
				var referrers = Em.A();
				response.referrers.forEach(function (r) {
					referrers.pushObject(App.Referrer.create(r));
				});
				return referrers;
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
		return App.Referrer.findAll();
	}
});

App.ReferrerRoute = Ember.Route.extend({
	model: function (params) {
		return App.Referrer.find(params.referrer_id);
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