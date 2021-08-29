const express = require("express");
const User = require("../models/user");
const utils = require("../utils");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/account");
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const result = await user.save();
    sendWelcomeEmail(user);
    const token = await user.getToken();
    res.status(201).send({ result, token });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.getToken();

    res.send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});
router.post("/users/logout", auth, async (req, res) => {
  const user = req.user;
  user.tokens = user.tokens.filter((token) => token.token != req.token);
  await user.save();
  res.send();
});
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).send();
  }
});

// router.get("/users/:id", async (req, res) => {
//   try {
//     const result = await User.findById(req.params.id);
//     if (!result) return res.status(404).send();
//     res.send(result);
//   } catch (err) {
//     res.status(404).send();
//   }
// });
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  if (!utils.canUpdate(updates, allowedUpdates)) {
    return res.status(400).send({
      error: "Invalid operation",
    });
  }

  try {
    const user = req.user;
    updates.forEach((field) => (user[field] = req.body[field]));

    const result = await user.save();

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancellationEmail(req.user);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

//upload profile picture

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
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

      req.user.avatar = buffer;
      await req.user.save();
      res.send();
    } catch (e) {
      console.log(`upload avatar error ${e}`);
      res.status(400).send(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});
module.exports = router;
