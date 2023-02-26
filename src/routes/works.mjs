import express from 'express';
const router = express.Router();

import jsonld from '../modules/seo/json-ld.mjs';

router.get('/', (req, res) => {
  res.ren('amuject/root', {
    title: '작업물 — 와니네',
    meta: {
      jsonld: jsonld.gen(
        jsonld.breadcrumb(
          { name: '와니네', item: 'https://wany.io' },
          { name: '작업물' }
        )
      ),
    },
  });
});

router.get('/greenbee', (req, res) => {
  res.ren('amuject/greenbee', {
    title: '그린비 — 작업물 — 와니네',
    meta: {
      jsonld: jsonld.gen(
        jsonld.breadcrumb(
          { name: '와니네', item: 'https://wany.io' },
          { name: '작업물', item: 'https://wany.io/w' },
          { name: '그린비' }
        )
      ),
    },
  });
});

export default router;
