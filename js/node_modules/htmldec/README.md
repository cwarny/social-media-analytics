# htmlDec [![Build Status](https://secure.travis-ci.org/Bonuspunkt/htmldec.png)](http://travis-ci.org/Bonuspunkt/htmldec)
converts html special entities back to plain text

the conversation table is taken from

- http://www.w3schools.com/tags/ref_entities.asp
- http://www.w3schools.com/tags/ref_symbols.asp

##installation
    npm install htmldec

##example
    var htmlDec = require('htmldec');

    var input = '&quot; &lt; T E X T &gt; &quot;';
    var decoded = htmlDec(input);
    console.log(decoded) // prints " < T E X T > "

## license
public domain