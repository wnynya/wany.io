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

    const input = document.querySelector('#blog-article-index-query');
    input.addEventListener('keydown', (event) => {
      var key = event.key;
      if (key == 'Enter') {
        Lapis.goto('/b/index/' + input.value);
      }
    });

    if (document.querySelector('#blog-article-control-delete')) {
      document
        .querySelector('#blog-article-control-delete')
        .addEventListener('click', (event) => {
          if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            return;
          }
          JSONDeleteRequest(
            'https://api.wany.io/blog/articles/' + window.global.articleid,
            {
              hard: event.shiftKey,
            }
          )
            .then(() => {
              noty('게시글이 삭제되었습니다.');
              setTimeout(() => {
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
