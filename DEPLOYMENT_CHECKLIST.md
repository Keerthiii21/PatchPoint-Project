# Deployment Checklist (Render)

Use this checklist when deploying PatchPoint to Render (or a similar PaaS). It covers both backend and frontend.

## Backend (Web Service)
- Create a new Web Service on Render and connect your GitHub repo.
- Build command: `npm install`
- Start command: `npm run start` (or `node server.js` if configured)
- Instance: choose a plan (free may sleep on inactivity)

### Environment variables (set these in Render dashboard):
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - secure random secret
- `CORS_ORIGIN` - comma-separated allowed origins (e.g. `https://your-frontend.onrender.com`)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PORT` - not strictly necessary on Render (Render sets it), but can be set to `5000` for parity

### Other backend notes:
- Ensure `backend/public` is served by Express (static middleware is present in `server.js`).
- Verify health by visiting `https://<your-backend>.onrender.com/` and `https://<your-backend>.onrender.com/api/potholes`.

## Frontend (Static Site or Web Service)
- Option A (Static Site): Build and deploy `frontend/dist` as a static site.
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
- Option B (Web Service): Deploy as a web service that runs a server to serve `dist`.

### Environment variables (frontend site settings):
- `VITE_API_URL` - set to your backend URL (e.g. `https://<your-backend>.onrender.com`)

## Post-deploy verification
- Check the frontend loads and makes API calls to `VITE_API_URL`.
- Open browser DevTools → Network to confirm requests to `https://<your-backend>.onrender.com/api/*`.
- Verify authentication flows work (login/signup) and cookies are being set (if using cookies for JWT).
- Verify image uploads (Cloudinary) function correctly via the UI or `POST /api/upload/image`.

## Security & Maintenance
- Rotate any keys accidentally committed to GitHub immediately.
- Use Render secrets for environment variables — do not commit `.env` files.
- Enable HTTPS (Render provides it by default) and set proper CORS origins.

---

If you'd like, I can produce a Render-specific step-by-step guide with screenshots and exact Render settings. Want me to generate that next?
# 🚀 PatchPoint Deployment Checklist

## ✅ Pre-Deployment (Local Testing)

- [x] Frontend builds without errors: `npm run build` ✨
- [x] Backend starts successfully: `npm run dev` ✨
- [x] MongoDB connection works ✨
- [x] Login/Signup functionality tested ✨
- [x] Dashboard loads & fetches potholes ✨
- [x] Map displays with markers ✨
- [x] File upload works ✨
- [x] Comments section functional ✨
- [x] Pi upload endpoint ready ✨
- [x] All code committed to GitHub ✨

---

## 🔄 Frontend Deployment (Choose One)

### **Option A: Vercel (Easiest for Frontend)**

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Import Project"
- [ ] Select GitHub repo: `Keerthiii21/temp`
- [ ] Set Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Set Environment Variable:
  ```
  VITE_API_URL=https://your-backend-url.com
  ```
- [ ] Click Deploy
- [ ] ✅ Frontend deployed at `*.vercel.app`

### **Option B: Netlify**

