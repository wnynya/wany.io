'use strict';

new (class extends LapisScript {
  load() {
    document
      .querySelector('#input-blog-index-header-query')
      .addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
          Lapis.goto(
            `/b/index/${
              document.querySelector('#input-blog-index-header-query').value
            }`
          );
        }
      });
  }

  unload() {}
})();
