var assert = require('assert');
var htmlDec = require('./index');

var input = '&quot; &lt; T E X T &gt; &quot;';
var expected = '" < T E X T > "';
var actual = htmlDec(input);

assert.equal(actual, expected);