var App = Ember.Application.create();

App.AccountSerializer = DS.RESTSerializer.extend({
	extractArray: function(store, type, payload, id, requestType) {
		var accounts = payload.accounts;
		var webproperties = [];
		var profiles = [];
		var referrers = [];
		var users = [];
		accounts.forEach(function (account) {
			var webpropertyIds = [];
			account.webproperties.forEach(function (webproperty) {
				var profileIds = [];
				webproperty.profiles.forEach(function (profile) {
					if (profile.hasOwnProperty("referrers")) {
						var referrerIds = [];
						profile.referrers.forEach(function (referrer) {
							if (referrer.hasOwnProperty("user")) {
								users.push(referrer.user);
								referrer.user = referrer.user.id;
								referrer.profile = profile.id;
								if (referrer.hasOwnProperty("clicks")) {
									referrers.push(referrer);
									referrerIds.push(referrer.id);
								}
							}
						});
						profile.referrers = referrerIds;
					}
					profiles.push(profile);
					profileIds.push(profile.id);
				});
				webproperty.profiles = profileIds;
				webproperties.push(webproperty);
				webpropertyIds.push(webproperty.id);
			});
			account.webproperties = webpropertyIds;
		});

		payload = { users: users, referrers: referrers, profiles: profiles, webproperties: webproperties, accounts: accounts };

		return this._super(store, type, payload, id, requestType);
	}
});

