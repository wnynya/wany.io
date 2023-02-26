'use strict';

import Sidebar from '/resources/modules/sidebar.mjs';

let sidebar;

new (class extends LapisScript {
  async load() {
    sidebar = new Sidebar(
      document.querySelector('#manage-auth-account-sidebar'),
      document.querySelector('#manage-auth-account-main')
    );
    document
      .querySelector(
        `#manage-auth-account-sidebar > .content a[href="${window.location.pathname.replace(
          /^(\/m\/auth\/accounts\/[^\/]+\/[^\/]+).*/,
          '$1'
        )}"] > label`
      )
      .setAttribute('selected', '');
  }

  unload() {
    sidebar.unload();
  }
})();
