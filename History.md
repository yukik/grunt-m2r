0.3.1 / 2014-06-06
===================

 * bug fixed
 * 動的なrequireで相対パスの場合の不具合を修正

0.3.0 / 2014-06-05
===================

 * requireを解釈を変更
 * 変数にするのを止め、そのまま行を残すようにした
 * `var bar = require('foo').bar;`等に対応
 * 「モジュールフォルダ全体を一気に行う」の依存モジュールの解決を変更
 * 動的なrequireで、定義済みモジュールを使用する方法を追加

0.2.1 / 2014-06-03
===================

 * bug fixed
 * サブディレクトリの定義名解決の不具合の修正

0.2.0 / 2014-06-03
===================

 * bug fixed
 * 対象ファイルコンパイル時のクライアント利用可能なモジュールを書き出し部分でmodulesが未定義になる不具合の修正

0.1.4 / 2014-06-02
===================

 * example bug fixed

0.1.3 / 2014-06-02
===================

 * モジュール全体を変換するオプションを追加

0.1.2 / 2014-05-31
===================

 * requireに対応
 * grunt-m2rで作成されたファイルの１行目に`GRUNT-M2R GENERATED THIS FILE`コメントを追加

0.1.1 / 2014-05-30
===================

 * exampleの更新

0.1.0 / 2014-05-29
===================

 * 初期リリース