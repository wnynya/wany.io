import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('amuject/root', {});
});

router.get('/co', (req, res) => {
  res.ren('amuject/root', {});
});

export default router;