App.Router.map(function() {
	this.resource("accounts", function () {
		this.resource("account", {path: "account/:account_id"}, function () {
			this.resource("webproperty", {path: "webproperty/:webproperty_id"}, function () {
				this.resource("profile", {path: "profile/:profile_id"}, function () {
					this.resource("referrer", {path: "referrer/:referrer_id"});
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

App.AccountsRoute = Ember.Route.extend({
	model: function () {
		return this.store.find("account");
	},
	renderTemplate: function () {
		this.render({
			into: "application",
			outlet: "accounts"
		});
	},
	actions: {
		error: function (reason) {
			alert("You must log in");
			window.open("http://localhost:3000/login", "_self");
		}
	}
});

App.AccountRoute = Ember.Route.extend({
	model: function (params) {
		return this.store.find("account", params.account_id);
	},
	renderTemplate: function () {
		this.render({
			into: "accounts",
			outlet: "account"
		});
	}
});

App.WebpropertyRoute = Ember.Route.extend({
	model: function (params) {
		return this.store.find("webproperty", params.webproperty_id);
	},
	renderTemplate: function () {
		this.render({
			into: "account",
			outlet: "webproperty"
		});
	}
});

App.ProfileRoute = Ember.Route.extend({
	model: function (params) {
		return this.store.find("profile", params.profile_id);
	},
	renderTemplate: function () {
		this.render({
			into: "accounts",
			outlet: "profile"
		});
	}
});

// App.ProfileController = Ember.Controller.extend({
// 	// referrers: function () {
// 	// 	var self = this;
// 	// 	var referrers = this.get("model.referrers").filter(function (d) {
// 	// 		console.log(d.get("totalClicks"));
// 	// 		return _.any(d.get("clicks"), function (c) {
// 	// 			var date = c.created_at.slice(0,4) + "-" + c.created_at.slice(4,6) + "-" + c.created_at.slice(6,8) + " " + c.created_at.slice(8,10) + ":00";
// 	// 			return new Date(self.get("startDate")) < new Date(date) && new Date(self.get("endDate")) > new Date(date);
// 	// 		});
// 	// 	});
// 	// 	return referrers.sort(function (a,b) {
// 	// 		return b._data.totalClicks - a._data.totalClicks;
// 	// 	});
// 	// }.property("model.referrers", "startDate", "endDate"),
// 	// startDate: "11/11/2013",
// 	// endDate: "11/13/2013"
// });

App.ProfileView = Ember.View.extend({
	didInsertElement: function () {
		$("html, body").animate({
			scrollTop: $("div.profile").offset().top
		}, 500);
		$("#datepicker").datepicker();
	}
});

App.ReferrersController = Ember.ArrayController.extend({
	needs: ["profile"],
	content: function () {
		var startDate = this.get("controllers.profile.model.startDate");
		var endDate = this.get("controllers.profile.model.endDate");
		return this.get("controllers.profile.model.referrers").filter(function (d) {
			return _.any(d.get("clicks"), function (c) {
				var date = c.created_at.slice(0,4) + "-" + c.created_at.slice(4,6) + "-" + c.created_at.slice(6,8) + " " + c.created_at.slice(8,10) + ":00";
				return new Date(startDate) < new Date(date) && new Date(endDate) > new Date(date);
			});
		});
	}.property("controllers.profile.model.referrers","controllers.profile.model.statDate","controllers.profile.model.endDate"),
	sortProperties: ["totalClicks"],
	sortAscending: false
});

App.ReferrerRoute = Ember.Route.extend({
	model: function (params) {
		return this.store.find("referrer", params.referrer_id);
	},
	renderTemplate: function () {
		this.render({
			into: "profile",
			outlet: "referrer"
		});
	}
});

App.ReferrerController = Ember.Controller.extend({
	needs: ["profile"],
	clicks: function () {
		return this.get("model.clicks").map(function (d) {
			var date = d.created_at.slice(0,4) + "-" + d.created_at.slice(4,6) + "-" + d.created_at.slice(6,8) + " " + d.created_at.slice(8,10) + ":00";
			return {created_at: new Date(date), count: d.count};
		});
	}.property("model.clicks"),

	created_at: function () {
		return new Date(this.get("model.created_at"));
	}.property("model.created_at"),

	// totalClicks: function () {
	// 	var startDate = this.get("controllers.profile.startDate");
	// 	var endDate = this.get("controllers.profile.endDate");
	// 	var clicks = this.get("clicks").filter(function (d) {
	// 		return new Date(startDate) < d.created_at && new Date(endDate) > d.created_at;
	// 	});
	// 	return d3.sum(clicks, function (d) {return d.count;});
	// }.property("clicks", "controllers.profile.startDate", "controllers.profile.endDate"),

	actions: {
		transition: function () {
			this.transitionToRoute("profile");
		}
	}
});

App.TreeBranchView = Ember.View.extend({
	tagName: "ul",
	templateName: "tree-branch",
	classNames: ["tree-branch"],
});

App.TreeNodeController = Ember.ObjectController.extend({
	isExpanded: false,
	actions: {
		toggle: function () {
			this.set("isExpanded", !this.get("isExpanded"));
		}
	}
});

App.TreeNodeView = Ember.View.extend({
	templateName: "tree-node",
	classNames: ["tree-node"],
	didInsertElement: function () {
		var id = "#" + this.get("controller").get("model").id;
		$("li" + id + " > span[rel=popover]").popover({ 
			html : true, 
			content: function () {
				return $("li" + id + " > div").html();
			},
			trigger: "hover",
			placement: "auto top"
		});
	}
});

App.BarChartComponent = Ember.Component.extend({
	classNames: ["chart"],

	didInsertElement: function () {
		Ember.run.once(this, "updateChart");
	},

	width: function () {
		return $(".tweetbox").width();
	},

	updateChart: function () {
		$("html, body").animate({
			scrollTop: $("div.profile").offset().top
		}, 500);

		if (this.get("data")) {
			d3.select(this.$()[0])
				.data([this.get("data")])
				.call(BarChart(this.get("startDate"),this.get("endDate"),this)
					.width($(".tweetbox").width()-30)
					.height(200)
				);
		} else {
			d3.select(this.$()[0])
				.data([[]])
				.call(BarChart()
					.width($(".tweetbox").width()-30)
					.height(200)
				);
		}
	}.observes("data","startDate","endDate")
});