# 🔌 VetCare API — Documentație Endpoint-uri

Toate endpoint-urile au prefix `/api`. Backend rulează implicit pe `http://localhost:3000`.

## Autentificare

Endpoint-urile protejate necesită un header HTTP:
```
Authorization: Bearer <JWT_TOKEN>
```

Token-ul se obține prin `POST /api/auth/login` și expiră după 7 zile.

---

## 📋 Tabel sumar

| Metodă | Endpoint | Auth | Descriere |
|--------|----------|------|-----------|
| **AUTENTIFICARE** | | | |
| POST | `/api/auth/register` | ❌ | Creează cont nou |
| POST | `/api/auth/login` | ❌ | Login → returnează JWT |
| GET | `/api/auth/me` | ✅ | Date user curent |
| PUT | `/api/auth/profile` | ✅ | Update nume |
| PUT | `/api/auth/change-password` | ✅ | Schimbă parolă |
| **PROGRAMĂRI** | | | |
| GET | `/api/appointments/occupied?date=YYYY-MM-DD` | ✅ | Ore ocupate într-o zi |
| GET | `/api/appointments/mine` | ✅ | Programările userului logat |
| POST | `/api/appointments` | ✅ | Creează programare |
| DELETE | `/api/appointments/:id` | ✅ | Anulează programare |
| **CONTACT** | | | |
| POST | `/api/contact` | ❌ | Trimite mesaj de contact |
| **DASHBOARD ADMIN** | | | |
| GET | `/api/dashboard/stats` | 👑 | Statistici globale |
| GET | `/api/dashboard/users` | 👑 | Listă utilizatori |
| PUT | `/api/dashboard/users/:id/role` | 👑 | Schimbă rol user |
| DELETE | `/api/dashboard/users/:id` | 👑 | Șterge user |
| GET | `/api/dashboard/appointments` | 👑 | Toate programările |
| PUT | `/api/dashboard/appointments/:id/status` | 👑 | Confirmă/Anulează |
| DELETE | `/api/dashboard/appointments/:id` | 👑 | Șterge definitiv |
| GET | `/api/dashboard/messages` | 👑 | Mesaje contact |
| PUT | `/api/dashboard/messages/:id/read` | 👑 | Marchează ca citit |
| DELETE | `/api/dashboard/messages/:id` | 👑 | Șterge mesaj |
| **HEALTH** | | | |
| GET | `/api/health` | ❌ | Verifică că serverul rulează |

> **Legendă:** ❌ public · ✅ user autentificat · 👑 doar admin

---

## 📝 Detalii pentru fiecare endpoint

### POST `/api/auth/register`
Înregistrare cont nou.

**Body:**
```json
{
  "email": "ana@example.com",
  "password": "Parola123",
  "name": "Ana Popescu"
}
```

**Validări:**
- email → format valid, max 254 caractere
- password → minim 8 caractere, cu cel puțin o literă și o cifră
- email-ul nu există deja în baza de date

**Răspuns 201:**
```json
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "email": "...", "name": "...", "role": "user", "createdAt": "..." }
}
```

**Erori:** 400 (validare), 409 (email există deja).

---

### POST `/api/auth/login`
Login și obținere token.

**Body:**
```json
{
  "email": "admin@vetcare.ro",
  "password": "Admin123"
}
```

**Răspuns 200:** identic cu `/register`.

**Erori:** 401 (credențiale invalide).

**Rate limit:** 10 încercări / 15 min / IP.

---

### POST `/api/appointments`
Creează o programare nouă.

**Body:**
```json
{
  "date":       "2026-05-15T10:00:00",
  "service":    "Consultație Generală",
  "animalType": "Câine",
  "message":    "Lupu are 3 ani, simptome de tuse"
}
```

**Validări server-side:**
- Data nu poate fi în trecut
- Doar zile lucrătoare (luni-vineri)
- Ore între 08:00 și 20:00
- Slotul (ora exactă) nu trebuie să fie deja ocupat
- `service` trebuie să fie din lista validă: Consultație Generală, Vaccinare, Chirurgie, Radiologie, Laborator, Grooming, Altul
- `animalType` trebuie să fie din lista validă: Câine, Pisică, Iepure, Pasăre, Reptilă, Animal Exotic, Altul

**`userId` se ia din token, NU din body** (prevenire impersonation).

**Erori:** 400 (validare), 409 (slot ocupat).

---

### DELETE `/api/appointments/:id`
Anulează o programare (soft delete — setează `status = 'cancelled'`).

**Permisiuni:** doar proprietarul sau un admin.

**Erori:** 403 (nu ești proprietar), 404 (nu există).

---

### POST `/api/contact`
Trimite mesaj prin formular contact (PUBLIC).

**Body:**
```json
{
  "firstName": "Ion",
  "lastName": "Popescu",
  "email": "ion@example.com",
  "phone": "0721234567",
  "animalType": "Câine",
  "subject": "Întrebare despre vaccin",
  "message": "Aș vrea să..."
}
```

**Câmpuri obligatorii:** firstName, lastName, email, subject, message.

---

### GET `/api/dashboard/stats`
Returnează statistici pentru admin panel.

**Răspuns 200:**
```json
{
  "totalUsers":             42,
  "totalAdmins":            2,
  "totalAppointments":      87,
  "pendingAppointments":    12,
  "confirmedAppointments":  68,
  "cancelledAppointments":  7,
  "totalMessages":          15,
  "unreadMessages":         3,
  "recentUsers":            [ ... 5 useri ... ]
}
```

---

## 🛡️ Coduri de eroare HTTP

| Cod | Semnificație |
|-----|--------------|
| 200 | OK |
| 201 | Resursă creată |
| 400 | Date invalide / validare eșuată |
| 401 | Token lipsă / invalid / expirat / credențiale greșite |
| 403 | Forbidden (autentificat dar fără permisiuni) |
| 404 | Resursă negăsită |
| 409 | Conflict (ex: email deja folosit, slot ocupat) |
| 429 | Too Many Requests (rate limit) |
| 500 | Eroare server |

Toate răspunsurile de eroare au format:
```json
{ "message": "Descriere eroare în română" }
```
