/*jshint maxparams:6*/

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
var GENERATED         = '/* !!!!! GRUNT-M2R GENERATED THIS FILE !!!!! */';
var REG_FLAG          = /^ *\/\*grunt-m2r(\:\w+)?\*\/ *$/;
var REG_STRICT        = /^ *\'use strict\';?$/;
var REG_REQUIRE       = /([=(,:] *require *\() *([^)]+) *\)/;
var REG_MOD_NAME      = /^'([^']+)'$/;
var REG_EXPORT        = /^ *exports\./;
var REG_MODULE_EXPORT = /^module\.exports *= *(exports *= *)?(\w+) *;?$/;
var MODULE_REQUIRE    = '/*module require*/';

/**
 * exports
 */
function m2r (grunt) {

  var description = 'node module to client module (requirejs)';

  grunt.registerMultiTask('m2r', description, function () {
    var target = this.target;
    if (target === 'dummy') {return;}
    var config = grunt.config('m2r')[target];

    if (typeof config.dest !== 'string') {
      grunt.fail.fatal('dest option necessary');
    }

    // node_modules全体のコンパイル
    if (config.node_modules) {
      complieModules(grunt, config);
      
    // 対象ファイルのコンパイル
    } else {
      complieNormal(grunt, config);

    }
  });
}

/**
 * 対象ファイルをコンパイル
 * @method normalComplie
 * @param  {Grunt}      grunt
 * @param  {Object}      config
 */
function complieNormal (grunt, config) {
  var srcCwd = path.resolve(cwd, config.cwd || '.');
  var options = {filter: 'isFile', cwd: srcCwd};
  var src = config.src || '**/*.js';
  var prefix = config.prefix || '.';
  var modulePrefix = config.modulePrefix || '.';
  var dest = config.dest;

  // 変換候補ファイル
  var files = grunt.file.expand(options, src);

  console.log('target:' + files.length);

  var complieCount = 0;

  // 変換
  files.forEach(function(file) {
    var from = path.join(options.cwd, file);
    var to = path.join(cwd, dest, file);
    var prefix2 = path.join(prefix, path.dirname(file));
    if (complie(grunt, from, to, prefix2, modulePrefix)) {
      complieCount++;
    }
  });

  console.log('complie:' + complieCount);
}

/**
 * node_modules全体をコンパイル
 * @method complieModules
 * @param {String} node_modules
 * @param {Object} config
 */
function complieModules (grunt, config) {
  // 検索するディレクトリ
  var searchDir = path.resolve(cwd, config.node_modules);
  // 配置先
  var dest = path.resolve(cwd, config.dest);
  var prefix = config.prefix || '.';
  var options = {filter: 'isFile', cwd: searchDir};
  var modules = [];
  // パッケージJSON
  var packageJsons = grunt.file.expand(options, '**/package.json');
  packageJsons.forEach(function(pj){
    var m = createEntryPoint(grunt, searchDir, dest, prefix, pj);
    if (m) {modules.push(m);}
  });
  var modules2 = modules.map(function (m) {return path.join(prefix, m);});
  modules.forEach(function (packageName) {
    compileModule(grunt, searchDir, dest, prefix, packageName, modules2);
    console.log('complie:' + packageName);
  });
}

/**
 * @method createEntryPoint
 * @param  {Grunt}         grunt
 * @param  {String}        searchDir
 * @param  {String}        dest
 * @param  {String}        prefix
 * @param  {String}        packageJson
 * @return {String}        packageName
 */
function createEntryPoint (grunt, searchDir, dest, prefix, packageJson) {
  var jsonFile = path.join(searchDir, packageJson);
  var info = grunt.file.readJSON(jsonFile);
  if (!~(info.keywords || []).indexOf('m2r')) {
    return false;
  }
  var mainFile = info.main || 'index.js';
  var packageName = path.dirname(packageJson);
  var index = path.resolve(cwd, dest || '.', packageName + '.js');
  var defineName = path.join(prefix || '.' , packageName, mainFile.slice(0, -3));
  var w = GENERATED + '\n' +
      'define([\'' + defineName + '\'], function(main){return main;});';
  grunt.file.write(index, w , {encoding: 'UTF-8'});
  return packageName;
}

/**
 * @method compileModule
 * @param  {Crunt}       grunt
 * @param  {String}      searchDir
 * @param  {String}      dest
 * @param  {String}      prefix
 * @param  {String}      packageName
 * @param  {Array}       modules
 */
