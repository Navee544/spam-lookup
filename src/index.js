require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();


app.use(express.json());
app.use(cors());
app.use(helmet());


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});
app.use(limiter);


const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const spamRoutes = require("./routes/spamRoutes");
const searchRoutes = require("./routes/searchRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/spam", spamRoutes);
app.use("/api/search", searchRoutes);


app.get("/", (req, res) => {
  res.send("📞 Spam Lookup API is running...");
});


app.use((err, req, res, next) => {
  console.error("❌ Internal error:", err.message, err.stack);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
