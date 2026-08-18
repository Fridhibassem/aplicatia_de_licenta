const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/dashboard.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

// Toate rutele dashboard necesita rol admin
router.use(requireAdmin);

// ── Stats & Users ──
router.get('/stats', ctrl.getStats);
router.get('/users', ctrl.getUsers);
router.put('/users/:id/role', ctrl.updateUserRole);
router.delete('/users/:id', ctrl.deleteUser);

// ── Appointments ──
router.get('/appointments',          ctrl.getAppointments);
router.put('/appointments/:id/status', ctrl.updateAppointmentStatus);
router.delete('/appointments/:id',   ctrl.deleteAppointment);

// ── Contact Messages ──
router.get('/messages',          ctrl.getMessages);
router.put('/messages/:id/read', ctrl.markMessageRead);
router.delete('/messages/:id',   ctrl.deleteMessage);

module.exports = router;
