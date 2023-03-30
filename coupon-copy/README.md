# クーポンコードコピースニペット

`<div class="coupon-code"></div>`

index.html の内容をコピペすることでクリップボードにコピーできる HTML を実装できます。

coupon-code の div 要素には複数の data 属性値が設定してあり、その内容を js で読み取ることで簡易的なスタイリングも可能です。

## data-\* の設定

data-code="CPN-CODE" data-code-color="#000,#fff" data-font-size="30px,16px" data-code-position="18%"
**_data-code_**
クリップボードにコピーさせたい＆表示させたいコードを記載します。（必須）

**_data-code-color_**
カンマ「,」区切りでカラーの設定ができます。

1. 第一要素：デフォルトの color
2. 第二要素：クリック時の color
3. 第三要素(オプション)：クリック時の背景色

3 つ目の色を指定しない場合、2 つ目の反転色がクリック時の背景色として描画されます。

**_data-font-size_**
カンマ「,」区切りでフォントサイズの設定ができます。

1. 第一要素：PC 時のフォントサイズ
2. 第二要素：SP 時のフォントサイズ

何も指定しない場合は、ブラウザもしくは親 DOM のフォントサイズが引き継がれます。

**_data-code-position_**
「クーポンコード：○○○」のテキスト位置を指定します。
要素の下辺からどれだけの位置かを設定します。

`bottom: ○○%;`の形で出力されます。

## 必要なもの

assets フォルダ内にある`coupon.css`、`coupon.js`を適宜読み込ませてください。

例：

<link rel="stylesheet" href="assets/css/coupon.css" />
<script src="assets/js/coupon.js"></script>
