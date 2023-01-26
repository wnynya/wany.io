/**
 * request.js
 *
 * (c) 2020-2021 Wany
 *
 * @summary HTTP / HTTPS API request modules
 * @author Wany <sung@wany.io>
 */

import EventEmitter from '/resources/modules/eventemitter.mjs';

class Request extends EventEmitter {
  constructor(uri, options = {}, body = {}) {
    super();

    if (!uri) {
      throw new Error('URI does not exist');
    }
    if (typeof uri != 'string') {
      throw new Error('URI must typeof string');
    }

    this.uri = encodeURI(uri);

    const m = /(?:(https?):\/?\/?)?([^/: ]+):?([0-9]{1,5})?(\/[^?]+)?(\?.+)?/i.exec(this.uri);

    this.protocol = window.fetch.bind(window);
    this.host = m[2];
    this.port = new Number(m[3] || m[1] == 'https' ? 443 : 80) * 1;
    this.path = m[4] || '';
    this.query = m[5] || '';

    this.path = this.path;
    this.query = this.query;

    this.method = options.method || 'GET';
    this.headers = {};
    this.credentials = options.credentials || 'include';

    this.blobres = options.blob || false;

    for (const key in options.headers || {}) {
      const value = options.headers[key];
      if (!value) {
        continue;
      }
      this.headers[key] = value;
    }

    this.body = body;

    if (!(body instanceof FormData)) {
      this.body = JSON.stringify(body);
    }

    this.res = {};
    this.res.request = {
      uri: this.uri,
      method: this.method,
      headers: this.headers,
    };

    this.req = this.protocol(this.uri, {
      method: this.method,
      headers: this.headers,
      credentials: this.credentials,
      body: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(this.method) ? this.body : undefined,
    })
      .then((res) => this.response(res))
      .catch((error) => {
        this.emit('error', error);
      });

    return this;
  }

  response(response) {
    this.res.uri = response.url;
    if (300 <= response.status && response.status < 400 && response?.headers?.location) {
      const redir = response?.headers?.location;
      const req = new Request(redir, this.options, this.body);
      req.on('response', (...args) => {
        this.emit('response', ...args);
        this.emit('res', ...args);
        this.emit('r', ...args);
      });
      req.on('info', (...args) => {
        this.emit('info', ...args);
        this.emit('res', ...args);
        this.emit('i', ...args);
      });
      req.on('success', (...args) => {
        this.emit('success', ...args);
        this.emit('ok', ...args);
        this.emit('s', ...args);
        this.emit('o', ...args);
      });
      req.on('redirect', (...args) => {
        this.emit('redirect', ...args);
        this.emit('redir', ...args);
        this.emit('d', ...args);
      });
      req.on('error', (...args) => {
        this.emit('error', ...args);
        this.emit('err', ...args);
        this.emit('e', ...args);
      });
    } else {
      const contentType = this.headers['Content-Type'] || '';
      if (contentType.match(/application\/json/)) {
        this.JSONResponse(response);
      } else {
        this.stringResponse(response);
      }
    }
  }

  responseStatus(response) {
    const status = response.status;
    this.res.status = status;
    this.res.headers = {};
    for (const key of response.headers.keys()) {
      this.res.headers[key] = response.headers.get(key);
    }
    this.emit('response', this.res);
    this.emit('res', this.res);
    this.emit('r', this.res);
    this.emit(status, this.res);
    if (100 <= status && status < 200) {
      this.emit('info', this.res);
      this.emit('i', this.res);
    } else if (200 <= status && status < 300) {
      this.emit('success', this.res);
      this.emit('ok', this.res);
      this.emit('s', this.res);
      this.emit('o', this.res);
    } else if (300 <= status && status < 400) {
      this.emit('redirect', this.res);
      this.emit('redir', this.res);
      this.emit('d', this.res);
    } else if (400 <= status && status < 500) {
      this.emit('error', this.res);
      this.emit('err', this.res);
      this.emit('e', this.res);
    } else if (500 <= status && status < 600) {
      this.emit('error', this.res);
      this.emit('err', this.res);
      this.emit('e', this.res);
    }
  }

