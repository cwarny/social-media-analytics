var App = Ember.Application.create();

App.Router.map(function() {
	this.resource("explore", function () {
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

App.User = Ember.Object.extend();

App.User.reopenClass({
	find: function () {
		return $.get("/users").then(function (res) {
			if (res.success) {
				return App.User.create(res.user);
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	}
});

App.ExploreRoute = Ember.Route.extend({
	model: function () {
		return App.User.find();
	},
	renderTemplate: function () {
		this.render({
			into: "application",
			outlet: "accounts"
		});
	}
});

App.Account = Ember.Object.extend();

App.Account.reopenClass({
	find: function (accountId) {
		return $.get("/accounts/" + accountId).then(function (res) {
			if (res.success) {
				return App.Webproperty.create(res.account);
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	}
});

App.AccountRoute = Ember.Route.extend({
	setupController: function (controller, model) {
		App.Account.find(model.id).then(function (data) {
			controller.set("model", data);
		});
	},
	renderTemplate: function () {
		this.render({
			into: "explore",
			outlet: "account"
		});
	}
});

App.Webproperty = Ember.Object.extend();

App.Webproperty.reopenClass({
	find: function (webpropertyId) {
		return $.get("/webproperties/" + webpropertyId).then(function (res) {
			if (res.success) {
				return App.Webproperty.create(res.webproperty);
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	}
});

App.WebpropertyRoute = Ember.Route.extend({
	setupController: function (controller, model) {
		App.Webproperty.find(model.id).then(function (data) {
			controller.set("model", data);
		});
	},
	renderTemplate: function () {
		this.render({
			into: "account",
			outlet: "webproperty"
		});
	}
});

App.Profile = Ember.Object.extend();

App.Profile.reopenClass({
	find: function (profileId) {
		return $.get("/profiles/" + profileId).then(function (res) {
			if (res.success) {
				return App.Profile.create(res.profile);
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	}
});

App.ProfileRoute = Ember.Route.extend({
	setupController: function (controller, model) {
		App.Profile.find(model.id).then(function (data) {
			controller.set("model", data);
		});
	},
	renderTemplate: function () {
		this.render({
			into: "explore",
			outlet: "profile"
		});
	}
});

App.ProfileView = Ember.View.extend({
	didInsertElement: function () {
		$("html, body").animate({
	        scrollTop: $("div.profile").offset().top
	    }, 500);
	}
});

App.Referrer = Ember.Object.extend();

App.Referrer.reopenClass({
	find: function (referrerId) {
		return $.get("/referrers/" + referrerId).then(function (res) {
			if (res.success) {
				return App.Referrer.create(res.referrer);
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	}
});

App.ReferrerRoute = Ember.Route.extend({
	setupController: function (controller, model) {
		App.Referrer.find(model.id).then(function (data) {
			controller.set("model", data);
		});
	},
	renderTemplate: function () {
		this.render({
			into: "profile",
			outlet: "referrer"
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

// App.TreeBranchView = Ember.View.extend({
// 	tagName: "ul",
// 	templateName: "tree-branch",
// 	classNames: ["tree-branch"],
// });

// App.TreeNodeController = Ember.ObjectController.extend({
// 	isExpanded: false,
// 	actions: {
// 		toggle: function () {
// 			this.set("isExpanded", !this.get("isExpanded"));
// 		},
// 		click: function () {
// 			console.log(this);
// 		}
// 	}
// });

// App.TreeNodeView = Ember.View.extend({
// 	templateName: "tree-node",
// 	classNames: ["tree-node"],
// 	didInsertElement: function () {
// 		var id = "#" + this.get("controller").get("model").id;
// 		$("li" + id + " > span[rel=popover]").popover({ 
// 			html : true, 
// 			content: function () {
// 				console.log($("li" + id + " > div"));
// 				return $("li" + id + " > div").html();
// 			},
// 			trigger: "hover",
// 			placement: "auto top"
// 		});
// 	}
// });

// Ensures tweetbox scrolls
// $(document).ready(function () {
// 	$(window).bind("scroll", function (e) { 
// 		if ($(this).scrollTop() > 300 ) { 
// 			$(".tweetbox").css({position: "fixed", top: "25px"}); 
// 		} else {
// 			$(".tweetbox").css({position: "absolute", top: "0px"}); 
// 		}
// 	});
// });