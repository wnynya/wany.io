import { JSONPostRequest } from '/resources/modules/request.mjs';

new (class extends LapisScript {
  async load() {
    document
      .querySelector('#button-you-login-submit')
      .addEventListener('click', () => {
        login();
      });
    login();
  }

  unload() {}
})();

function login() {
  const id = document.querySelector('#input-you-login-account');
  const pw = document.querySelector('#input-you-login-password');
  const keep = document.querySelector('#input-you-login-keep');
  const btn = document.querySelector('#button-you-login-submit');

  if (!id.value) {
    id.focus();
    noty('계정 아이디 또는 이메일을 입력해주세요', 'info');
    return;
  } else if (!pw.value) {
    pw.focus();
    noty('비밀번호를 입력해주세요', 'info');
    return;
  }

  btn.disabled = true;
  flipBack();

  setTimeout(() => {
    JSONPostRequest(`${global.api}/auth/accounts/${id.value}/sessions`, {
      password: pw.value,
      keep: keep.checked,
    })
      .then((res) => {
        goaway();
        document
          .querySelector('#button-you-login-reset-password')
          .setAttribute('status', 'hide');
        setTimeout(() => {
          if (!window.global.redir) {
            window.global.redir = '/';
          }
          window.location.href;
        }, 500);
      })
      .catch((error) => {
        btn.disabled = false;
        flipFront();
        noty(
          '🚨로그인 실패!<br>계정 아이디 혹은 비밀번호를 확인해주세요',
          'error'
        );
        setTimeout(() => {
          shake();
          document
            .querySelector('#button-you-login-reset-password')
            .removeAttribute('status');
        }, 250);
      });
  }, 250);
}

function flipBack() {
  const front = document.querySelector('#you-login > .fg > .front');
  const back = document.querySelector('#you-login > .fg > .back');

  front.style.transform = 'rotateX(-180deg)';
  back.style.transform = 'rotateX(-360deg)';
  front.style.transition = 'transform 0.25s linear';
  back.style.transition = 'transform 0.25s linear';
  setTimeout(() => {
    front.style.opacity = 0;
    back.style.opacity = 1;
  }, 125);
  setTimeout(() => {
    back.style.transition = 'all 0s';
    back.style.transform = 'rotateX(0deg)';
  }, 250);
}

function flipFront() {
  const front = document.querySelector('#you-login > .fg > .front');
  const back = document.querySelector('#you-login > .fg > .back');

  front.style.transform = 'rotateX(-360deg)';
  back.style.transform = 'rotateX(-180deg)';
  front.style.transition = 'transform 0.25s linear';
  back.style.transition = 'transform 0.25s linear';
  setTimeout(() => {
    front.style.opacity = 1;
    back.style.opacity = 0;
  }, 125);
  setTimeout(() => {
    front.style.transition = 'all 0s';
    front.style.transform = 'rotateX(0deg)';
  }, 250);
}

function shake() {
  document.querySelector('#you-login > .fg').setAttribute('status', 'shake');
  setTimeout(() => {
    document.querySelector('#you-login > .fg').removeAttribute('status');
  }, 500);
}

function goaway() {
  document.querySelector('#you-login > .fg').setAttribute('status', 'goaway');
}
