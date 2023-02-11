import express from 'express';
const router = express.Router();

import jsonld from '../modules/seo/json-ld.mjs';

router.get('/', (req, res) => {
  res.ren('amuject/root', {
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
  res.ren('amuject/root', {});
});

export default router;
