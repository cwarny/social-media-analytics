var App = Ember.Application.create();

App.Router.map(function() {
	this.resource("referrers", function() {
		this.resource("referrer", {path: "/:referrer_id"});
	}),
	this.route("fetch", {path: '/fetch'}),
	this.route("login");
});

App.LoginRoute = Ember.Route.extend({
	setupController: function (controller, model) {
		controller.reset();
	}
});

App.LoginController = Ember.Controller.extend({
	
	reset: function () {
		this.setProperties({
			username: "",
			password: "",
			errorMessage: "",
		});
	},

	token: localStorage.token,
	tokenChanged: function () {
		localStorage.token = this.get("token");
	}.observes("token"),

	actions: {
		login: function () {
			var self = this;
			var data = this.getProperties("username","password");
			self.set("errorMessage", null);
			Ember.$.post("http://localhost:3000/auth.json", data).then(function (response) {
				self.set("errorMessage", response.message);
				if (response.success) {
					self.set("token", response.token);
					self.transitionToRoute("/referrers")
				}
			});
		}
	}
});

App.Referrer = Ember.Object.extend({
	totalVisits: function() {
		return d3.sum(this.get("visits").getEach("count"));
	}.property("visits.@each")
});

App.Referrer.reopenClass({
	findAll: function () {
		return $.get("http://localhost:3000/referrers", {message:"hello"}).then(function (response) {
			var referrers = Em.A();
			response.referrers.forEach(function (r) {
				referrers.pushObject(App.Referrer.create(r));
			});
			return referrers;
		});
	},

	find: function (id) {
		return $.get("http://localhost:3000/referrers/" + id).then(function (response) {
			return App.Referrer.create(response.referrer);
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

App.FetchController = Ember.Controller.extend({
	startDate: "2013-08-01",
	endDate: "2013-09-11",
	profileId: "75218327",
	actions: {
		fetch: function() {
			$.ajax({
				type: "PUT",
				url: "http://localhost:3000/fetch",
				data: { startDate: this.get('startDate'), endDate: this.get('endDate'), profileId: this.get('profileId')}
			}).done(function(response) {
				console.log(response);
			});
		}
	}
});