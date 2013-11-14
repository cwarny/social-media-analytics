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

App.ProfileController = Ember.Controller.extend({
	referrers: function () {
		return this.get("model.referrers").content.sort(function (a,b) {return b._data.totalClicks - a._data.totalClicks;});
	}.property("model.referrers")
});

App.ProfileView = Ember.View.extend({
	didInsertElement: function () {
		$("html, body").animate({
	        scrollTop: $("div.profile").offset().top
	    }, 500);
	}
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
	chart: BarChart()
			.width(400)
			.height(200),

	didInsertElement: function () {
		Ember.run.once(this, "updateChart");
	},

	updateChart: function () {
		$("html, body").animate({
			scrollTop: $("div.profile").offset().top
		}, 500);

		if (this.get("data")) {
			d3.select(this.$()[0])
				.data([this.get("data")])
				.call(this.get("chart"));
		} else {
			d3.select(this.$()[0])
				.data([[]])
				.call(this.get("chart"));
		}
	}.observes("data")
});