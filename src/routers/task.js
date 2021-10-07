const express = require("express");
const Task = require("../models/task");
const utils = require("../utils");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const saveImages = require("../middleware/save_images");
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
  "/tasks",
  auth,
  upload.array("images", 4),
  saveImages,
  async (req, res) => {
    try {
      const reqJson = JSON.parse(req.body.request);
      const task = new Task({
        description: reqJson.description,
        completed: reqJson.completed,
        owner: req.user._id,
        images: req.taskImages,
      });
      const result = await task.save();
      res.status(201).send(result);
    } catch (err) {
      res.status(400).send(err);
      console.log(err);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//GET /tasks?completed=false
//GET /tasks?limit=10&skip=2
//GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    result = req.user.tasks;
    if (!result) return res.status(404).send();
    res.send(result);
  } catch (err) {
    res.status(404).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const result = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!result) return res.status(404).send();
    res.send(result);
  } catch (err) {
    res.status(404).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const inputField = Object.keys(req.body);

  if (!utils.canUpdate(inputField, allowedUpdates)) {
    return res.status(400).send({
      error: "Invalid operation",
    });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task)
      return res.status(404).send({
        error: "Task not found",
      });
    inputField.forEach((field) => (task[field] = req.body[field]));
    const updatedTask = await task.save();
    res.send(updatedTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deletedTask) return res.status(404).send({ error: "Task not found" });
    res.send(deletedTask);
  } catch (err) {
    res.status(404).send();
  }
});
module.exports = router;
