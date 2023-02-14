import { JSONGetRequest } from '/resources/modules/request.mjs';
import Date from '/resources/modules/date.mjs';

new (class extends LapisScript {
  async load() {
    select();
  }

  unload() {}
})();

function select() {
  JSONGetRequest(`${global.api}/auth/accounts?size=10000`)
    .then((res) => {
      const data = res.body.data;

      document.querySelector('#manage-auth-account-index .accounts').innerHTML =
        '';
      if (data.length > 0) {
        for (const account of data) {
          document
            .querySelector('#manage-auth-account-index .accounts')
            .appendChild(accountElement(account));
        }
      } else {
        document.querySelector(
          '#manage-auth-account-index .accounts'
        ).innerHTML = '<div class="label">계정이 없습니다.</div>';
      }

      Lapis.update();
    })
    .catch((error) => {
      console.log(error);
    });

  function accountElement(account) {
    let e = document.createElement('a');
    e.classList.add('account');
    e.innerHTML = account;
    e.href = `/m/auth/accounts/${account.eid}`;
    e.setAttribute('lapis', '');
    e.innerHTML = `
      <div class="profile">
        <img src="${account.gravatar}?d=identicon&s=120" />
      </div>
      <div class="info">
        <div class="top">
          ${
            account.eid == account.label
              ? account.eid
              : `${account.label} (${account.eid})`
          }
        </div>
        <div class="bottom">
          <div class="last">${
            new Date().compare(account.lastused, { nofuture: true }) +
            ' 마지막으로 활동함'
          }</div>
          <div class="dot">&nbsp;·&nbsp;</div>
          <div class="perm">${account.permissions.length}개의 권한 노드</div>
        </div>
      </div>
    `;
    return e;
  }
}
