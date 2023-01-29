import config from '../config.mjs';
import { console } from '@wnynya/logger';
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('root', {});
});

router.get('/ping', (req, res) => {
  res.send('pong!');
});

router.get('/ip', (req, res) => {
  res.send(req.client.ip);
});

router.get('/teapot', (req, res) => {
  res.error418();
});

router.get('/give-me-an-internal-server-error', (req, res) => {
  res.error500();
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
