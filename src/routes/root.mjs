import express from 'express';
const router = express.Router();

import { BlogArticle } from '@wnynya/blog';

router.get('/', (req, res) => {
  Promise.all([
    BlogArticle.index({ category: 'amuject' }, 10, 1, false, true),
    BlogArticle.index({ category: 'audio' }, 10, 1, false, true),
    BlogArticle.index({ category: 'dev' }, 10, 1, false, true),
    BlogArticle.index({ category: 'photo' }, 10, 1, false, true),
  ])
    .then(([amuject, audio, dev, photo]) => {
      res.ren('root', {
        title: '와니네',
        meta: {
          desc: '와니네 — 아무젝트, 블로그 — 와니네',
        },
        articles: {
          amuject: randomArticle(amuject),
          audio: randomArticle(audio),
          dev: randomArticle(dev),
          photo: randomArticle(photo),
        },
      });
    })
    .catch((error) => {
      res.error500();
    });

  function randomArticle(articles) {
    return articles[
      Math.floor(Math.min(Math.random() * articles.length), articles.length - 1)
    ];
  }
});

router.get('/ping', (req, res) => {
  res.send('pong!');
});

router.get('/ip', (req, res) => {
  res.send(req.client.ip);
});

router.get('/teapot', (req, res) => {
  res.error418();
});

router.get('/give-me-an-internal-server-error', (req, res) => {
  res.error500();
});

import amujectRouter from './amuject.mjs';
router.use('/a', amujectRouter);

import blogRouter from './blog.mjs';
router.use('/b', blogRouter);

import networkCrystalRouter from './network-crystal.mjs';
router.use('/network-crystal', networkCrystalRouter);

import manageRouter from './manage.mjs';
router.use('/m', manageRouter);

import photosRouter from './photos.mjs';
router.use('/p', photosRouter);

import youRouter from './you.mjs';
router.use('/u', youRouter);

export default router;
