"use-strict";
const { MongoClient, ObjectId } = require("mongodb");
const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionUrl,
  {
    useNewUrlParser: true,
  },
  (error, client) => {
    if (error) {
      return console.log("unable to connect to db", error);
    }
    const db = client.db(databaseName);
    // db.collection("users").deleteMany({
    //   age: 21,
    // });
    db.collection("tasks")
      .deleteOne({
        description: "aklsdkasdla",
      })
      .then((result) => {
        console.log(result);
      });
  }
);

// db.collection("users")
//       .updateOne(
//         {
//           _id: new ObjectId("610cecf12568d08373f753e5"),
//         },
//         {
//           $inc: {
//             age: -5,
//           },
//         }
//       )
//       .then((result) => {
//         console.log(result);
//       });

// db.collection("users")
//   .insertMany([
//     {
//       name: "Huy",
//       age: 21,
//     },
//     {
//       name: "Huy",
//       age: 21,
//     },
//     {
//       name: "Huy",
//       age: 21,
//     },
//     {
//       name: "Huy",
//       age: 21,
//     },
//   ])
//   .then((result) => {
//     console.log(result);
//   });
