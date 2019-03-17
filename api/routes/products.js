const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//file upload
const multer = require("multer");

// file storage
const storage = multer.diskStorage({
  //configuration
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  //file name
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (res, file, cb) => {
  //reject file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); //accept file time
  } else {
    cb(null, false); //decline any other file type
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

const Product = require("../models/Product");

// Product end point
// GET @ localhost:PORT/product
// GET all poducts

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .then(docs => {
      const response = {
        count: docs.length,
        product: docs.map(doc => {
          return {
            // ...doc._doc, //document array
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
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

// Product end point
// POST @ localhost:PORT/product
// POST to poducts
// @postdata {name}, {price}, {id}, {productImage}
// Create new product object to be stored in db with imgae url

// POST REQUEST to localhost:3000/products
router.post("/", upload.single("productImage"), (req, res, next) => {
  //create new product
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });

  //save product to db
  product
    .save()
    .then(result => {
      //res to user
      res.status(201).json({
        message: "Created producte successfully",
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          productImage: result.productImage,

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

// Product end point
// GET @ localhost:PORT/product/{id}
// GET single poducts with {id}
// GET REQUEST to localhost:3000/products:productId

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
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

// Product end point
// PATCH @ localhost:PORT/product/{id}
// PATCH single poducts with {id}
// PATCH REQUEST to localhost:3000/products:productId
// UPDATE DATA SENT FROM THE FRONT END IN THE DB
// @postdata {name}, {price}, {id}

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

// Product end point
// DELETE @ localhost:PORT/product/{id}
// DELETE single poducts with {id}
// DELETE REQUEST to localhost:3000/products:productId
// DELETE DATA SENT FROM THE FRONT END IN THE DB

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
