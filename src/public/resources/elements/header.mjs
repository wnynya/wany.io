import {
  JSONGetRequest,
  JSONPostRequest,
  JSONDeleteRequest,
} from '/resources/modules/request.mjs';
import Vector from '/resources/modules/vector.mjs';

window.Nav = new (class {
  constructor() {
    this.yl = Infinity;
    this.ys = 'top';
    document.addEventListener('scroll', (event) => {
      this.onScroll();
    });
    this.onScroll();

    this.dropdown = document.querySelector('#header-dropdown');
    this.opened = false;
    document
      .querySelector('#button-header-always-index')
      .addEventListener('click', () => {
        if (this.opened) {
          this.closeDropdown();
        } else {
          this.openDropdown();
        }
      });
    document
      .querySelector('#header-cover')
      .addEventListener('click', (event) => {
        this.closeDropdown();
      });
  }

  onScroll() {
    const y = window.scrollY;
    const nav = document.querySelector('#header-nav');

    if (y <= window.innerHeight / 4) {
      if (this.ys != 'top') {
        this.ys = 'top';
        nav.setAttribute('status', this.ys);
      }
    } else if (this.opened) {
      if (this.ys != 'up') {
        this.ys = 'up';
        nav.setAttribute('status', this.ys);
      }
    } else if (y <= window.innerHeight / 1.5) {
      if (this.ys == 'top') {
        if (this.ys != 'downtop') {
          this.ys = 'downtop';
          nav.setAttribute('status', this.ys);
        }
      } else if (this.ys == 'down' || this.ys == 'up') {
        if (this.ys != 'uptop') {
          this.ys = 'uptop';
          nav.setAttribute('status', this.ys);
        }
      }
    } else {
      if (y > this.yl) {
        if (this.ys != 'down') {
          this.ys = 'down';
          nav.setAttribute('status', this.ys);
        }
      } else if (y < this.yl) {
        if (this.ys != 'up') {
          this.ys = 'up';
          nav.setAttribute('status', this.ys);
        }
      }
    }

    this.yl = y;
  }

  hideScroll() {
    document.body.style.overflow = 'hidden';
  }

  showScroll() {
    if (this.opened) {
      return;
    }
    document.body.style.overflow = null;
  }

  openDropdown() {
    this.opened = true;
    document.querySelector('#header-nav').setAttribute('dropdown', 'open');
    document.querySelector('#button-header-always-index').innerHTML = 'Close';
    this.hideScroll();
    this.showCover();
  }

  closeDropdown() {
    this.opened = false;
    document.querySelector('#header-nav').setAttribute('dropdown', 'close');
    document.querySelector('#button-header-always-index').innerHTML = 'Index';
    this.showScroll();
    this.hideCover();
  }

  hideCover() {
    document.querySelector('#header-cover').setAttribute('status', 'hide');
  }

  showCover() {
    document.querySelector('#header-cover').setAttribute('status', 'show');
  }

  lapisGoto() {
    this.closeDropdown();
    Login.hide();
    Account.hide();
  }
})();

class WhenNarrow {
  show() {
    if (!this.when) {
      return;
    }
    this.showing = true;
    this.when.setAttribute('status', 'show');
    window.Nav.closeDropdown();
    window.Nav.hideScroll();
    window.Nav.opened = true;
  }

  hide() {
    if (!this.when) {
      return;
    }
    this.showing = false;
    window.Nav.opened = false;
    this.when.setAttribute('status', 'hide');
    window.Nav.showScroll();
  }

  flipBack() {
    if (!this.when) {
      return;
    }
    const front = this.when.querySelector('.fg > .front');
    const back = this.when.querySelector('.fg > .back');

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
    if (!this.when) {
      return;
    }
    const front = this.when.querySelector('.fg > .front');
    const back = this.when.querySelector('.fg > .back');

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
    if (!this.when) {
      return;
    }
    this.when.querySelector('.fg').setAttribute('status', 'shake');
    setTimeout(() => {
      this.when.querySelector('.fg').removeAttribute('status');
    }, 500);
  }

