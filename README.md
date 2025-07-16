# 🧠 Bitespeed Identify API

A Node.js + MySQL web service to identify and manage customer identities across multiple purchases based on email and phone number.

## 📦 Tech Stack

- Node.js (JavaScript)
- Express.js
- MySQL 8 (via Docker)
- Docker Compose

---

## 🚀 Getting Started

### 1️⃣ Clone and Install

```bash
git clone <your-repo-url>
cd bitespeed-identity
npm install
```

---

### 2️⃣ Run MySQL via Docker

```bash
docker-compose up -d
```

This starts MySQL on port `3306` with:
- DB: `bitespeed`
- User: `root`
- Password: `root`

---

### 3️⃣ Create Contact Table

```bash
docker exec -it bitespeed-mysql mysql -uroot -proot
```

Inside MySQL shell:

```sql
USE bitespeed;

CREATE TABLE Contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phoneNumber VARCHAR(20),
  email VARCHAR(255),
  linkedId INT,
  linkPrecedence ENUM('primary', 'secondary') DEFAULT 'primary',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt DATETIME
);
```

---

### 4️⃣ Start Server

```bash
npm start
```

Server will run at: `http://localhost:3000`

---

## 📫 API Endpoint

### POST `/identify`

#### Request Body:

```json
{
  "email": "user@example.com",
  "phoneNumber": "1234567890"
}
```

#### Response:

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["user@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
```

---

## 🧪 Testing

1. Import `bitespeed-postman-collection.json` into Postman
2. Run through 8 prepared test cases.

---

## 🌐 Deployment

To deploy, you can use:
- [Render.com](https://render.com/)
- [Railway](https://railway.app/)

Just set environment variables from `.env` and expose port 3000.

---

## 📁 Files

- `docker-compose.yml` - Runs MySQL locally
- `.env` - Environment config
- `app.js` - Express server
- `routes/identifyRoute.js` - API route
- `controllers/identifyController.js` - Logic
- `models/contactModel.js` - MySQL operations

---

## 📜 License

MIT — free to use, modify, and share.