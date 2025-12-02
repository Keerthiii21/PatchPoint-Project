const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

const corsOriginStr = process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174';
const corsOrigins = corsOriginStr.split(',').map(o => o.trim());
console.log('CORS origins:', corsOrigins);

app.use(cors({ origin: corsOrigins, credentials: true }));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/potholes', require('./src/routes/potholeRoutes'));
// Pi upload route (handles /api/potholes/pi-upload)
app.use('/api/potholes', require('./src/routes/piUploadRoute'));
app.use('/api/comments', require('./src/routes/commentRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));

app.get('/', (req, res) => res.send({ ok: true, message: 'PATCHPOINT API' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
