const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../models/db');

homeController = require('../controllers/homeController');

router.get('/', homeController.getHomePage);

router.get('/home/:subsection/:direction/:index', homeController.forwardPopularVideos)
module.exports = router