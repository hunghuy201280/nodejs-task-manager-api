const app = require("./app");
const port = process.env.PORT;

app.listen(port, () => {
  console.log("listening on port " + port);
});

// const Task = require("./models/task");
// const User = require("./models/user");

// const main = async () => {
//   // const task = await Task.findById("611908cbdc6d8a0c9cd0efc9");
//   // await task.populate("owner").execPopulate();
//   // console.log(task.owner);
//   const user = await User.findById("611908300be42a60e4cc8081");
//   await user.populate("tasks").execPopulate();

//   console.log(user.tasks);
// };
// main();
//const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error("Please upload a word document"));
//     }
//     cb(undefined, true);
//   },
// });

// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );
