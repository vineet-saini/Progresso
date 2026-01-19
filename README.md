# TaskFlow - Task Manager Application

A full-stack task management application built with React and Node.js.

## Project Structure

```
task-manager-jsx/
├── client/          # React frontend
└── server/          # Node.js backend
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Install Client Dependencies

```bash
cd client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory (or use the existing one):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/TaskFlow
JWT_SECRET=your-secret-key-change-this-in-production
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### Start the Server (Backend)

```bash
cd server
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:5000`

### Start the Client (Frontend)

Open a new terminal:

```bash
cd client
npm start
```

Client will run on `http://localhost:3000`

## Features

- User authentication (signup/login)
- Create, read, update, and delete tasks
- Organize tasks by categories
- Track task completion
- View progress reports and statistics
- Responsive design

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/categories` - Get user categories
- `POST /api/users/categories` - Add category
- `DELETE /api/users/categories/:category` - Delete category
- `GET /api/users/report` - Get progress report

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Default Categories

- Daily Tasks
- Office
- Study
- Gym

Users can add custom categories as needed.
