'use strict';

var fs = require('fs');
var Promise = require('promise');
var request = require('then-request');

// https://github.com/adobe/brackets/blob/master/src/extensions/default/HTMLCodeHints/main.js

var host = 'https://raw.githubusercontent.com';
var base = host + '/adobe/brackets/master/src/extensions/default/HTMLCodeHints';

function parseJSON(res) {
  return JSON.parse(res.getBody().toString());
}

var tags = request(base + '/HtmlTags.json', {}).then(parseJSON);
var attrs = request(base + '/HtmlAttributes.json', {}).then(parseJSON);

Promise.all([tags, attrs]).done(function (res) {
  var tags = res[0];
  var attrs = res[1];
  fs.writeFileSync(__dirname + '/lib/autocomplete/html-structure.js', '"use strict";\n\n' +
                   '// This file is generated by /update-auto-complete.js\n' +
                   '// Do not edit it directly\n\n' +
                   'exports.tags = ' + JSON.stringify(tags, null, '  ') + '\n\n' +
                   'exports.attrs = ' + JSON.stringify(attrs, null, '  ') + ';');
});
