'use strict';

/**
 * modules/eventemitter.mjs
 *
 * nodejs 에 있는 EventEmitter 를 브라우저에서도 쓰고 싶어
 *
 * @author Wany <sung@wany.io> (https://wany.io)
 */

class EventEmitter {
  #listeners = {};

  /**
   * Add listener on event(s)
   *
   * @param {string | string[]} events Event(s) name
   * @param {function(...args)} listener Event listener
   *
   * @returns EventEmitter
   */
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

  /**
   * Emit event
   *
   * @param {string} event Event name
   * @param {...any} args Arguments to listener(s)
   *
   * @returns EventEmitter
   */
  emit(event, ...args) {
    if (!(typeof event == 'string' || typeof event == 'number')) {
      throw new Error('Argument events must typeof string or number');
    }
    for (const listener of this.#listeners[event] || []) {
      listener(...args);
    }
    return this;
  }

  /**
   * Add listener on event
   *
   * @param {string} event Event name
   * @param {function(...args)} listener Event listener
   *
   * @returns EventEmitter
   */
  addListener(event, listener) {
    if (!(listener instanceof Function)) {
      throw new Error('Argument listener must instanceof Function');
    }
    !this.#listeners[event] ? (this.#listeners[event] = []) : null;
    this.#listeners[event].push(listener);
  }

  /**
   * Remove listener on event
   *
   * @param {string} event Event name
   * @param {function(...args)} listener Event listener
   *
   * @returns EventEmitter
   */
  removeListener(event, listener) {
    if (!(listener instanceof Function)) {
      throw new Error('Argument listener must instanceof Function');
    }
    if (!(this.#listeners[event] instanceof Array)) {
      return;
    }
    const index = this.#listeners[event].indexOf(listener);
    if (index > -1) {
      this.#listeners[event].splice(index, 1);
    }
  }

  /**
   * Remove all listeners on event
   *
   * @param {string} event Event name
   *
   * @returns EventEmitter
   */
  removeListeners(event) {
    delete this.#listeners[event];
  }

  /**
   * Get all listeners on event
   *
   * @param {string} event Event name
   *
   * @returns EventEmitter
   */
  getListeners(event) {
    if (!(typeof event == 'string')) {
      throw new Error('Argument event must instanceof String');
    }
    return this.#listeners[event] || [];
  }
}

export default EventEmitter;

export { EventEmitter };
