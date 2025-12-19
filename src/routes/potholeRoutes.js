const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createPothole, listPotholes, createFromPi, getPothole } = require('../controllers/potholeController');

router.get('/', listPotholes);
router.post('/', auth, createPothole);
router.post('/pi', createFromPi);
router.get('/:id', getPothole);

module.exports = router;
