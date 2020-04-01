const express = require("express");
require("dotenv").config();
const connectDB = require("./db/index");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

//connect the database
connectDB();

//Middleware
app.use(bodyParser.json());

app.use(bodyParser.text());
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));
app.use(
  express.json({
    extended: false,
    //need the raw body to verify webhook signatures
    //compute only when req is hitting the stripe webhook endpoint
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/api/stripe/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, x-auth-token, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "./public/uploads")));

//Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/images", require("./routes/api/store"));

app.use("/admin/upload", require("./routes/admin/uploads"));
// app.use("/admin/inventory", require("./routes/admin/inventory"));

app.use("/api/shop/my-cart", require("./routes/api/cart"));
app.use("/api/shop/my-account", require("./routes/api/account"));
app.use("/api/shop/order", require("./routes/api/order"));
app.use("/api/stripe", require("./routes/api/stripe"));

// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/public/index.html"));
});

const PORT = process.env.PORT || 5009;

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
