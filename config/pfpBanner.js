const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

      console.log(file.fieldname)

      if (file.fieldname === 'pfp') { 
        console.log('suo')
        cb(null, './public/profilePictures')
      } 
      else if (file.fieldname === 'banner') {
        cb(null, './public/banners')
      }

    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage});

module.exports = upload;