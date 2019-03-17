const mongoose = require("mongoose");

//Models
const Order = require("../models/Order");
const Product = require("../models/Product");

// Order end point
// GET @ localhost:PORT/orders
// GET all orders from the db

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .then(docs => {
      const response = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            // ...doc._doc, //document array
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// Order end point
// POST @ localhost:PORT/orders
// POST an order for an existing product
// @postdata {productQuantity}, {product}, {id},
// Create new order object using the Order Schema to be stored in db

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ error: "Product Not found" });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });
      return order.save();
    })
    .then(result => {
      const response = {
        message: "Order Stored",
        product: result.product,
        quantity: result.quantity,
        _id: result._id,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// Order end point
// GET @ localhost:PORT/orders/{id}
// GET an order from an existing order in the db
// expects an order {id} in the params objext of the request
// responde with order object

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .then(order => {
      if (!order) {
        return res.status(404).json({ error: "Product Not found" });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + order._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

// Order end point
// DELETE @ localhost:PORT/orders/{id}
// DELETE an order from an existing order in the db
// expects an order {id} in the params object of the request
// remove order from the db
exports.order_delete = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .then(response => {
      res.status(200).json({
        message: "Order Deleted",
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + response._id,
          body: { productId: "ID", quantity: "Number" }
        }
      });
    })
    .catch();
};
