# 🖼️ Ghid Capturi de Ecran pentru Lucrare

Acest document îți spune exact ce capturi să faci și cum să le organizezi în lucrarea de licență. Folosește **Snipping Tool** (Windows) sau **Cmd+Shift+4** (Mac) pentru capturi precise.

## 💡 Sfaturi generale

- **Rezoluție recomandată:** browser pe 1366×768 sau 1440×900 (nu 4K — devin texte microscopice în print)
- **Browser curat:** mod Incognito pentru a evita extensii vizibile
- **Loghează-te în prealabil** pe contul potrivit înainte de captură
- **Date demo** populate cu `npm run seed` — vei avea date care arată profesional
- **Format salvare:** PNG (calitate mai bună pentru print decât JPG)
- **Numește-le coerent:** `01_homepage.png`, `02_login.png` etc.

---

## 📸 Lista de capturi necesare

### Capitolul "Prezentare aplicație" (Frontend)

#### 1. `01_homepage.png` — Pagina principală
- **URL:** `http://localhost:4200/`
- **Stare:** delogat
- **Ce să captezi:** întreg viewportul cu hero section + first-fold

#### 2. `02_homepage_features.png` — Secțiunea features
- Scroll în jos pe homepage până la "De ce să ne alegi"
- Captează cardurile cu features

#### 3. `03_about.png` — Pagina Despre Noi
- **URL:** `/about`
- Capturi: hero + secțiunea echipă

#### 4. `04_contact.png` — Formular contact
- **URL:** `/contact`
- Stare: form gol cu toate câmpurile vizibile

#### 5. `05_contact_filled.png` — Form completat + mesaj succes
- Completează formularul cu date demo
- După click "Trimite", captează banner-ul verde de succes

#### 6. `06_login.png` — Pagina login
- **URL:** `/login`
- Tab-ul "Login" activ

#### 7. `07_register.png` — Pagina înregistrare
- **URL:** `/login`
- Click pe tab "Înregistrare"

### Capitolul "Funcționalități utilizator"

#### 8. `08_programare_calendar.png` — Calendar programare
- **URL:** `/programare` (logat ca user)
- Captează calendar + selecție serviciu + animal type

#### 9. `09_programare_ore.png` — Selecție oră
- După ce ai ales o dată, captează grila de ore disponibile/ocupate

#### 10. `10_programare_succes.png` — Confirmare programare
- După click "Confirmă programarea", captează ecranul de succes

#### 11. `11_profile_info.png` — Profil — tab Informații
- **URL:** `/profile`
- Tab "Informații" activ
- Captează sidebar + datele user-ului

#### 12. `12_profile_appointments.png` — Profil — Programările mele
- Tab "Programările Mele"
- Lista cu cele 4 programări demo (mix de status: pending/confirmed/cancelled)

#### 13. `13_profile_security.png` — Profil — Securitate
- Tab "Securitate"
- Form schimbare parolă

#### 14. `14_profile_edit_name.png` — Edit nume în profil
- Tab Informații → click "Editează" lângă nume
- Captează input-ul activ + butoane Salvează/Anulează

### Capitolul "Panou administrare"

> ⚠️ Loghează-te ca **`admin@vetcare.ro`** / **`Admin123`** pentru acest grup.

#### 15. `15_dashboard_overview.png` — Dashboard — Overview
- **URL:** `/dashboard`
- Tab "Privire de Ansamblu"
- Captează toate cele 4 carduri stats + tabel recent users

#### 16. `16_dashboard_appointments.png` — Dashboard — Programări
- Tab "Programări"
- Captează filtrele + tabelul cu toate programările
- 💡 Asigură-te că ai mix de status-uri (pending, confirmed, cancelled)

#### 17. `17_dashboard_appointments_filter.png` — Filtru "În așteptare"
- Click pe filtrul "În așteptare"
- Captează tabelul filtrat

#### 18. `18_dashboard_users.png` — Dashboard — Utilizatori
- Tab "Utilizatori"
- Captează tabelul cu cei 3 useri demo

#### 19. `19_dashboard_messages.png` — Dashboard — Mesaje
- Tab "Mesaje"
- 💡 **Înainte:** trimite 2-3 mesaje din formularul de contact (delogat) ca să ai date
- Captează lista de mesaje cu badge "necitit" pe câteva

#### 20. `20_dashboard_message_detail.png` — Detaliu mesaj
- Click pe un mesaj din listă (se marchează ca citit)
- Captează zona expandată cu butonul "Răspunde"

