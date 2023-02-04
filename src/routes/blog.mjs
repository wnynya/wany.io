import express from 'express';
const router = express.Router();

import { BlogArticle } from '@wnynya/blog';

const categories = {
  log: '로그',
  amuject: '아무젝트',
  works: '작업물',
  dev: '개발',
  photo: '사진',
  audio: '오디오',
  'audio-vinyl': '판',
  test: '테스트',
  delete: '삭제',
};

router.get('/', (req, res) => {
  res.redirect('/b/index');
});

router.get(/^\/index(\/.*)?$/, (req, res) => {
  let page = req.query.page * 1 ? req.query.page * 1 : 1;
  let size = req.query.size * 1 ? req.query.size * 1 : 20;
  let query = req.path;
  query = query.replace(/^\/index/, '');
  query = query.replace(/^\/(.*)(\?.*)?/, '$1');
  query = decodeURI(query);

  let filter = {};
  if (query.match(/^(?:category|카테고리|분류):([a-zA-Z0-9_-]+)/)) {
    const m = query.match(/^(?:category|카테고리|분류):([a-zA-Z0-9_-]+)/);
    filter.category = m[1];
  } else {
    filter.eid = `%${query}%`;
    filter.title = `%${query}%`;
    filter.content = `%${query}%`;
  }

  Promise.all([
    BlogArticle.index(filter, size, page, false, true),
    BlogArticle.index(filter, 1000000, 1, true, false),
  ])
    .then(([articles, count]) => {
      res.ren('blog/index', {
        title: '게시글 목록 — 와니네 블로그',
        articles: articles,
        categories: categories,
        query: query,
        page: page,
        size: size,
        count: count,
      });
    })
    .catch((error) => {
      res.error500();
      return;
    });
});

router.get('/editor', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  if (!req.hasPermission('blog.articles.post')) {
    res.error403();
    return;
  }
  res.ren('blog/editor', {
    title: '에디터 — 와니네 블로그',
    article: {},
    categories: categories,
  });
});
router.get('/editor/:article', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  if (!req.hasPermission('blog.articles.patch')) {
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
        categories: categories,
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
            meta: {
              desc: data.content.text,
              author:
                data.author.label == data.author.eid
                  ? data.author.label
                  : `${data.author.label} (${data.author.eid})`,
            },
            article: data,
            categories: categories,
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
