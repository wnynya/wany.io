import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  res.ren('manage/root', {});
});

export default router;
