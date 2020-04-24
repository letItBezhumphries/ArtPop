const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//models
const Exhibition = require("../../models/Exhibition");
const auth = require("../../middleware/auth");

// @route = POST admin/exhibitions/new
// @desc creates a new Exhibition to showcase
// @access Private / Admin
router.post("/new", auth, async (req, res) => {
  try {
    console.log("admin/exhibitions/new req.body:", req.body);

    const {
      title,
      subTitle,
      image,
      user,
      location,
      startDate,
      endDate,
    } = req.body;

    let imageUrl = `${keys.apiUrl}/images/image/${image}`;

    console.log(
      "admin/exhibitions/new title:",
      title,
      "subTitle:",
      subTitle,
      "image:",
      imageUrl,
      "user:",
      user,
      "location:",
      location,
      "startDate:",
      startDate,
      "endDate:",
      endDate
    );

    let newExhibition = new Exhibition({
      title: title,
      subTitle: subTitle,
      image: imageUrl,
      user: user,
      location: location,
      startDate: startDate,
      endDate: endDate,
    });

    await newExhibition.save();

    res.status(201).json(newExhibition);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route = GET admin/exhibitions
// @desc get all exhibitions
// @access Private / Admin
router.get("/all", async (req, res) => {
  try {
    let exhibitions = await Exhibition.find();

    console.log("GET all exhibitions:", exhibitions);

    res.status(200).json(exhibitions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
