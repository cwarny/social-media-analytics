
Ember.TEMPLATES['account'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n			");
  hashContexts = {'tagName': depth0};
  hashTypes = {'tagName': "STRING"};
  options = {hash:{
    'tagName': ("li")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "webproperty", "", options) : helperMissing.call(depth0, "linkTo", "webproperty", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n		");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n				<a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'href': ("#")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</a>\n			");
  return buffer;
  }

  data.buffer.push("<div class=\"col-md-4\">\n	<dl class=\"faq\">\n		<dt class=\"two\">Select property</dt>\n	</dl>\n	<ul class=\"nav nav-pills nav-stacked\">\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "webproperties", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</ul>\n</div>\n");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "webproperty", options) : helperMissing.call(depth0, "outlet", "webproperty", options))));
  return buffer;
  
});

Ember.TEMPLATES['accounts'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n	<div class=\"row\">\n		<div class=\"col-md-4\">\n			<dl class=\"faq\">\n				<dt class=\"one\">Select account</dt>\n			</dl>\n			<ul class=\"nav nav-pills nav-stacked\">\n				");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "content", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n			</ul>\n		</div>\n		");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "account", options) : helperMissing.call(depth0, "outlet", "account", options))));
  data.buffer.push("\n	</div>\n	<br>\n	<br>\n	<br>\n	<div class=\"container profile\">\n		");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "profile", options) : helperMissing.call(depth0, "outlet", "profile", options))));
  data.buffer.push("\n	</div>\n	<br>\n	<br>\n	<br>\n	<br>\n	<br>\n	<br>\n	<br>\n	<br>\n	<br>\n	<br>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n					");
  hashContexts = {'tagName': depth0};
  hashTypes = {'tagName': "STRING"};
  options = {hash:{
    'tagName': ("li")
  },inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "account", "", options) : helperMissing.call(depth0, "linkTo", "account", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n				");
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n						<a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'href': ("#")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</a>\n					");
  return buffer;
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n	<div class=\"alert alert-warning\">You do not have any Google Analytics data.</div>\n");
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "content", {hash:{},inverse:self.program(5, program5, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("\n	<div class=\"addthis_toolbox addthis_floating_style addthis_32x32_style\" style=\"position:fixed; top:40%\">\n		<a class=\"addthis_button_preferred_1\"></a>\n		<a class=\"addthis_button_preferred_2\"></a>\n		<a class=\"addthis_button_preferred_3\"></a>\n		<a class=\"addthis_button_compact\"></a>\n	</div>\n	<script type=\"text/javascript\">var addthis_config = {\"data_track_addressbar\":true};</script>\n	<script type=\"text/javascript\" src=\"//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-51ff7b84368a3b9b\"></script>\n	<script type=\"text/javascript\">\n		$(document).ready(function () {\n			$(window).bind(\"scroll\", function (e) { \n				$(\".addthis_toolbox\").css({position: \"fixed\", top: \"40%\"});\n			});\n		});\n	</script>\n");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("Explore");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("\n					<li><a href=\"/logout\">Logout</a></li>\n				");
  }

function program7(depth0,data) {
  
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options;
  data.buffer.push("\n					<li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "login", options) : helperMissing.call(depth0, "linkTo", "login", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n				");
  return buffer;
  }
function program8(depth0,data) {
  
  
  data.buffer.push("Login");
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.unless.call(depth0, "model.user", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n<div class=\"container\">\n	<br>\n	<nav class=\"navbar navbar-default\" role=\"navigation\">\n		<div class=\"navbar-header\">\n			<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-ex1-collapse\">\n				<span class=\"sr-only\">Toggle navigation</span>\n				<span class=\"icon-bar\"></scan>\n				<span class=\"icon-bar\"></scan>\n				<span class=\"icon-bar\"></scan>\n			</button>\n			<a href=\"/\" class=\"navbar-brand\">Socialr</a>\n		</div>\n		<div class=\"collapse navbar-collapse navbar-ex1-collapse\">\n			<ul class=\"nav navbar-nav pull-right\">\n				<li>");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "accounts", options) : helperMissing.call(depth0, "linkTo", "accounts", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n				");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers['if'].call(depth0, "model.user", {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n			</ul>\n		</div>\n	</nav>\n	");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['home'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("<button class=\"btn btn-primary\">Sign Up</button>");
  }

  data.buffer.push("<div class=\"jumbotron\">\n	<h1>Hi there</h1>\n	<br>\n	<p><strong>Socialr</strong> enables you to analyze who talks about your content, how influential they are and what online social conversations they spawn</p>\n	<br>\n	<div class=\"centering\">\n		<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/KgjC7U6-IrA\" frameborder=\"0\" allowfullscreen></iframe>\n	</div>\n	<br>\n	<div class=\"centering\">\n		<p>Are you getting lots of visits from social media sites?</p>\n		<p>Want to put a face on who's driving traffic to your website?</p>\n		<p>Want to read the stories around your web content?</p>\n		");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "signup", options) : helperMissing.call(depth0, "linkTo", "signup", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n	</div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['login'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n	<div class=\"alert alert-danger\">Please log in.</div>\n");
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "error", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n<p>You need a Google account to log into Socialr.</p>\n<a href=\"http://socialr.herokuapp.com/auth/google\" type=\"button\" class=\"btn btn-primary\">Log In with Google</a>");
  return buffer;
  
});

