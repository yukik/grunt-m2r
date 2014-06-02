grunt-m2r
====

node module to client module (requirejs) convert

(ja)  
nodeモジュールをクライアントサイドでも使用できるモジュール(要requirejs)に変換します。  
gruntを使用するためwatchで監視を行う事で変換の自動化も可能です

# install

```
npm install grunt-m2r --save-dev
```

# usage

変換は「対象ファイルを指定する」、「モジュールフォルダ全体を一気に行う」の２つの方法が用意されています。  

Gruntfile.js

```js
module.exports = function(grunt) {
  grunt.initConfig({
    m2r: {

      // 対象ファイルを指定する
      target_complie: {
        src: '**/*.js',         // 変換するファイル　省略可
        cwd: 'scripts',         // 対象フォルダ　省略可
        dest: 'src',            // 変換後のファイルの設置先　必須
        prefix: 'src'           // 変換後の定義名の接頭語　省略可
        modulePrefix: 'src_mod' // モジュールの接頭語　省略可
      },

      // モジュールフォルダ全体を一気に行う
      modules_complie: {
        node_modules: 'node_modules', // 変換対象のモジュールフォルダ　必須
        dest: 'src_mod',              // モジュールファイルの設置先　必須
        prefix: 'src_mod'             // 変換後の定義名の接頭語　省略可
      }
    }
  });

  // plugin
  grunt.loadNpmTasks('grunt-m2r');

  // task
  grunt.registerTask('default', ['m2r']);

};
```

## 対象ファイルを指定する

### src {String|Array}
変換対象ファイル  
省略時は、`**/*.js`です。（サブディレクトリを含む拡張子がjsのファイル）  
複数の場合は配列を指定する事が出来ます

### cwd {String}
実行時ディレクトリを指定したフォルダとして解決します  
指定していない場合は、`process.cwd()`です  
srcに`scripts/**/*.js`と指定した時の違いは、フォルダscriptsが作成されない事です

### dest {String}
変換後のファイルが配置されるディレクトリです。  
`/`から始まらない文字列は`process.cwd()`からの相対パスです  
cwdの影響は受けません

### prefix {String}
変換後のファイルを呼び出す起点のhtmlからのパスを指定します  
別の定義を呼び出す際の定義名を正しく解決できます

### modulePrefix {String}
ファイル内で作成済みのモジュールを利用している場合は、
モジュールの定義名のプリフィックスを指定することが出来ます  
省略した場合は空文字です

## モジュールフォルダ全体を一気に行う
<strong style='color:red'>変換が可能なモジュールはpackage.jsonのkeywordsに`m2r`が追加されているもののみ対象になります。</strong>  
node_modulesフォルダを指定して変換を行う事で、作成済みのモジュールを簡単に利用する事が出来るようになります。  
`node_modules`オプションを指定した場合に「モジュールフォルダ全体を一気に行う」に設定されます


### node_modules {String}
変換対象のモジュールフォルダ


### dest {String}
モジュールファイルの設置先

### prefix {String}
変換後の定義名のプリフィックスです。  
省略した場合は空文字です

# target file format

 + `require`にはクライアントサイドでも使用できるモジュール用意する必要があります
 + 変換が可能な事を示すコメント`/*grunt-m2r*/`を追加する必要があります
 + 変換はコード全体がdefine関数で包まれます
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
define(['src/bar'], function(bar) {
  'use strict';

  function foo (message) {
    console.log('foo say ' + message);
    bar(message);
  }

  return foo;
});
```



