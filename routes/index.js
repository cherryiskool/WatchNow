const express = require('express');
const router = express.Router();

homeController = require('../controllers/homeController');

router.get('/', homeController.getHomePage);

router.get('/home/:subsection/:direction/:index', homeController.forwardPopularVideos)
module.exports = router