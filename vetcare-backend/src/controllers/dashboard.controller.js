const db = require('../config/db');

function safeUser({ password, ...u }) { return u; }

async function getStats(req, res) {
  try {
    const users        = await db.findAll('users');
    const appointments = await db.findAll('appointments');
    const messages     = await db.findAll('contact_messages').catch(() => []);

    const pending   = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;

    return res.json({
      totalUsers:         users.length,
      totalAdmins:        users.filter(u => u.role === 'admin').length,
      totalAppointments:  appointments.length,
      pendingAppointments:   pending,
      confirmedAppointments: confirmed,
      cancelledAppointments: cancelled,
      totalMessages:      messages.length,
      unreadMessages:     messages.filter(m => !m.read).length,
      recentUsers:        users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(safeUser)
    });
  } catch (err) {
    console.error('[getStats]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function getUsers(req, res) {
  try {
    const users = await db.findAll('users');
    return res.json(
      users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(safeUser)
    );
  } catch (err) {
    console.error('[getUsers]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function updateUserRole(req, res) {
  try {
    const { id }   = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rol invalid.' });
    }
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Nu îți poți schimba propriul rol.' });
    }
    const user = await db.findOne('users', { id });
    if (!user) return res.status(404).json({ message: 'User negăsit.' });
    const updated = await db.update('users', { id }, { role });
    return res.json(safeUser(updated));
  } catch (err) {
    console.error('[updateUserRole]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Nu te poți șterge pe tine.' });
    }
    const user = await db.findOne('users', { id });
    if (!user) return res.status(404).json({ message: 'User negăsit.' });
    await db.delete('users', { id });
    return res.json({ message: 'User șters.' });
  } catch (err) {
    console.error('[deleteUser]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

// ── APPOINTMENTS ──

async function getAppointments(req, res) {
  try {
    const appts = await db.findAll('appointments');
    const users = await db.findAll('users');
    const userMap = new Map(users.map(u => [u.id, { name: u.name, email: u.email }]));

    const enriched = appts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(a => ({
        ...a,
        user: userMap.get(a.userId) || null
      }));

    return res.json(enriched);
  } catch (err) {
    console.error('[getAppointments]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function updateAppointmentStatus(req, res) {
  try {
    const { id }     = req.params;
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Status invalid.' });
    }
    const appt = await db.findOne('appointments', { id });
    if (!appt) return res.status(404).json({ message: 'Programare negăsită.' });

    const updated = await db.update('appointments', { id }, { status });
    return res.json(updated);
  } catch (err) {
    console.error('[updateAppointmentStatus]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;
    const appt = await db.findOne('appointments', { id });
    if (!appt) return res.status(404).json({ message: 'Programare negăsită.' });
    await db.delete('appointments', { id });
    return res.json({ message: 'Programare ștearsă.' });
  } catch (err) {
    console.error('[deleteAppointment]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

// ── CONTACT MESSAGES ──

async function getMessages(req, res) {
  try {
    const msgs = await db.findAll('contact_messages').catch(() => []);
    msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(msgs);
  } catch (err) {
    console.error('[getMessages]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function markMessageRead(req, res) {
  try {
    const { id } = req.params;
    const msg = await db.findOne('contact_messages', { id });
    if (!msg) return res.status(404).json({ message: 'Mesaj negăsit.' });
    const updated = await db.update('contact_messages', { id }, { read: 1 });
    return res.json(updated);
  } catch (err) {
    console.error('[markMessageRead]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    await db.delete('contact_messages', { id });
    return res.json({ message: 'Mesaj șters.' });
  } catch (err) {
    console.error('[deleteMessage]', err);
    return res.status(500).json({ message: 'Eroare server.' });
  }
}

module.exports = {
  getStats, getUsers, updateUserRole, deleteUser,
  getAppointments, updateAppointmentStatus, deleteAppointment,
  getMessages, markMessageRead, deleteMessage
};
