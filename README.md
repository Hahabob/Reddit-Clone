# Reddit-Clone

A simplified Reddit-like web application built with the **MERN stack**.  
This project replicates core Reddit features such as communities, posts, comments, voting, and basic moderator controls.

Developed as a final project for a fullstack development course.

---

## 👥 Meet the Team

<table>
  <tr>
    <th>Photo</th>
    <th>Name</th>
    <th>Role</th>
    <th>LinkedIn</th>
    <th>GitHub</th>
  </tr>
  <tr>
    <td><img src="https://user-images.githubusercontent.com/ori-hadad-profile.jpg" alt="Ori Hadad" width="60" style="border-radius:50%"></td>
    <td><b>Ori Hadad</b></td>
    <td>Backend Lead</td>
    <td><a href="https://www.linkedin.com/in/ori-hadad">LinkedIn</a></td>
    <td><a href="https://github.com/ori-hadad">GitHub</a></td>
  </tr>
  <tr>
    <td><img src="https://user-images.githubusercontent.com/omer-len-profile.jpg" alt="Omer Len" width="60" style="border-radius:50%"></td>
    <td><b>Omer Len</b></td>
    <td>Integration & Authentication</td>
    <td><a href="https://www.linkedin.com/in/omer-len">LinkedIn</a></td>
    <td><a href="https://github.com/omer-len">GitHub</a></td>
  </tr>
  <tr>
    <td><img src="https://user-images.githubusercontent.com/shalev-kehaty-profile.jpg" alt="Shalev Kehaty" width="60" style="border-radius:50%"></td>
    <td><b>Shalev Kehaty</b></td>
    <td>Frontend Lead</td>
    <td><a href="https://www.linkedin.com/in/shalev-kehaty">LinkedIn</a></td>
    <td><a href="https://github.com/shalevkehaty">GitHub</a></td>
  </tr>
</table>

---

---

## 🏁 Getting Started / Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)

### Clone the Repository

```bash
git clone https://github.com/Hahabob/Reddit-Clone.git
cd Reddit-Clone
```

### Install Dependencies

#### Client

```bash
cd Client
npm install
# or
yarn install
```

#### Server

```bash
cd ../server
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file in the `server/` directory with the following:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Optionally, set `VITE_SERVER_URL` in `Client/.env` (defaults to `http://localhost:3001`).

### Running the App Locally

#### Start the Server

```bash
cd server
npm run dev
# or
yarn dev
```

#### Start the Client

```bash
cd ../Client
npm run dev
# or
yarn dev
```

The client will run on `http://localhost:5173` (or as specified by Vite), and the server on `http://localhost:3001`.

---

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
- Response JSON: `{ url, public_id, width, height, format }`

---
