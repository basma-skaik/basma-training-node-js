const { User, Reviewer } = require("../models");

const createError = require("http-errors");

const signup = (req, res, next) => {
  const userData = req.body;

  //validation
  const validation = User.validate(userData);
  if (validation.error) {
    next(createError(400, validation.error.message));
  }

  //check existance
  const user = new User(userData);

  user
    .isExist()
    .then((result) => {
      if (result.check) {
        next(createError(409, result.message));
      }
    })
    .catch((err) => {
      next(createError(500, err.message));
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
          res.status(201).json({
            status: true,
            message: "User has been created successfully",
          });
        } else {
          next(createError(500, "User created but reviewer not created"));
        }
      });
    } else {
      next(createError(500, status.message));
    }
  });
};

const login = (req, res, next) => {
  User.login(req.body)
    .then((result) => {
      if (result.status) {
        res.status(200).json(result.data);
      }
      next(createError(result.code, result.message));
    })
    .catch((err) => {
      next(createError(500, err.message));
    });
};

module.exports = {
  signup,
  login,
};