  goaway() {
    if (!this.when) {
      return;
    }
    this.when.querySelector(' .fg').setAttribute('status', 'goaway');
  }
}

const Login = new (class extends WhenNarrow {
  constructor() {
    super();
    this.when = document.querySelector('#header-login');
    if (!this.when) {
      return;
    }
    this.showing = false;
    document
      .querySelector('#button-header-always-login')
      .addEventListener('click', () => {
        this.show();
        document.querySelector('#input-header-login-account').focus();
      });
    document
      .querySelector('#button-header-login-close')
      .addEventListener('click', () => {
        this.hide();
        this.clearForm();
      });
    document
      .querySelector('#header-login .bg')
      .addEventListener('click', (event) => {
        this.hide();
        this.clearForm();
      });
    document
      .querySelector('#button-header-login-submit')
      .addEventListener('click', (event) => {
        this.login();
      });
  }

  login() {
    const id = document.querySelector('#input-header-login-account');
    const pw = document.querySelector('#input-header-login-password');
    const keep = document.querySelector('#input-header-login-keep');
    const btn = document.querySelector('#button-header-login-submit');

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

    this.flipBack();

    setTimeout(() => {
      JSONPostRequest(
        'https://api.wany.io/auth/accounts/' + id.value + '/sessions',
        {
          password: pw.value,
          keep: keep.checked,
        }
      )
        .then((res) => {
          document
            .querySelector('#button-header-login-reset-password')
            .setAttribute('status', 'hide');
          this.goaway();
          setTimeout(() => {
            if (window.global.redirectto) {
              window.location.href = window.global.redirectto;
            } else {
              window.location.reload();
            }
          }, 500);
        })
        .catch((error) => {
          btn.disabled = false;
          this.flipFront();
          noty(
            '🚨로그인 실패!<br>계정 아이디 혹은 비밀번호를 확인해주세요',
            'error'
          );
          setTimeout(() => {
            this.shake();
            document
              .querySelector('#button-header-login-reset-password')
              .removeAttribute('status');
          }, 250);
        });
    }, 250);
  }

  clearForm() {
    document.querySelector('#input-header-login-account').value = '';
    document.querySelector('#input-header-login-password').value = '';
    document.querySelector('#input-header-login-keep').checked = false;
  }
})();

const Account = new (class extends WhenNarrow {
  constructor() {
    super();
    this.when = document.querySelector('#header-account');
    if (!this.when) {
      return;
    }
    this.showing = false;
    document
      .querySelector('#button-header-account')
      .addEventListener('click', () => {
        this.show();
      });
    document
      .querySelector('#button-header-account-close')
      .addEventListener('click', () => {
        this.hide();
      });
    document
      .querySelector('#header-account .bg')
      .addEventListener('click', (event) => {
        this.hide();
      });
    document
      .querySelector('#button-header-account-logout')
      .addEventListener('click', (event) => {
        this.logout();
      });
  }

  logout() {
    this.flipBack();
    JSONDeleteRequest(
      'https://api.wany.io/auth/accounts/@me/sessions/@current',
      {}
    )
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          this.goaway();
        }, 1000);
        setTimeout(() => {
          location.reload();
        }, 1500);
      })
      .catch((res) => {
        console.log(res);
        this.flipFront();
        new noty(res.message, 'error');
        return;
      });
  }
})();

const ShakeDetector = new (class {
  constructor() {
    this.position = new Vector(window.screenX, window.screenY);
    this.count = 0;
    var _this = this;
    function f() {
      _this.frame();
      window.requestAnimationFrame(f);
    }
    window.requestAnimationFrame(f);
  }

  frame() {
    if (this.count > 20) {
      this.count = 0;
      alert('🤮그만 흔들어!');
    }
    var newpos = new Vector(window.screenX, window.screenY);
    if (this.position.distence(newpos) > 50) {
      this.count += 2;
      this.position = newpos;
    }
    if (this.count > 0) {
      this.count--;
    }
  }
})();
