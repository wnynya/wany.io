import config from '../config.mjs';
import { console } from '@wnynya/logger';
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('root', {});
});

export default router;
