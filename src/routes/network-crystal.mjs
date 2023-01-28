import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('network-crystal/root', {});
});

export default router;
