'use strict';

/*
css vars
--sans-se


message: string,
type: string | "warn" | "error" | "success" | "rainbow"
options: {
  timeout: number,
  style: {} <- css value
}
*/

const Notifications = new Array();
class Notification {
  constructor(message, type, options = {}) {
    options.timeout = options.timeout ? options.timeout : 5000;
    var notifications = document.querySelector('#notifications');
    if (!notifications) {
      notifications = document.createElement('div');
      notifications.id = 'notifications';
      const style = document.createElement('style');
      style.innerText = this.style();
      notifications.appendChild(style);
      document.body.appendChild(notifications);
    }
    var notification = document.createElement('div');
    notification.classList.add('notification');
    type ? notification.classList.add(type) : null;
    if (type == 'rainbow') {
      notification.setAttribute('color', type);
    }
    var msg = document.createElement('div');
    msg.classList.add('message');
    msg.innerHTML = message;
    var close = document.createElement('div');
    close.classList.add('close');
    var closebtn = document.createElement('div');
    closebtn.classList.add('btn');
    closebtn.innerHTML = '×';
    closebtn.addEventListener('click', (event) => {
      this.close();
    });
    close.appendChild(closebtn);
    notification.appendChild(msg);
    notification.appendChild(close);
    if (options.style) {
      for (const key in options.style) {
        notification.style[key] = options.style[key];
      }
    }
    notifications.appendChild(notification);
    Notifications.push(this);
    this.notifications = notifications;
    this.notification = notification;
    setTimeout(() => {
      //notification.classList.add('show');
      notification.Animate().spring(0.35, 5).to({ right: '0px' }, 1000);
    }, 100);
    this.ct = setTimeout(() => {
      this.close();
    }, options.timeout);
  }

  close() {
    clearTimeout(this.ct);
    this.notification.classList.add('hide');
    this.notification.Animate().easeout().to({ right: '-900px' }, 200);
    setTimeout(() => {
      this.notifications.removeChild(this.notification);
      Notifications.splice(Notifications.indexOf(this), 1);
      if (Notifications.length == 0) {
        document.body.removeChild(this.notifications);
      }
    }, 200);
  }

  style() {
    return `
    #notifications {
      position: fixed;
      display: block;
      z-index: 500000000;
      top: 5rem;
      right: 1rem;
      width: calc(min((100vw - 4rem), 36rem));
      height: calc(100vh - 12rem);
      transition: top 0.2s ease-out, right 0.2s ease-out, max-width 0.2s ease-out;
      pointer-events: none;
      --bg: black;
      --fg: white;
    }
    #notifications .notification {
      position: relative;
      display: block;
      right: -900px;
      width: max-content;
      max-width: calc(100% - 4rem);
      padding: 1rem 3rem 1rem 1rem;
      margin-bottom: 1rem;
      margin-right: 0px;
      margin-left: auto;
      border-radius: 1rem;
      transition: /*right 0.35s cubic-bezier(0, 0, 0.3, 1.3),*/ opacity 0.2s ease-out, transform 0.2s ease-out,
        max-width 0s ease-out;
      text-align: left;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
      pointer-events: all;
    }
    #notifications .notification.show {
      right: 0px;
    }
    #notifications .notification.hide {
      opacity: 0;
      transform: scale(0);
    }
    #notifications .notification {
      background: var(--bg);
      color: var(--fg);
    }
    #notifications .notification.warn,
    #notifications .notification.yellow {
      background: var(--yellow);
      color: var(--t245);
    }
    #notifications .notification.error,
    #notifications .notification.red {
      background: var(--red);
      color: var(--t245);
    }
    #notifications .notification.success,
    #notifications .notification.green {
      background: var(--green);
      color: var(--t245);
    }
    #notifications .notification > .message {
      position: relative;
      display: inline;
      word-break: break-all;
      font-family: var(--sans-serif);
      font-weight: 500;
      font-size: 1rem;
      line-height: 150%;
    }
    #notifications .notification > .close {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0px;
      right: 0.5rem;
      width: 2rem;
      height: 100%;
    }
    #notifications .notification > .close > .btn {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 100%;
      font-family: var(--sans-serif);
      font-weight: 500;
      font-size: 1.25rem;
      background-color: rgba(255,255,255, 0.15);
      cursor: pointer;
    }
    #notifications .notification.rainbow {
      background: linear-gradient(
        to right,
        rgba(255, 0, 0, 1),
        rgba(255, 154, 0, 1),
        rgba(208, 222, 33, 1),
        rgba(79, 220, 74, 1),
        rgba(63, 218, 216, 1),
        rgba(47, 201, 226, 1),
        rgba(28, 127, 238, 1),
        rgba(95, 21, 242, 1),
        rgba(186, 12, 248, 1),
        rgba(251, 7, 217, 1),
        rgba(255, 0, 0, 1),
        rgba(255, 154, 0, 1),
        rgba(208, 222, 33, 1),
        rgba(79, 220, 74, 1),
        rgba(63, 218, 216, 1),
        rgba(47, 201, 226, 1),
        rgba(28, 127, 238, 1),
        rgba(95, 21, 242, 1),
        rgba(186, 12, 248, 1),
        rgba(251, 7, 217, 1),
        rgba(255, 0, 0, 1)
      );
      background-size: 200% 100%;
      color: white;
      animation-name: rainbow;
      animation-duration: 1s;
      animation-timing-function: linear;
      animation-direction: normal;
      animation-iteration-count: infinite;
    }
    @media (max-width: 600px) {
      #notifications {
        top: 4rem;
        right: 1rem;
        max-width: calc(min((100vw - 2rem), 36rem));
        height: calc(100vh - 8rem);
      }
    }`;
  }
}

export default Notification;

window.noty = (...args) => {
  new Notification(...args);
};
