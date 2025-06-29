const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

exports.addContact = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name?.trim() || !phone) {
      return res.status(400).json({ error: "Name and phone are required." });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: "Phone must be a valid 10-digit number." });
    }

    const exists = await prisma.contact.findFirst({
      where: {
        phone,
        userId: req.user.id,
      },
    });

    if (exists) {
      return res.status(409).json({ error: "This contact already exists in your list." });
    }

    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        phone,
        userId: req.user.id,
      },
    });

    res.status(201).json(contact);
  } catch (err) {
    console.error("Add Contact Error:", err);
    res.status(500).json({ error: "Failed to add contact." });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json(contacts);
  } catch (err) {
    console.error("Get Contacts Error:", err);
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
};
