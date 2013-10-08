var App = Ember.Application.create();

App.Router.map(function() {
	this.resource("explore", function () {
		this.resource("account", {path: "account/:account_id"}, function () {
			this.resource("webproperty", {path: "webproperty/:webproperty_id"}, function () {
				this.resource("profile", {path: "profile/:profile_id"}, function () {
					this.resource("referrers", function () {
						this.resource("referrer", {path: "/:referrer_id"});
					})
				})
			})
		})
	})
});

App.ApplicationRoute = Ember.Route.extend({
	model: function () {
		return $.get("/user").then(function (res) {
			return {user: res.user};
		})
	}
});

App.Account = Ember.Object.extend();

App.Account.reopenClass({
	findAll: function () {
		return $.get("/accounts").then(function (res) {
			if (res.success) {
				return res.accounts.map(function (a) {
					return App.Account.create(a);
				});
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	}
});

App.ExploreRoute = Ember.Route.extend({
	model: function () {
		return App.Account.findAll();
	},
	renderTemplate: function () {
		this.render({
			into: "application",
			outlet: "accounts"
		});
	},
	actions: {
		fetch: function (id) {
			var self = this;
			$.get("/accounts/" + id).then(function (res) {
				if (res.success) {
					self.transitionTo("account", res.account);
				}
			})
		} 
	}
});

App.AccountRoute = Ember.Route.extend({
	renderTemplate: function () {
		this.render({
			into: "explore",
			outlet: "account"
		});
	},
	actions: {
		fetch: function (id) {
			var self = this;
			$.get("/webproperties/" + id).then(function (res) {
				if (res.success) {
					self.transitionTo("webproperty", res.webproperty);
				}
			})
		} 
	}
});

App.WebpropertyRoute = Ember.Route.extend({
	renderTemplate: function () {
		this.render({
			into: "account",
			outlet: "webproperty"
		});
	}
});

App.ProfileRoute = Ember.Route.extend({
	redirect: function () {
		this.transitionTo("referrers")//.then($("body").scrollTop($("div.referrers").offset().top));
	}
});

App.Referrer = Ember.Object.extend({
	totalVisits: function() {
		return d3.sum(this.get("visits").getEach("count"));
	}.property("visits.@each")
});

App.Referrer.reopenClass({
	findAll: function () {
		return $.get("/referrers").then(function (res) {
			if (res.success) {
				return res.referrers.map(function (r) {
					return App.Referrer.create(r);
				});
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	},
	find: function (id) {
		return $.get("/referrers/" + id).then(function (res) {
			if (res.success) {
				return App.Referrer.create(res.referrer);
			}
		});
	}
});

App.ReferrersRoute = Ember.Route.extend({
	model: function () {
		return App.Referrer.findAll();
	},
	renderTemplate: function () {
		this.render({
			into: "explore",
			outlet: "referrers"
		});
	}
});

App.ReferrersView = Em.View.extend({
	didInsertElement: function () {
		// $("body").scrollTop($("div.referrers").offset().top);
		$('html, body').animate({
	        scrollTop: $("div.referrers").offset().top
	    }, 500);
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

	didInsertElement: function () {
		Ember.run.once(this, "updateChart");
		// $("body").scrollTop($("div.referrers").offset().top);
		$('html, body').animate({
	        scrollTop: $("div.referrers").offset().top
	    }, 500);
	},

	updateChart: function () {
		d3.select(this.$()[0])
			.data([this.get("data")])
			.call(this.get("chart"));
	}.observes("data")
});