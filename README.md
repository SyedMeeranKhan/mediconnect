# Mediconnect

React (Vite) frontend + Django (DRF) backend for listing doctors, managing weekly availability, and booking appointments.

## Project structure

- `my-react-app/` — React frontend
- `backend/` — Django project

## Prerequisites

- Node.js (for the frontend)
- Python 3.x (for the backend)

## Backend setup (Django)

From the repo root (PowerShell):

```powershell
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
cd backend
..\venv\Scripts\python.exe manage.py migrate
..\venv\Scripts\python.exe manage.py createsuperuser
..\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

Django admin:

- http://127.0.0.1:8000/admin/

## Frontend setup (React)

From the repo root:

```powershell
cd my-react-app
npm install
npm run dev
```

Frontend dev server is typically:

- http://localhost:5173/

## Convenience scripts (repo root)

If you created the venv at `./venv` (as above):

```powershell
npm run dev
npm run backend
```

## API (backend)

Base URL: `http://127.0.0.1:8000/`

- `GET /api/doctors/` — list doctors (used by the frontend)
- `GET /api/doctors/{id}/available-slots/` — available time slots for a doctor
- `POST /api/appointments/` — book an appointment
