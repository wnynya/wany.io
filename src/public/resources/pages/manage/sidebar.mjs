'use strict';

import Sidebar from '/resources/modules/sidebar.mjs';

let sidebar;

new (class extends LapisScript {
  async load() {
    sidebar = new Sidebar(
      document.querySelector('#manage-sidebar'),
      document.querySelector('#manage-main')
    );
    document
      .querySelector(
        `#manage-sidebar > .content a[href="${window.location.pathname.replace(
          /^(\/m\/([^\/]+\/)?[^\/]+).*/,
          '$1'
        )}"] > label`
      )
      .setAttribute('selected', '');
  }

  unload() {
    sidebar.unload();
  }
})();
