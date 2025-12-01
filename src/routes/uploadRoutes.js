const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImage } = require('../controllers/uploadController');

router.post('/image', upload.single('image'), uploadImage);

module.exports = router;
