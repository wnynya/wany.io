'use strict';

class EventEmitter {
  constructor() {
    this.listeners = {};
    return this;
  }

  on(events, listener) {
    let names = [];
    if (typeof events == 'string') {
      names = events.split(' ');
    } else if (typeof events == 'number') {
      names = [events];
    } else if (events instanceof Array) {
      names = events;
    } else {
      throw new Error(
        'Argument events must typeof string, number or instanceof Array'
      );
    }
    if (!(listener instanceof Function)) {
      throw new Error('Argument listener must instanceof Function');
    }
    for (const name of names) {
      this.addListener(name, listener);
    }
    return this;
  }

  emit(event, ...args) {
    if (!(typeof event == 'string' || typeof event == 'number')) {
      throw new Error('Argument events must typeof string or number');
    }
    for (const listener of this.listeners[event] || []) {
      listener(...args);
    }
    return this;
  }

  addListener(name, listener) {
    if (!(listener instanceof Function)) {
      throw new Error('Argument listener must instanceof Function');
    }
    !this.listeners[name] ? (this.listeners[name] = []) : null;
    this.listeners[name].push(listener);
  }

  removeListener(name, listener) {
    if (!(listener instanceof Function)) {
      throw new Error('Argument listener must instanceof Function');
    }
    if (!(this.listeners[name] instanceof Array)) {
      return;
    }
    const index = this.listeners[name].indexOf(listener);
    if (index > -1) {
      this.listeners[name].splice(index, 1);
    }
  }

  removeListeners(name) {
    delete this.listeners[name];
  }

  getListeners(event) {
    if (!(typeof event == 'string')) {
      throw new Error('Argument event must instanceof String');
    }
    return this.listeners[event] || [];
  }
}

export default EventEmitter;

export { EventEmitter };
