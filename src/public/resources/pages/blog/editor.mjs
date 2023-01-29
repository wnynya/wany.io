import Date from '/resources/modules/date.mjs';
import {
  JSONGetRequest,
  JSONPostRequest,
  JSONPatchRequest,
  FilePostRequest,
} from '/resources/modules/request.mjs';

new (class extends LapisScript {
  load() {
    window.editor = new Editor(window.global?.article?.uid);
    document.addEventListener('scroll', onScroll);
    onScroll();
  }

  unload() {
    document.removeEventListener('scroll', onScroll);
  }
})();

class Editor {
  constructor(uid) {
    this.uid = uid;

    this.paragraph;

    if (this.uid) {
      this.isNewArticle = false;
      this.loadArticle(uid);
    } else {
      this.isNewArticle = true;
      this.uid = new Date().format('YYDDDsssssCC');
      document.querySelector('#blog-editor-control-eid').value = this.uid;
      document.querySelector('#blog-article-info-datetime').innerHTML = '지금';
      document.querySelector('#blog-article-info-category').innerHTML =
        '카테고리 선택';
      this.content2html();
    }

    for (const cid in global.categories) {
      const option = document.createElement('option');
      option.value = cid;
      option.setAttribute('label', global.categories[cid]);
      document
        .querySelector('#blog-article-info-category-select')
        .appendChild(option);
    }
    let option = document.createElement('option');
    option.value = 'delete';
    option.disabled = true;
    option.setAttribute('label', '삭제');
    document
      .querySelector('#blog-article-info-category-select')
      .appendChild(option);

    this.addEventListener();
  }

