const express = require("express");
const { markSpam } = require("../controllers/spamController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", authMiddleware, markSpam);

module.exports = router;
