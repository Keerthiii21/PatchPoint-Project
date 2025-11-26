const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createComment, listComments } = require('../controllers/commentController');

router.post('/', auth, createComment);
router.get('/:potholeId', listComments);

module.exports = router;
