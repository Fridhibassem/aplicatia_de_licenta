/**
 * VetCare Backend – server.js
 * Node.js + Express + MySQL
 */
require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');

const authRoutes         = require('./routes/auth.routes');
const dashboardRoutes    = require('./routes/dashboard.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const contactRoutes      = require('./routes/contact.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Middleware global ── */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

/* ── Rate limiting ──
 * Apara endpoint-urile sensibile (login/register) impotriva atacurilor brute-force.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 10,                  // max 10 incercari / IP / fereastra
  message: { message: 'Prea multe încercări. Încearcă din nou în 15 minute.' },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});

/* ── Routes ── */
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/',              generalLimiter);

app.use('/api/auth',         authRoutes);
app.use('/api/dashboard',    dashboardRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/contact',      contactRoutes);

/* ── Health check ── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── 404 ── */
app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.method} ${req.path} nu exista.` });
});

/* ── Error handler ── */
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ message: 'Eroare server.' });
});

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`\n🐾  VetCare Backend pornit pe http://localhost:${PORT}`);
  console.log(`    Database   : MySQL @ ${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'vetcare'}`);
  console.log(`    Frontend   : ${process.env.FRONTEND_URL || 'http://localhost:4200'}\n`);
});
