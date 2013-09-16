var App = Ember.Application.create();

App.Router.map(function() {
	this.resource('referrers', function() {
		this.resource('referrer', {path: '/:referrer_id'});
	}),
	this.route('fetch', {path: '/fetch'});
});

App.Adapter = DS.RESTAdapter.extend({
	url: "http://localhost:3000"
});

App.Store = DS.Store.extend({
	adapter: 'App.Adapter'
});

App.Adapter.map("App.Referrer", {
	visits: {embedded: "always"},
	tweet: {embedded: "always"}
});

App.Adapter.map("App.Tweet", {
	user: {embedded: "always"},
	children: {embedded: "always"}
});

App.ReferrersRoute = Ember.Route.extend({
	model: function () {
		return App.Referrer.find();
	}
});

App.ReferrerRoute = Ember.Route.extend({
	model: function (params) {
		return App.Referrer.find(params.referrer_id);
	}
});

App.TweetRoute = Ember.Route.extend({
	model: function (params) {
		App.Tweet.find(params.tweet_id);
	}
});

App.BarGraph = Ember.View.extend({
	classNames: ["chart"],
	chart: BarChart()
			.margin({left: 40, top: 40, bottom: 80, right: 40})
			.width(200)
			.height(200),

	didInsertElement: function() {
		Ember.run.once(this, "updateChart");
	},

	updateChart: function() {
		if (this.get("isLoaded")) {
			d3.select(this.$()[0])
				.data([this.get("data").getEach("count")])
				.call(this.get("chart"));
		}
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