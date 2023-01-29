import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.ren('you/root', {});
});

router.get('/profile', (req, res) => {
  res.ren('you/profile', {
    title: '프로필 - 와니네 계정',
  });
});

router.get('/sessions', (req, res) => {
  res.ren('you/sessions', {
    title: '세션 - 와니네 계정',
  });
});

router.get('/change-password', (req, res) => {
  res.ren('you/change-password', {
    title: '비밀번호 변경 - 와니네 계정',
  });
});

router.get('/keys', (req, res) => {
  res.ren('you/keys', {
    title: 'API 키 - 와니네 계정',
  });
});

router.get('/keys/:kid', (req, res) => {
  res.ren('you/keys', {
    title: 'API 키 - 와니네 계정',
  });
});

export default router;
