'use strict';

import express from 'express';
const router = express.Router();

import auth, {
  AuthElement,
  AuthPermissions,
  AuthAccount,
  AuthSession,
  AuthKey,
} from '@wnynya/auth';
import Crypto from '@wnynya/crypto';

router.get('/', (req, res) => {
  res.redirect(`/m/auth/accounts`);
  /*if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  if (!req.hasPermission('manage.root')) {
    res.error403();
    return;
  }

  res.ren('manage/root', {
    title: '와니네 관리',
  });*/
});

router.get('/auth/accounts', (req, res) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  if (!req.hasPermission('manage.auth.accounts')) {
    res.error403();
    return;
  }

  res.ren('manage/auth/accounts/root', {
    title: '와니네 계정 — 와니네 관리',
  });
});

router.all('/auth/accounts/:aid*', (req, res, next) => {
  if (!req.login) {
    res.redirect(`/u/login?r=${req.originalUrl}`);
    return;
  }

  if (!req.hasPermission('manage.auth.accounts')) {
    res.error403();
    return;
  }

  const aid = req.params.aid;

  // 계정 정보 불러오기
  AuthAccount.of(aid)
    .then((account) => {
      req.p.account = account;
      req.p.account.uid = account.element.uid;
      req.p.account.label = account.element.label;
      req.p.account.eid = account.eid;
      req.p.account.email = account.email;
      req.p.account.gravatar = account.gravatar;
      next();
    })
    .catch((error) => {
      res.error404();
    });
});

router.get('/auth/accounts/:aid', (req, res) => {
  res.redirect(`/m/auth/accounts/${req.p.account.eid}/profile`);
});

router.get('/auth/accounts/:aid/profile', (req, res) => {
  res.ren('manage/auth/accounts/profile', {
    title: '프로필 — 와니네 계정 — 와니네 관리',
  });
});

router.get('/auth/accounts/:aid/sessions', (req, res) => {
  res.ren('manage/auth/accounts/sessions', {
    title: '세션 — 와니네 계정 — 와니네 관리',
  });
});

router.get('/auth/accounts/:aid/change-password', (req, res) => {
  res.ren('manage/auth/accounts/change-password', {
    title: '비밀번호 변경 — 와니네 계정 — 와니네 관리',
  });
});

router.get('/auth/accounts/:aid/permissions', (req, res) => {
  res.ren('manage/auth/accounts/permissions', {
    title: '권한 노드 — 와니네 계정 — 와니네 관리',
  });
});

router.get('/auth/accounts/:aid/keys', (req, res) => {
  res.ren('manage/auth/accounts/keys', {
    title: 'API 키 — 와니네 계정 — 와니네 관리',
  });
});

router.get('/auth/accounts/:aid/keys/:kid', (req, res) => {
  const kid = req.params.kid;

  res.ren('manage/auth/accounts/key', {
    title: 'API 키 — 와니네 계정 — 와니네 관리',
    kid: kid,
  });
});

export default router;
