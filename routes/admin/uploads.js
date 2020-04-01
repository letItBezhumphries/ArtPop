const express = require("express");
const router = express.Router();
require("dotenv").config();
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

// models
const Image = require("../.././models/Image");
const Portfolio = require("../.././models/Portfolio");
const auth = require("../../middleware/auth");

// Mongo Uri
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

// @route POST /admin/upload/image
// @desc Uploads image file to db
router.post("/image", [upload.single("file"), auth], async (req, res) => {
  try {
    const { title, description, portfolio, isGallery } = req.body;
    const image = req.file;
    if (!image) {
      console.log("THERE WAS NO IMAGE SELECTED");
      //error handle and set error message
    }
    console.log("file", image);
    const imageUrl = `http://localhost:3003/api/images/image/${image.filename}`;

    const newImage = new Image({
      title: title,
      fileName: image.filename,
      imageUrl: imageUrl,
      description: description,
      portfolio: portfolio,
      isGallery: isGallery
    });

    await newImage
      .save()
      .then(response => {
        res.json({
          msg: "success creating a new image",
          file: req.file,
          data: response
        });
      })
      .catch(err => {
        res.json({
          msg: "Server error adding new image",
          errMessage: err.message
        });
      });
  } catch (err) {
    res.status(500).send("Server error");
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
  console.log("this is the request", req.body);
  const { title, description } = req.body;

  const images = await Image.find({ portfolio: title });

  console.log(`these are the images for the portfolio: ${title}`, images);

  const newPortfolio = new Portfolio({
    title: title,
    description: description,
    images: images
  });

  await newPortfolio
    .save()
    .then(response => {
      console.log("this is the new portfolio", response);
      res.status(201).json({ msg: "Successfully created a new portfolio", data: response });
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send("Server error");
    });
});



// @route PUT admin/upload/image/:filename
// @desc updates an Image by filename
router.put("/image/:filename", auth, async (req, res) => {
  try {
    const { title, imageUrl, fileName, description, portfolio, isGallery } = req.body;

    await Image.findOne({ fileName: req.params.filename })
      .then(image => {
        image.title = title;
        image.imageUrl = imageUrl;
        image.fileName = fileName;
        image.description = description;
        image.portfolio = portfolio;
        image.isGallery = isGallery;
        return image.save();
      })
      .then(result => {
        res.status(202).json({ msg: 'You have successfully updated your image!', image: result });
      })
      .catch(error => console.log(error))
    
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
      .then(updatedProfile => {
        updatedProfile.description = description;
        return updatedProfile.save();
      })
      .then(result => {
        res.status(202).json({
          msg: 'You successfully updated the portfolio',
          portfolio: result
        });
      })
      .catch(error => console.log(error))
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

    await gfs.remove({ _id: id, root: "uploads"}, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      } else {
        res.status(204).json({ msg: 'You successfully removed that image!', deleted: image });
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

    res.status(204).json({ msg: 'You successfully removed the portfolio', portfolio: deletedPortfolio });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
