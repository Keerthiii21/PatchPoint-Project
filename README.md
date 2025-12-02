# 🚨 PatchPoint: Pothole Detection System

> **Live pothole detection, reporting, and tracking system** using Raspberry Pi + ML + Full-stack Web App

---

## 📸 Features

### 🎯 Smart Detection (Raspberry Pi)
- **YOLOv5 ONNX** neural network detection
- **LiDAR depth measurement** for accurate hole dimensions
- **GPS coordinates** capture
- **Auto-upload** to cloud backend with best frame selection

### 🌐 Web Dashboard (React + TailwindCSS)
- **Real-time map** showing detected potholes (Leaflet + OpenStreetMap)
- **Live statistics** (total reports, avg depth, today's detections)
- **User authentication** (signup/login with JWT)
- **Image upload** to Cloudinary with metadata
- **Comments system** for community discussion
- **Auto-refresh** every 10s for live Pi detection updates

### 📡 Backend API (Node.js + Express)
- **RESTful endpoints** for auth, potholes, comments, uploads
- **MongoDB database** for persistent storage
- **Cloudinary CDN** for image hosting
- **CORS support** for multi-origin requests
- **Multipart upload** handling with streaming

---

## 🚀 Quick Start

### Local Development (5 minutes)
```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB & Cloudinary credentials
npm run dev

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev
# Opens http://localhost:5173

# 3. Done! Test at http://localhost:5173
```

### Production Deployment
- **Frontend**: Deploy to Vercel/Netlify (auto-build from `main`)
- **Backend**: Deploy to Render/Railway/Heroku
- **Pi**: Run `FINAL_INTEGRATION_STORED_VIDEO.py` with backend URL

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions.

---

## 📂 Project Structure

```
temp/
├── frontend/               # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── pages/         # LoginPage, Dashboard, MapPage, etc.
│   │   ├── components/    # Button, Card, Navbar, StatsCard, etc.
│   │   ├── api/           # axiosClient, authApi, potholeApi
│   │   ├── context/       # AuthContext for state management
│   │   └── styles.css     # TailwindCSS directives
│   ├── dist/              # Production build (pre-built)
│   ├── package.json
│   ├── .env               # ⚠️ Local only (not committed)
│   └── .env.example       # Template (do commit)
│
├── backend/               # Node.js + Express
│   ├── src/
│   │   ├── models/        # Pothole, User, Comment schemas
│   │   ├── controllers/   # Auth, pothole, comment logic
│   │   ├── routes/        # API route definitions
│   │   ├── middleware/    # Auth verification, validation
│   │   └── config/        # Database, Cloudinary setup
│   ├── server.js          # Express app entry point
│   ├── package.json
│   ├── .env               # ⚠️ Local only (not committed)
│   └── .env.example       # Template (do commit)
│
├── FINAL_INTEGRATION_STORED_VIDEO.py  # Pi upload helper
├── DEPLOYMENT.md          # 📖 Production deploy guide
├── QUICKSTART.md          # 📖 Local development guide
├── README.md              # This file
├── .gitignore             # Ignore .env, node_modules, dist, etc.
└── .git/                  # Git history
```

---

## 🔑 Environment Variables

### Backend Required (`backend/.env`)
```dotenv
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/potholeDB
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Frontend Required (`frontend/.env`)
```dotenv
VITE_API_URL=http://localhost:5000        # Local dev
# VITE_API_URL=https://your-backend.com  # Production
```

### Raspberry Pi (`FINAL_INTEGRATION_STORED_VIDEO.py`)
```python
BACKEND_URL = "http://192.168.1.50:5000/api/potholes/pi-upload"  # Update IP
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user (returns JWT) |
| POST | `/api/auth/logout` | ✅ | Logout (clear cookie) |
| GET | `/api/auth/me` | ✅ | Get current user |

### Potholes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/potholes` | ❌ | List all potholes |
| POST | `/api/potholes` | ✅ | User upload pothole |
| POST | `/api/potholes/pi-upload` | ❌ | Pi auto-upload pothole |
| GET | `/api/potholes/:id` | ❌ | Get single pothole |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/comments` | ❌ | List all comments |
| POST | `/api/comments` | ✅ | Add comment to pothole |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload/image` | ✅ | Upload image to Cloudinary |

---

## 🎯 Workflow Example

### 1. User Signs Up & Logs In
```bash
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
# Returns: JWT in HTTP-only cookie
```

### 2. Frontend Fetches Potholes
```bash
GET /api/potholes
# Returns: [{ _id, imageUrl, gpsLat, gpsLon, depthCm, timestamp, ... }]
# Auto-polls every 10s for new Pi detections
```

### 3. Pi Detects & Uploads Pothole
```bash
POST /api/potholes/pi-upload
Content-Type: multipart/form-data
[binary image data] + lat + lon + depth + timestamp
# Returns: { success: true, pothole: {...} }
```

### 4. Dashboard Shows New Detection
```javascript
// Frontend polls GET /api/potholes every 10s
// New Pi detection automatically appears on map & table
```

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool (blazing fast)
- **TailwindCSS 3** - Utility-first styling with glassmorphism
- **Leaflet** - Interactive maps
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router v6** - Client-side routing

### Backend
- **Node.js 18** - Runtime
- **Express 4** - Web framework
- **MongoDB + Mongoose** - NoSQL database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary SDK** - Image hosting
- **Multer** - File upload handling
- **CORS** - Cross-origin requests

### Raspberry Pi
- **Python 3.8+** - Runtime
- **YOLOv5** - Object detection
- **OpenCV** - Image processing
- **LiDAR SDK** - Depth measurement
- **GPS SDK** - Location capture
- **Requests** - HTTP client

---

## 🚀 Deployment Steps

### 1. Deploy Backend (Render / Railway / Heroku)
```bash
# Select "Deploy from GitHub"
# Set environment variables (MongoDB, Cloudinary, JWT_SECRET)
# Auto-deploy on push to main
```

### 2. Deploy Frontend (Vercel / Netlify)
```bash
# Select "Import from Git"
# Build command: npm run build
# Output: frontend/dist
# Set VITE_API_URL to your backend URL
# Auto-deploy on push to main
```

### 3. Update Configs
```bash
# Backend: Update CORS_ORIGIN to frontend domain
# Frontend: Update VITE_API_URL to backend domain
# Pi: Update BACKEND_URL to backend domain
```

**[See DEPLOYMENT.md for detailed instructions](./DEPLOYMENT.md)**

---

## 📊 Database Schema

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Potholes
```javascript
{
  _id: ObjectId,
  imageUrl: String (Cloudinary URL),
  gpsLat: Number (latitude),
  gpsLon: Number (longitude),
  depthCm: Number (depth in cm),
  address: String (optional),
  timestamp: Date,
  createdBy: ObjectId (ref: User, optional for Pi uploads)
}
```

### Comments
```javascript
{
  _id: ObjectId,
  potholeId: ObjectId (ref: Pothole),
  userId: ObjectId (ref: User),
  text: String,
  createdAt: Date
}
```

---

## 🐛 Troubleshooting

### "Invalid URL" Frontend Error
→ Check `VITE_API_URL` in `frontend/.env`
→ Should be `http://localhost:5000` (local) or `https://your-backend.com` (prod)
→ Restart frontend: `npm run dev`

### CORS Error
→ Backend `CORS_ORIGIN` must include frontend domain
→ Local: `http://localhost:5173,http://localhost:5174`
→ Prod: `https://your-frontend-domain.com`
→ Restart backend after changes

### MongoDB Connection Error
→ Check `MONGO_URI` is valid
→ Add your IP to MongoDB Atlas whitelist
→ Test with `mongosh` CLI

### Port Already in Use
```bash
# Windows
Get-NetTCPConnection -LocalPort 5000 | Stop-Process -Force

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

## ✅ Verification Checklist

- [ ] Frontend builds without errors: `npm run build`
- [ ] Backend starts: `npm run dev` (port 5000)
- [ ] Database connected: See "MongoDB connected" in logs
- [ ] Login works without CORS errors
- [ ] Dashboard loads and fetches potholes
- [ ] Can upload image with location
- [ ] Map shows pothole markers
- [ ] Comments section works
- [ ] GitHub push works
- [ ] Can deploy to Vercel/Render

---

## 📝 Git Workflow

```bash
# 1. Make changes
git add .
git commit -m "feat: describe your changes"

# 2. Push to GitHub
git push origin main

# 3. Vercel/Netlify auto-deploy on push
# Render auto-deploys on push
# Check deployment status in each platform's dashboard
```

---

## 🔐 Security Best Practices

- ✅ Never commit `.env` files (use `.env.example` as template)
- ✅ Use strong `JWT_SECRET` (min 32 chars in production)
- ✅ Hash passwords with bcryptjs (already done)
- ✅ Use HTTP-only cookies for JWT (already configured)
- ✅ Enable HTTPS in production
- ✅ Whitelist IP in MongoDB Atlas
- ✅ Use environment variables for all secrets
- ✅ Rotate secrets periodically

---

## 📈 Performance Optimizations

- **Frontend**
  - TailwindCSS purges unused styles
  - Vite uses esbuild for fast bundling
  - Auto-polling (10s) prevents excessive API calls
  - Images served from Cloudinary CDN

- **Backend**
  - MongoDB indexes on gpsLat, gpsLon, timestamp
  - JWT caching in HTTP-only cookies
  - Image streaming to Cloudinary (no disk storage)
  - CORS headers cached by browsers

- **Database**
  - MongoDB Atlas auto-scaling
  - Connection pooling for efficiency
  - Indexes for fast queries

---

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Local development guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[API Endpoints](#-api-endpoints)** - Full API reference
- **[Environment Variables](#-environment-variables)** - Config reference

---

## 🤝 Contributing

```bash
# 1. Clone repo
git clone https://github.com/Keerthiii21/temp.git

# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Make changes & commit
git add .
git commit -m "feat: describe your changes"

# 4. Push & create PR
git push origin feature/your-feature
```

---

## 📞 Support & Issues

- Check **[QUICKSTART.md](./QUICKSTART.md)** for common issues
- Review **[DEPLOYMENT.md](./DEPLOYMENT.md)** for deployment problems
- Check terminal logs for error messages
- Test endpoints with `curl` or Postman

---

## 🎯 Roadmap

- [ ] Real-time WebSocket updates (instead of polling)
- [ ] Pothole severity ranking (ML-based)
- [ ] Government notifications (email/SMS)
- [ ] Mobile app (React Native)
- [ ] Automated road maintenance scheduling
- [ ] Crowdsourced validation voting
- [ ] Traffic impact analysis

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🌟 Show Your Support

If you find this project helpful, please star ⭐ on GitHub!

---

**Built with ❤️ for safer roads** 🛣️

**Ready to deploy? → [DEPLOYMENT.md](./DEPLOYMENT.md)**
