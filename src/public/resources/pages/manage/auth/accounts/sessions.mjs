import {
  JSONGetRequest,
  JSONDeleteRequest,
} from '/resources/modules/request.mjs';
import Date from '/resources/modules/date.mjs';

new (class extends LapisScript {
  async load() {
    select();
  }

  unload() {}
})();

function select() {
  JSONGetRequest(`${global.api}/auth/accounts/${global.auid}/sessions`).then(
    (res) => {
      const data = res.body.data;

      document.querySelector(
        '#manage-auth-account-sessions .sessions'
      ).innerHTML = '';
      if (data.length > 0) {
        for (let session of data) {
          if (session.current) {
            document
              .querySelector('#manage-auth-account-sessions .sessions')
              .appendChild(sessionElement(session));
            data.splice(data.indexOf(session), 1);
            break;
          }
        }
        for (let session of data) {
          document
            .querySelector('#manage-auth-account-sessions .sessions')
            .appendChild(sessionElement(session));
        }
      } else {
        document.querySelector(
          '#manage-auth-account-sessions .sessions'
        ).innerHTML = '<div class="label">세션이 없습니다.</div>';
      }

      Lapis.update();

      function sessionElement(session) {
        let e = document.createElement('div');
        e.classList.add('session');
        e.setAttribute('sid', session.sid);
        session.current ? e.classList.add('current') : null;
        session.system = session.system.toLowerCase();
        session.system = session.system.replace(/ /g, '-');
        session.browser = session.browser.toLowerCase();
        session.browser = session.browser.replace(/ /g, '-');
        e.innerHTML = `
        <div class="icon">
          <div class="system" name="${session.system}"></div>
          <div class="browser" name="${session.browser}"></div>
        </div>
        <div class="info">
          <div class="geoip">
            <div class="ip">
              <a href="/network-crystal/${session.ip}" lapis>${session.ip}</a>
            </div>
          </div>
          <div class="last">
            ${
              session.current
                ? '현재 세션'
                : new Date().compare(session.lastused) + ' 마지막 활동'
            }
          </div>
        </div>
        <div class="control">
          ${
            !session.current
              ? '<button color="red" medium>로그아웃</button>'
              : ''
          }
        </div>
      `;

        e.querySelector('button')
          ? e.querySelector('button').addEventListener('click', (event) => {
              let target = event.target;
              while (!target.hasAttribute('sid')) {
                target = target.parentElement;
              }
              const sid = target.getAttribute('sid');
              if (!confirm('정말 이 세션에서 로그아웃하시겠습니까?')) {
                return;
              }
              JSONDeleteRequest(
                `${global.api}/auth/accounts/${global.auid}/sessions/${sid}`
              )
                .then((res) => {
                  noty('세션에서 로그아웃되었습니다.', 'success');
                  select();
                })
                .catch((error) => {
                  console.log(error);
                });
            })
          : null;
        return e;
      }
    }
  );
}
