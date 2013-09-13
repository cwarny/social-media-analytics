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

App.Visit = DS.Model.extend({
	referrer: DS.belongsTo("App.Referrer"),
	datehour: DS.attr("string"),
	count: DS.attr("number")
});

App.Referrer = DS.Model.extend({
	fullreferrer: DS.attr("string"),
	visits: DS.hasMany("App.Visit"),
	totalVisits: function() {
		return this.get("visits").get("length");
	}.property("visits.@each")
});

App.Adapter.map("App.Referrer", {
	visits: {embedded: "always"}
});

App.ReferrersRoute = Ember.Route.extend({
	model: function() {
		return App.Referrer.find();
	}
});

App.ReferrerRoute = Ember.Route.extend({
	model: function(params) {
		return App.Referrer.find(params.referrer_id);
	}
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