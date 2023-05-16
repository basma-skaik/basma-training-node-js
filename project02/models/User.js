const { dbConnection } = require("../configurations");
const { userValidator, loginValidator } = require("../validators");
const { hashSync, compareSync } = require("bcryptjs");

class User {
  constructor(userData) {
    this.userData = userData;
  }

  save(cb) {
    dbConnection("users", async (collection) => {
      try {
        const hashedPassword = hashSync(this.userData.password);
        this.userData.password = hashedPassword;

        await collection.insertOne(this.userData).then((result) => {
          cb({
            status: true,
            _user_id: result.insertedId,
          });
        });

        // const newUser = collection.findOne({ email: this.userData.email });
      } catch (error) {
        cb({
          status: false,
          message: error.message,
        });
      }
    });
  }

  isExist() {
    return new Promise((resolve, reject) => {
      dbConnection("users", async (collection) => {
        try {
          const user = await collection.findOne({
            $or: [
              { username: this.userData.username },
              { email: this.userData.email },
            ],
          });

          if (!user) {
            resolve({
              check: false,
            });
          } else {
            if (user.email === this.userData.email) {
              resolve({
                check: true,
                message: "The email is aready used",
              });
            } else if (user.username === this.userData.username) {
              resolve({
                check: true,
                message: "The username is aready used",
              });
            }
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  static validate(userData) {
    try {
      const validationResult = userValidator.validate(userData);
      return validationResult;
    } catch (err) {
      return false;
    }
  }

  static login(loginData) {
    return new Promise((resolve, reject) => {
      const validation = loginValidator.validate(loginData);
      if (validation.error) {
        resolve({
          status: false,
          code: 400,
          message: validation.error.message,
        });
      }

      dbConnection("users", async (collection) => {
        try {
          const user = await collection.findOne(
            {
              username: loginData.username,
            },
            {
              projection: { username: 1, name: 1, password: 1 },
            }
          );
          if (user) {
            if (compareSync(loginData.password, user.password)) {
              resolve({
                status: true,
                data: user,
              });
            }
          }
          resolve({
            status: false,
            code: 401,
            message: "Login Failed",
          });
        } catch (error) {
          reject({
            status: false,
            message: error.message,
          });
        }
      });
    });
  }
}

module.exports = User;

// const userData = {
//   name: "Ahmed Ali",
//   email: "ahh1@gmail.com",
//   username: "ahh2",
//   password: "123456aA#",
// };
// const user = new User(userData);

// user.save();

// console.log(user);
// console.log(user.userData);
// console.log(user.userData.name);

// const valResult = User.validate(userData);
// if (valResult.error) {
//   //validate wrong
// } else {
//   // complete
// }
// console.log(valResult);

// user
//   .isExist()
//   .then((staus) => {
//     console.log(staus);
//     if (!staus.check) {
//       //user.save()
//     }
//   })
//   .catch();