### Capitolul "Securitate" (capturi DevTools / cod)

#### 21. `21_jwt_token.png` — Token JWT decodat
- După login, deschide DevTools (F12) → tab Application → Local Storage
- Click pe `localhost:4200` → Click pe `token`
- Copiază valoarea, decodează la [jwt.io](https://jwt.io) și captează rezultatul

#### 22. `22_password_hash.png` — Hash bcrypt în DB
- În MySQL Workbench: `SELECT id, email, password FROM users LIMIT 3;`
- Captează rezultatul (pentru a arăta că parolele sunt hash-uite)

#### 23. `23_rate_limit.png` — Demonstrație rate limit
- Încearcă login cu parolă greșită de 11 ori la rând
- A 11-a oară primești `429 Too Many Requests`
- Captează din DevTools → Network → click pe request-ul respins

#### 24. `24_cors_header.png` — Header CORS
- DevTools → Network → orice request către `localhost:3000`
- Tab Headers, captează `Access-Control-Allow-Origin`

### Capitolul "Bază de date"

#### 25. `25_db_workbench_schema.png` — Schemă în MySQL Workbench
- Deschide MySQL Workbench → conectează → expand `vetcare`
- Right-click `Tables` → Reverse Engineer (sau Object Browser)
- Captează diagrama generată

#### 26. `26_db_users_data.png` — Date din `users`
- `SELECT id, email, name, role, createdAt FROM users;`
- Captează rezultatul

#### 27. `27_db_appointments_data.png` — Date din `appointments`
- `SELECT id, userId, date, service, status FROM appointments;`
- Captează rezultatul

### Capitolul "Validări și gestionare erori"

#### 28. `28_error_password_weak.png` — Eroare parolă slabă
- La register, introdu parolă scurtă (`abc`)
- Captează mesajul de eroare

#### 29. `29_error_email_exists.png` — Eroare email duplicat
- La register, încearcă să te înregistrezi cu un email deja existent
- Captează eroarea

#### 30. `30_error_slot_busy.png` — Eroare slot ocupat
- Fă o programare la o dată/oră
- Încearcă imediat o A DOUA programare la aceeași oră
- Captează eroarea

---

## 📐 Cum să le aranjezi în lucrare

### Sugestie de capitole + capturi:

**Capitolul 4 — Prezentarea aplicației**
- 4.1 Pagina principală: 01, 02
- 4.2 Pagini informative: 03
- 4.3 Sistem autentificare: 06, 07

**Capitolul 5 — Funcționalități utilizator**
- 5.1 Sistem programări: 08, 09, 10, 30
- 5.2 Profil utilizator: 11, 12, 13, 14
- 5.3 Comunicare: 04, 05

**Capitolul 6 — Panou administrare**
- 6.1 Statistici: 15
- 6.2 Gestionare programări: 16, 17
- 6.3 Gestionare utilizatori: 18
- 6.4 Gestionare mesaje: 19, 20

**Capitolul 7 — Implementare tehnică**
- 7.1 Bază de date: 25, 26, 27
- 7.2 Securitate: 21, 22, 23, 24
- 7.3 Validări: 28, 29

---

## 💡 Trucuri utile pentru capturi profesioniste

1. **Cursor invizibil:** apasă Print Screen exact când nu ai mouse-ul peste UI
2. **Padding alb:** după captură, deschide în Paint și adaugă o margine albă de 20px (arată mai aerisit în PDF)
3. **Highlight roșu:** dacă vrei să arăți un buton specific, încercuiește-l cu unealta de cerc (din Paint sau Snipping Tool)
4. **Date credibile:** evită datele cu "test", "asd", "qwerty" — folosește nume reale (Ion Popescu, Maria Demo) pentru aspect profesional
5. **Conturi temporare:** după ce termini capturile, șterge conturile cu nume amuzante din DB

---

## 📦 Verificare finală înainte de predare

- [ ] Toate cele 30 de capturi sunt făcute
- [ ] Numerotarea e consistentă (`01_*.png`, `02_*.png`...)
- [ ] Rezoluție identică (folosești același viewport)
- [ ] Nu apar date sensibile (parole vizibile, emailuri reale ale tale)
- [ ] Capturile sunt incluse în lucrare cu **titlu** și **referință** (ex: "Figura 5.2: Selecția orei pentru programare")
- [ ] Lista de figuri e generată automat în Word/LaTeX