- [ ] Go to [netlify.com](https://netlify.com)
- [ ] Click "New site from Git"
- [ ] Select repo: `Keerthiii21/temp`
- [ ] Build Command: `cd frontend && npm run build`
- [ ] Publish Directory: `frontend/dist`
- [ ] Set Environment Variable:
  ```
  VITE_API_URL=https://your-backend-url.com
  ```
- [ ] Click Deploy
- [ ] ✅ Frontend deployed at `*.netlify.app`

### **Option C: Render (Both Frontend & Backend on Render)**

- [ ] Go to [render.com](https://render.com)
- [ ] Click "New +" → "Static Site"
- [ ] Connect GitHub Repository
- [ ] Select repo: `Keerthiii21/temp`
- [ ] Name: `patchpoint-frontend`
- [ ] Build Command: `cd frontend && npm run build`
- [ ] Publish Directory: `frontend/dist`
- [ ] Set Environment Variable:
  ```
  VITE_API_URL=https://your-backend-render-url.com
  ```
- [ ] Click Deploy
- [ ] ✅ Frontend deployed at `*.render.com`

### **After Frontend Deploy:**

- [ ] Note your frontend URL (e.g., `https://patchpoint.vercel.app`, `https://patchpoint.netlify.app`, or `https://patchpoint-frontend.render.com`)
- [ ] Update backend `CORS_ORIGIN` to include this URL
- [ ] Restart backend with new CORS setting

---

## 🗄️ Backend Deployment (Choose One)

### **Option A: Render (Easiest)**

- [ ] Go to [render.com](https://render.com)
- [ ] Create Account & Verify Email
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub Repository
- [ ] Select repo: `Keerthiii21/temp`
- [ ] Name: `patchpoint-backend`
- [ ] Runtime: `Node`
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Set Environment Variables:
  ```
  PORT=5000
  MONGO_URI=<your_mongodb_uri>
  JWT_SECRET=<your_jwt_secret>
  CORS_ORIGIN=https://your-frontend-domain.com
  CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
  CLOUDINARY_API_KEY=<your_cloudinary_key>
  CLOUDINARY_API_SECRET=<your_cloudinary_secret>
  ```
- [ ] Click Deploy
- [ ] ✅ Backend deployed at `*.render.com`

### **Option B: Railway**

- [ ] Go to [railway.app](https://railway.app)
- [ ] Create Account
- [ ] New Project → Deploy from GitHub
- [ ] Select repo: `Keerthiii21/temp`
- [ ] Add Variables (same as Render above)
- [ ] Set Root Directory: `backend`
- [ ] ✅ Backend deployed

### **Option C: Heroku**

- [ ] Go to [heroku.com](https://heroku.com)
- [ ] Create Account
- [ ] New App → `patchpoint-backend`
- [ ] Connect GitHub
- [ ] Select repo & enable auto-deploy
- [ ] Go to Settings → Config Vars (add same env vars as Render)
- [ ] Deploy
- [ ] ✅ Backend deployed at `*.herokuapp.com`

### **After Backend Deploy:**

- [ ] Note your backend URL (e.g., `https://patchpoint-backend.render.com`)
- [ ] Update frontend `VITE_API_URL` to this URL
- [ ] Trigger frontend re-deploy (push to main or manual redeploy)

---

## 🗄️ Database Setup

- [ ] Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- [ ] Create Free Tier Cluster
- [ ] Create Database User with strong password
- [ ] Whitelist your backend IP (or 0.0.0.0 for Render/Heroku)
- [ ] Get Connection String: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
- [ ] Add to backend environment variables as `MONGO_URI`
- [ ] ✅ Database accessible from backend

---

## ☁️ Image Storage Setup

- [ ] Go to [cloudinary.com](https://cloudinary.com)
- [ ] Create Free Account
- [ ] Get your Cloud Name from dashboard
- [ ] Go to Settings → API Keys
- [ ] Copy API Key and API Secret
- [ ] Add to backend environment variables:
  ```
  CLOUDINARY_CLOUD_NAME=<your_cloud_name>
  CLOUDINARY_API_KEY=<your_api_key>
  CLOUDINARY_API_SECRET=<your_api_secret>
  ```
- [ ] ✅ Image uploads working

---

## 🧪 Post-Deployment Testing

### Test Frontend

- [ ] Frontend loads: `https://your-frontend-domain.com` ✅
- [ ] Login page appears (no CORS errors) ✅
- [ ] Can sign up new account ✅
- [ ] Can login with account ✅
- [ ] Dashboard loads & shows stats ✅
- [ ] Map displays potholes ✅
- [ ] Can upload image ✅

### Test Backend API

```bash
# Get all potholes
curl https://your-backend-url.com/api/potholes

# Test signup
curl -X POST https://your-backend-url.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Test login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### Test Pi Upload

```bash
curl -X POST https://your-backend-url.com/api/potholes/pi-upload \
  -F "image=@/path/to/image.jpg" \
  -F "lat=37.7749" \
  -F "lon=-122.4194" \
  -F "depth=8.5" \
  -F "timestamp=$(date +%s)000"
```

---

## 📱 Raspberry Pi Deployment

- [ ] Update `FINAL_INTEGRATION_STORED_VIDEO.py`:
  ```python
  BACKEND_URL = "https://your-backend-url.com/api/potholes/pi-upload"
  ```
- [ ] Install Python dependencies:
  ```bash
  pip3 install requests
  ```
- [ ] Test upload:
  ```bash
  python3 FINAL_INTEGRATION_STORED_VIDEO.py
  ```
- [ ] Integrate into detection pipeline:
  ```python
  from FINAL_INTEGRATION_STORED_VIDEO import send_to_backend
  send_to_backend(image_path, lat, lon, depth_cm, timestamp_ms)
  ```
- [ ] ✅ Pi auto-uploading to backend

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files (check `.gitignore`)
- [ ] Use strong `JWT_SECRET` (min 32 chars in production)
- [ ] Cloudinary credentials are secret (not in code)
- [ ] MongoDB whitelist includes backend IP only
- [ ] Frontend `VITE_API_URL` uses HTTPS in production
- [ ] Backend `CORS_ORIGIN` restricted to frontend domain
- [ ] All environment variables set in deployment platform
- [ ] No sensitive data in GitHub commits

---

## 🎯 Verification Links

After deployment, check these:

- [ ] Frontend: `https://your-frontend-domain.com`
- [ ] Backend API: `https://your-backend-url.com/` (should return JSON)
- [ ] API Docs: `https://your-backend-url.com/api/potholes` (should list potholes)
- [ ] GitHub: `https://github.com/Keerthiii21/temp` (all commits visible)

---

## 🚨 If Something Goes Wrong

### CORS Error in Frontend

- [ ] Check backend `CORS_ORIGIN` includes frontend URL
- [ ] Restart backend deployment (redeploy)
- [ ] Clear browser cache (Ctrl+Shift+Delete)

### "Cannot POST" Error

- [ ] Verify backend is running
- [ ] Check API URL is correct in frontend `.env`
- [ ] Verify frontend has been redeployed after env change

### MongoDB Connection Error

- [ ] Check `MONGO_URI` is correct
- [ ] Whitelist backend IP in MongoDB Atlas
- [ ] Verify network access is enabled

### Image Upload Fails

- [ ] Check Cloudinary credentials are correct
- [ ] Verify Cloudinary folder `patchpoint/pi` exists
- [ ] Check storage quota (free tier has limits)

---

## 📊 Monitoring Checklist

### After 24 Hours of Production:

- [ ] Check Render/Railway/Heroku dashboard for errors
- [ ] Monitor MongoDB Atlas for storage usage
- [ ] Check Cloudinary for image uploads
- [ ] Verify frontend page loads are fast (<3s)
- [ ] Check GitHub Actions if any CI/CD configured

### Weekly Maintenance:

- [ ] Review error logs in deployment platform
- [ ] Check database growth in MongoDB
- [ ] Verify all API endpoints are responsive
- [ ] Test Pi uploads are working
- [ ] Update frontend cache (CDN invalidation if needed)

---

## ✨ Deployment Complete!

Once all checkboxes are ✅, your PatchPoint system is production-ready:

```
🌐 Frontend  → vercel.app or netlify.app
📡 Backend   → render.com or railway.app
🗄️  Database  → MongoDB Atlas
☁️  Images    → Cloudinary
📱 Pi        → Running and uploading
🔒 Secure    → All secrets protected
```

**Congratulations! PatchPoint is live! 🎉**

---

## 🔗 Quick Links

- GitHub Repo: https://github.com/Keerthiii21/temp
- QUICKSTART.md: Local development guide
- DEPLOYMENT.md: Detailed deployment steps
- README.md: Full project documentation

**Next: Monitor your application and celebrate! 🚀**
