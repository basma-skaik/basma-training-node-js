const { User, Reviewer } = require("../models");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { readFileSync } = require("fs");

const signup = (req, res, next) => {
  const userData = req.body;

  //validation
  const validation = User.validate(userData);
  if (validation.error) {
    return next(createError(400, validation.error.message));
  }

  //check existance
  const user = new User(userData);

  user
    .isExist()
    .then((result) => {
      if (result.check) {
        return next(createError(409, result.message));
      }
    })
    .catch((err) => {
      return next(createError(500, err.message));
    });

  //insert user
  user.save((status) => {
    if (status.status) {
      const _user_id = status._user_id;

      const reviewer = new Reviewer({
        name: userData.name,
        _user_id: _user_id,
      });

      reviewer.save((result) => {
        if (result.status) {
          // return res.status(201).json({
          //   status: true,
          //   message: "User has been created successfully",
          // });
          return returnJson(
            res,
            201,
            true,
            "User has been created successfully",
            null
          );
        } else {
          return next(
            createError(500, "User created but reviewer not created")
          );
        }
      });
    } else {
      return next(createError(500, status.message));
    }
  });
};

const login = (req, res, next) => {
  User.login(req.body)
    .then((result) => {
      if (result.status) {
        const jwtSecretKey = readFileSync("./configurations/private.key");

        console.log("login", result);

        const token = jwt.sign(
          {
            _id: result.data._id,
            _reviewer_id: result.data.reviewer._id,
          },
          jwtSecretKey
        );
        // return res.status(200).json({
        //   status: true,
        //   token: token,
        // });
        return returnJson(res, 200, true, "", { token });
      }
      return next(createError(result.code, result.message));
    })
    .catch((err) => {
      return next(createError(500, err.message));
    });
};

module.exports = {
  signup,
  login,
};
