# 🐾 VetCare — Cabinet Veterinar (Aplicație Web)

Aplicație web full-stack pentru gestionarea unui cabinet veterinar.
Permite vizitatorilor să facă programări online, iar administratorilor să gestioneze clienți, programări și mesaje de contact.

## 📦 Tehnologii folosite

**Backend:**
- Node.js + Express 4
- MySQL (cu `mysql2/promise`)
- JWT pentru autentificare
- bcryptjs pentru hashing parole
- express-rate-limit pentru protecție brute-force

**Frontend:**
- Angular 19 (Standalone Components)
- TypeScript 5.7
- HttpClient pentru comunicare cu API-ul
- RxJS

**Bază de date:**
- MySQL 8+

---

## 🚀 Cum rulezi proiectul (PAS CU PAS)

### Pasul 1: Verifică ce ai instalat

Deschide un terminal și rulează pe rând:

```bash
node --version    # trebuie să arate v18 sau mai mare
npm --version     # trebuie să arate v9 sau mai mare
mysql --version   # trebuie să arate 8.x
```

**Dacă lipsește vreunul:**
- **Node.js + npm:** descarcă de pe [nodejs.org](https://nodejs.org) (versiunea LTS)
- **MySQL:** descarcă MySQL Community Server de pe [mysql.com/downloads](https://dev.mysql.com/downloads/mysql/)
  - 💡 **Mai simplu pentru începători:** instalează **XAMPP** ([apachefriends.org](https://www.apachefriends.org/)) sau **Laragon** — vin cu MySQL la pachet, le pornești cu un click.

### Pasul 2: Pornește serverul MySQL

- **Windows (MySQL standalone):** Services → MySQL80 → Start. Sau pornește-l din MySQL Workbench.
- **XAMPP:** deschide XAMPP Control Panel → click "Start" lângă MySQL.
- **Laragon:** deschide Laragon → click "Start All".
- **Mac:** `brew services start mysql`
- **Linux:** `sudo systemctl start mysql`

Verifică că merge:
```bash
mysql -u root -p
# (introdu parola; dacă XAMPP/Laragon nu au, apasă Enter)
```

Dacă ajungi în prompt-ul `mysql>`, e perfect. Apasă `exit` ca să ieși.

### Pasul 3: Creează baza de date

În terminalul normal (nu în mysql>), rulează:

```bash
mysql -u root -p < vetcare_schema.sql
```

(când îți cere parola, o introduci pe a ta de la MySQL)

Asta creează baza `vetcare` cu tabelele `users`, `appointments`, `contact_messages`.

**Alternativ, prin MySQL Workbench:**
- File → Open SQL Script → alege `vetcare_schema.sql`
- Click pe iconița de "execute" (fulger galben).

### Pasul 4: Configurează backend-ul

```bash
cd vetcare-backend
npm install
```

Apoi creează un fișier `.env` în folderul `vetcare-backend/`. **Cel mai simplu:** copiază `.env.example` și redenumește-l în `.env`:

- **Windows:** copy `.env.example` `.env`
- **Mac/Linux:** `cp .env.example .env`

Deschide fișierul `.env` cu un text editor (Notepad / VS Code) și completează parola ta de MySQL la `DB_PASS`:

```env
PORT=3000
JWT_SECRET=schimba_cu_un_string_lung_si_random
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4200

DB_HOST=localhost
DB_PORT=3306
DB_NAME=vetcare
DB_USER=root
DB_PASS=parola_ta_aici
```

> ⚠️ **IMPORTANT:** dacă folosești XAMPP/Laragon și nu ai pus parolă la MySQL, lasă `DB_PASS=` (gol).

### Pasul 5: Populează baza cu date demo (opțional, dar recomandat)

```bash
npm run seed
```

Asta creează 3 conturi de test:

| Email | Parolă | Rol |
|---|---|---|
| `admin@vetcare.ro` | `Admin123` | Administrator |
| `user@vetcare.ro` | `User1234` | Utilizator obișnuit |
| `demo@vetcare.ro` | `Demo1234` | Utilizator obișnuit |

Și 4 programări demo pentru `user@vetcare.ro`.

### Pasul 6: Pornește backend-ul

```bash
npm start
```

Ar trebui să vezi:

```
🐾  VetCare Backend pornit pe http://localhost:3000
    Database   : MySQL @ localhost/vetcare
    Frontend   : http://localhost:4200
```

**Lasă terminalul ăsta deschis!** Backend-ul trebuie să ruleze tot timpul.

### Pasul 7: Pornește frontend-ul

Deschide **un AL DOILEA terminal** (nu-l închide pe primul!) și rulează:

```bash
cd vetcare-frontend
npm install
npm start
```

Așteaptă să apară:
```
✔ Compiled successfully
Local:   http://localhost:4200/
```

### Pasul 8: Deschide aplicația

În browser, accesează:
👉 **http://localhost:4200**

Loghează-te cu `admin@vetcare.ro` / `Admin123` ca să vezi dashboard-ul de admin.

---

## 🐛 Probleme frecvente

### ❌ "Access denied for user 'root'@'localhost'"
Parola din `.env` la `DB_PASS` nu e corectă. Verifică-o.

### ❌ "ECONNREFUSED 127.0.0.1:3306"
MySQL nu rulează. Pornește-l (vezi Pasul 2).

### ❌ "Unknown database 'vetcare'"
Baza nu a fost creată. Rulează din nou Pasul 3.

### ❌ "Port 3000 is already in use"
Altă aplicație folosește portul 3000. Schimbă `PORT=3001` în `.env`.

### ❌ Frontend-ul afișează "0.0.0.0 didn't send any data"
Backend-ul nu rulează. Verifică primul terminal.

### ❌ "CORS error" în consolă (F12 în browser)
Verifică în `.env` că `FRONTEND_URL=http://localhost:4200` (fără `/` la sfârșit).

### ❌ Conturile de seed nu se creează
Verifică că ai rulat Pasul 3 (schema) ÎNAINTE de Pasul 5 (seed).

---

## 📁 Structura proiectului

```
proiect_licenta/
├── vetcare_schema.sql         ← Schema bazei de date
├── README.md                  ← Acest fișier
├── docs/                      ← Documentație lucrare licență
│   ├── ER_DIAGRAM.md            ← Diagrama bazei de date (Mermaid)
│   ├── API_ENDPOINTS.md         ← Lista completă de endpoint-uri
│   └── SCREENSHOTS.md           ← Capturi mock pentru lucrare
├── vetcare-backend/           ← API Node.js + Express
│   ├── src/
│   │   ├── server.js              ← Punct de intrare
│   │   ├── config/db.js           ← Adaptor MySQL
│   │   ├── controllers/           ← Logică business
│   │   ├── routes/                ← Definiție rute API
│   │   ├── middleware/            ← Auth (JWT)
│   │   ├── models/                ← Factory funcții pt entități
│   │   └── utils/                 ← Validare, helpers
│   ├── seed.js                    ← Populează DB cu date demo
│   ├── .env.example               ← Șablon variabile mediu
│   └── package.json
└── vetcare-frontend/          ← UI Angular 19
    ├── src/app/
    │   ├── components/            ← Pagini și componente
    │   │   ├── home/                ← Pagina principală
    │   │   ├── about/               ← Despre clinică
    │   │   ├── contact/             ← Form contact
    │   │   ├── login/               ← Login + Register
    │   │   ├── programare/          ← Calendar programări
    │   │   ├── profile/             ← Profil user
    │   │   ├── dashboard/           ← Panou admin
    │   │   ├── header/              ← Bară navigație
    │   │   └── footer/
    │   ├── services/auth.service.ts ← Logică login/register
    │   ├── guards/                  ← Protecție rute
    │   ├── app.routes.ts            ← Definiție rute frontend
    │   └── app.config.ts            ← Configurare Angular
    └── package.json
```

---

## 🎯 Funcționalități

### Pentru vizitatori (publice)
- ✅ Vizualizare pagini Home / Despre noi / Contact
- ✅ Înregistrare cont
- ✅ Trimitere mesaj prin formular contact

### Pentru utilizatori autentificați
- ✅ Programare consultații (calendar interactiv, ore disponibile în timp real)
- ✅ Vizualizare programări proprii (istoric + viitoare)
- ✅ Anulare programări viitoare
- ✅ Editare nume profil
- ✅ Schimbare parolă

### Pentru administratori
- ✅ Dashboard cu statistici (utilizatori, programări, mesaje)
- ✅ Gestionare utilizatori (promovare/retrogradare rol, ștergere)
- ✅ Gestionare programări (filtrare, confirmare, anulare, ștergere)
- ✅ Gestionare mesaje contact (citire, ștergere, răspuns email direct)

### Securitate
- ✅ Parole hash-uite cu bcrypt (10 rounds)
- ✅ JWT pentru autentificare (expiră în 7 zile)
- ✅ Rate limiting pe endpoint-urile sensibile (10 încercări / 15 min)
- ✅ Validare server-side pe toate inputurile
- ✅ CORS configurat strict
- ✅ Protecție SQL injection (prepared statements)
- ✅ Validare conflict de slot la programări
- ✅ Verificare permisiuni la operațiile destructive

---

## 📚 Documentație suplimentară

- 📊 [Diagrama ER](docs/ER_DIAGRAM.md) — schema bazei de date
- 🔌 [API Endpoints](docs/API_ENDPOINTS.md) — toate rutele backend
- 🖼️ [Screenshots Guide](docs/SCREENSHOTS.md) — ce capturi să faci pentru lucrare

---

## 👤 Autor

Lucrare de licență — VetCare

---

## 📝 Note pentru evaluator / examinare

- Pentru testare rapidă: folosește contul `admin@vetcare.ro` / `Admin123` (acces complet)
- Datele demo sunt populate de `npm run seed`
- Toate parolele sunt hash-uite, nu există parole în clar în baza de date
- Mesajele de eroare sunt în limba română pentru consistență cu UI-ul
