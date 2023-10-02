// このjsファイルのパス
const GET_CURRENT_SU_SCRIPT_PATH = document.currentScript.src;
// 各クラス名やらを定義
const SU_TRIGGER_CLASS = "static-ugc";
const SU_TRIGGER_MODAL_CLASS = SU_TRIGGER_CLASS + "__modal-trigger";
const SU_TRIGGER_LIST_CLASS = SU_TRIGGER_CLASS + "__list";
const SU_TRIGGER_READMORE_CLASS = SU_TRIGGER_CLASS + "__readmore";
const SU_TRIGGER_READMORE_BTN_CLASS = SU_TRIGGER_READMORE_CLASS + "--btn";
const SU_MODAL_CLASS = SU_TRIGGER_CLASS + "-modal";
const SU_MODAL_SHOW_CLASS = "is-" + SU_MODAL_CLASS + "-show";
const SU_MODAL_OPEN_CLASS = "is-" + SU_MODAL_CLASS + "-open";
const SU_MODAL_CLOSE_CLASS = SU_MODAL_CLASS + "__close";
const SU_MODAL_CONTENTS_CLASS = SU_MODAL_CLASS + "__contents";
const SU_MODAL_NAV_CLASS = SU_MODAL_CLASS + "__nav";
const SU_MODAL_NAV_CURRENT_CLASS = "is-" + SU_MODAL_CLASS + "-current";
const SU_MODAL_NAV_PREV_CLASS = "is-" + SU_MODAL_CLASS + "-prev";
const SU_MODAL_NAV_NEXT_CLASS = "is-" + SU_MODAL_CLASS + "-next";
const SU_READMORE_CONTENT_TRIGGER_CLASS =
  "is-" + SU_TRIGGER_CLASS + "-content-opened";
const SU_READMORE_BTN_TRIGGER_CLASS = "is-" + SU_TRIGGER_CLASS + "-btn-opened";
const SU_READMORE_BTN_TEXT_OPEN = "続きを読む";
const SU_READMORE_BTN_TEXT_CLOSE = "閉じる";
const SU_PREV_SUFFIX_TEXT = "--prev";
const SU_NEXT_SUFFIX_TEXT = "--next";
const SU_DATA_MODAL_NUM = "data-modalnum";

// リスト表示のhtmlを作成
const generateContents = (data) => {
  const assetsPath = data[0];
  const i = data[1];
  const text = data[2];
  const thumbnail = data[3];
  const video = data[4];
  const url = data[5];
  const author = data[6];
  const date = data[7];
  let display = "block";
  if (i > 5) {
    display = "none";
  }
  let contents = `
  <li data-list-num="${i}" style="display:${display};">
      <label for="${SU_TRIGGER_CLASS}-item${i}">
        <div class="${SU_TRIGGER_CLASS}__each">
          <div class="${SU_TRIGGER_CLASS}__thumb">
            <div class="${SU_TRIGGER_CLASS}__thumb--image" style="background-image:url(${assetsPath}/media/${thumbnail})"></div>
            ${
              video
                ? `
            <div class="${SU_TRIGGER_CLASS}__thumb--video">
              <video src="${assetsPath}/media/${video}" poster="${assetsPath}/media/${thumbnail}" autoplay muted playsinline loop></video>
            </div>
            `
                : ""
            }
            <div class="${SU_TRIGGER_CLASS}__ig-icon ${SU_TRIGGER_CLASS}__color">
              <svg viewBox="0 0 100 100" width="100%">
                <use xlink:href="${assetsPath}/images/icon_ig.svg#icon-ig"></use>
              </svg>
            </div>
          </div>
          <div class="${SU_TRIGGER_CLASS}__data">
            <div class="${SU_TRIGGER_CLASS}__author">
              <div class="${SU_TRIGGER_CLASS}__author--icon ${SU_TRIGGER_CLASS}__color">
                <svg viewBox="0 0 100 100" width="100%">
                  <use xlink:href="${assetsPath}/images/icon_author.svg#icon-author"></use>
                </svg>
              </div>
              <div class="${SU_TRIGGER_CLASS}__author--name">${author}</div>
            </div>
            <div class="${SU_TRIGGER_CLASS}__text">${text}</div>
            <div class="${SU_TRIGGER_CLASS}__date">${date}</div>
            <div class="${SU_TRIGGER_READMORE_CLASS}"><button type="button" class="${SU_TRIGGER_READMORE_BTN_CLASS}">${SU_READMORE_BTN_TEXT_OPEN}</button></div>
            <div class="${SU_TRIGGER_CLASS}__post-link">
              <a href="${url}" target="_blank" class="${SU_TRIGGER_CLASS}__color">
                <svg viewBox="0 0 100 100" width="100%">
                  <use xlink:href="${assetsPath}/images/icon_ig.svg#icon-ig"></use>
                </svg>
                Instagramで見る
              </a>
            </div>
          </div>
        </div>
      </label>
      <button type="button" id="${SU_TRIGGER_CLASS}-item${i}" class="${SU_TRIGGER_MODAL_CLASS}" ${SU_DATA_MODAL_NUM}="${i}" style="display:none;">Modal Open</button>
    </li>
  `;

  return contents;
};

