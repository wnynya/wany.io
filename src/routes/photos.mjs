'use strict';

import express from 'express';
const router = express.Router();

import { JSONGetRequest } from '@wnynya/request';

router.get('/', (req, res) => {
  res.ren('photos/root', {});
});

router.get('/:pid', (req, res) => {
  const pid = req.params.pid;

  JSONGetRequest(`https://api.wany.io/photos/${pid}`)
    .then((result) => {
      const photo = result.body.data;
      res.ren('photos/single', {
        elements: ['scripts'],
        title: `${photo.name}.${photo.ext} — 와니네`,
        photo: photo,
      });
    })
    .catch((error) => {
      if (error.status == 404) {
        res.error404();
      } else {
        console.error(error);
        res.error500();
      }
    });
});

export default router;
