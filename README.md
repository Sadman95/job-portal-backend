# Job Portal API

A RESTful API for a Job Portal allowing candidates and employers to interact through job postings and applications.

## Features

### Employers can:

- Create, update, delete, and list job posts
- Receive real-time notifications on job applications via Socket.io

### Candidates can:

- View all job posts
- Apply to jobs with cover letter and resume (file upload supported)
- Search/filter job posts and applications

### Admin can:

- View all jobs and applications

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.io
- TypeScript
- Multer (for file uploads)
- Zod (for validation)

## Prerequisites

- Node.js >= 18.x
- Docker & Docker Compose

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=job_portal
JWT_SECRET=your_jwt_secret
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Sadman95/job-portal-backend.git
cd job-portal-backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Running with Docker

```bash
docker-compose up --build
```

## API Base URL

```
http://localhost:5000/api/v1/
```

## API Endpoints

### Job Posts

- `GET /job-posts` — List job posts
- `POST /job-posts` — Create a job post
- `PATCH /job-posts/:id` — Update a job post
- `DELETE /job-posts/:id` — Delete a job post

### Job Applications

- `GET /job-applications` — List job applications
- `POST /job-applications/:jobId` — Apply to a job

## File Upload

- Resumes are uploaded using `multipart/form-data` with Multer.

## Real-time Notifications

- Socket.io is used for notifying employers when a candidate applies.

---

## Sample credentials for testing

- Admin
  - email: admin@admin.com
  - password: admin
- Employer
  - email: emp1@employer.com
  - password: emp1
- Candidate
  - email: can1@candidate.com
  - password: can1

## Deployed link

[Deployed on AWS](http://56.228.2.135:80)

## License

MIT
