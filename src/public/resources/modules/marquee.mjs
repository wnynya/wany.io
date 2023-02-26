'use strict';

export default function marquee(msgs, element, speed = 200.0, margin = 100) {
  let pendings = [];
  let msgi = -1;

  function frame() {
    var rect = element.getBoundingClientRect();
    var currents = element.querySelectorAll('*');

    if (pendings.length > 0) {
      if (currents.length > 0) {
        var last = currents[currents.length - 1];
        var lastrect = last.getBoundingClientRect();
        if (rect.right > lastrect.right) {
          appendElement();
        }
      } else {
        appendElement();
      }
    }

    function appendElement() {
      const append = pendings[0];
      pendings.shift();
      element.appendChild(append);
      const appendrect = append.getBoundingClientRect();
      append.style.left = rect.width + margin + 'px';
      const go = (appendrect.width + 100) * -1;
      const length = rect.width - go;
      append.style.transition = 'left ' + length / speed + 's linear';
      Lapis.setTimeout(() => {
        append.style.left = go + 'px';
      }, 1);
    }

    for (var current of currents) {
      var currentrect = current.getBoundingClientRect();
      if (currentrect.right < rect.left) {
        element.removeChild(current);
        pend(msg());
      }
    }
  }

  Lapis.setInterval(() => {
    frame();
  }, 100);

  function msg() {
    msgi++;
    msgi >= msgs.length ? (msgi = 0) : null;
    return msgs[msgi];
  }

  function pend(text) {
    var p = document.createElement('p');
    p.innerHTML = text;
    pendings.push(p);
  }

  pend(msg());
  pend(msg());
  pend(msg());
  pend(msg());
  pend(msg());
  pend(msg());
  pend(msg());
  pend(msg());
  pend(msg());
  pend(msg());
}
