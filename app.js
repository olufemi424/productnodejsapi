const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

console.log(process.env.MONGO_ATLAS_PW);
//connect to mongo db
mongoose
  .connect(
    `mongodb+srv://olufemi:123456abcd@nodejs-project-2ovej.mongodb.net/test?retryWrites=true"`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDb Connected")) //promise return
  .catch(err => console.log(err));

//middleware
//Log our request types
app.use(morgan("dev"));
// Attached more fucntionilty to our request, get data from requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORES errors handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requestd-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);

//Error Handle if url not match
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//Error handle if one of the routes throw and error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "it works, this is home"
//   });
// });

module.exports = app;
