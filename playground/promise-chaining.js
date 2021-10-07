require("../src/db/mongoose");
const User = require("../src/models/User");
//"610e4337779812287c7814fb"
//ObjectId("610e509cd0bb2f0e8c2f0e7f")
// User.findByIdAndUpdate("610e509cd0bb2f0e8c2f0e7f", {
//   age: 1,
// })
//   .then((result) => {
//     return User.countDocuments({ age: 1 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const updateAgeAndCount = async (id, age) => {
//   await User.findByIdAndUpdate(id, {
//     age,
//   });
//   const count = await User.countDocuments({ age });
//   return count;
// };

// updateAgeAndCount("610e509cd0bb2f0e8c2f0e7f", 2)
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const Task = require("../src/models/Task");
// //ObjectId("610e515c1fe3661ab862d4fa")
// Task.findByIdAndDelete("610e515c1fe3661ab862d4fa")
//   .then((result) => {
//     console.log(result);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const deleteTaskAndCount = async (id) => {
  await Task.findByIdAndDelete(id);
  return await Task.countDocuments({ completed: false });
};
deleteTaskAndCount("610f8ffd84162445849e171d")
  .then((result) => {
    console.log(result);
  })
  .catch((e) => console.log(e));

// const add = (a, b) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (a < 0 || b < 0) return reject("erroorororor");
//       resolve(a + b);
//     }, 2000);
//   });
// };

// async function doWork() {
//   let sum = await add(1, 1);
//   try {
//     sum += await add(-1, 1);
//   } catch (err) {
//     console.log(err);
//   }
//   console.log(sum);
// }

// doWork();
