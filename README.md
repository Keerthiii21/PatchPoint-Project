# PATCHPOINT - Backend

Run backend:

1. copy `.env.example` to `.env` and fill values
2. npm install
3. npm run dev

API endpoints:

- `POST /api/auth/signup` - signup
- `POST /api/auth/login` - login
- `POST /api/auth/logout` - logout
- `GET /api/auth/me` - current user
- `POST /api/upload/image` - image upload to Cloudinary
- `GET /api/potholes` - list potholes
- `POST /api/potholes` - create pothole (auth)
- `POST /api/potholes/pi` - Pi-specific endpoint
- `GET /api/comments/:potholeId` - get comments
- `POST /api/comments` - add comment (auth)
