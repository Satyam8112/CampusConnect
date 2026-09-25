# CampusConnect

CampusConnect is a full-stack college event management platform built using the MERN stack. Students can discover and register for campus events, while organizers can create and manage their own events.

## Features

- Student and Organizer registration and login
- JWT-based authentication
- Role-based authorization
- Student and Organizer dashboards
- Browse and search campus events
- View detailed event information
- Organizer event creation, editing, and deletion
- Student event RSVP/registration
- Event capacity and duplicate-registration protection
- RSVP cancellation
- In-app notifications
- Mark notifications as read
- MongoDB data persistence

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Helmet
- CORS

## Project Structure

```text
CampusConnect/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       ├── app.js
│       └── index.js
│
├── .gitignore
├── package.json
├── README.md
└── test_milestone8.js
