![Static Badge](https://img.shields.io/badge/DB-MongoDB-green)
![Static Badge](https://img.shields.io/badge/license-MIT-orange)

# bitSynergy

AI client to interact with LLMs using Ollama API.

![bitSynergy preview](./preview.webp)

## Features

- JWT Authentication
- Support for multimodal LLMs
- Mobile view
- Abstracted ollama API from client using proxy
- Scalable due to decoupling which makes it easier to add load balancing and rate limiting
- Choose from installed models to interact with
- Protected routes
- AI interactions are saved using mongoDB under your account
- Modular and scalable codebase
- GUI heavily inspired by https://chat.deepseek.com/
- Logging

## 🛠️ Tech Stack

### Frontend (Client)

- React 19 + Vite
- typescript
- Axios (for API calls)

### Backend (Server)

- Node.js
- Express.js
- MongoDB / Mongoose

## 📁 Project Structure

```
bitSynergy/
├── client/
│	├── public/
│	└── src/
│		├── assets/
│		├── authentication/
│		├── components/
│		├── context/
│		├── layout/
│		├── pages/
│		├── request/
│		└── utils/
│
├── server/
│	├── config/
│	├── controllers/
│	├── logs/
│	├── middleware/
│	├── model/
│	└── routes/
│
├── runProject.sh
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/setAutomata/bitsynergy.git
cd bitsynergy
```

- N.B Also install ollama and mongoDB on your system

### 2. Install Dependencies

```bash
npm install
cd server && npm install
cd client && npm install
```

### 3. Setup Environment Variables

Create `.env` files in both `client/` and `server/` directories:

- On \*server/**\*.env**

```
PORT=3030
HOSTNAME=localhost
DATABASE_URI=mongodb://localhost:27017/bitSynergy
SALT_WORK_FACTOR=10
ACCESS_TOKEN_SECRET=<your access token>
REFRESH_TOKEN_SECRET=<your refresh token>
ACCESS_TOKEN_SECRET_LIFESPAN=30m
REFRESH_TOKEN_SECRET_LIFESPAN=1d
COOKIE_MAX_AGE=86400000
NODE_ENV=development
```

you can generate _refresh and access token_ using Node.Js:

```bash
node
require('crypto').randomBytes(64).toString('hex')
```

- On \*client/**\*.env**

```
VITE_BACKEND_BASEURL=http://localhost:3030
```

### 4. Run the App

```bash
cd server/ && npm run dev
cd client/ && npm run dev
```

- (optional) For Linux users on gnome desktop environment, you can run the _runProject.sh_ shell script:

```bash
sudo chmod +x runProject.sh
./runProject.sh
```

### Ollama setup for mobile phone

- On Linux

```bash
sudo systemctl edit ollama.service

```

add the line:

```
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_ORIGINS=http://<your local ip>:*"
```

- On Mac

```
launchctl setenv OLLAMA_HOST "0.0.0.0"
launchctl setenv OLLAMA_ORIGINS "http://<your local ip>:*"
```

## 🤝 Contributing

This project is part of my portfolio. Feel free to provide suggestions and improvements.
