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
	// find: function (id) {
	// 	return $.get("/accounts/" + id).then(function (res) {
	// 		if (res.success) {
	// 			return App.Account.create(res.account);
	// 		} else {
	// 			alert("You must log in");
	// 			window.open("http://localhost:3000/login", "_self");
	// 		}
	// 	});
	// }
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
	}
});

App.Webproperty = Ember.Object.extend();

App.Webproperty.reopenClass({
	findAll: function (accountId) {
		return $.get("/webproperties" + accountId).then(function (res) {
			if (res.success) {
				return res.webproperties.map(function (w) {
					return App.Webproperty.create(w);
				});
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	}
});

App.AccountRoute = Ember.Route.extend({
	model: function (params) {
		return App.Webproperty.findAll(params.account_id);
	},
	renderTemplate: function () {
		this.render({
			into: "explore",
			outlet: "account"
		});
	}
});

App.Profile = Ember.Object.extend();

App.Profile.reopenClass({
	findAll: function (webpropertyId) {
		return $.get("/profiles/" + webpropertyId).then(function (res) {
			if (res.success) {
				return res.profiles.map(function (p) {
					return App.Profile.create(p);
				});
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	}
});

App.WebpropertyRoute = Ember.Route.extend({
	model: function (params) {
		return App.Profile.findAll(params.webproperty_id);
	},
	renderTemplate: function () {
		this.render({
			into: "account",
			outlet: "webproperty"
		});
	}
});

App.Referrer = Ember.Object.extend();

App.Referrer.reopenClass({
	findAll: function (profileId) {
		return $.get("/referrers/" + profileId).then(function (res) {
			if (res.success) {
				return res.referrers.map(function (r) {
					return App.Referrer.create(r);
				});
			} else {
				alert("You must log in");
				window.open("http://localhost:3000/login", "_self");
			}
		});
	}
});

App.ProfileRoute = Ember.Route.extend({
	model: function (params) {
		return App.Referrer.findAll(params.profile_id);
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

App.ReferrerRoute = Ember.Route.extend({
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