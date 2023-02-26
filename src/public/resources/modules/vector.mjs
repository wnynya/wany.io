'use strict';

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x = this.x + vector.x;
    this.y = this.y + vector.y;
  }

  subtract(vector) {
    this.x = this.x - vector.x;
    this.y = this.y - vector.y;
  }

  multiply(vector) {
    this.x = this.x * vector.x;
    this.y = this.y * vector.y;
  }

  divide(vector) {
    this.x = this.x / vector.x;
    this.y = this.y / vector.y;
  }

  normalize() {
    var s = this.speed();
    if (s > 0) {
      this.divide(new Vector(s, s));
    }
  }

  speed() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  distence(vector) {
    return Math.sqrt(
      Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2)
    );
  }

  clone() {
    return new Vector(this.x, this.y);
  }
}

export default Vector;