  loadArticle(uid) {
    JSONGetRequest(`${global.api}/blog/articles/${this.uid}`, {})
      .then((res) => {
        const article = res.body.data;

        // article eid
        document.querySelector('#blog-editor-control-eid').value = article.eid;

        // article title
        document.querySelector('#blog-article-title-display').innerHTML =
          article.title.html
            .replace(/<span class=("block"|'block')>/g, '[[[')
            .replace(/<\/span>/g, ']]]');

        // article info
        document.querySelector('#blog-article-info-datetime-input').value =
          new Date(article.creation)
            .format('YYYY-MM-DD_hh:mm')
            .replace('_', 'T');
        document.querySelector('#blog-article-info-datetime').innerHTML =
          new Date(article.creation).format('YY년 M월 KH');
        document.querySelector('#blog-article-info-category-select').value =
          article.category;
        const categorySelect = document.querySelector(
          '#blog-article-info-category-select'
        ).childNodes[
          document.querySelector('#blog-article-info-category-select')
            .selectedIndex
        ];
        document.querySelector('#blog-article-info-category').innerHTML =
          categorySelect.getAttribute('label');
        document.querySelector('#blog-editor-control-thumbnail').value =
          article.title.image;

        // article content
        document.querySelector('#blog-article-content-display').innerHTML =
          article.content.html;
        this.content2html();
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  addEventListener() {
    var _this = this;

    // title
    document
      .querySelector('#blog-article-title-display')
      .addEventListener('keydown', (event) => {
        const key = event.key;
        if (key == 'Enter' || key == 'Tab') {
          event.preventDefault();
        }
      });
    document
      .querySelector('#blog-article-title-display')
      .addEventListener('keyup', (event) => {
        const key = event.key;
        if (key == 'Enter' || key == 'Tab') {
          event.preventDefault();
        }
      });
    document
      .querySelector('#blog-article-title-display')
      .addEventListener('paste', (event) => {
        event.preventDefault();
        let pasteText = (event.clipboardData || window.clipboardData).getData(
          'text'
        );
        let node;
        const selection = window.getSelection();
        if (!selection.rangeCount) {
          return;
        }
        if (pasteText && pasteText != '') {
          selection.deleteFromDocument();
          node = document.createTextNode(pasteText);
          selection.getRangeAt(0).insertNode(node);
          selection.collapseToEnd();
        }
      });

    // datetime
    document
      .querySelector('#blog-article-info-datetime')
      .addEventListener('click', (event) => {
        document
          .querySelector('#blog-article-info-datetime-input')
          .classList.remove('hide');
        document.querySelector('#blog-article-info-datetime-input').focus();
      });
    document
      .querySelector('#blog-article-info-datetime-input')
      .addEventListener('blur', (event) => {
        const datetime = document.querySelector(
          '#blog-article-info-datetime-input'
        ).value;
        if (datetime) {
          document.querySelector('#blog-article-info-datetime').innerHTML =
            new Date(datetime).format('YY년 M월 KH');
        }
        document
          .querySelector('#blog-article-info-datetime-input')
          .classList.add('hide');
      });

    // category
    document
      .querySelector('#blog-article-info-category')
      .addEventListener('click', function (event) {
        document
          .querySelector('#blog-article-info-category-select')
          .classList.remove('hide');
        document.querySelector('#blog-article-info-category-select').focus();
      });
    document
      .querySelector('#blog-article-info-category-select')
      .addEventListener('change', function (event) {
        const option = document.querySelector(
          '#blog-article-info-category-select'
        ).childNodes[
          document.querySelector('#blog-article-info-category-select')
            .selectedIndex
        ];
        document.querySelector('#blog-article-info-category').innerHTML =
          option.getAttribute('label') || '카테고리';
        document
          .querySelector('#blog-article-info-category-select')
          .classList.add('hide');
      });
    document
      .querySelector('#blog-article-info-category-select')
      .addEventListener('blur', function (event) {
        const option = document.querySelector(
          '#blog-article-info-category-select'
        ).childNodes[
          document.querySelector('#blog-article-info-category-select')
            .selectedIndex
        ];
        document.querySelector('#blog-article-info-category').innerHTML =
          option.getAttribute('label') || '카테고리';
        document
          .querySelector('#blog-article-info-category-select')
          .classList.add('hide');
      });

    // eid
    document
      .querySelector('#blog-editor-control-eid')
      .addEventListener('keydown', (event) => {
        const id = document.querySelector('#blog-editor-control-eid');
        id.value = id.value.toLowerCase().replace(/ |_|\+/g, '-');
        id.value = id.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      });
    document
      .querySelector('#blog-editor-control-eid')
      .addEventListener('keyup', (event) => {
        const id = document.querySelector('#blog-editor-control-eid');
        id.value = id.value.toLowerCase().replace(/ |_/g, '-');
        id.value = id.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      });

    /* submit */
    document
      .querySelector('#blog-editor-control-submit')
      .addEventListener('click', (event) => {
        this.submit();
      });

    /* content editor */
    document.execCommand('defaultParagraphSeparator', false, 'p');
    document
      .querySelector('#blog-article-content-display')
      .addEventListener('click', (event) => {
        const content = document.querySelector('#blog-article-content-display');
        let p = event.target;
        if (p == content) {
          this.paragraph = null;
          return;
        }
        while (p.parentNode != content) {
          p = p.parentNode;
        }
        this.paragraph = p;
      });
    document
      .querySelector('#blog-article-content-display')
      .addEventListener('focus', (event) => {
        if (
          document.querySelector('#blog-article-content-display').childNodes
            .length == 0
        ) {
          document.querySelector('#blog-article-content-display').innerHTML =
            '<p></p>';
        }
        this.content2html();
      });
    document
      .querySelector('#blog-article-content-display')
      .addEventListener('blur', (event) => {
        this.content2html();
      });
    document
      .querySelector('#blog-editor-control-content-html')
      .addEventListener('blur', (event) => {
        this.html2content();
      });
    document
      .querySelector('#blog-article-content-display')
      .addEventListener('paste', (event) => {
        event.preventDefault();
        let pasteText = (event.clipboardData || window.clipboardData).getData(
          'text'
        );
        let pasteHTML = (event.clipboardData || window.clipboardData).getData(
          'text/html'
        );
        let node;
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        selection.deleteFromDocument();
        if (pasteText && pasteText != '') {
          if (
            document.querySelector('#blog-article-content-display').childNodes
              .length == 0
          ) {
            node = document.createElement('p');
            node.innerHTML = pasteText;
          } else {
            node = document.createTextNode(pasteText);
          }
        } else {
          node = document.createElement('p');
          node.innerHTML = pasteText;
        }
        selection.getRangeAt(0).insertNode(node);
        selection.collapseToEnd();
        this.content2html();
      });
    document
      .querySelector('#blog-article-content-display')
      .addEventListener('keyup', (event) => {
        const key = event.key;
        if (key == 'Backspace' || key == 'Delete') {
          if (
            document.querySelector('#blog-article-content-display').childNodes
              .length == 0
          ) {
            document.querySelector('#blog-article-content-display').innerHTML =
              '<p></p>';
          }
        }
        this.content2html();
      });
    document
      .querySelector('#blog-editor-control-content-html')
      .addEventListener('keyup', (event) => {
        this.html2content();
      });

    /* content editor: selection */
    document
      .querySelector('#content-selection-bold')
      .addEventListener('click', (event) => {
        document.execCommand('bold', false, null);
        this.content2html();
      });
    document
      .querySelector('#content-selection-bold')
      .addEventListener('mousedown', (event) => {
        event.preventDefault();
      });
    document
      .querySelector('#content-selection-italic')
      .addEventListener('click', (event) => {
        document.execCommand('italic', false, null);
        this.content2html();
      });
    document
      .querySelector('#content-selection-italic')
      .addEventListener('mousedown', (event) => {
        event.preventDefault();
      });
    document
      .querySelector('#content-selection-underline')
      .addEventListener('click', (event) => {
        document.execCommand('underline', false, null);
        this.content2html();
      });
    document
      .querySelector('#content-selection-underline')
      .addEventListener('mousedown', (event) => {
        event.preventDefault();
      });
    document
      .querySelector('#content-selection-strike')
      .addEventListener('click', (event) => {
        document.execCommand('strikeThrough', false, null);
        this.content2html();
      });
    document
      .querySelector('#content-selection-strike')
      .addEventListener('mousedown', (event) => {
        event.preventDefault();
      });
    document
      .querySelector('#content-selection-superscript')
      .addEventListener('click', (event) => {
        document.execCommand('superscript', false, null);
        this.content2html();
      });
    document
      .querySelector('#content-selection-superscript')
      .addEventListener('mousedown', (event) => {
        event.preventDefault();
      });
    document
      .querySelector('#content-selection-subscript')
      .addEventListener('click', (event) => {
        document.execCommand('subscript', false, null);
        this.content2html();
      });
    document
      .querySelector('#content-selection-subscript')
      .addEventListener('mousedown', (event) => {
        event.preventDefault();
      });
    document
      .querySelector('#content-selection-hyperlink')
      .addEventListener('click', (event) => {
        event.preventDefault();
        const href = prompt('href=');
        if (href) {
          document.execCommand('createLink', false, href);
        } else {
          document.execCommand('unlink');
        }
        this.content2html();
      });
    document
      .querySelector('#content-selection-hyperlink')
      .addEventListener('mousedown', (event) => {
        event.preventDefault();
      });

    /* content editor: paragraph font */
    document
      .querySelector('#content-font-sans-serif')
      .addEventListener('click', (event) => {
        this.font('x');
      });
    document
      .querySelector('#content-font-serif')
      .addEventListener('click', (event) => {
        this.font('font-serif');
      });
    document
      .querySelector('#content-font-monospace')
      .addEventListener('click', (event) => {
        this.font('font-monospace');
      });

    /* content editor: paragraph font style */
    document
      .querySelector('#content-font-style-paragraph')
      .addEventListener('click', (event) => {
        this.fontStyle('x');
      });
    document
      .querySelector('#content-font-style-header-1')
      .addEventListener('click', (event) => {
        this.fontStyle('font-style-header-1');
      });
    document
      .querySelector('#content-font-style-header-2')
      .addEventListener('click', (event) => {
        this.fontStyle('font-style-header-2');
      });

    /* content editor: paragraph text align */
    document
      .querySelector('#content-text-align-justify')
      .addEventListener('click', (event) => {
        this.textAlign('x');
      });
    document
      .querySelector('#content-text-align-left')
      .addEventListener('click', (event) => {
        this.textAlign('text-align-left');
      });
    document
      .querySelector('#content-text-align-center')
      .addEventListener('click', (event) => {
        this.textAlign('text-align-center');
      });
    document
      .querySelector('#content-text-align-right')
      .addEventListener('click', (event) => {
        this.textAlign('text-align-right');
      });

    /* content editor: paragraph box align */
    document
      .querySelector('#content-box-align-center-normal')
      .addEventListener('click', (event) => {
        this.boxAlign('x');
      });
    document
      .querySelector('#content-box-align-center-full')
      .addEventListener('click', (event) => {
        this.boxAlign('box-align-center-full');
      });
    document
      .querySelector('#content-box-align-left-normal')
      .addEventListener('click', (event) => {
        this.boxAlign('box-align-left-normal');
      });
    document
      .querySelector('#content-box-align-left-full')
      .addEventListener('click', (event) => {
        this.boxAlign('box-align-left-full');
      });
    document
      .querySelector('#content-box-align-left-side')
      .addEventListener('click', (event) => {
        this.boxAlign('box-align-left-side');
      });
    document
      .querySelector('#content-box-align-right-normal')
      .addEventListener('click', (event) => {
        this.boxAlign('box-align-right-normal');
      });
    document
      .querySelector('#content-box-align-right-full')
      .addEventListener('click', (event) => {
        this.boxAlign('box-align-right-full');
      });
    document
      .querySelector('#content-box-align-right-side')
      .addEventListener('click', (event) => {
        this.boxAlign('box-align-right-side');
      });

    /* content editor: insert photo */
    const photoInput = document.createElement('input');
    photoInput.type = 'file';
    photoInput.multiple = true;
    photoInput.accept = '.jpg,.jpeg,.png,.gif,.webp,.bmp,.tif,.tiff';
    document
      .querySelector('#content-insert-photo')
      .addEventListener('click', (event) => {
        photoInput.value = '';
        photoInput.click();
      });
    photoInput.addEventListener('change', (event) => {
      const files = photoInput.files;

      for (const file of files) {
        if (
          [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/tiff',
            'image/bmp',
          ].includes(file.type)
        ) {
          this.insertPhoto(file);
        }
      }
    });
    document
      .querySelector('#blog-article-content')
      .addEventListener('drop', (event) => {
        event.preventDefault();
        event.stopPropagation();
        document
          .querySelector('#blog-article-content-display')
          .classList.remove('dragdrop');

        const files = event.dataTransfer.files;

        for (const file of files) {
          if (
            [
              'image/jpeg',
              'image/png',
              'image/gif',
              'image/tiff',
              'image/bmp',
            ].includes(file.type)
          ) {
            this.insertPhoto(file);
          }
        }
      });
    document
      .querySelector('#blog-article-content')
      .addEventListener('dragenter', (event) => {
        event.preventDefault();
        event.stopPropagation();
        document
          .querySelector('#blog-article-content-display')
          .classList.add('dragdrop');
      });
    document
      .querySelector('#blog-article-content')
      .addEventListener('dragleave', (event) => {
        event.preventDefault();
        event.stopPropagation();
        document
          .querySelector('#blog-article-content-display')
          .classList.remove('dragdrop');
      });
    document
      .querySelector('#blog-article-content')
      .addEventListener('dragover', (event) => {
        event.preventDefault();
        event.stopPropagation();
        document
          .querySelector('#blog-article-content-display')
          .classList.add('dragdrop');
      });

    /* content editor: insert youtube video */
    document
      .querySelector('#content-insert-youtube')
      .addEventListener('click', (event) => {
        document
          .querySelector('#modal-insert-youtube-bg')
          .classList.remove('hide');
        document
          .querySelector('#modal-insert-youtube')
          .classList.remove('hide');
        document.querySelector('#modal-insert-youtube-url').focus();
      });
    document
      .querySelector('#modal-insert-youtube-submit')
      .addEventListener('click', (event) => {
        const src = document.querySelector('#modal-insert-youtube-url').value;
        if (!src) {
          noty('유튜브 영상 링크를 찾을 수 없습니다', 'warn');
          return;
        }
        let id;
        try {
          id = src.match(
            /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
          )[1];
        } catch (error) {
          id = null;
        }
        if (!id) {
          noty('유튜브 영상 링크를 찾을 수 없습니다', 'warn');
          return;
        }
        document.querySelector('#modal-insert-youtube-url').value = '';
        document
          .querySelector('#modal-insert-youtube-bg')
          .classList.add('hide');
        document.querySelector('#modal-insert-youtube').classList.add('hide');
        const iframe = document.createElement('iframe');
        iframe.src =
          'https://www.youtube.com/embed/' +
          id +
          '?modestbranding=1&controls=1';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute(
          'allow',
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        );
        const ratiobox = document.createElement('span');
        ratiobox.classList.add('youtube-ratiobox');
        ratiobox.appendChild(iframe);
        ratiobox.contentEditable = false;
        const p = document.createElement('p');
        p.appendChild(ratiobox);
        p.appendChild(document.createElement('br'));
        if (!this.paragraph || !this.paragraph.nextSibling) {
          document
            .querySelector('#blog-article-content-display')
            .appendChild(p);
        } else {
          let next = this.paragraph.nextSibling;
          document
            .querySelector('#blog-article-content-display')
            .insertBefore(p, next);
        }
        this.paragraph = p;
        this.content2html();
      });
    document
      .querySelector('#modal-insert-youtube-close')
      .addEventListener('click', (event) => {
        document.querySelector('#modal-insert-youtube-url').value = '';
        document
          .querySelector('#modal-insert-youtube-bg')
          .classList.add('hide');
        document.querySelector('#modal-insert-youtube').classList.add('hide');
      });
    document
      .querySelector('#modal-insert-youtube-bg')
      .addEventListener('click', (event) => {
        document.querySelector('#modal-insert-youtube-url').value = '';
        document
          .querySelector('#modal-insert-youtube-bg')
          .classList.add('hide');
        document.querySelector('#modal-insert-youtube').classList.add('hide');
      });

    /* content editor: insert code block */
    document
      .querySelector('#content-insert-code')
      .addEventListener('click', (event) => {
        document
          .querySelector('#modal-insert-code-bg')
          .classList.remove('hide');
        document.querySelector('#modal-insert-code').classList.remove('hide');
        document.querySelector('#modal-insert-code-lang').focus();
      });
    document
      .querySelector('#modal-insert-code-submit')
      .addEventListener('click', (event) => {
        const lang = document.querySelector('#modal-insert-code-lang').value;
        const code = document.querySelector('#modal-insert-code-content').value;
        if (!lang) {
          noty('코드 언어를 선택하십시오', 'warn');
          document.querySelector('#modal-insert-code-lang').focus();
          return;
        }
        if (!code) {
          noty('코드 내용을 입력하십시오', 'warn');
          document.querySelector('#modal-insert-code-content').focus();
          return;
        }
        let highlight;
        try {
          highlight = hljs.highlight(code, {
            language: lang,
          });
        } catch (error) {
          noty(
            '코드 언어를 인식할 수 없거나 코드 내용에 오류가 있습니다',
            'warn'
          );
          return;
        }
        document.querySelector('#modal-insert-code-lang').value = '';
        document.querySelector('#modal-insert-code-content').value = '';
        document.querySelector('#modal-insert-code-bg').classList.add('hide');
        document.querySelector('#modal-insert-code').classList.add('hide');
        let colored = highlight.value;
        colored = colored.replace(/\n/g, '<br>');
        colored = colored.replace(/  /g, '&nbsp;&nbsp;');
        colored = colored.replace(/\t/g, '&nbsp;&nbsp;');
        const con = document.createElement('code');
        con.classList.add('code-block-content');
        con.innerHTML = colored;
        const div = document.createElement('span');
        div.classList.add('code-block');
        div.contentEditable = false;
        div.appendChild(con);
        const p = document.createElement('p');
        p.appendChild(div);
        p.appendChild(document.createElement('br'));
        if (!this.paragraph || !this.paragraph.nextSibling) {
          document
            .querySelector('#blog-article-content-display')
            .appendChild(p);
        } else {
          let next = this.paragraph.nextSibling;
          document
            .querySelector('#blog-article-content-display')
            .insertBefore(p, next);
        }
        this.paragraph = p;
        this.content2html();
      });
    document
      .querySelector('#modal-insert-code-close')
      .addEventListener('click', (event) => {
        document.querySelector('#modal-insert-code-lang').value = '';
        document.querySelector('#modal-insert-code-content').value = '';
        document.querySelector('#modal-insert-code-bg').classList.add('hide');
        document.querySelector('#modal-insert-code').classList.add('hide');
      });
    document
      .querySelector('#modal-insert-code-bg')
      .addEventListener('click', (event) => {
        document.querySelector('#modal-insert-code-lang').value = '';
        document.querySelector('#modal-insert-code-content').value = '';
        document.querySelector('#modal-insert-code-bg').classList.add('hide');
        document.querySelector('#modal-insert-code').classList.add('hide');
      });
  }

  insertPhoto(file) {
    FilePostRequest(`${global.api}/photos`, {
      photo: file,
    })
      .then((res) => {
        const body = JSON.parse(res.body);

        const photo = body.data;

        const pic = document.createElement('picture');
        pic.setAttribute(
          'original',
          'https://api.wany.io/photos/' +
            photo.id +
            '/' +
            photo.name +
            photo.ext
        );
        pic.setAttribute('uid', photo.id);

        const src1 = document.createElement('source');
        src1.media = '(max-width: 899px)';
        src1.srcset =
          'https://api.wany.io/photos/' +
          photo.id +
          '/' +
          photo.name +
          '_x900' +
          photo.ext +
          '?s=x900';
        pic.appendChild(src1);

        const src2 = document.createElement('source');
        src2.media = '(min-width: 900px)';
        src2.srcset =
          'https://api.wany.io/photos/' +
          photo.id +
          '/' +
          photo.name +
          '_x2100' +
          photo.ext +
          '?s=x2100';
        pic.appendChild(src2);

        const img = document.createElement('img');
        img.src =
          'https://api.wany.io/photos/' +
          photo.id +
          '/' +
          photo.name +
          '_x2100' +
          photo.ext +
          '?s=x2100';
        img.loading = 'lazy';
        img.alt = photo.name + photo.ext;
        pic.appendChild(img);

        const p = document.createElement('p');
        p.appendChild(pic);
        p.appendChild(document.createElement('br'));
        if (!this.paragraph || !this.paragraph.nextSibling) {
          document
            .querySelector('#blog-article-content-display')
            .appendChild(p);
        } else {
          let next = this.paragraph.nextSibling;
          document
            .querySelector('#blog-article-content-display')
            .insertBefore(p, next);
        }
        this.paragraph = p;
        this.content2html();

        if (!document.querySelector('#blog-editor-control-thumbnail').value) {
          document.querySelector('#blog-editor-control-thumbnail').value =
            'https://api.wany.io/photos/' +
            photo.id +
            '/' +
            photo.name +
            '_x900' +
            photo.ext +
            '?s=x900';
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  font(t = 'font-sans-serif') {
    if (!this.paragraph) {
      return;
    }
    const cl = ['font-sans-serif', 'font-serif', 'font-monospace'];
    for (const c of cl) {
      c == t
        ? this.paragraph.classList.add(c)
        : this.paragraph.classList.remove(c);
    }
    this.content2html();
  }

  textAlign(t = 'text-align-justify') {
    if (!this.paragraph) {
      return;
    }
    const cl = [
      'text-align-justify',
      'text-align-left',
      'text-align-center',
      'text-align-right',
    ];
    for (const c of cl) {
      c == t
        ? this.paragraph.classList.add(c)
        : this.paragraph.classList.remove(c);
    }
    this.content2html();
  }

  boxAlign(t = 'box-align-center-normal') {
    if (!this.paragraph) {
      return;
    }
    const cl = [
      'box-align-center-normal',
      'box-align-center-full',
      'box-align-left-normal',
      'box-align-left-full',
      'box-align-left-side',
      'box-align-right-normal',
      'box-align-right-full',
      'box-align-right-side',
    ];
    for (const c of cl) {
      c == t
        ? this.paragraph.classList.add(c)
        : this.paragraph.classList.remove(c);
    }
    this.content2html();
  }

  fontStyle(t = 'font-style-paragraph') {
    if (!this.paragraph) {
      return;
    }
    const cl = [
      'font-style-paragraph',
      'font-style-header-1',
      'font-style-header-2',
      'font-style-header-3',
    ];
    for (const c of cl) {
      c == t
        ? this.paragraph.classList.add(c)
        : this.paragraph.classList.remove(c);
    }
    this.content2html();
  }

  cleanParagraph(paragraph) {
    let cl = [];
    cl = cl.concat(['font-sans-serif', 'font-serif', 'font-monospace']);
    cl = cl.concat([
      'text-align-justify',
      'text-align-left',
      'text-align-center',
      'text-align-right',
    ]);
    cl = cl.concat([
      'box-align-center-normal',
      'box-align-center-full',
      'box-align-left-normal',
      'box-align-left-full',
      'box-align-left-side',
      'box-align-right-normal',
      'box-align-right-full',
      'box-align-right-side',
    ]);
    cl = cl.concat([
      'font-style-paragraph',
      'font-style-header-1',
      'font-style-header-2',
      'font-style-header-3',
    ]);
    for (const c of paragraph.classList) {
      cl.includes(c) ? null : paragraph.classList.remove(c);
    }
    paragraph.classList.length == 0 ? paragraph.removeAttribute('class') : null;
    paragraph.removeAttribute('style');
    function getChildNodes(element) {
      let nodes = [];
      for (const child of element.childNodes) {
        nodes.push(child);
        child?.childNodes.length > 0
          ? (nodes = nodes.concat(getChildNodes(child)))
          : null;
      }
      return nodes;
    }
    for (const child of getChildNodes(paragraph)) {
      if (child.nodeName.startsWith('#')) {
        continue;
      }
      if (child.nodeName == 'A') {
        child.setAttribute('target', '_blank');
      }
      child.removeAttribute('style');
    }
  }

  content2html() {
    const content = document.querySelector('#blog-article-content-display');
    const dummy = document.querySelector('#blog-article-content-dummy');
    const html = document.querySelector('#blog-editor-control-content-html');
    dummy.innerHTML = content.innerHTML;
    for (const child of dummy.childNodes) {
      if (child.nodeName.startsWith('#')) {
        continue;
      }
      if (child.nodeName == 'P') {
        this.cleanParagraph(child);
      }
      child.removeAttribute('placeholder');
      child.removeAttribute('contenteditable');
    }
    let t = dummy.innerHTML;
    t = t.replace(/\n|\r/g, '');
    t = t.replace(/\t/g, ' ');
    html.value = t;
  }

  html2content() {
    const content = document.querySelector('#blog-article-content-display');
    const dummy = document.querySelector('#blog-article-content-dummy');
    const html = document.querySelector('#blog-editor-control-content-html');
    content.innerHTML = html.value;
  }

  submit() {
    this.content2html();

    const article = getArticle();

    if (this.isNewArticle) {
      JSONPostRequest(`${global.api}/blog/articles`, article)
        .then((res) => {
          Lapis.goto('/b/' + res.body.data);
        })
        .catch((error) => {
          error?.body?.message
            ? noty(
                '게시글을 발행할 수 없습니다.<br>' + error.body.message,
                'error'
              )
            : null;
        });
    } else {
      JSONPatchRequest(`${global.api}/blog/articles/${this.uid}`, article)
        .then((res) => {
          Lapis.goto('/b/' + res.body.data);
        })
        .catch((error) => {
          error?.body?.message
            ? noty(
                '게시글 변경사항을 저장할 수 없습니다.<br>' +
                  error.body.message,
                'error'
              )
            : null;
        });
    }

    function getArticle() {
      let eid = document.querySelector('#blog-editor-control-eid');
      let title = document.querySelector('#blog-article-title-display');
      let datetime = document.querySelector(
        '#blog-article-info-datetime-input'
      );
      let category = document.querySelector(
        '#blog-article-info-category-select'
      );
      let content = document.querySelector('#blog-editor-control-content-html');
      let thumbnail = document.querySelector('#blog-editor-control-thumbnail');

      let article = {
        eid: eid.value,
        title: title.innerHTML,
        creation: datetime.value,
        category: category.value,
        content: content.value,
        thumbnail: thumbnail.value,
      };

      return article;
    }
  }
}

function onScroll() {
  var header = document.querySelector('#blog-article-title');
  var hrect = header.getBoundingClientRect();
  var info = document.querySelector('#blog-article-info');
  var irect = info.getBoundingClientRect();
  var content = document.querySelector('#blog-article-content');
  var crect = content.getBoundingClientRect();
  var controlpanel = document.querySelector('#blog-editor-panel');
  var scroll = window.scrollY;
  var pos1 = header.offsetTop + hrect.height;
  var pos2 = pos1 + irect.height + crect.height - Math.rem(12) - Math.rem(7);
  if (scroll <= pos1) {
    controlpanel.classList.remove('fixed');
  } else if (pos1 < scroll && scroll <= pos2) {
    controlpanel.classList.add('fixed');
    controlpanel.classList.remove('hide');
  } else {
    controlpanel.classList.add('hide');
  }
}
