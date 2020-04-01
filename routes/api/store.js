const express = require('express');
const router = express.Router();
require("dotenv").config();
// const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

// models
const Image = require("../../models/Image");
const Portfolio = require("../../models/Portfolio");

//Mongo Uri
const mongoURI = process.env.MONGODB_URI;

//create Mongo connection
const conn = mongoose.createConnection(mongoURI);

//init gfs
let gfs;

conn.once("open", () => {
  //init stream
  gfs = Grid(conn.db, mongoose.mongo);
  //this collection() determines the name of the collection
  gfs.collection("uploads");
});

// create storage object
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buffer) => {
        if (err) {
          return reject(err);
        }
        const filename =
          buffer.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          originalname: path.extname(file.originalname),
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });



// @route GET api/images/gallery
// @desc get all Images for image carousel and landing
// @access Public
router.get("/gallery", async (req, res) => {
  try {
    const galleryList = await Image.find({ isGallery: true })
    // console.log("List of Gallery images:", galleryList);

    res.status(200).json(galleryList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// @route GET api/images/portfolios/:title
// @desc get a portfolio by title
// @access Public
router.get('/portfolios/:title', async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ title: req.params.title }).select('-description');
    // console.log('portfolio', portfolio);
    res.status(200).json(portfolio);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// @route GET api/images/portfolios
// @desc get all portfolios
// @access Public
router.get('/portfolios', async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.status(200).json(portfolios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
})

// @route GET api/images/image/:filename
// @desc Display Image
// @access Private admin 
router.get("/image/:filename", async (req, res) => {
  try {
    await gfs.files.findOne(
    {
      filename: req.params.filename
    },
    async (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists"
        });
      }
      //check if image
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png" ||
        file.contentType === "image/jpg"
      ) {
        // read the output to browser
        const readstream = await gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: "Not an image"
        });
      }
    });
  } catch(err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});



// @route GET /api/images/shop
// @desc get json data for all images available
// @access Public
router.get("/shop", async (req, res) => {
  try {
    const images = await Image.find();
    // console.log("shop getImages", images);
    res.status(200).json(images);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



// @route GET /api/images/shop/artwork/:id
// @desc gets json data for single image by id
// @access public
router.get("/shop/artwork/:id", async (req, res) => {
  try {
    const selectedImage = await Image.findOne({ _id: req.params.id }).select('-isGallery');

    console.log('selected image', 'getSelectedImage is being hit', selectedImage);
    res.status(200).json(selectedImage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// @route GET /api/images/shop/artwork/:?title   ??? forget what to put here for a search term
// @desc gets single image data by search title
// @access public
router.get("/shop/artwork/s/:title", async (req, res) => {
  try {
    const searchedImage = await Image.findOne({ title: req.params.title }).select('-isGallery');

    console.log("shop search results image", searchedImage);
    res.status(200).json(searchedImage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



// @route GET /api/images/shop/artwork/s/:portfolio
// @desc gets all images/artwork from search by portfolio title received in param
// @access public
router.get("/shop/artwork/s/:portfolio", async (req, res) => {
  try {
    console.log('inside routes/api/store.js, params:', req.params.portfolio);
    const images = await Image.find({ portfolio: req.params.portfolio });

    console.log('shop selected image', images);
    res.status(200).json(images);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// @route GET /api/images/shop/artwork/:type eg photograph, painting, montage, aerial
// @desc gets all images/artwork from search by the medium type
// @access public
// router.get("/shop/artwork/s/:type", async (req, res) => {
//   try {
//     const selectedType = await Image.find({ medium: req.params.type });

//     console.log("shop selected image", selectedType);
//     res.status(200).json(selectedType);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });


// @route GET /api/images/shop/artwork/:price  set up for a range search
// @desc gets all images/artwork from search by price range
// @access public
router.get("/shop/artwork/s/:price", async (req, res) => {
  try {
    const selectedPrice = await Image.find({ price: req.params.price });

    console.log("shop selected image", selectedPrice);
    res.status(200).json(selectedPrice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;