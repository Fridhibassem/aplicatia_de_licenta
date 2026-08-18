const express = require('express');
const router  = express.Router();
const crypto  = require('crypto');
const db      = require('../config/db');
const { isValidEmail, sanitizeText } = require('../utils/validation');

// POST /api/contact - oricine poate trimite (fara auth)
router.post('/', async (req, res) => {
  try {
    const firstName  = sanitizeText(req.body.firstName, 100);
    const lastName   = sanitizeText(req.body.lastName, 100);
    const email      = sanitizeText(req.body.email, 254).toLowerCase();
    const phone      = sanitizeText(req.body.phone, 30);
    const animalType = sanitizeText(req.body.animalType, 50);
    const subject    = sanitizeText(req.body.subject, 200);
    const message    = sanitizeText(req.body.message, 2000);

    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        message: 'Câmpurile nume, prenume, email, subiect și mesaj sunt obligatorii.'
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email invalid.' });
    }

    const newMessage = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      phone,
      animalType,
      subject,
      message,
      read: 0,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    await db.insert('contact_messages', newMessage);
    return res.status(201).json({ message: 'Mesaj trimis cu succes! Te vom contacta în curând.' });
  } catch (err) {
    console.error('[contact]', err);
    return res.status(500).json({ message: 'Eroare server. Te rugăm să încerci din nou.' });
  }
});

module.exports = router;
