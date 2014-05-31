grunt-m2r
====

node module to client module (requirejs) convert

(ja)  
nodeモジュールをクライアントサイドでも使用できるモジュール(要requirejs)に変換します。  
gruntを使用するためwatchで監視を行う事で変換の自動化も可能です

### install

```
npm install grunt-m2r --save-dev
```

### usage

Gruntfile.js

```js
module.exports = function(grunt) {
  grunt.initConfig({
    m2r: {
      complie: {
        cwd: 'scripts', // 対象フォルダ
        src: '**/*.js', // 変換するファイル
        dest: 'src'     // 変換後のファイルの設置先
      }
    }
  });

  // plugin
  grunt.loadNpmTasks('grunt-m2r');

  // task
  grunt.registerTask('default', ['m2r']);

};
```

### target file format

 + `require`にはクライアントサイドでも使用できるモジュール用意する必要があります
 + 変換が可能な事を示すコメント`/*grunt-m2r*/`を追加する必要があります
 + 変換はdefine関数で包みます
 + require関数で包みたい場合は`/*grunt-m2r:require*/`とコメントしてください
 + コメントのないファイルは変換しません
 + メインの処理は変換後でも行が一致するようになっています
 + 変換後のファイルの１行目に`GRUNT-M2R GENERATED THIS FILE`のコメントが追加されます

before

```js
/*grunt-m2r*/
'use strict';
var bar = require('./bar');
function foo (message) {
  console.log('foo say ' + message);
  bar(message);
}
module.exports = exports = foo;
```

after

```js
define(['./bar'], function(bar) {
  'use strict';

  function foo (message) {
    console.log('foo say ' + message);
    bar(message);
  }

  return foo;
});
```

