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
    input.perm = document.querySelector(
      '#input-manage-auth-account-permissions-perm'
    );
    button.updateLabel = document.querySelector(
      '#button-manage-auth-account-permissions-label-update'
    );
    button.updatePermPut = document.querySelector(
      '#button-manage-auth-account-permissions-perm-update-put'
    );
    button.updatePermDelete = document.querySelector(
      '#button-manage-auth-account-permissions-perm-update-delete'
    );
    addEventListener();
    select();
  }

  unload() {}
})();

function addEventListener() {
  button.updatePermPut.addEventListener('click', (event) => {
    updatePermPut();
  });
  button.updatePermDelete.addEventListener('click', (event) => {
    updatePermDelete();
  });

  function onPermChange(event) {
    let v = event.target.value;
    v = v.toLowerCase();
    v = v.replace(/[^a-z0-9.*-]+/g, '');
    event.target.value = v;
  }
  input.perm.addEventListener('keydown', onPermChange);
  input.perm.addEventListener('keyup', onPermChange);
  input.perm.addEventListener('change', onPermChange);
}

function select() {
  JSONGetRequest(`${global.api}/auth/accounts/${global.auid}/permissions`)
    .then((res) => {
      const data = res.body.data;

      document.querySelector(
        '#manage-auth-account-permissions .perms'
      ).innerHTML = '';
      if (data.length > 0) {
        for (const perm of data) {
          document
            .querySelector('#manage-auth-account-permissions .perms')
            .appendChild(permElement(perm));
        }
      } else {
        document.querySelector(
          '#manage-auth-account-permissions .perms'
        ).innerHTML = '<div class="label">계정에 권한 노드가 없습니다.</div>';
      }
    })
    .catch((error) => {
      console.log(error);
    });

  function permElement(perm) {
    let e = document.createElement('div');
    e.classList.add('perm');
    e.innerHTML = perm;
    e.addEventListener('click', (event) => {
      const p = event.target.innerHTML;
      input.perm.value = p;
    });

    return e;
  }
}

function updatePermPut() {
  let perm = input.perm.value;

  if (!perm) {
    noty('추가할 권한 노드를 입력해주세요.');
    input.perm.focus();
    return;
  }

  const data = {
    permissions: [perm],
  };

  button.updatePermPut.disabled = true;

  JSONPutRequest(`${global.api}/auth/accounts/${global.auid}/permissions`, data)
    .then(() => {
      noty('권한 노드가 추가되었습니다.', 'success');
      input.perm.value = '';
      select();
      button.updatePermPut.disabled = false;
    })
    .catch((error) => {
      error?.body?.message
        ? noty(
            '권한 노드를 추가할 수 없습니다.<br>' + error.body.message,
            'error'
          )
        : null;
      button.updatePermPut.disabled = false;
    });
}

function updatePermDelete() {
  let perm = input.perm.value;

  if (!perm) {
    noty('제거할 권한 노드를 입력해주세요.');
    input.perm.focus();
    return;
  }

  const data = {
    permissions: [perm],
  };

  button.updatePermDelete.disabled = true;

  JSONDeleteRequest(
    `${global.api}/auth/accounts/${global.auid}/permissions`,
    data
  )
    .then(() => {
      noty('권한 노드가 제거되었습니다.', 'success');
      input.perm.value = '';
      select();
      button.updatePermDelete.disabled = false;
    })
    .catch((error) => {
      error?.body?.message
        ? noty(
            '권한 노드를 제거할 수 없습니다.<br>' + error.body.message,
            'error'
          )
        : null;
      button.updatePermDelete.disabled = false;
    });
}
