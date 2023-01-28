import { GetRequest } from '/resources/modules/request.mjs';

const Lapis = new (class {
  constructor() {
    this.host = window.location.host;
    this.color = 'rgb(170,143,179)';
    this.scripts = {
      cache: {},
      loads: [],
    };
    this.asyncs = {
      timeouts: [],
      intervals: [],
    };
    this.styles = [];
    this.prefetched = [];
    const _this = this;
    window.onpopstate = (event) => {
      _this.goto(window.location.href, false);
    };
    this.eventAHref = (event) => {
      event.preventDefault();
      let a = event.target;
      while (a.nodeName != 'A') {
        a = a.parentElement;
      }
      const href = a.href;
      const target = a.target;
      _this.goto(href, true, target);
    };
    this.updateAHref = () => {
      for (const e of document.querySelectorAll('a[href][lapis]')) {
        e.removeEventListener('click', _this.eventAHref);
        e.addEventListener('click', _this.eventAHref);
      }
    };
    this.updateAHref();
    this.Loadingbar = class Loadingbar {
      constructor(color = _this.color) {
        this.bar = document.createElement('div');
        this.bar.style.position = 'fixed';
        this.bar.style.top = 0;
        this.bar.style.left = 0;
        this.bar.style.height = '0.15rem';
        this.bar.style.background = color;
        this.bar.style.zIndex = 200000000;
        this.bar.style.transition = 'width ease-out 0.2s';
        this.state = 'ready';
        this.percent = 0.0;
        this.progress(this.percent);

        document.body.appendChild(this.bar);

        this.update = () => {
          if (this.state == 'ready') {
            this.percent += 0.01;
            this.percent = Math.min(90.0, this.percent);
            window.requestAnimationFrame(this.update);
          }
          this.progress(this.percent);
        };
        window.requestAnimationFrame(this.update);

        setTimeout(() => {
          this.percent = 20.0;
        }, 10);
      }

      progress(percent) {
        this.bar.style.width = percent + '%';
      }

      end() {
        this.state = 'end';
        this.percent = 100;
        this.progress(this.percent);

        setTimeout(() => {
          this.destroy();
        }, 250);
      }

      destroy() {
        this.bar.style.left = null;
        this.bar.style.right = 0;
        this.bar.style.width = '0%';
        setTimeout(() => {
          document.body.removeChild(this.bar);
        }, 250);
      }
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const target = entry.target;
          const href = target.href;
          const id = btoa(href);
          if (this.prefetched.includes(id)) {
            continue;
          }
          this.prefetched.push(id);
          this.prefetch(href);
        }
      }
    }, {});

    for (const e of document.querySelectorAll('a[href][lapis]')) {
      this.observer.observe(e);
    }

    this.firstLoaded = false;
    this.firstPageStyles = [];
    this.firstPageStylesPop = [];
    for (const e of document.querySelectorAll('main lapis-style')) {
      this.firstPageStyles.push(btoa(e.getAttribute('src')));
    }
    this.firstPageStylesPop = [...this.firstPageStyles];
    this.firstPageStyleLoaded();
  }

  goto(href, push = true, target = '_blank') {
    if (window.Nav) {
      window.Nav.lapisGoto();
    }

    const current = window.location.href;

    if (href.startsWith('/')) {
      href = 'https://' + this.host + href;
    }

    if (href == current) {
      push = false;
    }

    const matches = href.match(/https?:\/\/([^/]+)(\/[^?]*)?(\?.+)?/);
    let host = matches[1] + '';
    let path = matches[2] + '';
    let query = matches[3] + '';

    if (host != this.host) {
      window.open(href, target);
      return;
    }

    for (const s of this.asyncs.timeouts) {
      clearTimeout(s);
    }
    for (const s of this.asyncs.intervals) {
      clearInterval(s);
    }
    this.asyncs = {
      timeouts: [],
      intervals: [],
    };
    for (const load of this.scripts.loads) {
      load.unload();
    }
    this.scripts.loads = [];

    let tempHistory = [];

    push ? window.history.pushState(tempHistory, this.host, href) : null;

    const bar = new this.Loadingbar();

    GetRequest(href)
      .then((res) => {
        if (res.uri != href) {
          tempHistory.push(res.uri);
          window.history.replaceState(tempHistory, this.host, res.uri);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.display(res.body);
        bar.end();
        if (window.Cursor) {
          window.Cursor.lapisGoto();
        }
        if (window.Inputs) {
          window.Inputs.lapisGoto();
        }
      })
      .catch((error) => {
        bar.end();
        if (error.status >= 500) {
          noty('서버 오류. (' + error.status + ')');
        } else {
          console.error(error);
        }
      });
  }

  display(html) {
    const temp = document.createElement('template');
    temp.innerHTML = html;
    const doc = temp.content;

    copyHTML(doc, document, 'title');
    copyHTML(doc, document, 'main');
    copyContent(doc, document, 'meta[name="description"]');
    copyHTML(doc, document, 'script[type="application/ld+json"]');
    copyContent(doc, document, 'link[rel=canonical]');
    copyContent(doc, document, 'meta[name="og:title"]');
    copyContent(doc, document, 'meta[name="og:description"]');
    copyContent(doc, document, 'meta[name="og:image"]');
    copyContent(doc, document, 'meta[name="twitter:title"]');
    copyContent(doc, document, 'meta[name="twitter:description"]');
    copyContent(doc, document, 'meta[name="twitter:image"]');

    this.updateAHref();

    this.observer.disconnect();
    for (const e of document.querySelectorAll('a[href][lapis]')) {
      this.observer.observe(e);
    }

    function copyHTML(from, to, selector) {
      if (
        to.querySelector(selector)?.innerHTML &&
        from.querySelector(selector)?.innerHTML
      ) {
        to.querySelector(selector).innerHTML =
          from.querySelector(selector).innerHTML;
      } else if (to.querySelector(selector)?.innerHTML) {
        to.querySelector(selector).innerHTML = '&nbsp;';
      }
    }

    function copyContent(from, to, selector) {
      if (
        to.querySelector(selector)?.content &&
        from.querySelector(selector)?.content
      ) {
        to.querySelector(selector).content =
          from.querySelector(selector).content;
      } else if (to.querySelector(selector)?.content) {
        to.querySelector(selector).content = '';
      }
    }
  }

  prefetch(href) {
    GetRequest(href)
      .then((res) => {
        const temp = document.createElement('template');
        temp.innerHTML = res.body;
        const doc = temp.content;
        const main = doc.querySelector('main');
        for (const element of main.querySelectorAll(
          'lapis-script, lapis-style'
        )) {
          document.body.appendChild(element);
          document.body.removeChild(element);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setTimeout(f, t) {
    const s = setTimeout(f, t);
    this.asyncs.timeouts.push(s);
    return s;
  }

  clearTimeout(s) {
    clearTimeout(s);
    this.asyncs.timeouts.splice(this.asyncs.timeouts.indexOf(s), 1);
  }

  setInterval(f, t) {
    const s = setInterval(f, t);
    this.asyncs.intervals.push(s);
    return s;
  }

  clearInterval(s) {
    clearInterval(s);
    this.asyncs.timeouts.splice(this.asyncs.intervals.indexOf(s), 1);
  }

  update() {
    this.updateAHref();
  }

  firstPageStyleLoaded(id) {
    this.firstLoaded = false;

    id
      ? this.firstPageStylesPop.splice(this.firstPageStylesPop.indexOf(id), 1)
      : null;
    if (
      (this.firstPageStyles.includes(id) || !id) &&
      this.firstPageStylesPop.length == 0
    ) {
      console.log('firstPageStyleLoaded');
    }
  }
})();

window.Lapis = Lapis;
