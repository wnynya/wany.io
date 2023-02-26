'use strict';

window.Inputs = new (class {
  constructor() {
    this.addEventListener();
  }

  addEventListener() {
    for (var element of document.querySelectorAll('.input.text')) {
      // autocompleter
      for (var label of element.querySelectorAll('.autocomplete label')) {
        label.addEventListener('mousedown', (event) => {
          event.target.parentElement.setAttribute('labelselect', true);
        });
        label.addEventListener('click', (event) => {
          event.target.parentElement.removeAttribute('labelselect');
          var master = event.target.parentElement.parentElement;
          var input = master.querySelector('input');
          master.querySelector('input').value = event.target.innerHTML;
          this.updateTextAutocomplete();
        });
        if (
          element.querySelector('input').value == '' &&
          element.querySelector('.autocomplete').getAttribute('emptyshow') !=
            'true'
        ) {
          label.classList.add('hide');
        }
      }
      element.querySelector('input').addEventListener('focus', (event) => {
        this.updateTextAutocomplete();
      });
      element.querySelector('input').addEventListener('blur', (event) => {
        var master = event.target.parentElement;
        var input = master.querySelector('input');
        var autocomplete = master.querySelector('.autocomplete');
        if (autocomplete) {
          if (autocomplete.getAttribute('labelselect')) {
            event.target.focus();
          } else {
            autocomplete.classList.remove('drop');
            autocomplete.removeAttribute('index');
            master.querySelector('.border').style.paddingBottom = '0px';
            master.querySelector('.border').style.top = '0px';
            Lapis.setTimeout(() => {
              autocomplete.classList.remove('event');
            }, 100);
          }
        }
      });
      element.querySelector('input').addEventListener('keydown', (event) => {
        this.updateTextAutocomplete();
      });
      element.querySelector('input').addEventListener('keyup', (event) => {
        this.updateTextAutocomplete();
      });
    }

    for (var element of document.querySelectorAll(
      '.input.file input[type=file]'
    )) {
      element.parentElement.querySelector('.files').innerHTML =
        element.placeholder;
      element.addEventListener('change', (event) => {
        var target = event.target;
        var parent = event.target;
        while (!parent.classList.contains('file')) {
          parent = parent.parentElement;
        }
        parent.classList.remove('drag');
        var files = target.files;
        if (files.length == 0) {
          return;
        }
        var acceptedFiles = new Array();
        var acceptedFileIndex = '';
        if (target.multiple) {
          for (var file of files) {
            acceptedFiles.push(file);
          }
        } else {
          var file = files[0];
          acceptedFiles.push(file);
        }
        if (acceptedFiles.length == 0) {
          parent.querySelector('.files').innerHTML = target.placeholder;
        } else if (acceptedFiles.length <= 3) {
          for (var file of acceptedFiles) {
            acceptedFileIndex += file.name;
            if (file != acceptedFiles[acceptedFiles.length - 1]) {
              acceptedFileIndex += ', ';
            }
          }
          parent.querySelector('.files').innerHTML = acceptedFileIndex;
        } else {
          parent.querySelector('.files').innerHTML =
            acceptedFiles.length + ' files';
        }
      });
      element.addEventListener(
        'drop',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          var target = event.target;
          var parent = event.target;
          while (!parent.classList.contains('file')) {
            parent = parent.parentElement;
          }
          parent.classList.remove('drag');

          var files = event.dataTransfer.files;
          if (files.length == 0) {
            return;
          }

          var accept = event.target.accept;
          var accepts;
          if (accept) {
            accepts = accept.replace(/\s/g, '').split(',');
          }

          var acceptedFiles = new Array();
          var acceptedFileIndex = '';

          if (target.multiple) {
            for (var file of files) {
              if (
                !file.type == '' &&
                (!accept ||
                  accept == '*' ||
                  accept == '' ||
                  accepts.includes(file.type))
              ) {
                acceptedFiles.push(file);
              }
            }
          } else {
            var file = files[0];
            if (
              !file.type == '' &&
              (!accept ||
                accept == '*' ||
                accept == '' ||
                accepts.includes(file.type))
            ) {
              acceptedFiles.push(file);
            }
          }
          if (acceptedFiles.length == 0) {
            parent.querySelector('.files').innerHTML = target.placeholder;
          } else if (acceptedFiles.length <= 3) {
            for (var file of acceptedFiles) {
              acceptedFileIndex += file.name;
              if (file != acceptedFiles[acceptedFiles.length - 1]) {
                acceptedFileIndex += ', ';
              }
            }
            parent.querySelector('.files').innerHTML = acceptedFileIndex;
            target.files = files;
          } else {
            parent.querySelector('.files').innerHTML =
              acceptedFiles.length + ' files';
            target.files = files;
          }
        },
        false
      );
      element.addEventListener(
        'dragenter',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          var target = event.target;
          while (!target.classList.contains('file')) {
            target = target.parentElement;
          }
          target.classList.add('drag');
        },
        false
      );
      element.addEventListener(
        'dragleave',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          var target = event.target;
          while (!target.classList.contains('file')) {
            target = target.parentElement;
          }
          target.classList.remove('drag');
        },
        false
      );
      element.addEventListener(
        'dragover',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          var target = event.target;
          while (!target.classList.contains('file')) {
            target = target.parentElement;
          }
          target.classList.add('drag');
        },
        false
      );
      element.clear = () => {
        element.value = '';
        element.parentElement.querySelector('.files').innerHTML =
          element.placeholder;
      };
    }

    for (var element of document.querySelectorAll(
      '.input.range input[type=range]'
    )) {
      var slice =
        element.parentElement.querySelector('.slider').offsetWidth /
        (element.max - element.min);
      element.parentElement.querySelector('.slider .button').style.left =
        slice * (element.value - element.min) + 'px';
      if (element.parentElement.querySelector('div.number')) {
        element.parentElement.querySelector('div.number').innerHTML =
          element.value;
      }
      if (element.parentElement.querySelector('input.number')) {
        element.parentElement.querySelector('input.number').value =
          element.value;
        element.parentElement
          .querySelector('input.number')
          .addEventListener('change', (event) => {
            var target = event.target;
            var parent = event.target;
            while (!parent.classList.contains('range')) {
              parent = parent.parentElement;
            }
            var range = parent.querySelector('input[type=range]');
            var value = target.value;
            value = Math.min(range.max, value);
            value = Math.max(range.min, value);
            target.value = value;
            range.value = value;
            var slice =
              parent.querySelector('.slider').offsetWidth /
              (range.max - range.min);
            parent.querySelector('.slider .button').style.left =
              slice * (range.value - range.min) + 'px';
          });
      }
      element.addEventListener('change', (event) => {
        var target = event.target;
        var parent = event.target;
        while (!parent.classList.contains('range')) {
          parent = parent.parentElement;
        }
        var slice =
          parent.querySelector('.slider').offsetWidth /
          (target.max - target.min);
        parent.querySelector('.slider .button').style.left =
          slice * (target.value - target.min) + 'px';
        if (parent.querySelector('div.number')) {
          parent.querySelector('div.number').innerHTML = target.value;
        }
        if (parent.querySelector('input.number')) {
          parent.querySelector('input.number').value = target.value;
        }
      });
      element.addEventListener('mousemove', (event) => {
        if (!event.target.mouse) {
          return;
        }
        var target = event.target;
        var parent = event.target;
        while (!parent.classList.contains('range')) {
          parent = parent.parentElement;
        }
        var slice =
          parent.querySelector('.slider').offsetWidth /
          (target.max - target.min);
        parent.querySelector('.slider .button').style.left =
          slice * (target.value - target.min) + 'px';
        if (parent.querySelector('div.number')) {
          parent.querySelector('div.number').innerHTML = target.value;
        }
        if (parent.querySelector('input.number')) {
          parent.querySelector('input.number').value = target.value;
        }
      });
      element.addEventListener('mousedown', (event) => {
        event.target.mouse = true;
        event.target.classList.add('mouse');
        var target = event.target;
        var parent = event.target;
        while (!parent.classList.contains('range')) {
          parent = parent.parentElement;
        }
        var slice =
          parent.querySelector('.slider').offsetWidth /
          (target.max - target.min);
        parent.querySelector('.slider .button').style.left =
          slice * (target.value - target.min) + 'px';
        if (parent.querySelector('div.number')) {
          parent.querySelector('div.number').innerHTML = target.value;
        }
        if (parent.querySelector('input.number')) {
          parent.querySelector('input.number').value = target.value;
        }
      });
      element.addEventListener('mouseup', (event) => {
        event.target.mouse = false;
        event.target.classList.remove('mouse');
      });
      element.addEventListener('mouseout', (event) => {
        event.target.mouse = false;
        event.target.classList.remove('mouse');
      });
      element.addEventListener('mouseleave', (event) => {
        event.target.mouse = false;
        event.target.classList.remove('mouse');
      });
    }

    window.addEventListener('resize', (event) => {
      for (var element of document.querySelectorAll(
        '.input.range input[type=range]'
      )) {
        var slice =
          element.parentElement.querySelector('.slider').offsetWidth /
          (element.max - element.min);
        element.parentElement.querySelector('.slider .button').style.left =
          slice * (element.value - element.min) + 'px';
        if (element.parentElement.querySelector('.slider .number')) {
          element.parentElement.querySelector('.slider .number').innerHTML =
            element.value;
        }
      }
    });
  }

  updateTextAutocomplete() {
    for (var element of document.querySelectorAll('.input.text')) {
      // autocompleter
      if (document.activeElement.parentElement != element) {
        continue;
      }
      if (element.querySelector('.autocomplete')) {
        var master = element;
        var input = master.querySelector('input');
        var autocomplete = master.querySelector('.autocomplete');
        if (autocomplete) {
          var labels = autocomplete.childNodes;
          for (var label of labels) {
            if (!input.value) {
              if (autocomplete.getAttribute('emptyshow') == 'true') {
                label.classList.remove('hide');
              } else {
                label.classList.add('hide');
              }
            } else if (
              autocomplete.getAttribute('aterm') &&
              input.value.split(' ').length > 1
            ) {
              label.classList.remove('hide');
            } else if (
              autocomplete.getAttribute('aterm') &&
              label.innerHTML
                .toLowerCase()
                .replace(/'/g, '')
                .startsWith(input.value.toLowerCase().replace(/'/g, ''))
            ) {
              if (label.innerHTML == input.value) {
                label.classList.add('hide');
              } else {
                label.classList.remove('hide');
              }
            } else if (label.innerHTML.startsWith(input.value)) {
              if (label.innerHTML == input.value) {
                label.classList.add('hide');
              } else {
                label.classList.remove('hide');
              }
            } else {
              label.classList.add('hide');
            }
          }
          var h = autocomplete.offsetHeight;
          master.querySelector('.border').style.paddingBottom = h - 7.5 + 'px';
          if (autocomplete.classList.contains('top')) {
            master.querySelector('.border').style.top = -(h - 7.5) + 'px';
          }
          if (autocomplete.querySelectorAll('.hide').length == labels.length) {
            autocomplete.classList.remove('drop');
            autocomplete.classList.remove('event');
          } else {
            autocomplete.classList.add('drop');
            autocomplete.classList.add('event');
          }
        }
      }
    }

    for (var element of document.querySelectorAll(
      '.input.file input[type=file]'
    )) {
      element.parentElement.querySelector('.files').innerHTML =
        element.placeholder;
      element.addEventListener('change', (event) => {
        var target = event.target;
        var parent = event.target;
        while (!parent.classList.contains('file')) {
          parent = parent.parentElement;
        }
        parent.classList.remove('drag');
        var files = target.files;
        if (files.length == 0) {
          return;
        }
        var acceptedFiles = new Array();
        var acceptedFileIndex = '';
        if (target.multiple) {
          for (var file of files) {
            acceptedFiles.push(file);
          }
        } else {
          var file = files[0];
          acceptedFiles.push(file);
        }
        if (acceptedFiles.length == 0) {
          parent.querySelector('.files').innerHTML = target.placeholder;
        } else if (acceptedFiles.length <= 3) {
          for (var file of acceptedFiles) {
            acceptedFileIndex += file.name;
            if (file != acceptedFiles[acceptedFiles.length - 1]) {
              acceptedFileIndex += ', ';
            }
          }
          parent.querySelector('.files').innerHTML = acceptedFileIndex;
        } else {
          parent.querySelector('.files').innerHTML =
            acceptedFiles.length + ' files';
        }
      });
      element.addEventListener(
        'drop',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          var target = event.target;
          var parent = event.target;
          while (!parent.classList.contains('file')) {
            parent = parent.parentElement;
          }
          parent.classList.remove('drag');

          var files = event.dataTransfer.files;
          if (files.length == 0) {
            return;
          }

          var accept = event.target.accept;
          var accepts;
          if (accept) {
            accepts = accept.replace(/\s/g, '').split(',');
          }

          var acceptedFiles = new Array();
          var acceptedFileIndex = '';

          if (target.multiple) {
            for (var file of files) {
              if (
                !file.type == '' &&
                (!accept ||
                  accept == '*' ||
                  accept == '' ||
                  accepts.includes(file.type))
              ) {
                acceptedFiles.push(file);
              }
            }
          } else {
            var file = files[0];
            if (
              !file.type == '' &&
              (!accept ||
                accept == '*' ||
                accept == '' ||
                accepts.includes(file.type))
            ) {
              acceptedFiles.push(file);
            }
          }
          if (acceptedFiles.length == 0) {
            parent.querySelector('.files').innerHTML = target.placeholder;
          } else if (acceptedFiles.length <= 3) {
            for (var file of acceptedFiles) {
              acceptedFileIndex += file.name;
              if (file != acceptedFiles[acceptedFiles.length - 1]) {
                acceptedFileIndex += ', ';
              }
            }
            parent.querySelector('.files').innerHTML = acceptedFileIndex;
            target.files = files;
          } else {
            parent.querySelector('.files').innerHTML =
              acceptedFiles.length + ' files';
            target.files = files;
          }
        },
        false
      );
      element.addEventListener(
        'dragenter',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          var target = event.target;
          while (!target.classList.contains('file')) {
            target = target.parentElement;
          }
          target.classList.add('drag');
        },
        false
      );
      element.addEventListener(
        'dragleave',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          var target = event.target;
          while (!target.classList.contains('file')) {
            target = target.parentElement;
          }
          target.classList.remove('drag');
        },
        false
      );
      element.addEventListener(
        'dragover',
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          var target = event.target;
          while (!target.classList.contains('file')) {
            target = target.parentElement;
          }
          target.classList.add('drag');
        },
        false
      );
      element.clear = () => {
        element.value = '';
        element.parentElement.querySelector('.files').innerHTML =
          element.placeholder;
      };
    }

    for (var element of document.querySelectorAll(
      '.input.range input[type=range]'
    )) {
      var slice =
        element.parentElement.querySelector('.slider').offsetWidth /
        (element.max - element.min);
      element.parentElement.querySelector('.slider .button').style.left =
        slice * (element.value - element.min) + 'px';
      if (element.parentElement.querySelector('div.number')) {
        element.parentElement.querySelector('div.number').innerHTML =
          element.value;
      }
      if (element.parentElement.querySelector('input.number')) {
        element.parentElement.querySelector('input.number').value =
          element.value;
        element.parentElement
          .querySelector('input.number')
          .addEventListener('change', (event) => {
            var target = event.target;
            var parent = event.target;
            while (!parent.classList.contains('range')) {
              parent = parent.parentElement;
            }
            var range = parent.querySelector('input[type=range]');
            var value = target.value;
            value = Math.min(range.max, value);
            value = Math.max(range.min, value);
            target.value = value;
            range.value = value;
            var slice =
              parent.querySelector('.slider').offsetWidth /
              (range.max - range.min);
            parent.querySelector('.slider .button').style.left =
              slice * (range.value - range.min) + 'px';
          });
      }
      element.addEventListener('change', (event) => {
        var target = event.target;
        var parent = event.target;
        while (!parent.classList.contains('range')) {
          parent = parent.parentElement;
        }
        var slice =
          parent.querySelector('.slider').offsetWidth /
          (target.max - target.min);
        parent.querySelector('.slider .button').style.left =
          slice * (target.value - target.min) + 'px';
        if (parent.querySelector('div.number')) {
          parent.querySelector('div.number').innerHTML = target.value;
        }
        if (parent.querySelector('input.number')) {
          parent.querySelector('input.number').value = target.value;
        }
      });
      element.addEventListener('mousemove', (event) => {
        if (!event.target.mouse) {
          return;
        }
        var target = event.target;
        var parent = event.target;
        while (!parent.classList.contains('range')) {
          parent = parent.parentElement;
        }
        var slice =
          parent.querySelector('.slider').offsetWidth /
          (target.max - target.min);
        parent.querySelector('.slider .button').style.left =
          slice * (target.value - target.min) + 'px';
        if (parent.querySelector('div.number')) {
          parent.querySelector('div.number').innerHTML = target.value;
        }
        if (parent.querySelector('input.number')) {
          parent.querySelector('input.number').value = target.value;
        }
      });
      element.addEventListener('mousedown', (event) => {
        event.target.mouse = true;
        event.target.classList.add('mouse');
        var target = event.target;
        var parent = event.target;
        while (!parent.classList.contains('range')) {
          parent = parent.parentElement;
        }
        var slice =
          parent.querySelector('.slider').offsetWidth /
          (target.max - target.min);
        parent.querySelector('.slider .button').style.left =
          slice * (target.value - target.min) + 'px';
        if (parent.querySelector('div.number')) {
          parent.querySelector('div.number').innerHTML = target.value;
        }
        if (parent.querySelector('input.number')) {
          parent.querySelector('input.number').value = target.value;
        }
      });
      element.addEventListener('mouseup', (event) => {
        event.target.mouse = false;
        event.target.classList.remove('mouse');
      });
      element.addEventListener('mouseout', (event) => {
        event.target.mouse = false;
        event.target.classList.remove('mouse');
      });
      element.addEventListener('mouseleave', (event) => {
        event.target.mouse = false;
        event.target.classList.remove('mouse');
      });
    }

    window.addEventListener('resize', (event) => {
      for (var element of document.querySelectorAll(
        '.input.range input[type=range]'
      )) {
        var slice =
          element.parentElement.querySelector('.slider').offsetWidth /
          (element.max - element.min);
        element.parentElement.querySelector('.slider .button').style.left =
          slice * (element.value - element.min) + 'px';
        if (element.parentElement.querySelector('.slider .number')) {
          element.parentElement.querySelector('.slider .number').innerHTML =
            element.value;
        }
      }
    });
  }

  getTextAutocompleteLabel(content) {
    var label = document.createElement('label');
    label.innerHTML = content;
    label.addEventListener('mousedown', (event) => {
      event.target.parentElement.setAttribute('labelselect', true);
    });
    label.addEventListener('click', (event) => {
      event.target.parentElement.removeAttribute('labelselect');
      var master = event.target.parentElement.parentElement;
      var input = master.querySelector('input');
      master.querySelector('input').value = event.target.innerHTML;
      var autocomplete = master.querySelector('.autocomplete');
      if (autocomplete) {
        var labels = autocomplete.childNodes;
        for (var label of labels) {
          if (!input.value) {
            if (autocomplete.getAttribute('emptyshow') == 'true') {
              label.classList.remove('hide');
            } else {
              label.classList.add('hide');
            }
          } else if (label.innerHTML.startsWith(input.value)) {
            if (label.innerHTML == input.value) {
              label.classList.add('hide');
            } else {
              label.classList.remove('hide');
            }
          } else {
            label.classList.add('hide');
          }
        }
        var h = autocomplete.offsetHeight;
        master.querySelector('.border').style.paddingBottom = h - 7.5 + 'px';
        if (autocomplete.classList.contains('top')) {
          master.querySelector('.border').style.top = -(h - 7.5) + 'px';
        }
        if (autocomplete.querySelectorAll('.hide').length == labels.length) {
          autocomplete.classList.remove('drop');
          autocomplete.classList.remove('event');
        } else {
          autocomplete.classList.add('drop');
          autocomplete.classList.add('event');
        }
      }
    });
    return label;
  }

  lapisGoto() {
    this.addEventListener();
  }
})();
