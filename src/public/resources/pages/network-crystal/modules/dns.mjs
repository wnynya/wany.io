import { JSONGetRequest } from '/resources/modules/request.mjs';

new (class extends LapisScript {
  async load() {
    const name = 'dns';

    const element = document.querySelector(`#network-crystal-modules-${name}`);
    let query = (() => {
      for (const module of global.modules) {
        if (module.name == name) {
          return module.query;
        }
      }
    })();

    JSONGetRequest(`${global.api}/network/dns/${query}`)
      .then((res) => {
        response(res.body.data);
      })
      .catch((error) => {
        console.error(error);
      });

    function response(data) {
      for (const record of data.records.a.records) {
        const e = document.createElement('p');
        e.innerHTML =
          '<a href="/network-crystal/' + record + '" lapis>' + record + '</a>';
        element.querySelector('.content .a .value').appendChild(e);
      }

      for (const record of data.records.aaaa.records) {
        const e = document.createElement('p');
        e.innerHTML =
          '<a href="/network-crystal/' + record + '" lapis>' + record + '</a>';
        element.querySelector('.content .aaaa .value').appendChild(e);
      }

      for (const record of data.records.cname.records) {
        const e = document.createElement('p');
        e.innerHTML = record;
        element.querySelector('.content .cname .value').appendChild(e);
      }

      data.records.mx.records = data.records.mx.records.sort((a, b) => {
        return b.priority - a.priority;
      });

      for (const record of data.records.mx.records) {
        const e = document.createElement('p');
        e.innerHTML =
          record.priority +
          ' <a href="/network-crystal/' +
          record.exchange +
          '" lapis>' +
          record.exchange +
          '</a>';
        element.querySelector('.content .mx .value').appendChild(e);
      }

      for (const record of data.records.ns.records) {
        const e = document.createElement('p');
        e.innerHTML =
          '<a href="/network-crystal/' + record + '" lapis>' + record + '</a>';
        element.querySelector('.content .ns .value').appendChild(e);
      }

      for (const record in data.records.soa.records) {
        const e = document.createElement('div');
        e.classList.add('innerset');
        e.innerHTML =
          '<div class="key">' +
          record +
          '</div><div class="value">' +
          data.records.soa.records[record] +
          '</div>';
        element.querySelector('.content .soa .value').appendChild(e);
      }

      for (const record of data.records.srv.records) {
        const e = document.createElement('p');
        e.innerHTML = record;
        element.querySelector('.content .srv .value').appendChild(e);
      }

      for (const record of data.records.txt.records) {
        const e = document.createElement('p');
        e.innerHTML = record;
        element.querySelector('.content .txt .value').appendChild(e);
      }

      Lapis.update();
    }
  }

  unload() {}
})();
