const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// env variable
const secretKey = require("../../config/keys").secretOrKey;
const User = require("../models/User");

// User end point
// GET @ localhost:PORT/
// GET all users from the db
exports.user_get_all_user = (req, res, next) => {
  User.find()
    .select("name email _id")
    .then(users => {
      if (users.length <= 0) {
        res.status(500).json({
          message: "No user in the DB"
        });
      } else {
        const response = {
          count: users.length,
          users: users.map(user => {
            return {
              // ...user._user, //document array
              name: user.name,
              email: user.email,
              _id: user._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/user/" + user._id
              }
            };
          })
        };
        res.status(200).json(response);
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// User end point
// POST @ localhost:PORT/user
// POST an order for an existing product
// @postdata {email}, {password},
// Create new order object using the Order Schema to be stored in db
exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email }).then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "User Already Exist"
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: hash
          });
          newUser
            .save()
            .then(result => {
              res.status(201).json({
                message: "User Created"
              });
            })
            .catch(err => {
              res.status(500).json({ error: err });
            });
        }
      });
    }
  });
};

// User end point
// POST @ localhost:PORT/user/login
// POST user with {email} and {password}
//Find user with the email, then compare it with the hash+salted password stored in the database using bcrypt
exports.user_login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      //CHECK IF THERE IS USER
      //if user not found, throw and error
      if (!user) {
        return res.status(401).json({ message: "Auth Failed" });
      }
      //COMPARE PASSWORD
      bcrypt.compare(req.body.password, user.password, (err, response) => {
        //if response is true, Auth is succesful
        if (response) {
          //jwp token config
          // @ {token} is used to make request to protected routes, this token expires in {1hr }  depending on what time that is being set.
          //{protected from unauthorized user}
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            secretKey,
            {
              expiresIn: "1hr"
            }
          );

          return res.status(200).json({
            message: "Auth Succesful",
            success: true,
            token: "Bearer " + token
            // token: token
          });
        } else {
          // return fail if not succesful
          return res.status(401).json({ message: "Auth Failed" });
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// User end point
// DELETE @ localhost:PORT/user/{id}
// DELETE single user with {id}
// DELETE REQUEST to localhost:3000/user:userId

exports.user_delete = (req, res, next) => {
  User.findOneAndDelete({ _id: req.params.userId })
    .then(result => {
      res.status(200).json({
        message: "User Deleted"
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
