const { dbConnection } = require("../configurations");
const { userValidator } = require("../validators");

class User {
  constructor(userData) {
    this.userData = userData;
  }

  save() {
    try {
      dbConnection("users", async (collection) => {
        await collection.insertOne(this.userData);
      });
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
    return {
      status: true,
    };
  }

  static validate(userData) {
    try {
      const validationResult = userValidator.validate(userData);
      return validationResult;
    } catch (error) {
      return false;
    }
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
                message: "The email is aleady used",
              });
            } else if (user.username === this.userData.username) {
              resolve({
                check: true,
                message: "The username is aleady used",
              });
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}
