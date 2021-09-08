const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app");

const {
  userTwo,
  taskOne,
  userOne,
  userOneId,
  setupDatabase,
  taskTwo,
  taskThree,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Test Create Task",
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test("Should return all user's task", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toBe(2);
});

test("Should not delete user one's task by using user two's account", async () => {
  await request(app)
    .delete(`/tasks/${taskOne.id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test("Should not create task with invalid description/completed", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({})
    .expect(400);

  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: "asdasdasdasd",
    })
    .expect(400);
});

test("Should not update task with invalid description/completed", async () => {
  await request(app)
    .patch(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      completed: -4445,
    })
    .expect(400);
  const task = await Task.findById(taskThree._id);
  expect(task).toMatchObject(taskThree);
});

test("Should delete user's task", async () => {
  await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  const task = await Task.findById(taskThree._id);
  expect(task).toBeNull();
});

test("Should not delete task if unauthenticated", async () => {
  await request(app).delete(`/tasks/${taskThree._id}`).send().expect(401);
  const task = await Task.findById(taskThree._id);
  expect(task).not.toBeNull();
});

test("Should not update other user's task", async () => {
  await request(app)
    .patch(`/tasks/${taskTwo._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: "new descrip",
      completed: true,
    })
    .expect(404);
  const task = await Task.findById(taskTwo._id);
  expect(task).toMatchObject(taskTwo);
});

test("Should fetch user's task by it's id", async () => {
  const result = await request(app)
    .get(`/tasks/${taskTwo._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(result.body._id).toEqual(taskTwo._id.toString());
});

test("Should not fetch user task by id if unauthenticated", async () => {
  const result = await request(app)
    .get(`/tasks/${taskTwo._id}`)
    .send()
    .expect(401);
});

test("Should not fetch other user's task by it's id", async () => {
  const result = await request(app)
    .get(`/tasks/${taskTwo._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});

test("Should fetch only completed task", async () => {
  const result = await request(app)
    .get("/tasks?completed=true")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(result.body.length).toBe(0);
});

test("Should fetch only incomplete task", async () => {
  const result = await request(app)
    .get("/tasks?completed=false")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(result.body.length).toBe(2);
});

test("Should sort tasks by description/completed/createdAt/updatedAt", async () => {
  //description
  let result = await request(app)
    .get("/tasks?sortBy:description:desc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(result.body[0]._id).toBe(taskOne._id.toString());

  //completed
  result = await request(app)
    .get("/tasks?sortBy:completed:desc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(result.body[0]._id).toBe(taskOne._id.toString());

  //createdAt
  result = await request(app)
    .get("/tasks?sortBy:createdAt:desc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(result.body[0]._id).toBe(taskOne._id.toString());

  //updatedAt
  result = await request(app)
    .get("/tasks?sortBy:updatedAt:desc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(result.body[0]._id).toBe(taskOne._id.toString());
});

test("Should fetch page of tasks", async () => {
  const result = await request(app)
    .get("/tasks?limit=1&&skip=0")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(result.body[0]._id).toBe(taskOne._id.toString());
});
