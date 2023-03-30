'use strict';

import express from 'express';
const router = express.Router();

import jsonld from '../modules/seo/json-ld.mjs';

router.get('/', (req, res) => {
  res.ren('amuject/root', {
    title: '아무젝트 — 와니네',
    theme: {
      bg: '#ffdddd',
      bgt: '#ffdddd44',
      fg: '#0000ff',
      fgm: '#000000',
    },
    meta: {
      jsonld: jsonld.gen(
        jsonld.breadcrumb(
          { name: '와니네', item: 'https://wany.io' },
          { name: '아무젝트' }
        )
      ),
    },
  });
});

router.get('/co', (req, res) => {
  res.ren('amuject/co', {
    title: 'Co-아무젝트 — 와니네',
    meta: {
      jsonld: jsonld.gen(
        jsonld.breadcrumb(
          { name: '와니네', item: 'https://wany.io' },
          { name: '아무젝트', item: 'https://wany.io/a' },
          { name: 'Co-아무젝트' }
        )
      ),
    },
  });
});

export default router;
