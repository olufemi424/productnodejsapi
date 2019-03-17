const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// check authorization middleware
const checkAuth = require("../middleware/check-auth");

//orders contoller
const OrdersController = require("../controllers/orders");

// Order end point
// GET @ localhost:PORT/orders
router.get("/", checkAuth, OrdersController.orders_get_all);

// Order end point
// POST @ localhost:PORT/orders
router.post("/", checkAuth, OrdersController.orders_create_order);

// Order end point
// GET @ localhost:PORT/orders/{id}
router.get("/:orderId", checkAuth, OrdersController.orders_get_order);

// Order end point
// DELETE @ localhost:PORT/orders/{id}
router.delete("/:orderId", checkAuth, OrdersController.order_delete);

module.exports = router;
