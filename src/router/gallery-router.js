const express = require("express");
const multer = require("multer");
const galleryController=require("../controller/gallery-controller");
const router = express.Router();
const path=require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // save in public/uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }, 
}); 
// upload middleware
const upload = multer({ storage })
// Routes

router.route('/addImageGallery').post(upload.single("image"),galleryController.addImage);
router.route('/getGalleryImages').get(galleryController.getImages);
router.route('/updateGalleryImage/:id').put(upload.single('image'),galleryController.updateImage);
router.route('/deleteGalleryImage/:id').delete(galleryController.deleteImage)
router.route('/getgalleryimagebyid/:id').get(galleryController.getImageById);
module.exports = router;
