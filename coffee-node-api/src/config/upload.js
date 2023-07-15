const multer = require("multer")
const imagePath = "C:/xampp/htdocs/coffee-management-system/image"
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, imagePath) 
   },
   filename: function (req, file, cb) {
     cb(null, Date.now() + '-' + file.originalname)
   }
 });
 const upload = multer({storage : storage})

 module.exports = upload