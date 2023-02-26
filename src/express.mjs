'use strict';

import config from './config.mjs';
const dev = process.argv.includes('-dev');

/* __dirname and __filename */
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';

const app = express();

/* Body (JSON) parser */
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: 104857600 }));

/* Set middlewares */
import middlewares from '@wnynya/express-middlewares';
import auth from '@wnynya/auth';
import { Logger, console } from '@wnynya/logger';

app.use(middlewares.headers(config.headers)); // Custom response headers

/* Set static files (src/public) */
app.use(express.static(path.resolve(__dirname, './public')));

app.use(middlewares.cookies()); // Cookie parser
app.use(middlewares.client()); // Client infomations
app.use(middlewares.JSONResponses()); // JSON response functions
app.use(auth.session(config.session)); // Auth session (req.session)
app.use(auth.account()); // Auth account (req.account)
app.use(middlewares.logger(new Logger(config.logger.req))); // Log request

/* Ser view engine */
app.set('views', path.resolve(__dirname, './views'));
app.set('view cache', true);
app.set('view engine', 'pug');
/* Set basedir */
app.locals.basedir = path.resolve(__dirname);

app.use((req, res, next) => {
  req.api = dev ? config.api.dev : config.api.pub;
  req.wanyne = dev ? config.wanyne.dev : config.wanyne.pub;
  req.amuject = dev ? config.amuject.dev : config.amuject.pub;
  req.amethy = dev ? config.amethy.dev : config.amethy.pub;
  res.ren = (...args) => {
    const t = Date.now();
    let status = 200;
    let path;
    let data = {};
    for (const arg of args) {
      if (typeof arg == 'number') {
        status = arg;
      } else if (typeof arg == 'string') {
        path = arg;
      } else if (arg instanceof Object) {
        data = arg;
      }
    }
    if (!path) {
      throw new Error('No path');
    }
    data.req = req;
    data.path = path.split('/');
    data.elements = data.elements
      ? data.elements
      : ['scripts', 'header', 'footer'];
    data.meta = data.meta ? data.meta : {};

    data.meta.desc = data.meta.desc ? data.meta.desc : undefined;
    data.meta.keywords = data.meta.keywords ? data.meta.keywords : undefined;
    data.meta.author = data.meta.author ? data.meta.author : undefined;

    // OpenGraph
    data.meta.og = data.meta.og ? data.meta.og : {};
    data.meta.og.sitename = data.meta.og.sitename
      ? data.meta.og.sitename
      : '와니네';
    data.meta.og.title = data.meta.og.title
      ? data.meta.og.title
      : data.title
      ? data.title
      : undefined;
    if (data.meta.og.title) {
      let titlematch = data.meta.og.title.match(/^(.*) — ([^—]*)$/);
      if (titlematch) {
        data.meta.og.sitename = titlematch[2];
        data.meta.og.title = titlematch[1];
      }
    }
    data.meta.og.desc = data.meta.og.desc
      ? data.meta.og.desc
      : data.meta.desc
      ? data.meta.desc
      : undefined;
    data.meta.og.image = data.meta.og.image
      ? data.meta.og.image
      : data.meta.image
      ? data.meta.image
      : undefined;

    res.status(status).render('index.pug', data);
  };
  res.error403 = () => {
    res.ren(403, 'error/403', {
      title: '403 — 와니네',
    });
  };
  res.error404 = () => {
    res.ren(404, 'error/404', {
      title: '404 — 와니네',
    });
  };
  res.error418 = () => {
    res.ren(418, 'error/418', {
      title: '418 — 와니네',
    });
  };
  res.error500 = () => {
    res.ren(500, 'error/500', {
      title: '500 — 와니네',
    });
  };
  next();
});

/* Set root router */
import router from './routes/root.mjs';
app.use('/', router);

/* Set 404 */
app.all('*', (req, res) => {
  res.error404();
});

export default app;
