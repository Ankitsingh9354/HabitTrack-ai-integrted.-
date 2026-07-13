# AI Habit Tracker

An AI-powered Habit Tracker web application that helps users build and maintain daily habits. Users can create habits, track progress, visualize streaks, and receive AI-generated insights based on their consistency.

---

## Features

- User Authentication (JWT)
- Create, Update and Delete Habits
- Daily Habit Tracking
- Streak Calculation
- Weekly & Monthly Progress Dashboard
- AI-powered Habit Insights (Google Gemini API)
- Responsive UI
- Secure REST API
- MongoDB Database

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Google Gemini API

---

## Folder Structure

```
AI-Habit-Tracker
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── server.js
│
└── README.md
```

---



### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=8000

MONGO_URI

JWT_SECRET

JWT_EXPIRES_IN=7d

GEMINI_API_KEY

GEMINI_MODEL=gemini-2.5-flash

CLIENT_URL=http://localhost:5173
```

---

## API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login

### Habits

- GET /api/habits
- POST /api/habits
- PUT /api/habits/:id
- DELETE /api/habits/:id

### Logs

- POST /api/logs
- GET /api/logs

### AI

- POST /api/ai/insights

---

```

---

## Future Improvements

- Email Notifications
- Dark Mode
- Habit Sharing
- Calendar View
- Mobile App
- Achievement Badges

---


