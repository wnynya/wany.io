let sidebar;

new (class extends LapisScript {
  async load() {
    sidebar = new Sidebar(
      document.querySelector('#you-sidebar'),
      document.querySelector('#you-main')
    );
    document
      .querySelector(
        `#you-sidebar > .content a[href="${window.location.pathname.replace(
          /^(\/u\/[^\/]+).*/,
          '$1'
        )}"] > label`
      )
      .setAttribute('selected', '');
  }

  unload() {
    sidebar.unload();
  }
})();
