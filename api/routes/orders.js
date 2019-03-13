const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "orders were fetched"
  });
});

router.post("/", (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };

  res.status(201).json({
    message: "orders were posted",
    order: order
  });
});

router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order ID request",
    id: req.params.orderId
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Delete Order"
  });
});

module.exports = router;
