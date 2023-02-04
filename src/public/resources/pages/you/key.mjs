import {
  JSONGetRequest,
  JSONPostRequest,
  JSONPatchRequest,
  JSONPutRequest,
  JSONDeleteRequest,
} from '/resources/modules/request.mjs';
import Date from '/resources/modules/date.mjs';

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
    input.code = document.querySelector('#input-you-key-code');
    input.label = document.querySelector('#input-you-key-label');
    input.perm = document.querySelector('#input-you-key-perm');
    button.showCode = document.querySelector('#button-you-key-code-show');
    button.updateLabel = document.querySelector('#button-you-key-label-update');
    button.updatePermPut = document.querySelector(
      '#button-you-key-perm-update-put'
    );
    button.updatePermDelete = document.querySelector(
      '#button-you-key-perm-update-delete'
    );
    button.delete = document.querySelector('#button-you-key-delete');
    addEventListener();
    select();
  }

  unload() {}
})();

function addEventListener() {
  button.showCode.addEventListener('click', (event) => {
    input.code.type = 'text';
    button.showCode.disabled = true;
  });
  button.updateLabel.addEventListener('click', (event) => {
    updateLabel();
  });
  button.updatePermPut.addEventListener('click', (event) => {
    updatePermPut();
  });
  button.updatePermDelete.addEventListener('click', (event) => {
    updatePermDelete();
  });
  button.delete.addEventListener('click', (event) => {
    deleteKey();
  });
  input.code.addEventListener('click', (event) => {
    if (input.code.type == 'text') {
      navigator.clipboard.writeText(input.code.value).then(() => {
        window.noty('API 키 값이 클립보드에 복사되었습니다.');
      });
    }
  });

  function onLabelChange(event) {
    let v = event.target.value;
    v = v.replace(/[<>&]+/g, '');
    v = v.replace(/(^\s+)/, '');
    v = v.replace(/\s+/g, ' ');
    v = v.substring(0, 24);
    event.target.value = v;
  }
  function onPermChange(event) {
    let v = event.target.value;
    v = v.toLowerCase();
    v = v.replace(/[^a-z0-9.*-]+/g, '');
    event.target.value = v;
  }
  input.label.addEventListener('keydown', onLabelChange);
  input.label.addEventListener('keyup', onLabelChange);
  input.label.addEventListener('change', onLabelChange);
  input.perm.addEventListener('keydown', onPermChange);
  input.perm.addEventListener('keyup', onPermChange);
  input.perm.addEventListener('change', onPermChange);
}

function select() {
  JSONGetRequest(`${global.api}/auth/accounts/@me/keys/${global.kid}`)
    .then((res) => {
      const data = res.body.data;

      input.code.value = data.code;
      input.label.value = data.label;

      document.querySelector('#you-key .perms').innerHTML = '';
      if (data.permissions.length > 0) {
        for (const perm of data.permissions) {
          document
            .querySelector('#you-key .perms')
            .appendChild(permElement(perm));
        }
      } else {
        document.querySelector('#you-key .perms').innerHTML =
          '<div class="label">API 키에 권한 노드가 없습니다.</div>';
      }
    })
    .catch((error) => {
      Lapis.goto('/u/keys');
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

function updateLabel() {
  let label = input.label.value;

  if (!label) {
    noty('API 키 이름을 입력하십시오.');
    input.label.focus();
    return;
  }

  const data = {
    label: label,
  };

  button.updateLabel.disabled = true;

  JSONPatchRequest(`${global.api}/auth/accounts/@me/keys/${global.kid}`, data)
    .then(() => {
      noty('변경사항이 저장되었습니다.', 'success');
      select();
      button.updateLabel.disabled = false;
    })
    .catch((error) => {
      error?.body?.message
        ? noty(
            '변경사항을 저장할 수 없습니다.<br>' + error.body.message,
            'error'
          )
        : null;
      button.updateLabel.disabled = false;
    });
}

function updatePermPut() {
  let perm = input.perm.value;

  if (!perm) {
    noty('추가할 권한 노드를 입력하십시오.');
    input.perm.focus();
    return;
  }

  const data = {
    permissions: [perm],
  };

  button.updatePermPut.disabled = true;

  JSONPutRequest(
    `${global.api}/auth/accounts/@me/keys/${global.kid}/permissions`,
    data
  )
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
    noty('제거할 권한 노드를 입력하십시오.');
    input.perm.focus();
    return;
  }

  const data = {
    permissions: [perm],
  };

  button.updatePermDelete.disabled = true;

  JSONDeleteRequest(
    `${global.api}/auth/accounts/@me/keys/${global.kid}/permissions`,
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

function deleteKey() {
  if (!confirm('정말 이 API 키를 제거하시겠습니까?')) {
    return;
  }

  button.delete.disabled = true;

  JSONDeleteRequest(`${global.api}/auth/accounts/@me/keys/${global.kid}`, {})
    .then(() => {
      noty('API 키가 제거되었습니다.', 'success');
      Lapis.setTimeout(() => {
        Lapis.goto('/u/keys');
      }, 750);
    })
    .catch((error) => {
      error?.body?.message
        ? noty('API 키를 제거할 수 없습니다.<br>' + error.body.message, 'error')
        : null;
      button.delete.disabled = false;
    });
}
