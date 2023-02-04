import { JSONGetRequest } from '/resources/modules/request.mjs';

new (class extends LapisScript {
  async load() {
    const name = 'whois';

    const element = document.querySelector(`#network-crystal-modules-${name}`);
    let query = (() => {
      for (const module of global.modules) {
        if (module.name == name) {
          return module.query;
        }
      }
    })();

    JSONGetRequest(`${global.api}/network/whois/${query}`)
      .then((res) => {
        response(res.body.data);
      })
      .catch((error) => {
        console.log(error);
      });

    function response(data) {
      var str = data.string;
      str = str.replace(/\n/g, '<br>');
      str = str.replace(/ /g, '&nbsp;');
      /*str = str.replace(
        /([^/a-z0-9.\-_])([a-z0-9.\-_]+\.[a-z]+)([^/a-z0-9.\-_])/gi,
        '$1<a onclick=\'terminal.goto("$2")\'>$2</a>$3'
      );
      str = str.replace(
        /(https?:\/\/[a-z0-9.\-_]+\.[a-z]+(?:[a-z0-9.\-/_%?&#]+)?)/gi,
        '<a href="$1" target="_blank">$1</a>'
      );
      str = str.replace(
        /((?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi,
        '<a onclick=\'terminal.goto("$1")\'>$1</a>'
      );
      str = str.replace(
        /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(?=\s|$)/gi,
        '<a onclick=\'terminal.goto("$1")\'>$1</a>'
      );*/
      element.querySelector('.content .text .raw').innerHTML = str;
    }
  }

  unload() {}
})();
