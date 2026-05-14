# 🏙️ Smart City – Urban Incident Management Platform

## 📖 Overview

Smart City est une application web conçue pour permettre aux citoyens de signaler rapidement des incidents urbains (routes dégradées, éclairage public défectueux, infrastructures endommagées, etc.) et aux administrateurs de centraliser leur traitement via un tableau de bord moderne, sécurisé et intuitif.

L’objectif est d’améliorer la réactivité des services urbains grâce à une plateforme numérique accessible et efficace.

---

# 🚀 Features

## 👥 Citizen Side
- Signalement d’incidents urbains
- Ajout de descriptions détaillées
- Localisation des incidents
- Consultation du suivi des signalements
- Interface responsive

## 🛠️ Administration Dashboard
- Gestion centralisée des signalements
- Mise à jour des incidents
- Tableau de bord analytique
- Suivi de résolution

## ⚡ Priority Levels

Chaque incident possède un niveau de priorité :

- 🟢 Bas
- 🟡 Moyen
- 🟠 Élevé
- 🔴 Critique

---

# 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| Frontend | Next.js, TailwindCSS, ShadCN UI |
| Backend | Django, Django REST Framework |
| Database | PostgreSQL (Aiven Cloud) |
| Security | Local HTTPS with mkcert |

---

# 📦 Installation

## 🔧 Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
```

### Activate environment

#### Linux / macOS
```bash
source venv/bin/activate
```

#### Windows
```bash
venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Configure environment variables

```bash
cp .env.example .env
```

### Apply migrations

```bash
python manage.py migrate
```

### Run backend server

```bash
python manage.py runserver
```

---

## 💻 Frontend

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Configure Local HTTPS

```bash
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

### Run frontend server

```bash
npm run dev
```

---

# 📸 Application Preview

<div align="center">

<img src="assets/Login.png" width="250" alt="Login"/>
<img src="assets/Admin-Dashboard.png" width="250" alt="Admin Dashboard"/>
<img src="assets/Ajout signalement.png" width="250" alt="Ajout signalement"/>
<img src="assets/Gestion des utilisateurs.png" width="250" alt="Gestion utilisateurs"/>
<img src="assets/signalement avec filtre .png" width="250" alt="Signalement avec filtre"/>
<img src="assets/signalement sans filtre .png" width="250" alt="Signalement sans filtre"/>
<img src="assets/statistique .png" width="250" alt="Dashboard"/>

</div>

---

# 📁 Project Structure

```bash
smart-city/
│
├── back-smartcity/
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
│
├── front-smartcity/
│   ├── app/
│   ├── components/
│   └── ...
│
└── README.md
```
