const express=require("express");
const router=express.Router();
const foodItems=require("../controller/foodItems-Controller");
const multer = require("multer");
const path = require("path");
// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // save in public/uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }, 
}); 

// upload middleware
const upload = multer({ storage });

router.route("/addfooditem").post( upload.single("imageUrl"),foodItems.addFoodItem);
router.route("/getallfooditems").get(foodItems.getAllFoodItems);
router.route("/getfooditembyid/:id").get(foodItems.getFoodItemById);
router.route('/deletefooditem/:id').delete(foodItems.deleteFoodItemById);
router.route('/updatefooditem/:id').put(upload.single("imageUrl"),foodItems.updateFoodItemById);
router.route('/foods-items-random').get(foodItems.getRandomMenu);

module.exports=router;