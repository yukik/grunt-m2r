'use strict';
/**
 * dependencies
 */
var cwd = process.cwd();
var path = require('path');
var EOL = require('os').EOL;

/**
 * alias
 */
var localName = '_exports';
var GENERATED = '/* !!!!! GRUNT-M2R GENERATED THIS FILE !!!!! */';



module.exports = function (grunt) {
  var description = 'node module to client module (requirejs)';
  grunt.registerMultiTask('m2r', description, function () {

    var target = this.target;
    var done = this.async();
    var config = grunt.config('m2r')[target];
    var src = config.src;
    var srcCwd = path.join(cwd, config.cwd || '.');
    var options = {filter: 'isFile', cwd: srcCwd};

    // 変換候補ファイル
    var files = grunt.file.expand(options, src);

    console.log('target:' + files.length);

    // pattern
    var flag = /^ *\/\*grunt-m2r(\:\w+)?\*\/ *$/;
    var stri = /^ *\'use strict\';$/;
    var requ = /^var (\w+) ?= ?require\('([-\.\/_0-9a-z]+)'\);?$/;
    var expo = /^ *exports\./;
    var mode = /^module\.exports ?= ?(exports ?= ?)?(\w+);$/;


    var complieCount = 0;

    // 一行づつ読み込みクライアントサイドのスクリプトに変換して配置する
    files.forEach(function(js) {

      var file = path.join(options.cwd, js);
      var text = grunt.file.read(file, {encoding: 'UTF-8'});

      var res = [];
      var mods = [];
      var params = [];
      var isRequire = false;
      var useStrict = false;
      var needLocal = null;
      var isM2r = false;
      var moduleName = null;
      var matches;

      text.split(EOL).forEach(function (line){
        // complie target
        if (!isM2r) {
          matches = line.match(flag);
          if (matches) {
            isRequire = matches[1] === ':require';
            isM2r = true;
            return;
          }
        }

        // use strict
        matches = line.match(stri);
        if (matches) {
          useStrict = res.length;
          res.push('  ' + line);
          return;
        }

        // require
        matches = line.match(requ);
        if (matches) {
          mods.push(matches[2]);
          params.push(matches[1]);
          res.push('');
          return;
        }

        // exports
        matches = line.match(expo);
        if (matches) {
          needLocal = true;
          res.push('  ' + line.replace('exports', localName));
          moduleName = localName;
          return;
        }

        // module.exports
        matches = line.match(mode);
        if (matches) {
          moduleName = matches[2];
          res.push('');
          return;
        }

        if (line.length === 0) {
          res.push('');
        } else {
          res.push('  ' + line);
        }
      });

      if (useStrict !== false && needLocal) {
        res[useStrict] = res[useStrict] + 'var ' + localName + ';';
        needLocal = false;
      }

      // クライアント利用可能なモジュールを書き出し
      if (isM2r) {
        var ln = needLocal ? 'var ' + localName + ';': '';
        var method = isRequire ? 'require' : 'define';
        if (mods.length) {
          var ms = '[\'' + mods.join('\', \'') + '\']';
          var ps = params.join(', ');
          res.unshift(GENERATED + ' ' + method + '('+ ms + ', function(' + ps + ') {' + ln);
        } else {
          res.unshift(GENERATED + ' ' + method + '(function() {' + ln);
        }
        if (moduleName) {
          res.push('  return ' + moduleName + ';');
        }
        res.push('});');

        var fpath = path.join(cwd, config.dest, js);
        grunt.file.write(fpath, res.join(EOL) , {encoding: 'UTF-8'});
        complieCount++;
      }

    });

    console.log('complie:' + complieCount);
    done();
  });
};