Ember.TEMPLATES['profile'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"container\">\n	<div class=\"row\">\n		<div class=\"col-md-3\">\n			");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "referrers", options) : helperMissing.call(depth0, "render", "referrers", options))));
  data.buffer.push("\n		</div>\n		<div class=\"col-md-8\">\n			<div class=\"row\">\n				<div class=\"col-md-7\">\n					<br>\n					<form class=\"form-inline\" role=\"form\">\n						<div class=\"input-daterange row\" id=\"datepicker\">\n							<label>From</label>\n							<div class=\"form-group\">\n								");
  hashContexts = {'class': depth0,'type': depth0,'name': depth0,'value': depth0};
  hashTypes = {'class': "STRING",'type': "STRING",'name': "STRING",'value': "ID"};
  options = {hash:{
    'class': ("form-control"),
    'type': ("text"),
    'name': ("start"),
    'value': ("startDate")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n							</div>\n							<label>to</label>\n							<div class=\"form-group\">\n								");
  hashContexts = {'class': depth0,'type': depth0,'name': depth0,'value': depth0};
  hashTypes = {'class': "STRING",'type': "STRING",'name': "STRING",'value': "ID"};
  options = {hash:{
    'class': ("form-control"),
    'type': ("text"),
    'name': ("end"),
    'value': ("endDate")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n							</div>\n						</div>\n					</form>\n				</div>\n			</div>\n			<br>\n			<br>\n			<div class=\"row\">\n				<div class=\"col-md-12\">\n					");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.outlet || depth0.outlet),stack1 ? stack1.call(depth0, "tweet", options) : helperMissing.call(depth0, "outlet", "tweet", options))));
  data.buffer.push("\n				</div>\n			</div>\n		</div>\n	</div>\n</div>");
  return buffer;
  
});

Ember.TEMPLATES['referrers'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("Clicks");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("Followers");
  }

function program5(depth0,data) {
  
  
  data.buffer.push("Retweets");
  }

function program7(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.onlyOneTweet", {hash:{},inverse:self.program(17, program17, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n			");
  hashContexts = {'tagName': depth0};
  hashTypes = {'tagName': "STRING"};
  options = {hash:{
    'tagName': ("li")
  },inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "tweet", "model.tweets.firstObject", options) : helperMissing.call(depth0, "linkTo", "tweet", "model.tweets.firstObject", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n		");
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n				<a href=\"#\">\n					");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.screen_name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n					<span class=\"badge\">\n						");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "controllers.referrers.sortingPropertyIsTotalClicks", {hash:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					</span>\n				</a>\n			");
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n							");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.tweets.firstObject.totalClicks", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n						");
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n							");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "controllers.referrers.sortingPropertyIsFollowersCount", {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  return buffer;
  }
