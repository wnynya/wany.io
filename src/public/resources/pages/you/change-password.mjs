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
    input.password = document.querySelector('#input-you-change-password-old');
    input.newpassword = document.querySelector(
      '#input-you-change-password-new'
    );
    input.confirm = document.querySelector(
      '#input-you-change-password-new-confirm'
    );
    button.update = document.querySelector(
      '#button-you-change-password-update'
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
  let password = input.password.value;
  let newpassword = input.newpassword.value;
  let confirm = input.confirm.value;

  if (!password) {
    noty('기존 비밀번호를 입력하십시오.');
    input.password.focus();
    return;
  }
  if (!newpassword) {
    noty('새 비밀번호를 입력하십시오.');
    input.newpassword.focus();
    return;
  }
  if (!confirm) {
    noty('새 비밀번호를 한 번 더 입력하십시오.');
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
    password: password,
    newpassword: newpassword,
  };

  JSONPatchRequest(`${global.api}/auth/accounts/@me/password`, data)
    .then(() => {
      noty('비밀번호가 변경되었습니다.', 'success');
      setTimeout(() => {
        alert(
          '비밀번호가 변경된 후에는 모든 세션에서 로그아웃됩니다. 다시 로그인하기 바랍니다.'
        );
        window.location.href = '/';
      }, 1500);
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
