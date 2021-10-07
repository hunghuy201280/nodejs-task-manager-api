const Image = require("../models/image");

async function saveImages(req, res, next) {
  const resultLinks = [];
  if (req.files) {
    for (i = 0; i < req.files.length; i++) {
      const it = req.files[i];
      const tempImage = Image({
        data: it.buffer,
      });
      await tempImage.save();
      resultLinks.push(`/images/${tempImage._id}`);
    }
  }
  req.taskImages = resultLinks;
  next();
}

module.exports = saveImages;
