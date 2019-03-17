const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

//products controller
const ProductContoller = require("../controllers/products");

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

//upload file config
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

// Product end point
// GET @ localhost:PORT/product
// GET all poducts
router.get("/", ProductContoller.products_get_all);

// Product end point
// POST @ localhost:PORT/product
// POST REQUEST to localhost:3000/products
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductContoller.products_create
);

// Product end point
// GET @ localhost:PORT/product/{id}
router.get("/:productId", checkAuth, ProductContoller.products_get_product);

// Product end point
// PATCH @ localhost:PORT/product/{id}
router.patch(
  "/:productId",
  checkAuth,
  ProductContoller.products_update_product
);

// Product end point
// DELETE @ localhost:PORT/product/{id}
router.delete(
  "/:productId",
  checkAuth,
  ProductContoller.products_delete_product
);

module.exports = router;