function program13(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n								");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.tweets.firstObject.referrer.followers_count", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n							");
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n								");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.retweet_count", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n							");
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n			<li ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggle", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">\n				<a href=\"#\">\n					<span>\n						");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.isExpanded", {hash:{},inverse:self.program(20, program20, data),fn:self.program(18, program18, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					</span>\n					");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.screen_name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n					<span class=\"badge\">\n						");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "controllers.referrers.sortingPropertyIsTotalClicks", {hash:{},inverse:self.program(24, program24, data),fn:self.program(22, program22, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					</span>\n				</a>\n			</li>\n			");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.isExpanded", {hash:{},inverse:self.noop,fn:self.program(27, program27, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  return buffer;
  }
function program18(depth0,data) {
  
  
  data.buffer.push("\n							&#x25BC;\n						");
  }

function program20(depth0,data) {
  
  
  data.buffer.push("\n							&#x25B6;\n						");
  }

function program22(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n							");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.totalClicks", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n						");
  return buffer;
  }

function program24(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n							");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "controllers.referrers.sortingPropertyIsFollowersCount", {hash:{},inverse:self.program(15, program15, data),fn:self.program(25, program25, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  return buffer;
  }
function program25(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n								");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.followers_count", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n							");
  return buffer;
  }

function program27(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n				");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "tweets", "model.tweets", options) : helperMissing.call(depth0, "render", "tweets", "model.tweets", options))));
  data.buffer.push("\n			");
  return buffer;
  }

  data.buffer.push("<label>Sort by</label>\n<div class=\"btn-group\">\n	");
  hashContexts = {'property': depth0};
  hashTypes = {'property': "STRING"};
  stack1 = helpers.view.call(depth0, "App.SortingButtonView", {hash:{
    'property': ("totalClicks")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  hashContexts = {'property': depth0};
  hashTypes = {'property': "STRING"};
  stack1 = helpers.view.call(depth0, "App.SortingButtonView", {hash:{
    'property': ("followers_count")
  },inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  hashContexts = {'property': depth0};
  hashTypes = {'property': "STRING"};
  stack1 = helpers.view.call(depth0, "App.SortingButtonView", {hash:{
    'property': ("retweet_count")
  },inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n<br>\n<br>\n<ul class=\"nav nav-pills nav-stacked\">\n	");
  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack1 = helpers.each.call(depth0, "arrangedContent", {hash:{
    'itemController': ("referrer")
  },inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</ul>");
  return buffer;
  
});

Ember.TEMPLATES['signup'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, self=this;

function program1(depth0,data) {
  
  
  data.buffer.push("\n	<div class=\"centering\">\n		<h3>Fetching data...</h3>\n		<br>\n		<img src=\"/img/loading.gif\" alt=\"Loading\" title=\"Loading\" class=\"loading\"/>\n	</div>\n");
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n	");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "error", {hash:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	<h1>Sign Up</h1>\n	<br>\n	<dl class=\"signup\">\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.view.call(depth0, "App.SignonView", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		<dd>");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.view.call(depth0, "App.SignonButtonView", {hash:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</dd>\n\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.view.call(depth0, "App.ConnectView", {hash:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		<dd>");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.view.call(depth0, "App.ConnectButtonView", {hash:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</dd>\n\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.view.call(depth0, "App.GetDataView", {hash:{},inverse:self.noop,fn:self.program(14, program14, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		<dd>");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.view.call(depth0, "App.GetDataButtonView", {hash:{},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</dd>\n		\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.unless.call(depth0, "isNotAtGetDataStep", {hash:{},inverse:self.noop,fn:self.program(18, program18, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</dl>\n");
  return buffer;
  }
function program4(depth0,data) {
  
  
  data.buffer.push("\n		<div class=\"alert alert-danger\">Please finish the signup process.</div>\n	");
  }

function program6(depth0,data) {
  
  
  data.buffer.push("\n			Socialr needs access to your Google Analytics data. Please sign on with the Google account linked to your Analytics account.\n		");
  }

function program8(depth0,data) {
  
  
  data.buffer.push("Sign On");
  }

function program10(depth0,data) {
  
  
  data.buffer.push("\n			Socialr finds the tweets that led people to land on your website. You need to connect a Twitter account to your Socialr account.\n		");
  }

function program12(depth0,data) {
  
  
  data.buffer.push("Connect");
  }

function program14(depth0,data) {
  
  
  data.buffer.push("\n			Mash up Google Analytics and Twitter. Download your data.\n		");
  }

function program16(depth0,data) {
  
  
  data.buffer.push("Get Data");
  }

function program18(depth0,data) {
  
  
  data.buffer.push("\n			<div class=\"alert alert-warning\">On sign up, Socialr grabs data only one day in the past. From then on, your data will be updated daily, adding to your data history.</div>\n		");
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "downloading", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES['tweet'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n	<div class=\"well row tweetbox\">\n		<div class=\"col-md-1\">\n			<img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "ID"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("model.referrer.profile_image_url")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" alt=\"Profile picture\">\n		</div>\n		<div class=\"col-md-11\">\n			<blockquote>\n				<p>\n					");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "chunks", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n				</p>\n				<small>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.referrer.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" (@");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.referrer.screen_name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(")</small>\n			</blockquote>\n		</div>\n		<a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "ID"};
  options = {hash:{
    'href': ("model.conversation_url")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" role=\"button\" class=\"btn btn-info pull-right\" target=\"_blank\">See tweet</a>\n		");
  hashContexts = {'data': depth0,'startDate': depth0,'endDate': depth0,'transition': depth0};
  hashTypes = {'data': "ID",'startDate': "ID",'endDate': "ID",'transition': "STRING"};
  options = {hash:{
    'data': ("model.clicks"),
    'startDate': ("controllers.profile.startDate"),
    'endDate': ("controllers.profile.endDate"),
    'transition': ("transition")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bar-chart'] || depth0['bar-chart']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bar-chart", options))));
  data.buffer.push("\n		</br>\n	</div>\n");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n						");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "str", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("<a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "ID"};
  options = {hash:{
    'href': ("expanded_url")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" target=\"_blank\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "url", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</a>\n					");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n	");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.referrer.onlyOneTweet", {hash:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n		<div class=\"well row tweetbox\">\n			<div class=\"col-md-1\">\n				<img ");
  hashContexts = {'src': depth0};
  hashTypes = {'src': "ID"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("model.referrer.profile_image_url")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" alt=\"Profile picture\">\n			</div>\n			<div class=\"col-md-11\">\n				<blockquote>\n					<p>\n						");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "chunks", {hash:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					</p>\n					<small>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.referrer.name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(" (@");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.referrer.screen_name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(")</small>\n				</blockquote>\n			</div>\n			<a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "ID"};
  options = {hash:{
    'href': ("model.conversation_url")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" role=\"button\" class=\"btn btn-info pull-right\" target=\"_blank\">See tweet</a>\n			");
  hashContexts = {'data': depth0,'startDate': depth0,'endDate': depth0,'transition': depth0};
  hashTypes = {'data': "ID",'startDate': "ID",'endDate': "ID",'transition': "STRING"};
  options = {hash:{
    'data': ("model.clicks"),
    'startDate': ("controllers.profile.startDate"),
    'endDate': ("controllers.profile.endDate"),
    'transition': ("transition")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bar-chart'] || depth0['bar-chart']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bar-chart", options))));
  data.buffer.push("\n			</br>\n		</div>\n	");
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n							");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "str", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("<a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "ID"};
  options = {hash:{
    'href': ("expanded_url")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers['bind-attr'] || depth0['bind-attr']),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "bind-attr", options))));
  data.buffer.push(" target=\"_blank\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "url", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</a>\n						");
  return buffer;
  }

  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "model.referrer.isExpanded", {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});

Ember.TEMPLATES['tweets'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashContexts, hashTypes, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.unless.call(depth0, "noClicks", {hash:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n			");
  hashContexts = {'tagName': depth0};
  hashTypes = {'tagName': "STRING"};
  options = {hash:{
    'tagName': ("li")
  },inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "tweet", "model", options) : helperMissing.call(depth0, "linkTo", "tweet", "model", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n		");
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n				<a href=\"#\">\n					");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "controllers.referrers.sortingPropertyIsTotalClicks", {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n				</a>\n			");
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n						");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.referrer.screen_name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("<span class=\"badge\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.totalClicks", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n					");
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts;
  data.buffer.push("\n						");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "controllers.referrers.sortingPropertyIsFollowersCount", {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					");
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n							");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.referrer.screen_name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("<span class=\"badge\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.referrer.followers_count", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n						");
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("\n							");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.referrer.screen_name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("<span class=\"badge\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "model.retweet_count", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span>\n						");
  return buffer;
  }

  data.buffer.push("<ul class=\"nav nav-pills nav-stacked\">\n	");
  hashContexts = {'itemController': depth0};
  hashTypes = {'itemController': "STRING"};
  stack1 = helpers.each.call(depth0, "arrangedContent", {hash:{
    'itemController': ("tweet")
  },inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</ul>");
  return buffer;
  
});

Ember.TEMPLATES['webproperty'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("\n			");
  hashContexts = {'tagName': depth0};
  hashTypes = {'tagName': "STRING"};
  options = {hash:{
    'tagName': ("li")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo || depth0.linkTo),stack1 ? stack1.call(depth0, "profile", "", options) : helperMissing.call(depth0, "linkTo", "profile", "", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n		");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashContexts, hashTypes;
  data.buffer.push("\n				<a ");
  hashContexts = {'href': depth0};
  hashTypes = {'href': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'href': ("#")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "name", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</a>\n			");
  return buffer;
  }

  data.buffer.push("<div class=\"col-md-4\">\n	<dl class=\"faq\">\n		<dt class=\"three\">Select profile</dt>\n	</dl>\n	<ul class=\"nav nav-pills nav-stacked\">\n		");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "profiles", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</ul>\n</div>");
  return buffer;
  
});


