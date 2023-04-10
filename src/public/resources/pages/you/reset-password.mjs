import { JSONPostRequest } from '/resources/modules/request.mjs';

new (class extends LapisScript {
  async load() {
    Lapis.checkCookie = false;

    const resetBlock1 = new ResetBlock1(
      document.querySelector('#you-reset-password-1')
    );
    document
      .querySelector('#button-you-reset-password-submit-1')
      .addEventListener('click', () => {
        resetBlock1.submit().then(() => {
          document.activeElement?.blur ? document.activeElement.blur() : null;
          resetBlock1.down();
          setTimeout(() => {
            resetBlock2.up();
          }, 250);
          setTimeout(() => {
            resetBlock2.submit();
          }, 1000);
        });
      });
    resetBlock1.submit();

    const resetBlock2 = new ResetBlock2(
      document.querySelector('#you-reset-password-2')
    );
    document.querySelector('#you-reset-password-2').style.top =
      window.innerHeight + 'px';
    document
      .querySelector('#button-you-reset-password-submit-2')
      .addEventListener('click', () => {
        resetBlock2.submit().then(() => {
          document.activeElement?.blur ? document.activeElement.blur() : null;
          resetBlock2.down();
          setTimeout(() => {
            resetBlock3.up();
          }, 250);
          setTimeout(() => {
            resetBlock3.submit();
          }, 1000);
        });
      });

    const resetBlock3 = new ResetBlock3(
      document.querySelector('#you-reset-password-3')
    );
    document.querySelector('#you-reset-password-3').style.top =
      window.innerHeight + 'px';
    document
      .querySelector('#button-you-reset-password-submit-3')
      .addEventListener('click', () => {
        resetBlock3.submit();
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
    this.element
      .Animate()
      .spring(0.3, 3)
      .to(
        {
          top: window.innerHeight + 'px',
        },
        500
      );
  }

  up() {
    this.element.Animate().spring(0.3, 3).to(
      {
        top: '0px',
      },
      500
    );
  }
}

class ResetBlock1 extends Block {
  constructor(element) {
    super(element);
  }

  submit() {
    return new Promise((resolve) => {
      const email = document.querySelector('#input-you-reset-password-email');
      const btn = document.querySelector('#button-you-reset-password-submit-1');

      if (!email.value) {
        email.focus();
        noty('계정 이메일을 입력해주세요.', 'info');
        return;
      }
      if (!email.value.match(/[^.@]+@[^.]+\.[^.]+/i)) {
        email.focus();
        noty('유효한 이메일 주소를 입력해주세요.', 'info');
        return;
      }

      btn.disabled = true;
      this.flipBack();

      setTimeout(() => {
        JSONPostRequest(
          `${global.api}/auth/verification/email/reset-password/send`,
          {
            aid: email.value,
            email: email.value,
          }
        )
          .then((res) => {
            noty(
              '아메일 인증 코드가 전송되었습니다.<br>이메일을 확인해주세요.',
              'success'
            );
            resolve();
          })
          .catch((error) => {
            btn.disabled = false;
            this.flipFront();
            noty(
              '🚨이메일 인증 코드 전송 실패!<br>사용 중인 계정 이메일인지 확인해주세요.',
              'error'
            );
            setTimeout(() => {
              this.shake();
            }, 250);
          });
      }, 250);
    });
  }
}

class ResetBlock2 extends Block {
  constructor(element) {
    super(element);
  }

  submit() {
    return new Promise((resolve) => {
      const email = document.querySelector('#input-you-reset-password-email');
      const code = document.querySelector('#input-you-reset-password-code');
      const btn = document.querySelector('#button-you-reset-password-submit-2');

      if (!code.value) {
        code.focus();
        noty('이메일 인증 코드를 입력해주세요.', 'info');
        return;
      }

      btn.disabled = true;
      this.flipBack();

      setTimeout(() => {
        JSONPostRequest(
          `${global.api}/auth/verification/email/reset-password/verify`,
          {
            email: email.value,
            code: code.value,
          }
        )
          .then((res) => {
            noty('아메일 인증 코드가 확인되었습니다.', 'success');
            resolve();
          })
          .catch((error) => {
            btn.disabled = false;
            this.flipFront();
            noty('🚨이메일 인증 코드 확인 실패!', 'error');
            setTimeout(() => {
              this.shake();
            }, 250);
          });
      }, 250);
    });
  }
}

class ResetBlock3 extends Block {
  constructor(element) {
    super(element);
  }

  submit() {
    return new Promise((resolve) => {
      const newpass = document.querySelector(
        '#input-you-reset-password-newpass'
      );
      const renewpass = document.querySelector(
        '#input-you-reset-password-newpass-re'
      );
      const btn = document.querySelector('#button-you-reset-password-submit-3');

      if (!newpass.value) {
        newpass.focus();
        noty('새 비밀번호를 입력해주세요.');
        return;
      }
      if (newpass.value.length < 8) {
        newpass.focus();
        noty(
          '새 비밀번호가 너무 짧습니다. 새 비밀번호는 8글자 이상으로 설정해야 합니다.'
        );
        return;
      }
      if (!renewpass.value) {
        renewpass.focus();
        noty('새 비밀번호를 한 번 더 입력해주세요.');
        return;
      }
      if (newpass.value != renewpass.value) {
        renewpass.focus();
        noty('새 비밀번호와 재입력 값이 일치하지 않습니다.');
        return;
      }

      btn.disabled = true;
      this.flipBack();

      setTimeout(() => {
        JSONPostRequest(`${global.api}/auth/accounts/reset-password`, {
          newpassword: newpass.value,
        })
          .then((res) => {
            noty('비밀번호가 변경되었습니다.', 'success');
            Lapis.setTimeout(() => {
              alert(
                '비밀번호가 변경된 후에는 모든 세션에서 로그아웃됩니다. 다시 로그인하기 바랍니다.'
              );
              window.location.href = '/u/login';
            }, 1500);
          })
          .catch((error) => {
            btn.disabled = false;
            this.flipFront();
            error?.body?.message
              ? noty(
                  '비밀번호를 변경할 수 없습니다.<br>' + error.body.message,
                  'error'
                )
              : null;
            setTimeout(() => {
              this.shake();
            }, 250);
          });
      }, 250);
    });
  }
}
