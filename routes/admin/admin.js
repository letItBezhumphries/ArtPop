//delete
// const express = require("express");
// const router = express.Router();
// require("dotenv").config();
// const path = require("path");
// const crypto = require("crypto");
// const multer = require("multer");
// const mongoose = require("mongoose");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");

// // models
// const Image = require("../.././models/Image");
// const Portfolio = require("../.././models/Portfolio");
// const auth = require("../../middleware/auth");

// // Mongo Uri
// const mongoURI = process.env.MONGODB_URI;

// //create Mongo connection
// const conn = mongoose.createConnection(mongoURI);

// //init gfs
// let gfs;

// conn.once("open", () => {
//   //init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   //this collection() determines the name of the collection
//   gfs.collection("uploads");
// });

// // create storage object
// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buffer) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename =
//           buffer.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           originalname: path.extname(file.originalname),
//           bucketName: "uploads"
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

// const upload = multer({ storage });


// // @route POST /admin/upload/image
// // @desc Uploads image file to db
// router.post("/image", [
//   upload.single('file'),
//   auth
// ], async (req, res) => {
//   try {
//     const { title, description, portfolio, isGallery } = req.body;
//     const image = req.file;
//     if (!image) {
//       console.log('THERE WAS NO IMAGE SELECTED');
//       //error handle and set error message
//     }
//     console.log('file', image);
//     const imageUrl = `http://localhost:3003/admin/upload/image/${image.filename}`;
//     console.log('imageUrl', imageUrl);

//     const newImage = new Image({
//       title: title,
//       fileName: image.filename,
//       imageUrl: imageUrl,
//       description: description,
//       portfolio: portfolio,
//       isGallery: isGallery
//     });
  
//       await newImage
//       .save()
//       .then(response => {
//         res.json({ msg: "success creating a new image", file: req.file, data: response });
//       })
//       .catch(err => {
//         res.json({ msg: "Server error adding new image", errMessage: err.message });
//       });
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

// // @route GET /admin/upload/images
// // @desc Display all files in JSON
// router.get("/images", async (req, res) => {
//   try {
//     const images = await Image.find();
//     console.log('GET images routes/api/admin', typeof images)
//     res.json(images);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }

// });

// // // @route GET /admin/upload/images/:filename
// // // @desc Display single file object in JSON
// // router.get('/images/:filename', (req, res) => {
// //   gfs.files.findOne({
// //     filename: req.params.filename
// //   }, (err, file) => {
// //     //check if file doesn't exist
// //     if (!file || file.length === 0) {
// //       return res.status(404).json({
// //         err: 'No file exists'
// //       });
// //     }
// //     //file exists
// //     return res.json(file);
// //   });
// // });

// // //in order to display the image need to use createReadStream
// // // @route GET admin/upload/images/:filename
// // // @desc Display Image
// router.get("/image/:filename", async (req, res) => {
//   try {
//     await gfs.files.findOne(
//     {
//       filename: req.params.filename
//     },
//     async (err, file) => {
//       if (!file || file.length === 0) {
//         return res.status(404).json({
//           err: "No file exists"
//         });
//       }
//       //check if image
//       if (
//         file.contentType === "image/jpeg" ||
//         file.contentType === "image/png" ||
//         file.contentType === "image/jpg"
//       ) {
//         // read the output to browser
//         const readstream = await gfs.createReadStream(file.filename);
//         readstream.pipe(res);
//       } else {
//         res.status(404).json({
//           err: "Not an image"
//         });
//       }
//     });
//   } catch(err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });



// // @route GET admin/upload/images/gallery
// // @desc creates a Portfolio in db
// router.get("/gallery", async (req, res) => {
//   try {
//     const galleryList = await Image.find({ isGallery: true })
    
//     console.log("List:", galleryList);

//     res.json(galleryList);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });



// // @route POST /upload/portfolio
// // @desc creates a Portfolio collection
// router.post("/portfolio", async (req, res) => {
//   console.log("this is the request", req.body);
//   const { title, description } = req.body;

//   const images = await Image.find({ portfolio: title });

//   console.log(`these are the images for the portfolio: ${title}`, images);

//   const newPortfolio = new Portfolio({
//     title: title,
//     description: description,
//     // images: images
//   });

//   await newPortfolio
//     .save()
//     .then(response => {
//       console.log("this is the new portfolio", response);
//       res.json({ msg: "Successfully created a new portfolio", data: response });
//     })
//     .catch(err => {
//       console.error(err.message);
//       res.status(500).send("Server error");
//     });
// });


// // @route GET admin/upload/images/:portfolio
// // @desc loads a Portfolio of images
// router.get('/images/:portfolio', async (req, res) => {
//   try {
//     const portfolio = await Images.find({ portfolio: req.params.portfolio })
//     console.log('portfolio', portfolio);
//     res.json(portfolio);

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// })

// // @route PUT admin/update/images/:filename
// // @desc updates an Image by filename
// router.put('/:filename', async (req, res) => {
//   // try {
    
//   // } catch (err) {
    
//   // }
// }); 


// // @route PUT admin/update/images/gallery
// // @desc updates an Image by filename
// router.put('/gallery', async (req, res) => {
//   // try {
    
//   // } catch (err) {
    
//   // }
// }); 

// // @route PUT admin/update/images/:filename
// // @desc updates an Image by filename
// router.put('/', async (req, res) => {
//   // try {
    
//   // } catch (err) {
    
//   // }
// }); 




// module.exports = router;