// UGCコンテンツを読み込む
const customUGCgenerator = (assetsPath, callback) => {
  let totalRequests = 0;
  let completedRequests = 0;
  const loadedData = [];

  const outputTarget = document.querySelector("." + SU_TRIGGER_CLASS);
  if (outputTarget !== null) {
    const ul = document.createElement("ul");
    ul.classList.add(SU_TRIGGER_LIST_CLASS);
    outputTarget.appendChild(ul);
  }

  function checkCompletion() {
    completedRequests++;
    if (completedRequests === totalRequests) {
      // ここに全ての非同期処理が終了した後に実行したい処理を書く
      // 非同期でロードすると順番がおかしい場合があるので並び替え
      loadedData.sort((a, b) => a[1] - b[1]);
      const outputList = document.querySelector("." + SU_TRIGGER_LIST_CLASS);
      loadedData.forEach((obj) => {
        const contents = generateContents(obj);
        outputList.insertAdjacentHTML("beforeend", contents);
      });
      if (loadedData.length >= 6) {
        outputList.insertAdjacentHTML(
          "afterend",
          '<div class="' +
            SU_TRIGGER_LIST_CLASS +
            '--loadmore"><button type="button" class="' +
            SU_TRIGGER_LIST_CLASS +
            '--loadmore-btn">もっと見る</button></div>'
        );
        document
          .querySelector("." + SU_TRIGGER_LIST_CLASS + "--loadmore-btn")
          .addEventListener("click", function () {
            this.style.display = "none";
            const list = this.closest("." + SU_TRIGGER_CLASS).querySelectorAll(
              "li"
            );
            list.forEach((e) => {
              e.style.display = "block";
            });
          });
      }
      if (typeof callback === "function") {
        callback();
      }
    }
  }

  // まずはjsonを読み込む
  fetch(assetsPath + "/json/ugc-data.json")
    .then((response) => response.json())
    .then((data) => {
      totalRequests = data.length;
      data.forEach((item, i) => {
        const filename = item.text;
        // jsonから取得したtxtファイルを読みこむ
        fetch(`${assetsPath}/text/${filename}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `ファイルの読み込みに失敗しました: ${response.status}`
              );
            }
            return response.text();
          })
          .then((text) => {
            loadedData.push([
              assetsPath,
              i,
              text,
              item.thumbnail,
              item.video,
              item.url,
              item.author,
              item.date,
            ]);
            checkCompletion();
          })
          .catch((error) => {
            console.error(error);
            checkCompletion();
          });
      });
    })
    .catch((error) => console.error("エラー:", error));
};

// モーダルの次へ前へボタンを押した時の処理
const customUGCmodalPagination = (modal, btn) => {
  const isC = SU_MODAL_NAV_CURRENT_CLASS;
  const isP = SU_MODAL_NAV_PREV_CLASS;
  const isN = SU_MODAL_NAV_NEXT_CLASS;
  const elements = modal.querySelectorAll("." + SU_MODAL_CONTENTS_CLASS);
  const current = modal.querySelector("." + isC);
  const currentIndex = Array.from(elements).indexOf(current);
  const lastIndex = elements.length - 1;
  elements[currentIndex].classList.remove(isC);

  if (elements.length > 2) {
    // スライドが３つ以上
    if (btn.classList.contains(SU_MODAL_NAV_CLASS + SU_NEXT_SUFFIX_TEXT)) {
      // 次へボタンの時
      for (let index = -1; index <= 2; index++) {
        let number = currentIndex + index;
        let e = elements[number];
        if (index === -1) {
          if (e) {
            e.classList.remove(isP);
          } else {
            elements[lastIndex].classList.remove(isP);
          }
        } else if (index === 0) {
          e.classList.add(isP);
        } else if (index === 1) {
          if (e) {
            e.classList.remove(isN);
            e.classList.add(isC);
          } else {
            elements[0].classList.remove(isN);
            elements[0].classList.add(isC);
          }
        } else if (index === 2) {
          if (e) {
            e.classList.add(isN);
          } else if (currentIndex === lastIndex) {
            elements[1].classList.add(isN);
          } else {
            elements[0].classList.add(isN);
          }
        }
      }
    } else {
      // 前へボタンの時
      for (let index = -2; index <= 1; index++) {
        let number = currentIndex + index;
        let e = elements[number];
        if (index === -2) {
          if (e) {
            e.classList.add(isP);
          } else if (currentIndex === 0) {
            elements[lastIndex - 1].classList.add(isP);
          } else {
            elements[lastIndex].classList.add(isP);
          }
        } else if (index === -1) {
          if (e) {
            e.classList.remove(isP);
            e.classList.add(isC);
          } else {
            elements[lastIndex].classList.remove(isP);
            elements[lastIndex].classList.add(isC);
          }
        } else if (index === 0) {
          e.classList.add(isN);
        } else if (index === 1) {
          if (e) {
            e.classList.remove(isN);
          } else {
            elements[0].classList.remove(isN);
          }
        }
      }
    }
  } else {
    // スライドが２つ以下
    if (elements[currentIndex + 1]) {
      elements[currentIndex + 1].classList.add(isC);
    } else {
      elements[0].classList.add(isC);
    }
  }
};

// modal generate
const customUGCmodalGenerator = () => {
  const lists = document.querySelectorAll("." + SU_TRIGGER_LIST_CLASS + " li");
  const listsLength = lists.length;
  let contents = "";
  let navBtns = "";
  lists.forEach((list, i) => {
    let content = list.querySelector("label").innerHTML;
    content =
      '<div class="' +
      SU_MODAL_CONTENTS_CLASS +
      '" ' +
      SU_DATA_MODAL_NUM +
      '="' +
      i +
      '">' +
      content +
      "</div>";
    contents += content;
  });
  if (listsLength > 1) {
    navBtns = `
    <button type="button" class="${SU_MODAL_NAV_CLASS} ${SU_MODAL_NAV_CLASS}${SU_PREV_SUFFIX_TEXT}">prev</button>
    <button type="button" class="${SU_MODAL_NAV_CLASS} ${SU_MODAL_NAV_CLASS}${SU_NEXT_SUFFIX_TEXT}">next</button>
    `;
  }
  const modalBlock = `
    <div class="${SU_MODAL_CLASS}">
      <div class="${SU_MODAL_CLOSE_CLASS} ${SU_MODAL_CLASS}__bg"></div>
      <button type="button" class="${SU_MODAL_CLOSE_CLASS} ${SU_MODAL_CLASS}__btn">Close Modal</button>
      <div class="${SU_MODAL_CLASS}__box">
        ${contents}
      </div>
      ${navBtns}
    </div>
    `;
  document.body.insertAdjacentHTML("beforeend", modalBlock);
};

// modal events
const customUGCmodalEvents = () => {
  // モーダル立ち上げボタン
  const triggers = document.querySelectorAll("." + SU_TRIGGER_MODAL_CLASS);
  const modal = document.querySelector("." + SU_MODAL_CLASS);
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      // ボタンのdata属性から対象モーダルのindex番号を取得
      const targetIndex = Number(this.getAttribute(SU_DATA_MODAL_NUM));
      // 各モーダル要素
      const targetModals = document.querySelectorAll(
        "." + SU_MODAL_CONTENTS_CLASS
      );
      // 対象モーダル
      const targetModal = targetModals[targetIndex];
      // 一旦不要なclassを全て消す
      const removeClasses = [
        SU_MODAL_NAV_CURRENT_CLASS,
        SU_MODAL_NAV_PREV_CLASS,
        SU_MODAL_NAV_NEXT_CLASS,
      ];
      targetModals.forEach((e) => {
        e.classList.remove(...removeClasses);
      });
      // ナビゲーション用にclassを振る
      targetModal.classList.add(SU_MODAL_NAV_CURRENT_CLASS);
      document.body.classList.add(SU_MODAL_OPEN_CLASS);
      if (targetModal.previousElementSibling) {
        targetModal.previousElementSibling.classList.add(
          SU_MODAL_NAV_PREV_CLASS
        );
      } else {
        targetModals[targetModals.length - 1].classList.add(
          SU_MODAL_NAV_PREV_CLASS
        );
      }
      if (targetModal.nextElementSibling) {
        targetModal.nextElementSibling.classList.add(SU_MODAL_NAV_NEXT_CLASS);
      } else {
        targetModals[0].classList.add(SU_MODAL_NAV_NEXT_CLASS);
      }
      // モーダル自体の立ち上げ
      modal.classList.add(SU_MODAL_SHOW_CLASS);
    });
  });
  // モーダル内でコンテンツが開いたままになるのを防ぐ
  const resetOpenedContent = () => {
    const contentOpened = document.querySelector(
      "." + SU_READMORE_CONTENT_TRIGGER_CLASS
    );
    if (contentOpened !== null) {
      contentOpened.classList.remove(SU_READMORE_CONTENT_TRIGGER_CLASS);
      const openedBtn = contentOpened.querySelector(
        "." + SU_READMORE_BTN_TRIGGER_CLASS
      );
      openedBtn.classList.remove(SU_READMORE_BTN_TRIGGER_CLASS);
      openedBtn.textContent = SU_READMORE_BTN_TEXT_OPEN;
    }
  };
  // モーダル閉じるボタン
  const closeBtns = document.querySelectorAll("." + SU_MODAL_CLOSE_CLASS);
  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      modal.classList.remove(SU_MODAL_SHOW_CLASS);
      resetOpenedContent();
      document.body.classList.remove(SU_MODAL_OPEN_CLASS);
    });
  });
  // ナビゲーションボタン
  const modalNavs = document.querySelectorAll("." + SU_MODAL_NAV_CLASS);
  if (modalNavs.length > 0) {
    modalNavs.forEach((modalNav) => {
      modalNav.addEventListener("click", function () {
        customUGCmodalPagination(modal, this);
        resetOpenedContent();
      });
    });
  }
  // 続きを読むボタン
  const readMoreBtns = document.querySelectorAll(
    "." + SU_TRIGGER_READMORE_BTN_CLASS
  );
  if (readMoreBtns.length > 0) {
    readMoreBtns.forEach((readMoreBtn) => {
      readMoreBtn.addEventListener("click", function () {
        this.classList.toggle(SU_READMORE_BTN_TRIGGER_CLASS);
        this.closest("." + SU_MODAL_CONTENTS_CLASS).classList.toggle(
          SU_READMORE_CONTENT_TRIGGER_CLASS
        );
        if (this.classList.contains(SU_READMORE_BTN_TRIGGER_CLASS)) {
          this.textContent = SU_READMORE_BTN_TEXT_CLOSE;
        } else {
          this.textContent = SU_READMORE_BTN_TEXT_OPEN;
        }
      });
    });
  }
};
// モーダル周りのセットアップ
function callbackCustomUGCmodal() {
  customUGCmodalGenerator();
  customUGCmodalEvents();
}
// cssをheadに出力
const styleSetUp = (assetsPath) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = assetsPath + "/css/ugc.css";
  document.head.appendChild(link);
  // テーマカラーが指定されていれば反映
  const mainTrigger = document.querySelector("." + SU_TRIGGER_CLASS);
  if (mainTrigger !== null) {
    const suMainColor = mainTrigger.getAttribute("data-su-color");
    if (suMainColor !== null) {
      document.documentElement.style.setProperty(
        "--staticUGCstyledColor",
        suMainColor
      );
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  // srcパスを分解してjsonやtextファイルへのパスを通す用の変数
  let assetsPath = GET_CURRENT_SU_SCRIPT_PATH.split("/js/ugc.js")[0];
  styleSetUp(assetsPath);
  // まずはリストを生成した後、コールバックでモーダル処理を走らせる
  customUGCgenerator(assetsPath, callbackCustomUGCmodal);
});
