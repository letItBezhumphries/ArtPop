const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const { check, validationResult } = require("express-validator");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const auth = require("../../middleware/auth");

// models
const Image = require("../.././models/Image");
const Portfolio = require("../.././models/Portfolio");

// Mongo Uri
const mongoURI = keys.mongoURI;

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
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

// @route POST /admin/upload/artwork
// @desc creates a new Image instance to store a single artwork details and info
router.post("/image", [upload.single("file"), auth], async (req, res) => {
  console.log("in upload req handler req.file:", req.file);

  const image = req.file;

  if (!image) {
    console.log("THERE WAS NO IMAGE SELECTED");
    //error handle and set error message
  }

  const imageUrl = `${keys.apiUrl}/images/image/${image.filename}`;

  const newImage = new Image({
    fileName: image.filename,
    imageUrl: imageUrl,
    inStock: true,
  });

  await newImage
    .save()
    .then((response) => {
      // console.log("in addImage handler: response:", response);
      res.json({
        msg: "Success Creating a New Image",
        file: req.file,
        data: response,
      });
    })
    .catch((err) => {
      res.json({
        msg: "Server error adding new image",
        errMessage: err.message,
      });
    });
});

// @route POST /admin/upload/artwork
// @desc Creates/Updates a new Image instance
// @access Admin
router.post("/artwork", auth, async (req, res) => {
  try {
    console.log("inside req handler for new Artwork => req.body:", req.body);

    const {
      title,
      height,
      width,
      year,
      price,
      medium,
      materials,
      description,
      portfolio,
      _id,
      filename,
      imageUrl,
      inStock,
      isGallery,
    } = req.body;

    let updatedImage = {};
    if (title) updatedImage.title = title;
    if (height) updatedImage.height = parseInt(height);
    if (width) updatedImage.width = parseInt(width);
    if (year) updatedImage.year = parseInt(year);
    if (price) updatedImage.price = parseInt(price);
    if (medium) updatedImage.medium = medium;
    if (materials) updatedImage.materials = materials;
    if (portfolio) updatedImage.portfolio = portfolio;
    if (description) updatedImage.description = description;
    if (isGallery) updatedImage.isGallery = isGallery;
    updatedImage.user = req.user.id;

    let image = await Image.findOneAndUpdate(
      { _id: _id },
      { $set: updatedImage },
      { new: true, upsert: true }
    );

    console.log("new Image created", image);
    res.status(201).json(image);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// // @route GET /admin/upload/images/:filename
// // @desc Display single file object in JSON
// router.get('/images/:filename', (req, res) => {
//   gfs.files.findOne({
//     filename: req.params.filename
//   }, (err, file) => {
//     //check if file doesn't exist
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }
//     //file exists
//     return res.json(file);
//   });
// });

// @route POST /upload/portfolio
// @desc creates a Portfolio collection
router.post("/portfolio", auth, async (req, res) => {
  // console.log("this is the request", req.body);
  const { title, description } = req.body;

  const images = await Image.find({ portfolio: title });

  const newPortfolio = new Portfolio({
    title: title,
    description: description,
    images: images,
  });

  await newPortfolio
    .save()
    .then((response) => {
      res
        .status(201)
        .json({ msg: "Successfully created a new portfolio", data: response });
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send("Server error");
    });
});

// @route PUT admin/upload/image/:filename
// @desc updates an Image by filename
router.put("/image/:filename", auth, async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      fileName,
      description,
      portfolio,
      isGallery,
    } = req.body;

    await Image.findOne({ fileName: req.params.filename })
      .then((image) => {
        image.title = title;
        image.imageUrl = imageUrl;
        image.fileName = fileName;
        image.description = description;
        image.portfolio = portfolio;
        image.isGallery = isGallery;
        return image.save();
      })
      .then((result) => {
        res.status(202).json({
          msg: "You have successfully updated your image!",
          image: result,
        });
      })
      .catch((error) => console.log(error));
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route PUT admin/upload/portfolio/:title
// @desc updates details for a Portfolio
router.put("/portfolio/:title", auth, async (req, res) => {
  const { description } = req.body;

  try {
    await Portfolio.findOne({ title: req.params.title })
      .then((updatedProfile) => {
        updatedProfile.description = description;
        return updatedProfile.save();
      })
      .then((result) => {
        res.status(202).json({
          msg: "You successfully updated the portfolio",
          portfolio: result,
        });
      })
      .catch((error) => console.log(error));
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route DELETE admin/upload/image/:filename
// @desc deletes an Image by filename
router.delete("/image/:filename", auth, async (req, res) => {
  try {
    const image = await Image.find({ fileName: req.params.filename });
    const id = image._id;

    await Image.findByIdAndRemove(id);

    await gfs.remove({ _id: id, root: "uploads" }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      } else {
        res.status(204).json({
          msg: "You successfully removed that image!",
          deleted: image,
        });
      }
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route DELETE admin/upload/portfolio/:title
// @desc deletes a Portfolio
router.delete("/portfolio/:title", auth, async (req, res) => {
  try {
    const deletedPortfolio = await Portfolio.find({ title: req.params.title });
    const id = deletedPortfolio._id;

    await Portfolio.findByIdAndRemove(id);

    res.status(204).json({
      msg: "You successfully removed the portfolio",
      portfolio: deletedPortfolio,
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
