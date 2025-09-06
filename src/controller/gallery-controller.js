const fs = require("fs");
const path = require("path");
const Gallery = require("../models/gallery-model");

// Add new image
const addImage = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) return res.status(400).json({ message: "Image required" });

    const newImage = await Gallery.create({ name, image });
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all images
const getImages = async (req, res) => {
  try {
    const images = await Gallery.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Update image
const updateImage = async (req, res) => {
  try {
   const { name } = req.body;
    // Find existing food item
    const existingItem = await Gallery.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({ message: "Image not found" });
    } 
    let imageUrl = existingItem.image; // keep old image by default
    // If a new image is uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      // Delete old image if exists
      if (existingItem.image) {
        const oldImagePath = path.join(
          __dirname,
          "../../",
          "public",
          existingItem.image
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
    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      { name,image:imageUrl },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Image updated successfully", updatedItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const galleryimage = await Gallery.findById(req.params.id);
    if (!galleryimage) {
      return res.status(404).json({ message: "Image not found" });
    }
    console.log(galleryimage);
    // Delete image from public/images
    const imagePath = path.join(
      __dirname,
      "../../",
      "public",
      galleryimage.image
    );
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Failed to delete old image:", err);
      } else {
        console.log("Old image deleted successfully");
      }
    });
    // Delete product from DB
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// get Image thourgh id get Single
const getImageById = async (req, res) => {
  try {
    const { id } = req.params; // ✅ fix: no `.id` after req.params
    const getImage = await Gallery.findById(id);
    if (!getImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json(getImage); // return the document directly
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  addImage,
  getImages,
  updateImage,
  deleteImage,
  getImageById,
};
