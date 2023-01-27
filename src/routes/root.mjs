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

router.get('/test.css', (req, res) => {
  setTimeout(() => {
    res.set('Content-Type', 'text/css');
    res.send(`
    #test-block {
      width: 300px;
      height: 500px;
      background-color: yellow;
    }
    
    `);
  }, 1000);
});

router.get('/test.mjs', (req, res) => {
  setTimeout(() => {
    res.set('Content-Type', 'text/javascript');
    res.send(`
    new (class extends LapisScript {
      load() {
        console.log('로딩 2초 걸리는');
      }
    
      unload() {}
    })();    
    `);
  }, 2000);
});

export default router;
