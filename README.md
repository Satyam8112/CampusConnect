# CampusConnect - College Event Management System

CampusConnect is a production-grade College Event Management System built on the MERN stack (MongoDB, Express, React, Node.js). 

This repository is pre-configured with client and server workspaces, environment variables, Tailwind CSS, security middlewares, and concurrent development launch scripts.

---

## 🛠️ Tech Stack & Key Configurations

### Frontend (`client/`)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS v3 (integrated with PostCSS)
- **Routing:** React Router DOM (client-side routing)
- **HTTP Client:** Axios (configured with API proxies)
- **Icons:** Lucide React

### Backend (`server/`)
- **Runtime:** Node.js (configured as ES Modules - `"type": "module"`)
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose ODM
- **Middlewares:**
  - `cors`: Handles cross-origin requests.
  - `helmet`: Enhances server security by setting HTTP response headers.
  - `compression`: Compresses responses (gzip) for speed optimization.
  - `morgan`: Requests logger (active in development).

---

## 📂 Project Structure

```
CampusConnect/
├── client/                      # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── assets/              # Logos, images, assets
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # React route components
│   │   ├── services/            # Axios API calls
│   │   ├── App.jsx              # Setup Dashboard & routing
│   │   ├── index.css            # Stylesheet (Tailwind configuration)
│   │   └── main.jsx             # React entrypoint
│   ├── tailwind.config.js       # Tailwind configuration file
│   └── vite.config.js           # Vite dev proxy configuration
├── server/                      # Backend Application (Node.js + Express)
│   ├── src/
│   │   ├── config/db.js         # MongoDB connection script (5s timeout fallback)
│   │   ├── routes/api.js        # Express API router
│   │   ├── app.js               # Express application middleware pipeline
│   │   └── index.js             # Node entrypoint script
│   ├── .env.example             # Template for variables
│   └── .env                     # Local environment configurations
├── package.json                 # Workspace developer scripts
└── README.md                    # This document
```

---

## ⚡ Setup & Launching Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) and optionally a local [MongoDB](https://www.mongodb.com/try/download/community) instance.

### Running both Frontend & Backend Concurrently (Recommended)
You can run both servers at once from the root folder:

```bash
# 1. Run from the project root directory
npm run dev
```
This spins up:
- The **Express server** on `http://localhost:5000`
- The **Vite dev server** on `http://localhost:5173`

*(Vite is configured with a proxy, so hitting `/api/` in client scripts automatically routes to the backend on port `5000` without CORS issues).*

### Running Services Independently
If you wish to run them in separate terminal windows:

#### Frontend Client
```bash
cd client
npm run dev
```

#### Backend API Server
```bash
cd server
npm run dev
```

---

## 🔍 Health & Verification
After booting up, visit:
- **boilerplate dashboard:** `http://localhost:5173/`
- **backend healthcheck api:** `http://localhost:5000/api/health`
