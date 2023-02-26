'use strict';

import {
  JSONGetRequest,
  JSONPatchRequest,
} from '/resources/modules/request.mjs';

const input = {
  label: null,
  eid: null,
  email: null,
  phone: null,
};
const button = {
  update: null,
};

new (class extends LapisScript {
  async load() {
    input.label = document.querySelector(
      '#input-manage-auth-account-profile-label'
    );
    input.eid = document.querySelector(
      '#input-manage-auth-account-profile-eid'
    );
    input.email = document.querySelector(
      '#input-manage-auth-account-profile-email'
    );
    input.phone = document.querySelector(
      '#input-manage-auth-account-profile-phone'
    );
    button.update = document.querySelector(
      '#button-manage-auth-account-profile-update'
    );
    addEventListener();
    select();
  }

  unload() {}
})();

function addEventListener() {
  function onLabelChange(event) {
    let v = event.target.value;
    v = v.replace(/[<>&]+/g, '');
    v = v.replace(/(^\s+)/, '');
    v = v.replace(/\s+/g, ' ');
    v = v.substring(0, 24);
    event.target.value = v;
  }
  function onEidChange(event) {
    let v = event.target.value;
    v = v.replace(/[^a-z0-9]+/g, '');
    v = v.substring(0, 24);
    event.target.value = v;
  }
  function onEmailChange(event) {
    let v = event.target.value;
    v = v.replace(/[^a-z0-9_.@\-]+/g, '');
    v = v.substring(0, 60);
    event.target.value = v;
  }
  function onPhoneChange(event) {
    let v = event.target.value;
    v = v.replace(/[^+0-9]+/g, '');
    v = v.substring(0, 24);
    event.target.value = v;
  }
  input.label.addEventListener('keydown', onLabelChange);
  input.label.addEventListener('keyup', onLabelChange);
  input.label.addEventListener('change', onLabelChange);
  input.eid.addEventListener('keydown', onEidChange);
  input.eid.addEventListener('keyup', onEidChange);
  input.eid.addEventListener('change', onEidChange);
  input.email.addEventListener('keydown', onEmailChange);
  input.email.addEventListener('keyup', onEmailChange);
  input.email.addEventListener('change', onEmailChange);
  input.phone.addEventListener('keydown', onPhoneChange);
  input.phone.addEventListener('keyup', onPhoneChange);
  input.phone.addEventListener('change', onPhoneChange);
  button.update.addEventListener('click', (event) => {
    update();
  });
}

function select() {
  JSONGetRequest(`${global.api}/auth/accounts/${global.auid}`).then((res) => {
    const data = res.body.data;
    input.label.value = data.label;
    input.eid.value = data.eid;
    input.email.value = data.email;
    input.phone.value = data.phone;
  });
}

function update() {
  let label = input.label.value;
  let eid = input.eid.value;
  let email = input.email.value;
  let phone = input.phone.value;

  if (!label) {
    noty('이름을 입력하십시오.');
    input.label.focus();
    return;
  }
  if (!eid) {
    noty('사용자 ID를 입력하십시오.');
    input.eid.focus();
    return;
  }
  if (eid.length < 6) {
    noty(
      '사용자 ID가 너무 짧습니다. 사용자 ID 는 최소 6자리로 설정해야 합니다.'
    );
    input.eid.focus();
    return;
  }
  if (!email) {
    noty('이메일을 입력하십시오.');
    input.email.focus();
    return;
  }

  const data = {
    label: label,
    eid: eid,
    email: email,
    phone: phone,
  };

  JSONPatchRequest(`${global.api}/auth/accounts/${global.auid}`, data)
    .then(() => {
      noty('변경사항이 저장되었습니다.', 'success');
      window.location.reload();
    })
    .catch((error) => {
      error?.body?.message
        ? noty(
            '변경사항을 저장할 수 없습니다.<br>' + error.body.message,
            'error'
          )
        : null;
    });
}
