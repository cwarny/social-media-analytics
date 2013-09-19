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

	// This is HTML5 stuff to persist the token on a page refresh
	is: localStorage.token,
	tokenChanged: function () {
		localStorage.token = this.get("token");
	}.observes("token"),

	actions: {
		login: function () {
			var self = this;
			var data = this.getProperties("username","password");
			self.set("errorMessage", null);
			$.post("http://localhost:3000/auth.json", data).then(function (response) {
				self.set("errorMessage", response.message);
				
				if (response.success) {
					alert("Login succeeded!");
					self.set("token", response.token);

					var attemptedTransition = self.get("attemptedTransition");
					if (attemptedTransition) {
						attemptedTransition.retry();
						self.set("attemptedTransition", null)
					} else {
						// Redirect to "referrers" by default
						self.transitionTo("/referrers");
					}
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
	findAll: function (token) {
		return $.get("http://localhost:3000/referrers", {token: token}).then(function (response) {
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

App.AuthenticatedRoute = Ember.Route.extend({

	// The "beforeModel" hook is to check whether we are logged in before even trying to load the model of a route. This avoids useless calls to the server.
	beforeModel: function (transition) {
		if (!this.controllerFor("login").get("token")) {
			this.redirectToLogin(transition);
		}
	},

	redirectToLogin: function (transition) {
		alert("You must log in!");
		var loginController = this.controllerFor("login");
		loginController.set("attemptedTransition", transition);
		this.transitionTo("login");
	},

	actions: {
		error: function (reason, transition) {
			if (reason.status === 401) {
				this.redirectToLogin(transition);
			} else {
				alert("Something went wrong")
			}
		}
	}
});

App.ReferrersRoute = App.AuthenticatedRoute.extend({
	model: function () {
		var token = this.controllerFor("login").get("token");
		return App.Referrer.findAll(token);
	}
});

App.ReferrerRoute = App.AuthenticatedRoute.extend({
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