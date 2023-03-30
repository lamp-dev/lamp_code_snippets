/**
 * ページロード時に実行(data-* 属性を読み込んでスタイルを充てる)
 * @param {HTMLElement} targetElm ターゲットとなるelement
 * @param {string} textElm コピーターゲットのdom要素を指定
 * @param {string} targetClass ターゲットとなるelementのclass名
 */
function setupCoupon(targetElm, textElm, targetClass) {
  var newStyle = document.createElement("style");
  document.getElementsByTagName("head")[0].appendChild(newStyle);
  let addStyles = [];
  const obj = { ...targetElm.dataset };
  // console.log(obj);
  // datasetで取得したdata属性全てをループで回す
  Object.keys(obj).forEach(function (key) {
    if (key == "code") {
      targetElm.querySelector(textElm).textContent = obj[key];
    } else if (key == "codeColor") {
      // 第一引数はddのcolor,第二引数はクリック時のcolor,第三引数(オプション)はクリック時の背景色
      const colors = obj[key].split(",");
      targetElm.querySelector(targetClass + "__text").style.color = colors[0];
      addStyles.push(targetClass + "::before {color:" + colors[1] + ";}");
      let i = 1;
      let filterInvert = "filter: invert(1);";
      if (colors[2] !== undefined) {
        i = 2;
        filterInvert = "";
      }
      addStyles.push(
        targetClass +
          "::after {background-color:" +
          colors[i] +
          ";" +
          filterInvert +
          "}"
      );
    } else if (key == "fontSize") {
      const fontSize = obj[key].split(",");
      if (fontSize[1] !== undefined) {
        addStyles.push(
          "@media (max-width: 767px) {" +
            targetClass +
            " {font-size:" +
            fontSize[1] +
            ";}}"
        );
      }
      addStyles.push(targetClass + " {font-size:" + fontSize[0] + ";}");
    } else if (key == "codePosition") {
      targetElm.querySelector(targetClass + "__text").style.bottom = obj[key];
    }
  });
  //スタイルルールの追加
  // console.log(addStyles);
  addStyles.forEach((styles) => {
    newStyle.sheet.insertRule(styles, 0);
  });
}

// クーポンコードのコピー
document.addEventListener("DOMContentLoaded", function () {
  const targetClassName = ".coupon-code";
  const couponElm = document.querySelectorAll(targetClassName);
  const copiedClass = "is-copied";
  const copyTarget = "dd";
  if (couponElm.length > 0) {
    couponElm.forEach((e) => {
      setupCoupon(e, copyTarget, targetClassName);
      e.addEventListener("click", () => {
        const couponCode = e.querySelector(copyTarget).textContent;
        navigator.clipboard
          .writeText(couponCode)
          .then(() => {
            e.classList.add(copiedClass);
            setTimeout(() => {
              e.classList.remove(copiedClass);
            }, 3000);
          })
          .catch((err) => {
            console.log("Copy failed", err);
          });
      });
    });
  }
});
