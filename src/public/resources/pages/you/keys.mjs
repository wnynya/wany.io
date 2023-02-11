import {
  JSONGetRequest,
  JSONPostRequest,
} from '/resources/modules/request.mjs';
import Date from '/resources/modules/date.mjs';

const button = {
  insert: null,
};

new (class extends LapisScript {
  async load() {
    button.insert = document.querySelector('#button-you-keys-insert');
    addEventListener();
    select();
  }

  unload() {}
})();

function addEventListener() {
  button.insert.addEventListener('click', (event) => {
    insert();
  });
}

function insert() {
  button.insert.disabled = true;
  JSONPostRequest(`${global.api}/auth/accounts/@me/keys`, {})
    .then((res) => {
      select();
      noty('새 API 키가 만들어졌습니다.', 'success');
      Lapis.setTimeout(() => {
        Lapis.goto(`/u/keys/${res.body.data}`);
      }, 750);
    })
    .catch((error) => {
      error?.body?.message
        ? noty(
            '새 API 키를 만들 수 없습니다.<br>' + error.body.message,
            'error'
          )
        : null;
      button.insert.disabled = false;
    });
}

function select() {
  JSONGetRequest(`${global.api}/auth/accounts/@me/keys`)
    .then((res) => {
      const data = res.body.data;

      document.querySelector('#you-keys .keys').innerHTML = '';
      if (data.length > 0) {
        for (let key of data) {
          document
            .querySelector('#you-keys .keys')
            .appendChild(keyElement(key));
        }
      } else {
        document.querySelector('#you-keys .keys').innerHTML =
          '<div class="label">API 키가 없습니다.</div>';
      }

      Lapis.update();
    })
    .catch((error) => {
      console.log(error);
    });

  function keyElement(key) {
    let e = document.createElement('a');
    e.classList.add('key');
    e.setAttribute('uid', key.uid);
    e.href = '/u/keys/' + key.uid;
    e.setAttribute('lapis', '');
    let code =
      key.code.substring(0, 4) +
      '···' +
      key.code.substring(key.code.length - 4, key.code.length);
    e.innerHTML = `
      <div class="icon">
      </div>
      <div class="info">
        <div class="top">
          <div class="name">${key.label}</div>
          <div class="code">${code}</div>
        </div>
        <div class="bottom">
          <div class="perm">${key.permissions.length}개의 권한 노드</div>
          <div class="dot">&nbsp;·&nbsp;</div>
          <div class="last">${
            new Date().compare(key.lastused, { nofuture: true }) +
            ' 마지막으로 사용됨'
          }</div>
        </div>
      </div>
    `;
    return e;
  }
}
