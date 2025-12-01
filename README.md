# PATCHPOINT Backend

Node.js Express backend for the PATCHPOINT pothole detection system. Provides REST API for authentication, pothole management, comments, and Raspberry Pi uploads.

## Local Development

### 1. Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB, Cloudinary, JWT_SECRET
```

### 2. Run
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Test
```bash
curl http://localhost:5000/
```

## Deployment to Render

### Quick Start
1. Push to GitHub (include `/backend` folder)
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables (from `.env.example`):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `CORS_ORIGIN=https://your-frontend.vercel.app`
5. Deploy and copy the public URL
6. Update `frontend/.env` and `FINAL_INTEGRATION_STORED_VIDEO.py` with the Render URL

## API Endpoints

### Auth `/api/auth`
- `POST /signup` — Register
- `POST /login` — Login (returns JWT cookie)
- `POST /logout` — Logout
- `GET /me` — Current user (requires auth)

### Potholes `/api/potholes`
- `GET /` — List all
- `POST /` — Create (requires auth)
- `GET /:id` — Get one
- `POST /pi-upload` — Pi upload (no auth required)
  - Accepts: `image` (file), `lat`, `lon`, `depth`, `timestamp`, `confidence`

### Comments `/api/comments`
- `GET /:potholeId` — Get for pothole
- `POST /` — Add comment (requires auth)

### Upload `/api/upload`
- `POST /image` — Upload to Cloudinary

## Local Pi Testing

1. Get your PC's LAN IP: `ipconfig` (Windows)
2. Update `BACKEND_URL` in `../FINAL_INTEGRATION_STORED_VIDEO.py`:
   ```python
   BACKEND_URL = "http://192.168.1.2:5000/api/potholes/pi-upload"
   ```
3. Run: `npm run dev`
4. Pi posts to endpoint and sees potholes on frontend

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Module not found | `npm install` |
| MongoDB fails | Check `MONGO_URI` in `.env` and IP whitelist in Atlas |
| Cloudinary fails | Verify credentials and account active |
| CORS error | Ensure `CORS_ORIGIN` includes frontend URL |
