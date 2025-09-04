const mongoose=require("mongoose");

// schema here
const categoryScheam=new mongoose.Schema({
    categoryname:{
        type:String,
        required:true,
        unique:true
    },
    categorydetails:{
        type:String,
    }
});
// model here
const Category=mongoose.model("Category",categoryScheam);

module.exports=Category;