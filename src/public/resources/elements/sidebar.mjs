let sidebar;
new (class extends LapisScript {
  load() {
    sidebar = new Sidebar(document.querySelector('#network-crystal-results'));
  }

  unload() {
    sidebar.onUnload();
  }
})();
