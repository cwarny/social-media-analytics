var App = Ember.Application.create();

App.AccountSerializer = DS.RESTSerializer.extend({
	extractArray: function(store, type, payload, id, requestType) {
		var accounts = payload.accounts;
		var webproperties = [];
		var profiles = [];
		var tweets = [];
		var referrers = [];
		accounts.forEach(function (account) {
			var webpropertyIds = [];
			account.webproperties.forEach(function (webproperty) {
				var profileIds = [];
				webproperty.profiles.forEach(function (profile) {
					if (profile.hasOwnProperty("referrers")) {
						var cache = {};
						var maxDate = new Date("01/01/2013");
						profile.referrers.forEach(function (tweet) {
							if (tweet.hasOwnProperty("user") && tweet.hasOwnProperty("clicks")) {
								tweet.clicks.forEach(function (c) {
									var date = new Date(c.created_at.slice(0,4) + "-" + c.created_at.slice(4,6) + "-" + c.created_at.slice(6,8) + " " + c.created_at.slice(8,10) + ":00");
									if (date > maxDate) maxDate = new Date(date.getTime());
									c.created_at = date;
								});
								tweet.created_at = new Date(tweet.created_at);
								var temp = {};
								temp[tweet.user.id] = [];
								_.defaults(cache, temp);
								cache[tweet.user.id].push(tweet);
							}
						});
						for (var prop in cache) {
							var referrer = cache[prop][0].user;
							cache[prop].forEach(function (tweet) {
								tweet.referrer = tweet.user.id;
								tweets.push(tweet);
							});
							referrer.tweets = _.pluck(cache[prop],"id");
							referrer.profile = profile.id;
							referrers.push(referrer);
						}
						profile.referrers = _.pluck(referrers,"id");
						var format = d3.time.format("%m/%d/%Y");
						var d = new Date(maxDate.getTime());
						d.setDate(d.getDate()+1);
						profile.endDate = format(d);
						var d = new Date(maxDate.getTime());
						d.setDate(d.getDate()-3);
						profile.startDate = format(d);			
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

		payload = { tweets: tweets, referrers: referrers, profiles: profiles, webproperties: webproperties, accounts: accounts };

		return this._super(store, type, payload, id, requestType);
	}
});

App.Router.map(function() {
	this.resource("accounts", function () {
		this.resource("account", {path: "/:account_id"}, function () {
			this.resource("webproperty", {path: "webproperty/:webproperty_id"}, function () {
				this.resource("profile", {path: "profile/:profile_id"}, function () {
					this.resource("tweet", {path: "tweet/:tweet_id"});
				})
			})
		})
	}),
	this.resource("login"),
	this.resource("home"),
	this.resource("signup")
});

App.ApplicationRoute = Ember.Route.extend({
	model: function () {
		return $.get("/user").then(function (res) {
			return {user: res.user};
		});
	},
	afterModel: function (model, transition) {
		if (model.user) {
			if (!model.user.new) {
				if (transition.targetName === "index") {
					this.transitionTo("accounts");
				} else {
					this.transitionTo(transition.targetName);
				}
			} else {
				this.transitionTo("signup");
			} 
		} else {
			this.transitionTo("home");
		}
	}
});

App.SignupController = Ember.Controller.extend({
	needs: ["application"],
	downloading: false
});

App.SignupStepView = Ember.View.extend({
	tagName: "dt",
	classNameBindings: ["isUnactive:unactive"],
});

App.ButtonView = Ember.View.extend({
	tagName: "a",
	classNames: ["btn"],
	classNameBindings: ["isDisabled:btn-default:btn-primary"],
	attributeBindings: ["isDisabled:disabled", "type", "href"],
	type: "button",
	disabled: "disabled"
});

App.SignonView = App.SignupStepView.extend({
	isUnactive: function () {
		if (this.get("controller.controllers.application.model.user")) return true;
		else return false;
	}.property("controller.controllers.application.model.user")
});

App.SignonButtonView = App.ButtonView.extend({
	isDisabled: function () {
		if (this.get("controller.controllers.application.model.user")) return true;
		else return false;
	}.property("controller.controllers.application.model.user"),

	href: "http://localhost:3000/auth/google"
});

App.ConnectView = App.SignupStepView.extend({
	isUnactive: function () {
		if (!this.get("controller.controllers.application.model.user") || this.get("controller.controllers.application.model.user.twitter_tokens")) return true;
		else return false;
	}.property("controller.controllers.application.model.user")
});

App.ConnectButtonView = App.ButtonView.extend({
	isDisabled: function () {
		if (!this.get("controller.controllers.application.model.user") || this.get("controller.controllers.application.model.user.twitter_tokens")) return true;
		else return false;
	}.property("controller.controllers.application.model.user"),
	
	href: "http://localhost:3000/connect/twitter"
});

App.GetDataView = App.SignupStepView.extend({
	isUnactive: function () {
		if (!this.get("controller.controllers.application.model.user") || !this.get("controller.controllers.application.model.user.twitter_tokens") || !this.get("controller.controllers.application.model.user.new")) return true;
		else return false;
	}.property("controller.controllers.application.model.user")
});

App.GetDataButtonView = App.ButtonView.extend({
	isDisabled: function () {
		if (!this.get("controller.controllers.application.model.user") || !this.get("controller.controllers.application.model.user.twitter_tokens") || !this.get("controller.controllers.application.model.user.new")) return true;
		else return false;
	}.property("controller.controllers.application.model.user"),

	click: function () {
		this.set("controller.downloading",true);
		var c = this.get("controller");
		$.get("data").then(function (res) {
			c.transitionToRoute("accounts");
		});
	}
});

App.AccountsRoute = Ember.Route.extend({
	model: function () {
		return this.store.find("account");
	},
	actions: {
		error: function (reason, transition) {
			alert("You must log in");
			this.transitionTo("login");
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
		return this.get("controllers.profile.model.referrers").filter(function (r) {
			return _.any(r.get("tweets").content, function (t) {
				return _.any(t.get("clicks"), function (c) {
					return new Date(startDate) < c.created_at && new Date(endDate) > c.created_at;
				});
			})
		});
	}.property("controllers.profile.model.referrers","controllers.profile.model.startDate","controllers.profile.model.endDate"),

	sortProperties: function () {
		return [this.get("sortingProperty")];
	}.property("sortingProperty"),
	sortAscending: false,
	sortingProperty: "totalClicks",
	sortingPropertyIsTotalClicks: function () {
		return this.get("sortingProperty") === "totalClicks";
	}.property("sortingProperty"),
	sortingPropertyIsFollowersCount: function () {
		return this.get("sortingProperty") === "followers_count";
	}.property("sortingProperty"),

	actions: {
		setSortingProperty: function (p) {
			this.set("sortingProperty",p);
		}
	}
});

App.ReferrerController = Ember.Controller.extend({
	needs: ["profile","referrers"],

	actions: {
		toggle: function () {
			this.set("isExpanded",true)
		}
	},

	actions: {
		toggle: function () {
			this.set("model.isExpanded", !this.get("model.isExpanded"));
		}
	}
});

App.TweetRoute = Ember.Route.extend({
	model: function (params) {
		return this.store.find("tweet", params.tweet_id);
	},

	renderTemplate: function () {
		this.render({
			into: "profile",
			outlet: "tweet"
		});
	}
});

App.TweetsController = Ember.ArrayController.extend({
	needs: ["referrers","referrer","profile"],

	sortProperties: function () {
		return [this.get("controllers.referrers.sortingProperty")];
	}.property("controllers.referrers.sortingProperty"),
	sortAscending: false
});

App.TweetController = Ember.Controller.extend({
	needs: ["referrers","profile"],

	actions: {
		transition: function () {
			this.transitionToRoute("profile");
		}
	},

	chunks: function () {
		var text = this.get("model.text");
		var chunks = [];
		var i = 0;
		this.get("model.entities.urls").forEach(function (url) {
			var j = text.indexOf(url.url);
			chunks.push({str: text.slice(i,j), url: url.url, expanded_url: url.expanded_url});
			i = (j + url.url.length);
		});
		chunks.push({str: text.slice(i,text.length)});
		return chunks;
	}.property("model.text","model.entities")
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