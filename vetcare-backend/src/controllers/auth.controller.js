const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');
const { createUser } = require('../models/user.model');
const { isValidEmail, isStrongPassword, sanitizeText } = require('../utils/validation');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function safeUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

async function register(req, res) {
  try {
    const email = sanitizeText(req.body.email, 254).toLowerCase();
    const name  = sanitizeText(req.body.name, 100);
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email și parola sunt obligatorii.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email invalid.' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: 'Parola trebuie să aibă minim 8 caractere, cu cel puțin o literă și o cifră.'
      });
    }

    const exists = await db.findOne('users', { email });
    if (exists) return res.status(409).json({ message: 'Există deja un cont cu acest email.' });

    const hash = await bcrypt.hash(password, 10);
    const user = createUser({ email, password: hash, name });
    await db.insert('users', user);

    const token = signToken(user);
    return res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function login(req, res) {
  try {
    const email = sanitizeText(req.body.email, 254).toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email și parola sunt obligatorii.' });
    }

    const user = await db.findOne('users', { email });
    if (!user) return res.status(401).json({ message: 'Email sau parolă incorecte.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Email sau parolă incorecte.' });

    const token = signToken(user);
    return res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function me(req, res) {
  try {
    const user = await db.findOne('users', { id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User negăsit.' });
    return res.json(safeUser(user));
  } catch (err) {
    console.error('[me]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function updateProfile(req, res) {
  try {
    const name = sanitizeText(req.body.name, 100);
    if (!name) return res.status(400).json({ message: 'Numele este obligatoriu.' });

    const updated = await db.update('users', { id: req.user.id }, { name });
    return res.json(safeUser(updated));
  } catch (err) {
    console.error('[updateProfile]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Ambele parole sunt obligatorii.' });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: 'Parola nouă trebuie să aibă minim 8 caractere, cu cel puțin o literă și o cifră.'
      });
    }

    const user = await db.findOne('users', { id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User negăsit.' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Parola curentă este incorectă.' });

    const hash = await bcrypt.hash(newPassword, 10);
    await db.update('users', { id: user.id }, { password: hash });

    return res.json({ message: 'Parola a fost schimbată cu succes.' });
  } catch (err) {
    console.error('[changePassword]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

module.exports = { register, login, me, updateProfile, changePassword };