  stringResponse(response) {
    response.text().then((text) => {
      this.res.body = text;
      this.responseStatus(response);
    });
  }

  JSONResponse(response) {
    response.text().then((text) => {
      if (!text) {
        text = '{}';
      }
      let json = {};
      try {
        json = JSON.parse(text);
      } catch (error) {
        console.error(error);
      }
      this.res.body = json;
      this.responseStatus(response);
    });
  }

  blobResponse(response) {
    response.blob().then((blob) => {
      this.res.body = blob;
      this.responseStatus(response);
    });
  }
}

export default Request;

export { Request };

async function URIRequest(uri, body, method, headers) {
  return new Promise((resolve, reject) => {
    new Request(
      uri,
      {
        method: method,
        headers: headers,
      },
      body
    )
      .on('ok', (res) => {
        resolve(res);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function HeadRequest(uri, auth) {
  return URIRequest(uri, undefined, 'HEAD', { Authorization: auth });
}

async function GetRequest(uri, auth) {
  return URIRequest(uri, undefined, 'GET', { Authorization: auth });
}

async function PostRequest(uri, body, auth) {
  return URIRequest(uri, body, 'POST', { Authorization: auth });
}

async function PutRequest(uri, body, auth) {
  return URIRequest(uri, body, 'PUT', { Authorization: auth });
}

async function PatchRequest(uri, body, auth) {
  return URIRequest(uri, body, 'PATCH', { Authorization: auth });
}

async function DeleteRequest(uri, body, auth) {
  return URIRequest(uri, body, 'DELETE', { Authorization: auth });
}

export { URIRequest, HeadRequest, GetRequest, PostRequest, PutRequest, PatchRequest, DeleteRequest };

async function JSONRequest(uri, body, method, headers = {}) {
  const formHeaders = {
    'Content-Type': 'application/json',
  };
  for (const key in headers) {
    formHeaders[key] = headers[key];
  }
  return URIRequest(uri, body, method, formHeaders);
}

async function JSONGetRequest(uri, auth) {
  return JSONRequest(uri, undefined, 'GET', { Authorization: auth });
}

async function JSONPostRequest(uri, body, auth) {
  return JSONRequest(uri, body, 'POST', { Authorization: auth });
}

async function JSONPutRequest(uri, body, auth) {
  return JSONRequest(uri, body, 'PUT', { Authorization: auth });
}

async function JSONPatchRequest(uri, body, auth) {
  return JSONRequest(uri, body, 'PATCH', { Authorization: auth });
}

async function JSONDeleteRequest(uri, body, auth) {
  return JSONRequest(uri, body, 'DELETE', { Authorization: auth });
}

export { JSONRequest, JSONGetRequest, JSONPostRequest, JSONPutRequest, JSONPatchRequest, JSONDeleteRequest };

async function FilePostRequest(uri, body) {
  return new Promise((resolve, reject) => {
    var formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    new Request(
      uri,
      {
        method: 'POST',
        credentials: 'include',
      },
      formData
    )
      .on('ok', (res) => {
        resolve(res);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function FileGetRequest(uri, options = {}) {
  let uriname = uri.replace(/.*\/([^/#?&]+)/, '$1');
  return new Promise((resolve, reject) => {
    new Request(uri, {
      method: 'GET',
      credentials: 'include',
      blob: true,
    })
      .on('ok', (res) => {
        if (options.after == 'download') {
          saveBlob(res.content, options.name || uriname);
          resolve(res.content, res);
        } else if (options.after == 'text') {
          res.content.text().then(resolve).catch(reject);
        } else {
          resolve(res.content, res);
        }
      })
      .on('error', (error) => {
        reject(error?.content, error);
      });
  });
  function saveBlob(blob, name) {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = name;
    a.dispatchEvent(new MouseEvent('click'));
  }
}

export { FilePostRequest, FileGetRequest };
