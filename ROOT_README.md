PATCHPOINT

PATCHPOINT is a full-stack pothole detection and reporting application.

Requirements:

- Node.js
- MongoDB (Atlas free tier OK)
- Cloudinary account (free tier OK)

Quick start:

1. Backend

   - cd backend
   - copy .env.example .env (PowerShell: `copy .env.example .env`) and fill values
   - npm install
   - npm run dev

2. Frontend
   - cd frontend
   - copy .env.example .env (PowerShell: `copy .env.example .env`) and fill values
   - npm install
   - npm run dev

Open the frontend at `http://localhost:5173` and backend at `http://localhost:5000`.

This project uses JWT in HTTP-only cookies for authentication, Cloudinary for image storage, and Leaflet + OpenStreetMap tiles for maps.
