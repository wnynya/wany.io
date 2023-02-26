'use strict';

import {
  JSONGetRequest,
  JSONPutRequest,
  JSONDeleteRequest,
} from '/resources/modules/request.mjs';

const input = {
  code: null,
  label: null,
  perm: null,
};
const button = {
  showCode: null,
  updateLabel: null,
  updatePermPut: null,
  updatePermDelete: null,
  delete: null,
};

new (class extends LapisScript {
  async load() {
    select();
  }

  unload() {}
})();

function select() {
  JSONGetRequest(`${global.api}/auth/accounts/@me/permissions`)
    .then((res) => {
      const data = res.body.data;

      document.querySelector('#you-permissions .perms').innerHTML = '';
      if (data.length > 0) {
        for (const perm of data) {
          document
            .querySelector('#you-permissions .perms')
            .appendChild(permElement(perm));
        }
      } else {
        document.querySelector('#you-permissions .perms').innerHTML =
          '<div class="label">계정에 권한 노드가 없습니다.</div>';
      }
    })
    .catch((error) => {
      console.log(error);
    });

  function permElement(perm) {
    let e = document.createElement('div');
    e.classList.add('perm');
    e.innerHTML = perm;
    return e;
  }
}
