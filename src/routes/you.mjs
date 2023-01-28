import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('you/root', {});
});

export default router;
