# spam-lookup
RESTful API for detecting spam numbers and finding user identity by phone number, built with Node.js, Express, Prisma, and MySQL.

📞 Spam Lookup API
A production-ready REST API to detect spam numbers and search people by name or phone number — similar to apps like Truecaller. Built with Node.js, Express.js, MySQL, and Prisma ORM.

🚀 Features
✅ User registration & login with JWT authentication

✅ Add contacts to your phonebook

✅ Mark any number as spam

✅ Search global database by name or phone

✅ Spam likelihood count for every phone number

✅ Show email only if contact is in your phonebook

⚙️ Tech Stack
Backend: Node.js, Express.js

Database: MySQL

ORM: Prisma

Security: JWT, Helmet, CORS, bcryptjs

Dev Tools: Nodemon, dotenv

📁 Project Structure
spam-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── index.js
│   └── seed.js
├── .env
├── package.json
└── README.md

📦 Installation
Clone the repo
git clone https://github.com/Navee544/spam-lookup.git

Go into project folder
cd spam-lookup

Install dependencies
npm install

Generate Prisma client
npx prisma generate

Apply database migrations
npx prisma migrate dev --name init

Seed sample data (optional)
npm run seed

Start development server
npm run dev

🔐 Environment Setup
Create a .env file in the root and add:

PORT=5000
DATABASE_URL="mysql://<user>:<password>@localhost:3306/spam_api"
JWT_SECRET=your_super_secret_key

🧪 API Endpoints
🔹 Auth
POST /api/auth/register
Register new user

Body:
{name, phone, email, password}

POST /api/auth/login
Login user

Body:
{phone, password}

GET /api/user/me
Get logged-in user details (requires token)

🔹 Contacts
POST /api/contacts
Add a contact to your phonebook

Body:
{name, phone}

🔹 Spam
POST /api/spam
Mark a phone number as spam

Body:
{phone}

🔍 Search
GET /api/search/name?query=Naveen
Search people by name globally
Returns list of matched users with spam count

GET /api/search/phone?number=9999999999
Search by phone number
Returns name(s), spam likelihood, and email (if contact exists in your list)

🧪 Sample Seed Data
To populate example data:

Run npm run seed
Creates users, contacts, and spam reports

✅ Best Practices Followed
Modular folder structure (routes/controllers)

Prisma ORM for clean DB operations

Passwords hashed using bcrypt

JWT-based authentication

Input validation and proper error handling

Helmet and CORS security enabled

Rate limiting to prevent abuse

📜 License
MIT

Made with ❤️ by Naveen T


