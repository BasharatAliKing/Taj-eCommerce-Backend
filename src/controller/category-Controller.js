const Category=require("../models/category-model");

// add category
const addCategory=async(req,res)=>{
    try {
        const {categoryname,categorydetails}=req.body;
        if(!categoryname){
            return res.status(400).json({message:"Category name is required"});
        }
        // check category already exists
        const existingCategory=await
            Category.findOne({categoryname:categoryname.toLowerCase()});
        if(existingCategory){
            return res.status(400).json({message:"Category already exists"});
        }
        const category=new Category({categoryname:categoryname.toLowerCase() , categorydetails});
        await category.save();
        res.status(201).json({message:"Category added successfully",category});
    } catch (error) {
        console.error("Error in addCategory:", error);
        res.status(500).json({message:"Internal server error"});
    }
};
// get all category
const getAllCategory=async(req,res)=>{
    try {
        const categories=await Category.find({});
        res.status(200).json({categories});
    } catch (error) {
        console.error("Error in getAllCategory:", error);
        res.status(500).json({message:"Internal server error"});
    }
};
// get single category by id
const getCategoryById=async(req,res)=>{
    try {
        const {id}=req.params;
        const category=await Category
            .findById(id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }
        res.status(200).json({category});
    } catch (error) {
        console.error("Error in getCategoryById:", error);
        res.status(500).json({message:"Internal server error"});
    }
};
const deleteCategoryById=async(req,res)=>{
    try{
        const {id}=req.params;
        const category=await Category.findByIdAndDelete(id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }
        res.status(200).json({message:"Category deleted successfully",category});
    }catch(err){
        res.status(400).json({message:"Error"+err});
    }
}
const updateCategoryById=async(req,res)=>{
    try{
         const {id}=req.params;
         const {categoryname,categorydetails}=req.body;
         const category=await Category.findByIdAndUpdate(id,
            {categoryname,categorydetails},{new:true});
            if(!category){
                return res.status(404).json({message:"Category not found"});
            }
            res.status(200).json({message:"Category updated successfully",category});

    }catch(err){
        res.status(400).json({message:"Error"+err});
    }
}

module.exports={addCategory,getAllCategory,getCategoryById,deleteCategoryById,updateCategoryById};