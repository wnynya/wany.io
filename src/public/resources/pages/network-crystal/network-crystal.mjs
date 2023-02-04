let sidebar;

new (class extends LapisScript {
  async load() {
    sidebar = new Sidebar(
      document.querySelector('#network-crystal-sidebar'),
      document.querySelector('#network-crystal-modules')
    );

    const input = document.querySelector('#network-crystal-query-input');

    input.addEventListener('keydown', (event) => {
      if (event.key == 'Enter') {
        Lapis.goto('/network-crystal/' + input.value);
      }
      fitInput();
    });
    input.addEventListener('keyup', (event) => {
      fitInput();
    });

    fitInput();
  }

  unload() {
    sidebar.unload();
  }
})();

function fitInput() {
  const input = document.querySelector('#network-crystal-query-input');
  let fs = input.getAttribute('fs') * 1;
  let c = gc();

  let i = 0;
  while (!(-2 <= c && c <= 0)) {
    i++;
    if (i > 1000) {
      break;
    }
    if (c < -2) {
      fs += 0.1;
    } else if (0 < c) {
      fs -= 0.1;
    }
    if (fs <= 10 || fs >= 80) {
      fs = Math.max(10, Math.min(80, fs));
      break;
    }
    input.style.fontSize = fs + 'px';
    c = gc();
  }
  fs -= 0.5;
  input.style.fontSize = fs + 'px';
  input.setAttribute('fs', fs);

  function gc() {
    return input.scrollWidth - input.clientWidth - 5;
  }
}
