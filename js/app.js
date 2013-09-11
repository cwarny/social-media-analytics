var App = Ember.Application.create();

App.Router.map(function() {
	this.resource('user', {path: '/user/:user_id'});
});

App.User = DS.Model.extend({
	first: DS.attr('string'),
	last: DS.attr('string'),
	avatar: DS.attr('string')
})

App.User.adapter = DS.RESTAdapter.extend({
	url: "http://172.18.18.129:3000"
	// adapter: App.User.FIXTURES
});

App.Store = DS.Store.extend({
	adapter: App.User.adapter.create()
});

App.ApplicationRoute = Ember.Route.extend({
	model: function() {
		return App.User.find();
	}
});

App.UserRoute = Ember.Route.extend({
	model: function(params) {
		return App.User.find(params.user_id);
	}
});

App.User.FIXTURES = [
	{
		id: 0,
		first: 'Ryan',
		last: 'Florence',
		avatar: 'https://si0.twimg.com/profile_images/3123276865/5c069e64eb7f8e971d36a4540ed7cab2.jpeg'
	},
	{
		id: 1,
		first: 'Tom',
		last: 'Dale',
		avatar: 'https://si0.twimg.com/profile_images/1317834118/avatar.png'
	},
	{
		id: 2,
		first: 'Yehuda',
		last: 'Katz',
		avatar: 'https://si0.twimg.com/profile_images/3250074047/46d910af94e25187832cb4a3bc84b2b5.jpeg'
	}
];