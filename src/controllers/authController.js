const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

exports.register = async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name?.trim() || !phone || !password) {
    return res.status(400).json({ error: "Name, phone, and password are required." });
  }

  if (!isValidPhone(phone)) {
    return res.status(400).json({ error: "Phone must be a valid 10-digit number." });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long and contain at least one letter and one number.",
    });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  const existingUser = await prisma.user.findUnique({ where: { phone } });
  if (existingUser) {
    return res.status(400).json({ error: "Phone number already in use." });
  }

  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use." });
    }
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: name.trim(), phone, email, password: hashed },
  });

  res.json({ token: generateToken(user.id) });
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: "Phone and password are required." });
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  res.json({ token: generateToken(user.id) });
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found." });

    res.json(user);
  } catch (err) {
    console.error("Get Current User Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
