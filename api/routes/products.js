const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/Product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .then(docs => {
      const response = {
        count: docs.length,
        producst: docs.map(doc => {
          return {
            // ...doc._doc, //document array
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };

      // if (docs.length >= 0) {
      res.status(200).json(response);
      // } else {
      //   res.status(404).json({
      //     message: "No Entries Found"
      //   });
      // }
    })
    .catch(err => {
      res.status(404).json({ err: err });
    });
});

// POST REQUEST to localhost:3000/products
router.post("/", (req, res, next) => {
  //create new product
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  //save product to db
  product
    .save()
    .then(result => {
      //res to user
      res.status(201).json({
        message: "Created producte successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// GET REQUEST to localhost:3000/products:productId
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then(doc => {
      if (doc) {
        res.status(201).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get all Products",
            url: "http://localhost:3000/products/"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided product Id" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// PATCH REQUEST to localhost:3000/products/productId
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updatesOps = {};

  for (const ops of req.body) {
    updatesOps[ops.propName] = ops.value;
  }

  Product.update({ _id: id }, { $set: updatesOps })
    .then(doc => {
      //res to user
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: "GET",
          description: "Get all Products",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .then(result => {
      res.status(200).json({
        message: "Product Deleted",
        request: {
          type: "POST",
          description: "Create New Product",
          url: "http://localhost:3000/products/",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
