const express = require("express");
require("./db/mongoose");
const app = express();
app.use(express.json());

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const imageRouter = require("./routers/image");
app.use(userRouter);
app.use(taskRouter);
app.use(imageRouter);

module.exports = app;
