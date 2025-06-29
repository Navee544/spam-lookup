const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSpamLikelihood = async (phone) => {
  return await prisma.spamReport.count({ where: { phone } });
};

const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

exports.searchByName = async (req, res) => {
  const { query } = req.query;

  if (!query?.trim()) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  try {
    const startsWith = await prisma.user.findMany({
      where: {
        name: {
          startsWith: query,
        },
      },
      select: { id: true, name: true, phone: true },
    });

    const contains = await prisma.user.findMany({
      where: {
        name: {
          contains: query,
        },
        NOT: {
          name: {
            startsWith: query,
          },
        },
      },
      select: { id: true, name: true, phone: true },
    });

    const results = [...startsWith, ...contains];

    const final = await Promise.all(
      results.map(async (person) => {
        const spamCount = await getSpamLikelihood(person.phone);
        return { ...person, spamLikelihood: spamCount };
      })
    );

    res.status(200).json(final);
  } catch (error) {
    console.error("Search by name error:", error);
    res.status(500).json({ error: "Something went wrong during name search." });
  }
};

exports.searchByPhone = async (req, res) => {
  const { number } = req.query;

  if (!number || !isValidPhone(number)) {
    return res.status(400).json({ error: "A valid 10-digit phone number is required." });
  }

  try {
    const registered = await prisma.user.findUnique({
      where: { phone: number },
    });

    if (registered) {
      const spamCount = await getSpamLikelihood(number);
      let email = null;

      const inContacts = await prisma.contact.findFirst({
        where: { phone: number, userId: req.user.id },
      });

      if (inContacts) email = registered.email;

      return res.status(200).json({
        name: registered.name,
        phone: registered.phone,
        email,
        spamLikelihood: spamCount,
      });
    }

    const contacts = await prisma.contact.findMany({ where: { phone: number } });
    const names = [...new Set(contacts.map((c) => c.name))];
    const spamCount = await getSpamLikelihood(number);

    return res.status(200).json({
      phone: number,
      names,
      spamLikelihood: spamCount,
    });
  } catch (error) {
    console.error("Search by phone error:", error);
    res.status(500).json({ error: "Something went wrong during phone search." });
  }
};
