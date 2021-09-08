const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const { userOneId, userOne, setupDatabase, userTwo } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should sign up a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "John",
      email: "humghuy20189292@gmail.com",
      password: "Mypass123412",
    })
    .expect(201);
  //assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  //assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "John",
      email: "humghuy20189292@gmail.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("Mypass123412");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
      fuck: "you",
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  //assert that token in response match user's second token
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "Invalid",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  //assert that user was deleted
  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/test_image.jpg")
    .expect(200);
  const user = await User.findById(userOne._id);
  //check if user.avatar contain Buffer variable type
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Cena",
      age: 12,
      password: "TestPass123",
      email: "test@test.com",
    })
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(user).toMatchObject({
    name: "Cena",
    age: 12,
    email: "test@test.com",
  });
  expect(bcrypt.compareSync("TestPass123", user.password)).toBe(true);
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Fuck you",
    })
    .expect(400);
});

test("Should not signup user with invalid name/email/password", async () => {
  //invalid email
  let tempId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/users")
    .send({
      _id: tempId,
      email: "Fuck you",
      password: "Test123123",
      name: "Huy truong",
    })
    .expect(400);
  let testUser = await User.findById(tempId);
  expect(testUser).toBeNull();

  //invalid name
  tempId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/users")
    .send({
      _id: tempId,
      email: "valid@email.com",
      password: "Test123123",
    })
    .expect(400);
  testUser = await User.findById(tempId);
  expect(testUser).toBeNull();
  //invalid password
  tempId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/users")
    .send({
      _id: tempId,
      email: "valid@email.com",
      password: "Pa    ssword",
    })
    .expect(400);
  testUser = await User.findById(tempId);
  expect(testUser).toBeNull();
});

test("Should not update user if unauthenticated", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      name: "AAA",
      age: 123,
      email: "validEamil@mail.com",
      password: "Thisisvalidpassword",
    })
    .expect(401);
});

test("Should not update user with invalid name/email/password", async () => {
  //invalid email
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      email: "Thisisinvalidemail",
    })
    .expect(400);
  let tempUser = await User.findById(userTwo._id);
  expect(tempUser.email).toBe(userTwo.email);

  //invalid name
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      name: "123123",
    })
    .expect(400);
  tempUser = await User.findById(userTwo._id);
  expect(tempUser.name).toBe(userTwo.name);
  //invalid password
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      password: "asdjadjkasd asdas d",
    })
    .expect(400);
  tempUser = await User.findById(userTwo._id);
  expect(tempUser.name).toBe(userTwo.name);
});

test("Should not delete if unauthenticated", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
