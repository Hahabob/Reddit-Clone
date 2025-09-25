# Reddit-Clone

A simplified Reddit-like web application built with the **MERN stack**.  
This project replicates core Reddit features such as communities, posts, comments, voting, and basic moderator controls.  
Built as a final project in a fullstack development course.

---

## 🚀 Features

- **Authentication & Users**

  - User signup/login with [Clerk](https://clerk.com/)
  - User profiles (username, avatar)

- **Communities (Subreddits)**

  - Create, read, update, and delete communities
  - Moderator management: promote users, remove users
  - Role-based access control for moderator actions

- **Posts & Comments**

  - Create text/image posts inside communities
  - Comment on posts
  - Upvote/downvote system with dynamic counts

- **Frontend**

  - Reddit-style layout with feeds, sidebars, and navigation
  - Built with React and styled with TailwindCSS
  - API requests managed with Axios

- **Backend**

  - RESTful API built with Express.js
  - MongoDB database with Mongoose models
  - Secure auth middleware with Clerk JWT verification

- **Deployment**
  - Frontend: Vercel
  - Backend: Render/Heroku
  - Database: MongoDB Atlas

---

## 🛠️ Tech Stack

**Frontend**

- React
- TailwindCSS
- Axios

**Backend**

- Node.js
- Express.js
- MongoDB + Mongoose

**Auth**

- Clerk

**Deployment**

- Vercel (frontend)
- Render/Heroku (backend)
- MongoDB Atlas (database)

---

## 📂 Project Structure

reddit-clone/
│
├── backend/ # Express API
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── controllers/ # Route handlers
│ └── server.js
│
├── frontend/ # React/Next.js app
│ ├── components/ # Reusable UI
│ ├── pages/ # App routes
│ └── utils/ # Axios API calls
│
└── README.md

---

## 📸 Image uploads (Cloudinary)

Server requires these environment variables in `server/.env`:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Client can set `VITE_SERVER_URL` to the server origin (defaults to `http://localhost:3001`).

Upload endpoint:

- `POST /upload/image` with `multipart/form-data`, field `file`
- Response JSON: `{ url, public_id, width, height, format }`
