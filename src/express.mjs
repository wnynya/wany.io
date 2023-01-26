import config from './config.mjs';

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
app.use(middlewares.cookies()); // Cookie parser
app.use(middlewares.client()); // Client infomations
app.use(middlewares.JSONResponses()); // JSON response functions
app.use(auth.session(config.session)); // Auth session (req.session)
app.use(auth.account()); // Auth account (req.account)
app.use(middlewares.logger(new Logger(config.logger.req))); // Log request

app.use((req, res, next) => {
  res.ren = (path, data) => {
    data.req = req;
    data.path = path.split('/');
    data.elements = data.elements ? data.elements : ['header', 'footer'];
    res.render('index.pug', data);
  };
  res.error403 = () => {
    res.status(403).render('index', {
      client: req.client,
      path: ['error', '403'],
      elements: ['header'],
      title: '403 — 와니네',
      meta: {
        og: {
          title: '403 — 와니네',
          desc: 'Forbidden',
          image: '/api/images/netpan/og-image.png',
        },
      },
    });
  };
  res.error404 = () => {
    res.status(404).render('index', {
      client: req.client,
      path: ['error', '404'],
      elements: ['header'],
      title: '404 — 와니네',
      meta: {
        og: {
          title: '404 — 와니네',
          desc: 'Not Found',
          image: '/api/images/netpan/og-image.png',
        },
      },
    });
  };
  res.error500 = () => {
    res.status(500).render('index', {
      client: req.client,
      path: ['error', '500'],
      elements: ['header'],
      title: '500 — 와니네',
      meta: {
        og: {
          title: '500 — 와니네',
          desc: 'Internal Server Error',
          image: '/api/images/netpan/og-image.png',
        },
      },
    });
  };
  next();
});

/* __dirname and __filename */
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Ser view engine */
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, './views'));
/* Set basedir */
app.locals.basedir = path.resolve(__dirname);

/* Set root router */
import router from './routes/root.mjs';
app.use('/', router);

/* Set static files (src/public) */
app.use(express.static(path.resolve(__dirname, './public')));

/* Set 404 */
app.all('*', (req, res) => {
  res.status(404).render('error/404', {
    client: req.client,
  });
});

export default app;
