<a href="https://www.djangoproject.com/" target="_blank">
  <img src="https://www.djangoproject.com/m/img/logos/django-logo-negative.png" height="40">
</a>
<a href="https://www.django-rest-framework.org/" target="_blank">
  <img src="https://www.django-rest-framework.org/img/logo.png" height="40">
</a>
<a href="https://aiven.io/" target="_blank">
  <img src="https://aiven.io/remix-assets/logo-aiven-white-text-tDZpBsXE.svg" height="40">
</a>

# SmartCity

**SmartCity** est une application web développée avec **Django** et **Django REST Framework (DRF)**.  
Elle permet aux citoyens de soumettre des signalements et aux administrateurs de les gérer efficacement.

---

## Technologies

- Python 3.x
- Django
- Django REST Framework (DRF)
- PostgreSQL  hebergé sur Aiven


---


## Installation

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/Orimbato77/projetM1 
cd SmartCity
```

2. **Créer un environnement virtuel**
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos paramètres de base de données
```

5. **Appliquer les migrations**
```bash
python manage.py migrate
```

6. **Créer un superutilisateur**
```bash
python manage.py createsuperuser
```

7. **Lancer le serveur de développement**
```bash
python manage.py runserver
```

L'application sera accessible à `http://localhost:8000/api/v1/`

---
## 📚 Ressources

- **Collection d'API de test ApiDog** : [ApiDog_ SmartCity](https://github.com/FinoanaKevin/SmartCity/)

