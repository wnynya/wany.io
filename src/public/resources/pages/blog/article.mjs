'use strict';

import { JSONDeleteRequest } from '/resources/modules/request.mjs';

new (class extends LapisScript {
  load() {
    for (const pic of document.querySelectorAll(
      '#blog-article-content picture, #blog-article-content p > img'
    )) {
      pic.addEventListener('click', (event) => {
        let uid = event.target.getAttribute('uid');
        let original = event.target.getAttribute('original');
        if (uid) {
          window.open('https://wany.io/p/' + uid, '_blank');
        } else if (original) {
          window.open(original, '_blank');
        }
      });
    }

    for (const a of document.querySelectorAll(
      '#blog-article-content a[href]'
    )) {
      if (a.href.match(/^(\/|https:\/\/wany.io)/)) {
        a.setAttribute('lapis', '');
      }
    }
    Lapis.update();

    document
      .querySelector('#blog-article-index-query')
      .addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
          Lapis.goto(
            `/b/index/${
              document.querySelector('#blog-article-index-query').value
            }`
          );
        }
      });

    if (document.querySelector('#blog-article-control-delete')) {
      document
        .querySelector('#blog-article-control-delete')
        .addEventListener('click', (event) => {
          if (!event.shiftKey) {
            return;
          }
          if (
            prompt(
              `정말로 이 게시글을 삭제하시겠습니까?\n게시글을 삭제하시려면 아래에 ${window.global.article.eid}를 입력해주세요.`
            ) != window.global.article.eid
          ) {
            return;
          }
          JSONDeleteRequest(
            `${global.api}/blog/articles/${window.global.article.uid}`
          )
            .then(() => {
              noty('게시글이 삭제되었습니다.');
              Lapis.setTimeout(() => {
                Lapis.goto('/b/index');
              }, 2000);
            })
            .catch((error) => {
              console.log(error);
            });
        });
    }
  }

  unload() {}
})();
