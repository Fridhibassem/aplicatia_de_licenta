const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', ctrl.register);

// POST /api/auth/login
router.post('/login', ctrl.login);

// GET  /api/auth/me  (necesita token)
router.get('/me', requireAuth, ctrl.me);

// PUT  /api/auth/profile (update nume)
router.put('/profile', requireAuth, ctrl.updateProfile);

// PUT  /api/auth/change-password
router.put('/change-password', requireAuth, ctrl.changePassword);

module.exports = router;
