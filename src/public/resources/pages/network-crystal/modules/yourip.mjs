new (class extends LapisScript {
  async load() {
    const name = 'yourip';

    const element = document.querySelector(`#network-crystal-modules-${name}`);

    element
      .querySelector('.content h2 span')
      .addEventListener('click', (event) => {
        navigator.clipboard.writeText(event.target.innerText).then(() => {
          window.noty('텍스트가 클립보드에 복사되었습니다.');
        });
      });
  }

  unload() {}
})();
