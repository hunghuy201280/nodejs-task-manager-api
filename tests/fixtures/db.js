const request = require("supertest");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "John",
  email: "humghuy220189292@gmail.com",
  password: "Mypass123412",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Ganyu",
  email: "ganyu@votoi.com",
  password: "Mypass123412",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "This is test Task one",
  completed: false,
  owner: userOneId,
};
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "This is test Task two",
  completed: false,
  owner: userOneId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "This is test Task three",
  completed: true,
  owner: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  setupDatabase,
  taskOne,
  userTwo,
  taskTwo,
  taskThree,
};
