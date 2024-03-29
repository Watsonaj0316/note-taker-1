const express = require('express');
const router = express.Router();
const path = require('path');

// Define route handlers
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'home.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'about.html'));
});

module.exports = router;
