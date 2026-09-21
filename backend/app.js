const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const requestLogger = require("./middleWare/requestLogger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const cors = require("cors");
// resolve config relative to this file so the app boots from any working directory
require("dotenv").config({ path: path.resolve(__dirname, "config", "config.env") });







// routes

const user = require("./route/userRoute");
const order = require("./route/orderRoute");
const product = require("./route/productRoute")
const payment = require("./route/paymentRoute");
const health = require("./route/healthRoute");

// Add request logging middleware (only in development or when LOG_REQUESTS is true)
if (process.env.NODE_ENV === 'development' || process.env.LOG_REQUESTS === 'true') {
    app.use(requestLogger);
}

// for req.cookie to get token while authentication
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());
app.use(cors());

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", health);

// Return a clean JSON 404 for any unknown /api route (never the HTML SPA page)
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "/frontend/build")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
);

// Error middleware must come after all routes (including static + SPA fallback)
app.use(errorMiddleware);

module.exports = app;
