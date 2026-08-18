const express = require('express');
const router  = express.Router();
const crypto  = require('crypto');
const db      = require('../config/db');
const { requireAuth } = require('../middleware/auth.middleware');
const { sanitizeText } = require('../utils/validation');

const VALID_SERVICES = [
  'Consultație Generală', 'Vaccinare', 'Chirurgie',
  'Radiologie', 'Laborator', 'Grooming', 'Altul'
];
const VALID_ANIMALS = [
  'Câine', 'Pisică', 'Iepure', 'Pasăre',
  'Reptilă', 'Animal Exotic', 'Altul'
];

// GET /api/appointments/occupied?date=YYYY-MM-DD
router.get('/occupied', requireAuth, async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) return res.json([]);

    const all = await db.findAll('appointments');
    const occupied = all
      .filter(a => {
        if (!a.date || a.status === 'cancelled') return false;
        const d = new Date(a.date);
        const dStr = d.toISOString().slice(0, 10);
        return dStr === date;
      })
      .map(a => {
        const d = new Date(a.date);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      });

    return res.json(occupied);
  } catch (err) {
    console.error('[occupied]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
});

// GET /api/appointments/mine - programarile userului logat
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const all = await db.findAll('appointments', { userId: req.user.id });
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    return res.json(all);
  } catch (err) {
    console.error('[mine]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
});

// POST /api/appointments
router.post('/', requireAuth, async (req, res) => {
  try {
    const { date, service, animalType } = req.body;
    const message = sanitizeText(req.body.message, 1000);

    if (!date || !service || !animalType) {
      return res.status(400).json({ message: 'Completează toate câmpurile.' });
    }
    if (!VALID_SERVICES.includes(service)) {
      return res.status(400).json({ message: 'Serviciu invalid.' });
    }
    if (!VALID_ANIMALS.includes(animalType)) {
      return res.status(400).json({ message: 'Tip animal invalid.' });
    }

    const apptDate = new Date(date);
    if (isNaN(apptDate.getTime())) {
      return res.status(400).json({ message: 'Data invalidă.' });
    }

    const now = new Date();
    if (apptDate < now) {
      return res.status(400).json({ message: 'Nu poți programa în trecut.' });
    }

    const day = apptDate.getDay();
    if (day === 0 || day === 6) {
      return res.status(400).json({ message: 'Programările sunt doar în zilele lucrătoare.' });
    }

    const hour = apptDate.getHours();
    if (hour < 8 || hour >= 20) {
      return res.status(400).json({ message: 'Programările sunt între 08:00 și 20:00.' });
    }

    // verifica daca slotul e ocupat
    const all = await db.findAll('appointments');
    const conflict = all.find(a => {
      if (!a.date || a.status === 'cancelled') return false;
      return new Date(a.date).getTime() === apptDate.getTime();
    });
    if (conflict) {
      return res.status(409).json({ message: 'Slotul este deja ocupat.' });
    }

    const appointment = {
      id:         crypto.randomUUID(),
      userId:     req.user.id,
      date:       apptDate.toISOString().slice(0, 19).replace('T', ' '),
      service,
      animalType,
      message,
      status:     'pending',
      createdAt:  new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    await db.insert('appointments', appointment);
    return res.status(201).json(appointment);
  } catch (err) {
    console.error('[createAppointment]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
});

// DELETE /api/appointments/:id - anulare programare
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const appt = await db.findOne('appointments', { id });
    if (!appt) return res.status(404).json({ message: 'Programare negăsită.' });

    // doar proprietarul sau admin poate anula
    if (appt.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Nu ai voie să anulezi această programare.' });
    }

    await db.update('appointments', { id }, { status: 'cancelled' });
    return res.json({ message: 'Programare anulată.' });
  } catch (err) {
    console.error('[deleteAppointment]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
});

module.exports = router;
