import express from 'express';
const router = express.Router();

import { BlogArticle } from '@wnynya/blog';
import sitemap from '../modules/seo/sitemap.mjs';
import jsonld from '../modules/seo/json-ld.mjs';

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
          jsonld: jsonld.gen(jsonld.breadcrumb({ name: '와니네' }), {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: 'https://wany.io/',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://wany.io/b/index/{query}',
              },
              'query-input': 'required name=find',
            },
          }),
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

/* sitemap.xml */
router.get('/sitemap.xml', (req, res) => {
  sitemap()
    .then((data) => {
      res.set('Content-Type', 'text/xml');
      res.send(data);
    })
    .catch((error) => {
      console.error(error);
    });
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
