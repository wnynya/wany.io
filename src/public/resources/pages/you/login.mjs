import { JSONPostRequest } from '/resources/modules/request.mjs';

new (class extends LapisScript {
  async load() {
    const loginBlock = new LoginBlock(document.querySelector('#you-login'));
    document
      .querySelector('#button-you-login-submit')
      .addEventListener('click', () => {
        loginBlock.login();
      });
    loginBlock.login();

    document
      .querySelector('#button-you-login-google')
      .addEventListener('click', () => {
        const popup = window.open(
          `${global.wanyne}/u/login/google`,
          '',
          `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=480,height=720`
        );
      });
  }

  unload() {}
})();

class Block {
  constructor(element) {
    this.element = element;
  }

  flipBack() {
    const front = this.element.querySelector('.wrapper > .front');
    const back = this.element.querySelector('.wrapper > .back');

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

  flipFront() {
    const front = this.element.querySelector('.wrapper > .front');
    const back = this.element.querySelector('.wrapper > .back');

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

  shake() {
    this.element.setAttribute('status', 'shake');
    setTimeout(() => {
      this.element.removeAttribute('status');
    }, 500);
  }

  goaway() {
    this.element.setAttribute('status', 'goaway');
  }

  down() {
    this.element.setAttribute('status', 'down');
  }

  up() {
    this.element.setAttribute('status', 'up');
  }
}

class LoginBlock extends Block {
  constructor(element) {
    super(element);
  }

  login() {
    const id = document.querySelector('#input-you-login-account');
    const pw = document.querySelector('#input-you-login-password');
    const keep = document.querySelector('#input-you-login-keep');
    const btn = document.querySelector('#button-you-login-submit');

    if (!id.value) {
      id.focus();
      noty('계정 아이디 또는 이메일을 입력해주세요.', 'info');
      return;
    } else if (!pw.value) {
      pw.focus();
      noty('비밀번호를 입력해주세요.', 'info');
      return;
    }

    btn.disabled = true;
    this.flipBack();

    setTimeout(() => {
      JSONPostRequest(`${global.api}/auth/accounts/${id.value}/sessions`, {
        password: pw.value,
        keep: keep.checked,
      })
        .then((res) => {
          this.goaway();
          document
            .querySelector('#button-you-login-reset-password')
            .setAttribute('status', 'hide');
          setTimeout(() => {
            if (!window.global.redir) {
              window.global.redir = '/';
            }
            window.location.href = window.global.redir;
          }, 500);
        })
        .catch((error) => {
          btn.disabled = false;
          this.flipFront();
          noty(
            '🚨로그인 실패!<br>계정 아이디 혹은 비밀번호를 확인해주세요.',
            'error'
          );
          pw.focus();
          setTimeout(() => {
            this.shake();
            document
              .querySelector('#button-you-login-reset-password')
              .removeAttribute('status');
          }, 250);
        });
    }, 250);
  }
}
