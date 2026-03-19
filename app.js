require("dotenv").config({ quiet: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { corsOption } = require("./config/corsOption");
const path = require("path");
const verifyJWT = require("./middleware/verifyJWT");
const errorHandler = require("./middleware/errorHandler");
const { logger } = require("./middleware/logEvent");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/dbConn");

// Connect to MongoDB
connectDB();

app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/user", require("./routes/api/user"));
app.use("/quiz", require("./routes/api/quiz"));
app.use("/question", require("./routes/api/questions"));

app.all(/\/*/, (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
