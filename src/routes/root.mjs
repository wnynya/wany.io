import config from '../config.mjs';
import { console } from '@wnynya/logger';
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('root', {});
});

router.get('/page1', (req, res) => {
  res.ren('page1', {});
});

router.get('/page2', (req, res) => {
  res.ren('page2', {});
});

export default router;
