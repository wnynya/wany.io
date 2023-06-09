'use strict';

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/u/profile');
  return;
});

router.get('/login', (req, res) => {
  let r = req.query.r;
  r = r ? decodeURI(decodeURI(req.query.r)) : undefined;
  if (req.login) {
    res.redirect(r ? r : '/');
    return;
  }
  if (r && !r.match(/^(\/|https?:\/?\/?)/)) {
    res.redirect(`/u/login`);
    return;
  }
  res.ren('you/login', {
    title: '로그인🔒 — 와니네 계정',
    redir: r,
  });
});

router.get('/login/google', (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${'724935159172-obmq72ttk4d0l1en2itmp1b4ughk9ndu.apps.googleusercontent.com'}`;
  url += `&redirect_uri=${'https://lab-api.wany.io/auth/accounts/@google/sessions'}`;
  url += '&response_type=code';
  url += '&scope=email profile';
  res.redirect(url);
});

router.get('/reset-password', (req, res) => {
  if (req.login) {
    res.redirect(`/u/change-password`);
    return;
  }
  res.ren('you/reset-password', {
    title: '비밀번호 재설정 — 와니네 계정',
  });
});

router.get('/profile', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  res.ren('you/profile', {
    title: '프로필 — 와니네 계정',
  });
});

router.get('/sessions', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  res.ren('you/sessions', {
    title: '세션 — 와니네 계정',
  });
});

router.get('/change-password', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  res.ren('you/change-password', {
    title: '비밀번호 변경 — 와니네 계정',
  });
});

router.get('/permissions', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  res.ren('you/permissions', {
    title: '권한 노드 — 와니네 계정',
  });
});

router.get('/keys', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  res.ren('you/keys', {
    title: 'API 키 — 와니네 계정',
  });
});

router.get('/keys/:kid', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  const kid = req.params.kid;

  res.ren('you/key', {
    title: 'API 키 — 와니네 계정',
    kid: kid,
  });
});

export default router;
