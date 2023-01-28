import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('manage/root', {});
});

export default router;
