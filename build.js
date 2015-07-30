var glob = require('glob');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var babel = require('babel');

var dist = './dist';

var babelOptions = {
  optional: ['runtime']
};

glob.sync('./src/**/*.js').forEach(function(filepath) {
  var destpath = path.join(__dirname, dist, path.relative('./src', filepath));

  mkdirp.sync(path.dirname(destpath));

  var code = babel.transformFileSync(filepath, babelOptions).code;
  fs.writeFileSync(destpath, code);
  console.log('Built', path.relative(dist, destpath))

});