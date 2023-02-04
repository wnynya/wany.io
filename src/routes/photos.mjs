import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('photos/root', {});
});

router.get('/:pid', (req, res) => {
  const pid = req.params.pid;

  res.ren('photos/photo', {});
});

export default router;
