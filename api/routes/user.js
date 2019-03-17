const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");

// User end point
// POST @ localhost:PORT/user
// POST an order for an existing product
// @postdata {productQuantity}, {product}, {id},
// Create new order object using the Order Schema to be stored in db
router.post("/", (req, res, next) => {
  User.find({ email: req.body.email })
    .then(user => {
      console.log(user);
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
    })
    .catch();
});

// User end point
// DELETE @ localhost:PORT/user/{id}
// DELETE single user with {id}
// DELETE REQUEST to localhost:3000/user:userId

router.delete("/:userId", (req, res, next) => {
  User.findOneAndDelete({ _id: req.params.userId })
    .then(result => {
      res.status(200).json({
        message: "User Deleted"
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
