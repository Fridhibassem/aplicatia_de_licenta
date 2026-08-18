# VetCare - aplicatie web pentru cabinet veterinar

Acest proiect este o aplicatie web realizata pentru gestionarea unui cabinet veterinar. Ideea principala a fost sa existe o parte publica pentru vizitatori si o parte privata pentru utilizatori si administrator.

Un vizitator poate vedea informatii despre cabinet, poate trimite un mesaj prin formularul de contact si isi poate crea cont. Dupa autentificare, utilizatorul poate face programari si isi poate vedea programarile proprii. Administratorul are acces la un dashboard unde poate gestiona utilizatorii, programarile si mesajele primite.

## Tehnologii folosite

Backend-ul este facut cu Node.js si Express, iar pentru baza de date am folosit MySQL. Autentificarea se face cu JWT, iar parolele sunt salvate hash-uit cu bcrypt.

Frontend-ul este realizat in Angular, cu componente standalone si TypeScript. Comunicarea dintre frontend si backend se face prin cereri HTTP catre API-ul Express.

Pe scurt:

- Angular si TypeScript pentru interfata
- Node.js si Express pentru API
- MySQL pentru baza de date
- JWT pentru autentificare
- bcrypt pentru protectia parolelor

## Structura proiectului

```text
aplicatia_de_licenta/
├── vetcare-backend/        # serverul Node.js + Express
├── vetcare-frontend/       # aplicatia Angular
├── docs/                   # documentatie tehnica
├── lucrare_licenta/        # materiale pentru lucrarea de licenta
├── vetcare_schema.sql      # script pentru crearea bazei de date
└── README.md
```

## Functionalitati

Aplicatia include:

- pagini publice: Home, Despre noi, Contact
- creare cont si autentificare
- programari online pentru utilizatori
- profil utilizator
- dashboard pentru administrator
- gestionare programari
- gestionare mesaje de contact
- roluri diferite pentru utilizator si administrator

## Cum se ruleaza proiectul

Pentru rulare sunt necesare:

- Node.js
- npm
- MySQL

### 1. Crearea bazei de date

Din folderul principal al proiectului se ruleaza:

```bash
mysql -u root -p < vetcare_schema.sql
```

Comanda creeaza baza de date `vetcare` si tabelele necesare.

### 2. Configurarea backend-ului

Intra in folderul backend:

```bash
cd vetcare-backend
npm install
```

Copiaza fisierul `.env.example` si creeaza un fisier nou numit `.env`:

```bash
cp .env.example .env
```

In `.env` trebuie completate datele pentru conexiunea la MySQL. Exemplu:

```env
PORT=3000
JWT_SECRET=schimba_acest_string_cu_unul_lung_si_random
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4200

DB_HOST=localhost
DB_PORT=3306
DB_NAME=vetcare
DB_USER=root
DB_PASS=parola_ta_de_mysql
```

Daca MySQL nu are parola, `DB_PASS` poate ramane gol.

Optional, se pot adauga date demo:

```bash
npm run seed
```

Pornire backend:

```bash
npm start
```

Backend-ul ruleaza pe:

```text
http://localhost:3000
```

### 3. Pornirea frontend-ului

Deschide un terminal nou si intra in folderul frontend:

```bash
cd vetcare-frontend
npm install
npm start
```

Aplicatia se deschide in browser la:

```text
http://localhost:4200
```

## Conturi demo

Daca se ruleaza comanda `npm run seed`, se creeaza cateva conturi pentru test:

| Email | Parola | Rol |
| --- | --- | --- |
| admin@vetcare.ro | Admin123 | admin |
| user@vetcare.ro | User1234 | user |
| demo@vetcare.ro | Demo1234 | user |

## Observatii

Proiectul a fost realizat ca aplicatie de licenta si pune accent pe organizarea unei aplicatii full-stack: frontend separat, backend separat, baza de date relationala si autentificare cu roluri.

Pentru o versiune de productie ar mai fi necesare lucruri precum HTTPS, configurare pentru deployment, backup pentru baza de date si o metoda mai avansata de gestionare a sesiunilor.
