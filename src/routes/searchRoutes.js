const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { searchByName, searchByPhone } = require("../controllers/searchController");

const router = express.Router();

router.get("/name", authMiddleware, searchByName);
router.get("/phone", authMiddleware, searchByPhone);

module.exports = router;
