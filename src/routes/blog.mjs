import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/b/index');
});

router.get('/index', (req, res) => {
  res.ren('blog/index', {});
});

router.get('/editor', (req, res) => {
  res.ren('blog/editor', {});
});

router.get('/:article', (req, res) => {
  const id = req.params.article;
  res.ren('blog/article', {});
});

export default router;
