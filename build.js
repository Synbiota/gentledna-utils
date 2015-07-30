var glob = require('glob');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var babel = require('babel');
var _ = require('underscore');

var dist = './dist';

var babelOptions = {
  optional: ['runtime']
};

var replaceHtmlRequires = function(filepath, content) {
  var pattern = /require\(['"](.*\.html)['"]\);?/gi;

  return content.replace(pattern, function(match, templatepath) {
    console.log('Injecting', templatepath, 'into', filepath);
    var absoluteTemplatepath = path.resolve(path.dirname(filepath), templatepath);
    var template = fs.readFileSync(absoluteTemplatepath, 'utf-8');
    return _.template(template).source;
  });
};

glob.sync('./src/**/*.js').forEach(function(filepath) {
  var destpath = path.join(__dirname, dist, path.relative('./src', filepath));

  mkdirp.sync(path.dirname(destpath));

  var code = babel.transformFileSync(filepath, babelOptions).code;
  var newCode = replaceHtmlRequires(filepath, code);

  fs.writeFileSync(destpath, newCode);
  console.log('Built', path.relative(dist, destpath));
});