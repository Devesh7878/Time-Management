# Team Task Manager (MERN)

A production-ready full stack task management web app with JWT auth, role-based access, project/task control, and dashboards for Admin and Member users.

## Tech Stack

- MongoDB Atlas
- Express.js + Node.js
- React.js (Vite) + React Router + Axios
- Tailwind CSS
- JWT + bcryptjs

## Features

- Signup/Login with `Admin` and `Member` roles
- JWT authentication and protected routes
- Role-based permissions:
  - Admin: create/update/delete projects and tasks, assign tasks
  - Member: view assigned tasks, update task status only
- Dashboard metrics:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - Overdue tasks
- Task search and filtering (status, due date)
- Toast notifications and loading states
- Pagination for tasks API and UI

## Project Structure

```txt
backend/
  controllers/
  models/
  routes/
  middleware/
  config/
  validators/
frontend/
  src/
    components/
    pages/
    services/
    context/
```

## Setup Instructions

### 1) Clone and install

```bash
git clone <your-repo-url>
cd Team-Task-Manager
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment variables

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/team-task-manager
JWT_SECRET=replace_with_a_strong_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3) Run locally

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## REST API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Projects
- `POST /api/projects` (Admin)
- `GET /api/projects` (Admin: all, Member: assigned)
- `PUT /api/projects/:id` (Admin)
- `DELETE /api/projects/:id` (Admin)

### Tasks
- `POST /api/tasks` (Admin)
- `GET /api/tasks` (Admin: all, Member: assigned)
- `PUT /api/tasks/:id` (Admin or assigned Member)
- `DELETE /api/tasks/:id` (Admin)

## Deployment

### Backend on Railway
1. Create new Railway project and connect repo.
2. Set service root to `backend`.
3. Add env variables from `backend/.env.example`.
4. Railway start command: `npm start`.
5. Copy live backend URL.

### Frontend on Vercel (recommended)
1. Import repo in Vercel.
2. Set root directory as `frontend`.
3. Add env `VITE_API_URL=<your-live-backend-url>/api`.
4. Build command: `npm run build`, output dir: `dist`.

You can also deploy frontend on Railway similarly.

## Screenshots

Add screenshots in a `/screenshots` folder and reference them here:

- Signup page
- Login page
- Admin panel (projects/tasks)
- Member dashboard

## Demo Video Checklist

Record a short demo showing:
- Signup and Login
- Admin creating a project and assigning tasks
- Member viewing and updating assigned task status
- Dashboard stats overview
