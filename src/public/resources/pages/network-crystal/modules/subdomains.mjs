import { JSONGetRequest } from '/resources/modules/request.mjs';

new (class extends LapisScript {
  async load() {
    const name = 'subdomains';

    const element = document.querySelector(`#network-crystal-modules-${name}`);
    let query = (() => {
      for (const module of global.modules) {
        if (module.name == name) {
          return module.query;
        }
      }
    })();

    element
      .querySelector('.content .control button')
      .addEventListener('click', () => {
        subscan(true);
      });

    subscan();

    function subscan(cc) {
      element.querySelector('.content .control button').disabled = true;
      element.querySelector('.content .text .raw').innerHTML = '<p>...</p>';
      JSONGetRequest(
        `${global.api}/network/subdomains/${query}${cc ? '?cache=false' : ''}`
      )
        .then((res) => {
          response(res.body.data);
        })
        .catch((error) => {
          console.log(error);
        });

      function response(data) {
        const text = element.querySelector('.content .text .raw');
        text.innerHTML = '';

        const p = document.createElement('p');
        p.innerHTML = '검색된 서브도메인: ' + data.subdomains.length + '개';
        text.appendChild(p);

        for (const sub of data.subdomains) {
          const a = document.createElement('a');
          a.href = '/network-crystal/' + sub;
          a.innerHTML = sub;
          a.setAttribute('lapis', '');
          text.appendChild(a);
        }

        Lapis.update();

        Lapis.setTimeout(() => {
          element.querySelector('.content .control button').disabled = false;
        }, 2000);
      }
    }
  }

  unload() {}
})();