function compileModule (grunt, searchDir, dest, prefix, packageName, modules) {
  var modulePrefix = prefix;
  var packageDir = path.join(searchDir, packageName);
  var options = {cwd: packageDir, filter: 'isFile'};
  // node_modules以外のjsファイルをすべて変換対象にする
  var files = grunt.file.expand(options, '**/*.js');
  files = files.filter(function (f) {return f.indexOf('node_modules');});
  files.forEach(function(f){
    var prefix2 = path.join(prefix, packageName, path.dirname(f));
    var from = path.join(packageDir, f);
    var to = path.resolve(cwd, dest || '.', packageName, f);
    complie(grunt, from, to, prefix2, modulePrefix, modules);
  });
}

/**
 * 一行づつ読み込みクライアントサイドのスクリプトに変換して配置する
 * @method complie
 * @param  {Grunt}   grunt
 * @param  {String}  from
 * @param  {String}  to
 * @param  {String}  prefix       相対位置のプリフィックス
 * @param  {String}  modulePrefix
 * @param  {Array}   modules
 * @return {Boolean} result
 */
function complie(grunt, from, to, prefix, modulePrefix, modules) {
  var text = grunt.file.read(from, {encoding: 'UTF-8'});

  var res = [];
  var mods = [];
  var isRequire = false;
  var useStrict = false;
  var needLocal = null;
  var isM2r = false;
  var moduleName = null;
  var matches;

  // 定義済みモジュールと検索対象のディレクトリ
  modules = modules || [];
  var definedModuleDirs = (prefix || '.').split('/').map(function (x, i, a) {
    return path.join(a.slice(0, i + 1).join('/') , 'node_modules');
  });

  text.split(EOL).forEach(function (line){
    // /*grunt-m2r*/
    if (!isM2r) {
      matches = line.match(REG_FLAG);
      if (matches) {
        isRequire = matches[1] === ':require';
        isM2r = true;
        return;
      }
    }

    // 'use strict'
    matches = line.match(REG_STRICT);
    if (matches) {
      useStrict = res.length;
      res.push('  ' + line);
      return;
    }

    // require ('foo')
    matches = line.match(REG_REQUIRE);
    if (matches) {
      var result = complieRequire(line, matches, prefix, modulePrefix, modules, definedModuleDirs);
      if (result.loadModule) {
        mods.push(result.loadModule);
      }
      res.push(result.line);
      return;
    }

    // exports.foo =
    matches = line.match(REG_EXPORT);
    if (matches) {
      needLocal = true;
      res.push('  ' + line);
      moduleName = 'exports';
      return;
    }

    // module.exports = 
    matches = line.match(REG_MODULE_EXPORT);
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

  // フラグ無し
  if (!isM2r) {
    return false;
  }

  // use strictの前にローカル変数を追加
  if (useStrict !== false && needLocal) {
    res[useStrict] = res[useStrict] + ' var exports = {};';
    needLocal = false;
  }

  // クライアント利用可能なモジュールを書き出し
  var ln = needLocal ? 'var exports = {};': '';
  var method = isRequire ? 'require' : 'define';
  var ms = mods.length ? ', \'' + mods.join('\', \'') + '\'' : '';
  res.unshift(GENERATED + ' ' +
        method + '([\'require\'' + ms + '], function(require) {' + ln);
  if (moduleName) {
    res.push('  return ' + moduleName + ';');
  }
  res.push('});');

  grunt.file.write(to, res.join(EOL) , {encoding: 'UTF-8'});

  // 読み込みモジュールを返す
  return mods;
}

/**
 * requireを含む行を処理する
 * @method complieRequire
 * @param  {String} line
 * @param  {Object} matches
 * @param  {String} prefix
 * @param  {String} modulePrefix
 * @param  {Array}  modules
 * @param  {Array}  definedModuleDirs
 * @return {Object} result
 */
function complieRequire (line, matches, prefix, modulePrefix, modules, definedModuleDirs) {
  var pre = line.slice(0, matches.index) + matches[1];
  var mod = matches[2];
  var sur = line.slice(matches.index + matches[0].length);
  var loadModule = null;

  var mtc2 = mod.match(REG_MOD_NAME);
  // 静的
  if (mtc2) {
    var name = mtc2[1];
    // 相対パス
    if (name[0] === '.') {
      loadModule = path.join(prefix, name);
    // 絶対パス
    } else {
      // 定義済みモジュールから一番階層が近いものを検索
      // 見つからない場合はmodulePrefixを追加して返す
      loadModule = definedModuleDirs.reduce(function (x, y) {
        var idx = modules.indexOf(path.join(y, name));
        return idx === -1 ? x : modules[idx];
      }, path.join(modulePrefix, name));
    }
    mod = '\'' + loadModule + '\'';

  // 動的
  } else {
    if (modulePrefix !== '.' && ~line.indexOf(MODULE_REQUIRE)) {
      mod = '\'' + modulePrefix + '/\' + ' + mod;
    }
  }
  return {
    loadModule: loadModule,
    line: '  ' + pre + mod + ')' + sur
  };
}

module.exports = exports = m2r;