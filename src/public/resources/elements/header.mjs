'use strict';

import {
  JSONGetRequest,
  JSONDeleteRequest,
} from '/resources/modules/request.mjs';
import Vector from '/resources/modules/vector.mjs';

window.Nav = new (class {
  constructor() {
    this.nav = document.querySelector('#header-nav');
    this.yl = window.scrollY;
    this.ys = 'top';
    this.dir = null;
    this.dirl = null;
    this.upstack = 0;
    document.addEventListener('scroll', (event) => {
      this.onScroll();
    });
    this.onScroll();

    this.dropdown = document.querySelector('#header-nav-dropdown');
    this.dropdownOpened = false;
    document
      .querySelector('#button-header-nav-always-index')
      .addEventListener('click', () => {
        if (this.dropdownOpened) {
          this.closeDropdown();
        } else {
          this.openDropdown();
        }
      });
    document
      .querySelector('#header-nav-cover')
      .addEventListener('click', () => {
        this.closeDropdown();
      });
    const loginButton = document.querySelector(
      '#button-header-nav-always-login'
    );
    if (loginButton) {
      loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        Lapis.goto(`/u/login?r=${window.location.href}`);
      });
      Lapis.prefetch(`${global.wanyne}/u/login`);
    }
  }

  onScroll() {
    if (document.body.style.overflow == 'hidden') {
      return;
    }
    const y = window.scrollY;

    if (y > this.yl) {
      this.dir = 'down';
    } else if (y < this.yl) {
      this.dir = 'up';
    }

    if (y <= 500) {
      this.absTop();
    } else if (500 < y && y <= 1000) {
      if (this.dir == 'down') {
        this.preHide();
      } else {
        this.fixHide();
      }
    } else if (this.dir == 'up' && this.dirl == 'up') {
      this.upstack++;
      if (this.upstack > 1) {
        this.fixShow();
      }
    } else {
      this.upstack = 0;
      this.fixHide();
    }

    this.yl = y;
    this.dirl = this.dir;
  }

  absTop() {
    if (this.status == 'top') {
      return;
    }
    this.status = 'top';
    this.nav.setAttribute('status', this.status);
  }

  preHide() {
    if (this.status == 'pre') {
      return;
    }
    this.status = 'pre';
    this.nav.setAttribute('status', this.status);
  }

  fixHide() {
    if (this.status == 'hide') {
      return;
    }
    this.status = 'hide';
    this.nav.setAttribute('status', this.status);
    this.nav.querySelector('#header-nav-drawer').Animate().spring(0.35, 5).to(
      {
        top: '-16rem',
      },
      800
    );
    this.nav.querySelector('#header-nav-always').Animate().spring(0.35, 5).to(
      {
        top: '-12rem',
      },
      800
    );
  }

  fixShow() {
    if (this.status == 'show') {
      return;
    }
    this.status = 'show';
    this.nav.setAttribute('status', this.status);
    this.nav.querySelector('#header-nav-drawer').Animate().spring(0.25, 5).to(
      {
        top: '-4rem',
      },
      800
    );
    this.nav.querySelector('#header-nav-always').Animate().spring(0.25, 5).to(
      {
        top: '0rem',
      },
      800
    );
  }

  hideScroll() {
    document.body.style.overflow = 'hidden';
  }

  showScroll() {
    if (this.dropdownOpened) {
      return;
    }
    document.body.style.overflow = null;
  }

  openDropdown() {
    this.dropdownOpened = true;
    document.querySelector('#header-nav').setAttribute('dropdown', 'open');
    document.querySelector('#button-header-nav-always-index').innerHTML =
      'Close';
    this.hideScroll();
    this.nav.querySelector('#header-nav-drawer').Animate().spring(0.3, 3).to(
      {
        top: '-4rem',
        height: '26rem',
      },
      500
    );
    document
      .querySelector('#header-nav-dropdown')
      .Animate()
      .spring(0.3, 3)
      .to({ height: '22rem' }, 500);
  }

  closeDropdown() {
    this.dropdownOpened = false;
    document.querySelector('#header-nav').setAttribute('dropdown', 'close');
    document.querySelector('#button-header-nav-always-index').innerHTML =
      'Index';
    this.showScroll();
    this.nav
      .querySelector('#header-nav-drawer')
      .Animate()
      .easeout()
      .to(
        {
          top: this.status == 'show' ? '-4rem' : '-16rem',
          height: '8rem',
        },
        100
      );
    document
      .querySelector('#header-nav-dropdown')
      .Animate()
      .easeout()
      .to({ height: '0rem' }, 100);
  }

  lapisGoto() {
    this.closeDropdown();
    Nav.Account.hideMenu();
  }
})();

