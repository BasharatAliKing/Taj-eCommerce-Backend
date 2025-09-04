const express=require("express");
const router=express.Router();
const CategoryController=require("../controller/category-Controller");
const authMiddleware=require("../middleware/auth-middleware")
router.route("/addcategory").post(CategoryController.addCategory);
router.route("/getallcategory").get(CategoryController.getAllCategory);
router.route("/getcategorybyid/:id").get(CategoryController.getCategoryById);
router.route('/deletecategory/:id').delete(CategoryController.deleteCategoryById);
router.route('/updatecategory/:id').put(CategoryController.updateCategoryById);
module.exports=router;