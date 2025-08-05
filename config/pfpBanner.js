const multer = require('multer');
const path = require('path');
const { v4:uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

      console.log(file.fieldname)

      if (file.fieldname === 'pfp') { 
        cb(null, './public/profilePictures')
      } 
      else if (file.fieldname === 'banner') {
        cb(null, './public/banners')
      }

    },
    filename: (req, file, cb) => {
        cb(null,  uuidv4() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage});

module.exports = upload;