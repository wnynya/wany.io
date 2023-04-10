'use strict';

import { JSONPatchRequest } from '/resources/modules/request.mjs';

const input = {
  password: null,
  newpassword: null,
  confirm: null,
};
const button = {
  update: null,
};

new (class extends LapisScript {
  async load() {
    input.newpassword = document.querySelector(
      '#input-manage-auth-account-change-password-new'
    );
    input.confirm = document.querySelector(
      '#input-manage-auth-account-change-password-new-confirm'
    );
    button.update = document.querySelector(
      '#button-manage-auth-account-change-password-update'
    );
    addEventListener();
  }

  unload() {}
})();

function addEventListener() {
  button.update.addEventListener('click', (event) => {
    update();
  });
}

function update() {
  let newpassword = input.newpassword.value;
  let confirm = input.confirm.value;

  if (!newpassword) {
    noty('새 비밀번호를 입력해주세요.');
    input.newpassword.focus();
    return;
  }
  if (!confirm) {
    noty('새 비밀번호를 한 번 더 입력해주세요.');
    input.confirm.focus();
    return;
  }
  if (newpassword.length < 8) {
    noty(
      '새 비밀번호가 너무 짧습니다. 새 비밀번호는 최소 8자리로 설정해야 합니다.'
    );
    input.newpassword.focus();
    return;
  }
  if (newpassword != confirm) {
    noty('새 비밀번호와 재입력 값이 일치하지 않습니다.');
    input.confirm.focus();
    return;
  }

  const data = {
    newpassword: newpassword,
  };

  JSONPatchRequest(
    `${global.api}/auth/accounts/${global.auid}/password/force`,
    data
  )
    .then(() => {
      noty('비밀번호가 변경되었습니다.', 'success');
      Lapis.setTimeout(() => {
        Lapis.goto(`/m/auth/accounts/${global.aeid}/change-password`);
      }, 750);
    })
    .catch((error) => {
      error?.body?.message
        ? noty(
            '비밀번호를 변경할 수 없습니다.<br>' + error.body.message,
            'error'
          )
        : null;
    });
}
