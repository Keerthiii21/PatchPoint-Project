const cloudinary = require('../config/cloudinary');

exports.uploadImage = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const streamifier = require('streamifier');
    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'patchpoint' }, (error, result) => {
      if (error) return res.status(500).json({ message: 'Upload failed', error });
      res.json({ url: result.secure_url });
    });
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
