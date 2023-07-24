'use strict';

import {
  JSONGetRequest,
  JSONPostRequest,
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
  update_email: null,
  update_phone: null,
};

new (class extends LapisScript {
  async load() {
    input.label = document.querySelector('#input-you-profile-label');
    input.eid = document.querySelector('#input-you-profile-eid');
    input.email = document.querySelector('#input-you-profile-email');
    input.email_code = document.querySelector('#input-you-profile-email-code');
    input.phone = document.querySelector('#input-you-profile-phone');
    button.update = document.querySelector('#button-you-profile-update');
    button.update_email_code = document.querySelector(
      '#button-you-profile-update-email-code'
    );
    button.update_email = document.querySelector(
      '#button-you-profile-update-email'
    );
    button.update_phone = document.querySelector(
      '#button-you-profile-update-phone'
    );
    addEventListener();
    read();
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
    updateProfile();
  }
  function onEidChange(event) {
    let v = event.target.value;
    v = v.replace(/[^a-z0-9]+/g, '');
    v = v.substring(0, 24);
    event.target.value = v;
    updateProfile();
  }
  function onEmailChange(event) {
    let v = event.target.value;
    v = v.replace(/[^a-z0-9_.@\-]+/g, '');
    v = v.substring(0, 60);
    event.target.value = v;
    updateEmail();
  }
  function onEmailCodeChange(event) {
    let v = event.target.value;
    v = v.toUpperCase();
    event.target.value = v;
    updateEmailCode();
  }
  function onPhoneChange(event) {
    let v = event.target.value;
    v = v.replace(/[^+0-9]+/g, '');
    v = v.substring(0, 24);
    event.target.value = v;
    updatePhone();
  }
  function updateProfile() {
    if (
      input.label.value &&
      input.eid.value &&
      (input.label.getAttribute('original') != input.label.value ||
        input.eid.getAttribute('original') != input.eid.value)
    ) {
      button.update.disabled = false;
    } else {
      button.update.disabled = true;
    }
  }
  function updateEmail() {
    if (
      input.email.value &&
      input.email.value.match(/[^@]+@[^.]+\..+/gi) &&
      input.email.getAttribute('original') != input.email.value
    ) {
      button.update_email_code.disabled = false;
    } else {
      button.update_email_code.disabled = true;
    }
  }
  function updateEmailCode() {
    if (input.email_code.value) {
      button.update_email.disabled = false;
    } else {
      button.update_email.disabled = true;
    }
  }
  function updatePhone() {
    if (
      input.phone.value &&
      input.phone.getAttribute('original') != input.phone.value
    ) {
      button.update_email.disabled = true;
    } else {
      button.update_email.disabled = true;
    }
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
  input.email_code.addEventListener('keydown', onEmailCodeChange);
  input.email_code.addEventListener('keyup', onEmailCodeChange);
  input.email_code.addEventListener('change', onEmailCodeChange);
  input.phone.addEventListener('keydown', onPhoneChange);
  input.phone.addEventListener('keyup', onPhoneChange);
  input.phone.addEventListener('change', onPhoneChange);
  button.update.addEventListener('click', (event) => {
    update();
  });
  button.update_email_code.addEventListener('click', (event) => {
    send_email_code();
  });
  button.update_email.addEventListener('click', (event) => {
    update_email();
  });
  button.update_phone.addEventListener('click', (event) => {
    update_phone();
  });
}

function read() {
  JSONGetRequest(`${global.api}/auth/accounts/@me`).then((res) => {
    const data = res.body.data;
    input.label.value = data.label;
    input.label.setAttribute('original', data.label);
    input.eid.value = data.eid;
    input.eid.setAttribute('original', data.eid);
    input.email.value = data.email;
    input.email.setAttribute('original', data.email);
    input.phone.value = data.phone;
    input.phone.setAttribute('original', data.phone);
  });
}

function update() {
  let label = input.label.value;
  let eid = input.eid.value;

  if (!label) {
    noty('이름을 입력해주세요.');
    input.label.focus();
    return;
  }
  if (!eid) {
    noty('사용자 ID를 입력해주세요.');
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

  const data = {
    label: label,
    eid: eid,
  };

  JSONPatchRequest(`${global.api}/auth/accounts/@me`, data)
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

function send_email_code() {
  let email = input.email.value;

  if (!email) {
    noty('이메일을 입력해주세요.');
    input.email.focus();
    return;
  }

  const data = {
    email: email,
  };

  JSONPostRequest(
    `${global.api}/auth/accounts/@me/verification/email/change-email/send`,
    data
  )
    .then(() => {
      noty(
        '이메일 인증 코드가 전송되었습니다.<br>이메일을 확인해주세요.',
        'success'
      );
      button.update_email_code.disabled = true;
      input.email_code.disabled = false;
      input.email_code.focus();
    })
    .catch((error) => {
      error?.body?.message
        ? noty(
            '🚨이메일 인증 코드 전송 실패!<br>' + error.body.message,
            'error'
          )
        : null;
    });
}

function update_email() {
  let email = input.email.value;

  if (!email) {
    noty('이메일을 입력해주세요.');
    input.email.focus();
    return;
  }

  let code = input.email_code.value;

  if (!code) {
    noty('이메일 인증 코드를 입력해주세요.');
    input.email_code.focus();
    return;
  }

  JSONPostRequest(
    `${global.api}/auth/accounts/@me/verification/email/change-email/verify`,
    {
      code: code,
      email: email,
    }
  )
    .then(() => {
      noty('아메일 인증 코드가 확인되었습니다.', 'success');
      JSONPatchRequest(`${global.api}/auth/accounts/@me/email`, {
        email: email,
      })
        .then(() => {
          noty('변경사항이 저장되었습니다.', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 750);
        })
        .catch((error) => {
          error?.body?.message
            ? noty(
                '변경사항을 저장할 수 없습니다.<br>' + error.body.message,
                'error'
              )
            : null;
        });
    })
    .catch((error) => {
      error?.body?.message
        ? noty(
            '🚨이메일 인증 코드 확인 실패!<br>' + error.body.message,
            'error'
          )
        : null;
    });
}

function update_phone() {
  let label = input.label.value;
  let eid = input.eid.value;
  let email = input.email.value;
  let phone = input.phone.value;

  if (!label) {
    noty('이름을 입력해주세요.');
    input.label.focus();
    return;
  }
  if (!eid) {
    noty('사용자 ID를 입력해주세요.');
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
    noty('이메일을 입력해주세요.');
    input.email.focus();
    return;
  }

  const data = {
    label: label,
    eid: eid,
    email: email,
    phone: phone,
  };

  JSONPatchRequest(`${global.api}/auth/accounts/@me`, data)
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
