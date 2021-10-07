const express = require("express");
const Image = require("../models/image");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});
router.post(
  "/images/avatar",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (req.user.avatar != null) {
        const imageId = req.user.avatar.split("/")[2];
        const oldImage = await Image.findByIdAndDelete(imageId);
      }

      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      const image = Image({
        data: buffer,
      });
      await image.save();
      req.user.avatar = `/images/${image._id}`;
      await req.user.save();
      res.send();
    } catch (e) {
      console.log(`upload image error ${e}`);
      res.status(400).send(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/images/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) throw new Error(`Image ${req.params.id} not found`);
    res.set("Content-Type", "image/png");
    res.send(image.data);
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.toString() });
  }
});

module.exports = router;