Nav.Account = new (class {
  constructor() {
    this.element = document.querySelector('#header-nav-always-account');
    if (!this.element) {
      return;
    }
    this.background = document.querySelector(
      '#header-nav-always-account-background'
    );
    this.profile = this.element.querySelector('.profile');
    this.menu = this.element.querySelector('.menu');

    this.showing = false;

    this.profile.addEventListener('click', () => {
      this.showing ? this.hideMenu() : this.showMenu();
    });
    this.background.addEventListener('click', () => {
      this.hideMenu();
    });
    this.menu.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    document
      .querySelector('#button-header-nav-always-logout')
      .addEventListener('click', (event) => {
        this.logout();
      });

    this.initMenu();

    Promise.all([
      JSONGetRequest(`${global.api}/amethy/terminal/nodes/owns`),
      JSONGetRequest(`${global.api}/amethy/terminal/nodes/members`),
    ])
      .then(([owns, members]) => {
        if (owns?.body?.data?.length > 0 || members?.body?.data?.length) {
          document
            .querySelector('#button-header-nav-always-amethy-terminal')
            .classList.remove('none');
        }
      })
      .catch((error) => {});
  }

  profileWidth() {
    const l = this.element.querySelector('.profile > .label').clientWidth;
    const i = this.element.querySelector('.profile > .image').clientWidth;
    return l + i + Math.rem(0.5);
  }

  initMenu() {
    this.profile.Animate().spring(0.15, 3).to(
      {
        'padding-top': '0.3rem',
        'padding-bottom': '0rem',
        'padding-left': '0.7rem',
        'padding-right': '0.3rem',
      },
      500
    );
    this.element
      .querySelector('.profile > .label')
      .Animate()
      .spring(0.15, 3)
      .to(
        {
          'max-width': '8rem',
          'margin-right': '0.5rem',
        },
        500
      );
    this.menu
      .Animate()
      .spring(0.15, 3)
      .to(
        {
          width: this.profileWidth() + 'px',
          height: '0.3rem',
        },
        500
      );
  }

  showMenu() {
    Nav.closeDropdown();
    Nav.hideScroll();
    this.showing = true;
    this.element.classList.add('show');
    this.background.classList.add('show');
    this.element.Animate().spring(0.3, 3).to(
      {
        'border-radius': '1.7rem',
      },
      500
    );
    this.profile.Animate().spring(0.3, 3).to(
      {
        'padding-top': '1rem',
        'padding-bottom': '0.8rem',
        'padding-left': '1rem',
        'padding-right': '1rem',
      },
      500
    );
    this.menu
      .Animate()
      .spring(0.3, 3)
      .to(
        {
          width: '14rem',
          height:
            Math.rem(
              this.menu.querySelectorAll('.element:not(.none)').length * 2 +
                1 +
                0.2
            ) +
            1 +
            'px',
        },
        500
      );
  }

  hideMenu() {
    if (!this.element) {
      return;
    }
    Nav.showScroll();
    this.showing = false;
    this.element.classList.remove('show');
    this.background.classList.remove('show');
    this.element.Animate().spring(0.15, 3).to(
      {
        'border-radius': '1.1rem',
      },
      500
    );
    this.profile.Animate().spring(0.15, 3).to(
      {
        'padding-top': '0.3rem',
        'padding-bottom': '0rem',
        'padding-left': '0.7rem',
        'padding-right': '0.3rem',
      },
      500
    );
    this.menu
      .Animate()
      .spring(0.15, 3)
      .to(
        {
          width: this.profileWidth() + 'px',
          height: '0.3rem',
        },
        500
      );
  }

  logout() {
    JSONDeleteRequest(`${global.api}/auth/accounts/@me/sessions/@current`, {})
      .then((res) => {
        window.location.href = '/';
      })
      .catch((res) => {
        new noty(res.message, 'error');
        return;
      });
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
    this.when
      .querySelector('.fg')
      .Animate()
      .spring(0.35, 8)
      .to({ top: '0%' }, 1250);
  }

  hide() {
    if (!this.when) {
      return;
    }
    this.showing = false;
    window.Nav.opened = false;
    this.when.setAttribute('status', 'hide');
    window.Nav.showScroll();
    this.when.querySelector('.fg').Animate().easeout().to({ top: '100%' }, 150);
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
export { WhenNarrow };

/*
const Login = new (class extends WhenNarrow {
  constructor() {
    super();
    this.when = document.querySelector('#header-login');
    if (!this.when) {
      return;
    }
    this.hide();
    this.showing = false;
    document
      .querySelector('#button-header-nav-always-login')
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
    if (!global.loginpage) {
      document
        .querySelector('#header-login .bg')
        .addEventListener('click', (event) => {
          this.hide();
          this.clearForm();
        });
    }
    document
      .querySelector('#button-header-login-submit')
      .addEventListener('click', (event) => {
        this.login();
      });

    if (global.loginpage) {
      document.querySelector('#button-header-login-close').style.display =
        'none';
      setInterval(() => {
        if (!this.showing) {
          this.show();
          document.querySelector('#input-header-login-account').focus();
        }
      }, 100);
    }
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
      JSONPostRequest(`${global.api}/auth/accounts/${id.value}/sessions`, {
        password: pw.value,
        keep: keep.checked,
      })
        .then((res) => {
          document
            .querySelector('#button-header-login-reset-password')
            .setAttribute('status', 'hide');
          this.goaway();
          setTimeout(() => {
            if (window.global.redir) {
              window.location.href = window.global.redir;
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
    this.hide();
    this.showing = false;
    document
      .querySelector('#button-header-nav-always-account')
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
    JSONDeleteRequest(`${global.api}/auth/accounts/@me/sessions/@current`, {})
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          this.goaway();
        }, 1000);
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      })
      .catch((res) => {
        console.log(res);
        this.flipFront();
        new noty(res.message, 'error');
        return;
      });
  }
})();*/

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
