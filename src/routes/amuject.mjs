'use strict';

import express from 'express';
const router = express.Router();

import jsonld from '../modules/seo/json-ld.mjs';

router.get('/', (req, res) => {
  res.ren('amuject/root', {
    title: '아무젝트 — 와니네',
    theme: {
      bg: 'rgb(255,225,225)',
      bgt: 'rgba(253,225,241,0.25)',
      fg: 'rgb(0,0,255)',
      fgm: 'rgb(0,0,0)',
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
