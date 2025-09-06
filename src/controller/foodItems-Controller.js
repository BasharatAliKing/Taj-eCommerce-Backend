const FoodItem = require("../models/foodItems-model");
const fs = require("fs");
const path = require("path");
//************************************************ */
//    ADD FOOD ITEM
//************************************************ */
const addFoodItem = async (req, res) => {
  try {
    const { name, category, price, description, available , suggestions} = req.body;
    // multer saves file in req.file
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const foodItemCreated = await FoodItem.create({
      name,
      category,
      price,
      description,
      imageUrl,
      available,
      suggestions,
    });
    res.status(201).json({ message: foodItemCreated });
  } catch (err) {
    res.status(400).json({ message: "Error " + err });
  }
};
//************************************************ */
//    GET FOOD ITEMS ALL
//************************************************ */
const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.status(200).json({ message: foodItems });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
//************************************************ */
//    ADD FOOD ITEM BY ID
//************************************************ */
const getFoodItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const foodItem = await FoodItem.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json({ foodItem });
  } catch (error) {
    console.error("Error in getFoodItemById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//************************************************ */
//    DELETE FOOD ITEM
//************************************************ */
const deleteFoodItemById = async (req, res) => {
  try {
    const product = await FoodItem.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Delete image from public/images
    const imagePath = path.join(
      __dirname,
      "../../",
      "public",
      product.imageUrl
    );
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Failed to delete old image:", err);
      } else {
        console.log("Old image deleted successfully");
      }
    });
    // Delete product from DB
    await FoodItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product and image deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
};
//************************************************ */
//    UPDATE FOOD ITEM
//************************************************ */
const updateFoodItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, available , suggestions } = req.body;
    // Find existing food item
    const existingItem = await FoodItem.findById(id);
    if (!existingItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    let imageUrl = existingItem.imageUrl; // keep old image by default
    // If a new image is uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      // Delete old image if exists
      if (existingItem.imageUrl) {
        const oldImagePath = path.join(
          __dirname,
          "../../",
          "public",
          existingItem.imageUrl
        );

        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
          } else {
            console.log("Old image deleted successfully");
          }
        });
      }
    }

    // Update DB
    const updatedItem = await FoodItem.findByIdAndUpdate(
      id,
      { name, category, price, description, imageUrl, available, suggestions },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Food item updated successfully", updatedItem });
  } catch (error) {
    console.error("Error in updateFoodItemById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//****************************************************** */
// Get random menu items
//****************************************************** */
const getRandomMenu = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // how many random items
    const randomItems = await FoodItem.aggregate([
      { $sample: { size: limit } },
    ]);
    res.status(200).json(randomItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching random items", error });
  }
};

module.exports = {
  addFoodItem,
  getAllFoodItems,
  getFoodItemById,
  deleteFoodItemById,
  updateFoodItemById,
  getRandomMenu,
};
