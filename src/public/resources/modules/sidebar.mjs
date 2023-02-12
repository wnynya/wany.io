import EventEmitter from '/resources/modules/eventemitter.mjs';

class Sidebar extends EventEmitter {
  constructor(
    sidebar = document.querySelector('aside.sidebar'),
    element = document.querySelector('main')
  ) {
    super();

    this.sidebar = sidebar;
    this.element = element;
    this.lastWidth = window.innerWidth;
    this.onScroll = () => {
      const srect = sidebar.getBoundingClientRect();
      const erect = element.getBoundingClientRect();
      if (srect.height > erect.height) {
        sidebar.style.top = `${erect.top}px`;
      } else {
        sidebar.style.top = `max(${
          Math.rem(5) + Math.min(0, erect.bottom - (srect.height + Math.rem(5)))
        }px, ${erect.top}px)`;
      }
      this.emit('scroll');
    };
    const _this = this;
    this.onResize = () => {
      _this.lastWidth < 900 && 900 < window.innerWidth ? _this.close() : null;
      _this.lastWidth = window.innerWidth;
      _this.onScroll();
    };

    this.load();

    this.sidebar.querySelector('button').addEventListener('click', (event) => {
      this.sidebar.classList.contains('open') ? _this.close() : _this.open();
    });

    var i = Lapis.setInterval(() => {
      this.onScroll();
    }, 100);
    Lapis.setTimeout(() => {
      clearInterval(i);
    }, 1000);
    this.onScroll();
  }

  open() {
    this.sidebar.classList.add('open');
  }

  close() {
    this.sidebar.classList.remove('open');
  }

  hide() {
    this.close();
    this.sidebar.classList.add('hide');
  }

  show() {
    this.sidebar.classList.remove('hide');
  }

  load() {
    document.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
  }

  unload() {
    document.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }
}

export default Sidebar;
