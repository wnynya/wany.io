import express from 'express';
const router = express.Router();

import { BlogArticle } from '@wnynya/blog';

router.get('/', (req, res) => {
  res.redirect('/b/index');
});

router.get('/index', (req, res) => {
  res.ren('blog/index', {});
});
router.get('/index/*', (req, res) => {
  res.ren('blog/index', {});
});

router.get('/editor', (req, res) => {
  if (!res.hasPermission('blog.articles.post')) {
    res.error403();
    return;
  }
  res.ren('blog/editor', {
    title: '에디터 — 와니네 블로그',
    article: {},
  });
});
router.get('/editor/:article', (req, res) => {
  if (!res.hasPermission('blog.articles.patch')) {
    res.error403();
    return;
  }
  const aid = req.params.article;
  BlogArticle.of(aid)
    .then((article) => {
      const data = article.toJSON();
      res.ren('blog/editor', {
        title: '에디터 — 와니네 블로그',
        article: data,
      });
    })
    .catch((error) => {
      res.error404();
      return;
    });
});

router.get('/:article', (req, res, next) => {
  const aid = req.params.article;
  BlogArticle.of(aid)
    .then((article) => {
      Promise.all([article.selectAfter(), article.selectBefore()])
        .then((index) => {
          const data = article.toJSON();
          data.after = index[0];
          data.before = index[1];
          res.ren('blog/article', {
            title: data.title.text + ' — 와니네 블로그',
            article: data,
          });
        })
        .catch((error) => {
          res.error500();
          return;
        });
    })
    .catch((error) => {
      res.error404();
      return;
    });
});

export default router;
