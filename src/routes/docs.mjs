'use strict';

import express from 'express';
const router = express.Router();

import jsonld from '../modules/seo/json-ld.mjs';

router.get('/', (req, res) => {
  res.ren('docs/root', {
    title: '문서 — 와니네',
    meta: {
      jsonld: jsonld.gen(
        jsonld.breadcrumb(
          { name: '와니네', item: 'https://wany.io' },
          { name: '문서' }
        )
      ),
    },
  });
});

router.get('/api', (req, res) => {
  res.ren('docs/root', {
    title: 'API 문서 — 와니네',
    meta: {
      jsonld: jsonld.gen(
        jsonld.breadcrumb(
          { name: '와니네', item: 'https://wany.io' },
          { name: '문서', item: 'https://wany.io/d' },
          { name: 'API' }
        )
      ),
    },
  });
});

router.get('/api/amethy/terminal', (req, res) => {
  res.ren('docs/root', {
    title: '아메시 터미널 — API 문서 — 와니네',
    meta: {
      jsonld: jsonld.gen(
        jsonld.breadcrumb(
          { name: '와니네', item: 'https://wany.io' },
          { name: '문서', item: 'https://wany.io/d' },
          { name: 'API', item: 'https://wany.io/d/api' },
          { name: '아메시', item: 'https://wany.io/d/api/amethy' },
          { name: '터미널' }
        )
      ),
    },
  });
});

export default router;
