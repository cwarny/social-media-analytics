var translation = require('./htmlEntities');

module.exports = function(string) {
    return string.replace(/(&\w+;)/g, function(match) { 
        return translation[match] || 'match';
    }).replace(/&#(\d+);/g, function(match, capture) { 
        return String.fromCharCode(capture);
    }).replace(/&#x([0-9A-F]+);/gi, function(match, capture) {
        return String.fromCharCode(parseInt(capture, 16));
    });
};