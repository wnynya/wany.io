import { JSONGetRequest } from '/resources/modules/request.mjs';

new (class extends LapisScript {
  async load() {
    const name = 'ping';

    const element = document.querySelector(`#network-crystal-modules-${name}`);
    let query = (() => {
      for (const module of global.modules) {
        if (module.name == name) {
          return module.query;
        }
      }
    })();

    element.querySelector('.ping.icmp button').addEventListener('click', () => {
      pingICMP();
    });
    element.querySelector('.ping.tcp button').addEventListener('click', () => {
      scanTCP(true);
    });
    element.querySelector('.ping.udp button').addEventListener('click', () => {
      scanUDP(true);
    });

    pingICMP();
    scanTCP();
    scanUDP();

    function pingICMP(cc) {
      element.querySelector('.ping.icmp button').disabled = true;
      element.querySelector('.content .icmp .res .ip').innerHTML = '...';
      element.querySelector('.content .icmp .res .bytes').innerHTML = '...';
      element.querySelector('.content .icmp .res .ttl').innerHTML = '...';
      element.querySelector('.content .icmp .res .time').innerHTML = '...';
      JSONGetRequest(
        `${global.api}/network/ping/icmp/${query}${cc ? '?cache=false' : ''}`
      )
        .then((res) => {
          const data = res.body.data;
          data.ip =
            '<a href="/network-crystal/' +
            data.ip +
            '" lapis>' +
            data.ip +
            '</a>';
          if (data.error) {
            if (data.ip) {
              element.querySelector('.content .icmp .res .ip').innerHTML =
                data.ip + ' (' + data.error + ')';
            } else {
              element.querySelector('.content .icmp .res .ip').innerHTML =
                data.error;
            }
          } else if (data.status == 'timeout') {
            element.querySelector('.content .icmp .res .ip').innerHTML =
              data.ip + ' (ETIMEDOUT)';
          } else {
            element.querySelector('.content .icmp .res .ip').innerHTML =
              data.ip;
          }
          element.querySelector('.content .icmp .res .bytes').innerHTML =
            data.bytes;
          element.querySelector('.content .icmp .res .ttl').innerHTML =
            data.ttl;
          element.querySelector('.content .icmp .res .time').innerHTML =
            data.time + 'ms';

          Lapis.update();

          Lapis.setTimeout(() => {
            element.querySelector('.ping.icmp button').disabled = false;
          }, 2000);
        })
        .catch((res) => {
          console.error(res.message);
        });
    }

    function scanTCP(cc) {
      element.querySelector('.ping.tcp button').disabled = true;
      element.querySelector(
        '.content .tcp .res'
      ).innerHTML = `<div class="set"><div class="port">...</div><div class="status">...</div><div class="desc">...</div></div>`;
      JSONGetRequest(
        `${global.api}/network/ping/tcp/scan/${query}:@${
          cc ? '?cache=false' : ''
        }`
      )
        .then((res) => {
          element.querySelector('.content .tcp .res').innerHTML = '';
          const data = res.body.data;

          const dp = {};
          const up = [];
          const su = ['open', 'close', 'filtered', 'reset', 'error'];

          for (const status of su) {
            const l = data.statuses[status].length;
            if (l <= 16) {
              for (const port of data.statuses[status]) {
                dp[port] = status;
              }
            } else {
              up.push({
                status: status,
                ports: l,
              });
            }
          }

          for (let d in dp) {
            var port = d * 1;
            var name = data.names[port];
            if (data.banners[port]) {
              name += ' (' + data.banners[port] + ')';
            }
            const pe = portElement(port, dp[d], name);
            if (data.banners[port]) {
              pe.classList.add('banner');
            }
            element.querySelector('.content .tcp .res').appendChild(pe);
          }

          for (let u of up) {
            const pe = portElement('', u.status, u.ports + ' ports');
            element.querySelector('.content .tcp .res').appendChild(pe);
          }

          function portElement(port, status, desc) {
            var element = document.createElement('div');
            element.classList.add('set');
            var html = '';
            html += '<div class="port">' + ':' + port + '</div>';
            html += '<div class="status">' + status + '</div>';
            html += '<div class="desc">' + desc + '</div>';
            element.innerHTML = html;
            return element;
          }

          Lapis.setTimeout(() => {
            element.querySelector('.ping.tcp button').disabled = false;
          }, 2000);
        })
        .catch((res) => {
          console.error(res.message);
        });
    }

    function scanUDP(cc) {
      element.querySelector('.ping.udp button').disabled = true;
      element.querySelector(
        '.content .udp .res'
      ).innerHTML = `<div class="set"><div class="port">...</div><div class="status">...</div><div class="desc">...</div></div>`;
      JSONGetRequest(
        `${global.api}/network/ping/udp/scan/${query}:@${
          cc ? '?cache=false' : ''
        }`
      )
        .then((res) => {
          element.querySelector('.content .udp .res').innerHTML = '';
          const data = res.body.data;

          const dp = {};
          const up = [];
          const su = ['open', 'close', 'filtered', 'reset', 'error'];

          for (const status of su) {
            const l = data.statuses[status].length;
            if (l <= 16) {
              for (const port of data.statuses[status]) {
                dp[port] = status;
              }
            } else {
              up.push({
                status: status,
                ports: l,
              });
            }
          }

          for (let d in dp) {
            var port = d * 1;
            var name = data.names[port];
            const pe = portElement(port, dp[d], name);
            element.querySelector('.content .udp .res').appendChild(pe);
          }

          for (let u of up) {
            const pe = portElement('', u.status, u.ports + ' ports');
            element.querySelector('.content .udp .res').appendChild(pe);
          }

          function portElement(port, status, desc) {
            var element = document.createElement('div');
            element.classList.add('set');
            var html = '';
            html += '<div class="port">' + ':' + port + '</div>';
            html += '<div class="status">' + status + '</div>';
            html += '<div class="desc">' + desc + '</div>';
            element.innerHTML = html;
            return element;
          }

          Lapis.setTimeout(() => {
            element.querySelector('.ping.udp button').disabled = false;
          }, 2000);
        })
        .catch((res) => {
          console.error(res);
        });
    }
  }

  unload() {}
})();
