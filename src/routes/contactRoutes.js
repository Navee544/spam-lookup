const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addContact, getContacts } = require("../controllers/contactController");

const router = express.Router();

router.post("/", authMiddleware, addContact);

router.get("/", authMiddleware, getContacts);

module.exports = router;
