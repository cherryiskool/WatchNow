const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/videos')
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})

const upload = multer({storage: videoStorage});

module.exports = upload;