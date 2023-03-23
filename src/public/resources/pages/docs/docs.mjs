'use strict';

import Sidebar from '/resources/modules/sidebar.mjs';

let sidebar;

new (class extends LapisScript {
  async load() {
    sidebar = new Sidebar(
      document.querySelector('#docs-sidebar'),
      document.querySelector('#docs-main')
    );
  }

  unload() {
    sidebar.unload();
  }
})();
