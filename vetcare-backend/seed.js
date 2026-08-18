/**
 * VetCare – Seed pentru MySQL
 * Ruleaza: npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql  = require('mysql2/promise');
const crypto = require('crypto');

const defaultUsers = [
  { email: 'admin@vetcare.ro', password: 'Admin123', name: 'Administrator VetCare', role: 'admin' },
  { email: 'user@vetcare.ro',  password: 'User1234', name: 'Ion Popescu',           role: 'user'  },
  { email: 'demo@vetcare.ro',  password: 'Demo1234', name: 'Maria Demo',            role: 'user'  }
];

function nowOffset(daysFromNow, hour = 10, min = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, min, 0, 0);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

async function seed() {
  const pool = await mysql.createPool({
    host:     process.env.DB_HOST || 'localhost',
    port:     process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'vetcare',
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASS || ''
  });

  console.log('\n🌱  VetCare – Seed MySQL\n');

  // ── Users ──
  const userIds = {};
  for (const u of defaultUsers) {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [u.email]);
    if (rows.length) {
      userIds[u.email] = rows[0].id;
      console.log(`  ⚠️  Skip user  ${u.email} (există deja)`);
      continue;
    }
    const hash = await bcrypt.hash(u.password, 10);
    const id   = crypto.randomUUID();
    await pool.query(
      'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      [id, u.email, hash, u.name, u.role]
    );
    userIds[u.email] = id;
    console.log(`  ✅  User creat:  ${u.email}  (parola: ${u.password})  [${u.role}]`);
  }

  // ── Appointments demo ──
  const userId = userIds['user@vetcare.ro'];
  if (userId) {
    const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM appointments WHERE userId = ?', [userId]);
    if (existing[0].cnt === 0) {
      const demoAppts = [
        { date: nowOffset(2,  10, 0),  service: 'Consultație Generală', animalType: 'Câine',  message: 'Lupu are 3 ani.',           status: 'pending'   },
        { date: nowOffset(5,  14, 30), service: 'Vaccinare',            animalType: 'Pisică', message: 'Vaccin anual.',             status: 'confirmed' },
        { date: nowOffset(-3, 11, 0),  service: 'Radiologie',           animalType: 'Câine',  message: 'Radiografie torace.',       status: 'confirmed' },
        { date: nowOffset(-7, 9,  30), service: 'Chirurgie',            animalType: 'Pisică', message: 'Sterilizare.',              status: 'cancelled' }
      ];
      for (const a of demoAppts) {
        await pool.query(
          `INSERT INTO appointments (id, userId, date, service, animalType, message, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), userId, a.date, a.service, a.animalType, a.message, a.status]
        );
      }
      console.log(`  ✅  ${demoAppts.length} programări demo create pentru user@vetcare.ro`);
    } else {
      console.log(`  ⚠️  Skip appointments (există deja ${existing[0].cnt})`);
    }
  }

  console.log('\n  Gata!\n');
  console.log('  Conturi de test:');
  console.log('    admin@vetcare.ro / Admin123  (admin)');
  console.log('    user@vetcare.ro  / User1234  (user)');
  console.log('    demo@vetcare.ro  / Demo1234  (user)\n');

  await pool.end();
}

seed().catch(err => {
  console.error('\n❌  Eroare la seed:\n', err.message);
  process.exit(1);
});
