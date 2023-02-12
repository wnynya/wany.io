import Sidebar from '/resources/modules/sidebar.mjs';

let sidebar;

new (class extends LapisScript {
  async load() {
    sidebar = new Sidebar(
      document.querySelector('#network-crystal-sidebar'),
      document.querySelector('#network-crystal-modules')
    );

    sidebar.on('scroll', () => {
      let show;
      let showtop = Infinity;
      for (const module of document.querySelectorAll(
        '#network-crystal-modules section'
      )) {
        const rect = module.getBoundingClientRect();
        if (rect.height + rect.top - Math.rem(5) < 0) {
          continue;
        }
        if (rect.top < showtop) {
          show = module;
          showtop = rect.top;
        }
      }
      if (!show) {
        return;
      }
      let name = show.id.replace('network-crystal-modules-', '');
      for (const label of document.querySelectorAll(
        '#network-crystal-sidebar label'
      )) {
        if (label.getAttribute('module') == name) {
          label.setAttribute('selected', '');
        } else {
          label.removeAttribute('selected');
        }
      }
    });

    for (const label of document.querySelectorAll(
      '#network-crystal-sidebar label'
    )) {
      label.addEventListener('click', (event) => {
        let target = event.target;
        while (!target.hasAttribute('module')) {
          target = target.parentElement;
        }
        const name = label.getAttribute('module');
        const module = document.querySelector(
          `#network-crystal-modules-${name}`
        );
        const y =
          module.getBoundingClientRect().top + window.scrollY - Math.rem(5);
        window.scroll({
          top: y,
          behavior: 'smooth',
        });
      });
    }

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

    window.addEventListener('resize', onResize);

    fitInput();
  }

  unload() {
    window.removeEventListener('resize', onResize);
    sidebar.unload();
  }
})();

function onResize() {
  fitInput();
}

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
