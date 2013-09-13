var App = Ember.Application.create();

App.Router.map(function() {
	this.resource('visits', function() {
		this.resource('visit', {path: '/:visit_id'});
	}),
	this.route('fetch', {path: '/fetch'});
});

App.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo("parameters");
	}
});

App.ParametersController = Ember.Controller.extend({
	startDate: "2013-08-01",
	endDate: "2013-09-11",
	profileId: "75218327",
	actions: {
		save: function() {
			$.ajax({
				type: "POST",
				url: "http://localhost:3000/fetch",
				data: { startDate: this.get('startDate'), endDate: this.get('endDate'), profileId: this.get('profileId')}
			}).done(function(response) {
				console.log(response);
			});
		}
	}
});