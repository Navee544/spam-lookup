const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

exports.markSpam = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ error: "A valid 10-digit phone number is required." });
    }
    
    const existing = await prisma.spamReport.findFirst({
      where: {
        phone,
        userId: req.user.id,
      },
    });

    if (existing) {
      return res.status(400).json({ error: "You have already marked this number as spam." });
    }

    const report = await prisma.spamReport.create({
      data: {
        phone,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      message: "Number marked as spam successfully.",
      report,
    });
  } catch (err) {
    console.error("📛 Spam Report Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
