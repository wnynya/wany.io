import { JSONGetRequest } from '/resources/modules/request.mjs';
import Date from '/resources/modules/date.mjs';

new (class extends LapisScript {
  async load() {
    const name = 'geoip';

    const element = document.querySelector(`#network-crystal-modules-${name}`);
    let query = (() => {
      for (const module of global.modules) {
        if (module.name == name) {
          return module.query;
        }
      }
    })();

    JSONGetRequest(`${global.api}/network/geoip/${query}`)
      .then((res) => {
        response(res.body.data);
      })
      .catch((error) => {
        console.error(error);
      });

    function response(data) {
      if (
        data.coordinate &&
        data.coordinate.latitude &&
        data.coordinate.longtitude
      ) {
        element.querySelector('.content .data').innerHTML =
          normalHTML() + (data.service ? serviceHTML() : '');

        element.querySelector('#geoip-country').innerHTML = data.country.name;
        element.querySelector('#geoip-region').innerHTML = data.region;
        element.querySelector('#geoip-city').innerHTML = data.city;
        element.querySelector('#geoip-coordinate').innerHTML =
          data.coordinate.latitude + ', ' + data.coordinate.longtitude;
        element.querySelector('#geoip-timezone').innerHTML = data.timezone;
        element.querySelector('#geoip-time').innerHTML = new Date(
          data.time
        ).format('YYYY-MM-DD hh:mm:ss');
        element.querySelector('#geoip-as-number').innerHTML = data.as.number;
        element.querySelector('#geoip-as-name').innerHTML = data.as.name;
        if (data.service) {
          element.querySelector('#geoip-service').innerHTML = data.service;
        }

        let iframe = document.createElement('iframe');
        iframe.src =
          '/network-crystal/map?lat=' +
          data.coordinate.latitude +
          '&lng=' +
          data.coordinate.longtitude;

        element.querySelector('.map').appendChild(iframe);
      } else {
        element.querySelector('.content .data').innerHTML =
          bogonHTML() + (data.service ? serviceHTML() : '');
        element.querySelector('.map').innerHTML = data.country.name;
        element.querySelector('#geoip-desc').innerHTML = data.country.name;
        if (data.service) {
          element.querySelector('#geoip-service').innerHTML = data.service;
        }
      }
    }

    function normalHTML() {
      let html = '';
      html += '<div class="desc">';
      html += '<div class="set">';
      html += '  <div class="key">국가</div>';
      html += '  <div class="value" id="geoip-country"></div>';
      html += '</div>';
      html += '<div class="set">';
      html += '  <div class="key">지역</div>';
      html += '  <div class="value" id="geoip-region"></div>';
      html += '</div>';
      html += '<div class="set">';
      html += '  <div class="key">도시</div>';
      html += '  <div class="value" id="geoip-city"></div>';
      html += '</div>';
      html += '<div class="set">';
      html += '  <div class="key">좌표</div>';
      html += '  <div class="value" id="geoip-coordinate"></div>';
      html += '</div>';
      html += '<div class="set">';
      html += '  <div class="key">시간대</div>';
      html += '  <div class="value" id="geoip-timezone"></div>';
      html += '</div>';
      html += '<div class="set">';
      html += '  <div class="key">시각</div>';
      html += '  <div class="value" id="geoip-time"></div>';
      html += '</div>';
      html += '<div class="set">';
      html += '  <div class="key">AS 번호</div>';
      html += '  <div class="value" id="geoip-as-number"></div>';
      html += '</div>';
      html += '<div class="set">';
      html += '  <div class="key">AS 이름</div>';
      html += '  <div class="value" id="geoip-as-name"></div>';
      html += '</div>';
      html += '</div>';
      return html;
    }

    function bogonHTML() {
      let html = '';
      html += '<div class="desc">';
      html += '<div class="set">';
      html += '  <div class="key">설명</div>';
      html += '  <div class="value" id="geoip-desc"></div>';
      html += '</div>';
      html += '</div>';
      return html;
    }

    function serviceHTML() {
      let html = '';
      html += '<div class="desc">';
      html += '<div class="set">';
      html += '  <div class="key">서비스</div>';
      html += '  <div class="value" id="geoip-service"></div>';
      html += '</div>';
      html += '</div>';
      return html;
    }
  }

  unload() {}
})();
