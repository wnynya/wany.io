import config from '../config.mjs';
import { console } from '@wnynya/logger';
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('root', {});
});

import amujectRouter from './amuject.mjs';
router.use('/a', amujectRouter);

import blogRouter from './blog.mjs';
router.use('/b', blogRouter);

import networkCrystalRouter from './network-crystal.mjs';
router.use('/network-crystal', networkCrystalRouter);

import manageRouter from './manage.mjs';
router.use('/m', manageRouter);

import youRouter from './you.mjs';
router.use('/u', youRouter);

export default router;
