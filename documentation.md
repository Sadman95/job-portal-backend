# Documentation

# 🧾 System Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for a **Job Portal Backend System** that enables **users to register**, **employers to post jobs**, **candidates to apply for jobs**, and **admins to monitor the system**, with **real-time notifications** powered by **Socket.io**.

### 1.2 Intended Audience

- Backend Developers
- DevOps Engineers
- QA Testers
- Project Managers
- Technical Leads

### 1.3 Scope

The backend system will:

- Support user registration & login
- Provide role-based access (Admin, Employer, Candidate)
- Allow employers to post and manage jobs
- Allow candidates to view and apply to jobs
- Enable admins to monitor activities
- Send real-time notifications for job applications

---

## 2. Overall Description

### 2.1 Product Perspective

This system is the backend of a full-stack Job Portal application. It will expose RESTful APIs and use **MongoDB** for storage. Socket.io is used for real-time features. API documentation will be provided via Swagger or Postman.

### 2.2 User Roles

- **Admin**
- **Employer**
- **Candidate**

### 2.3 Assumptions and Dependencies

- The system uses **Node.js + TypeScript**
- Database: **MongoDB**
- Authentication: **JWT**
- Real-time Communication: **Socket.io**
- ORM: **Mongoose**
- Environment: Dockerized

---

## 3. System Features & Requirements

### 3.1 User Authentication

#### Functional Requirements:

- Register and login using email/password
- Password hashing using **bcrypt**
- JWT-based authentication
- Token expiry configured via `.env`
- Login returns access token
- Role is assigned at registration

#### Non-functional:

- Secure password storage
- Invalid credentials return `401 Unauthorized`

---

### 3.2 Role-Based Access Control (RBAC)

| Route                           | Access                 |
| ------------------------------- | ---------------------- |
| POST `/api/v1/jobs`             | Employer only          |
| PATCH `/api/v1/jobs/:id`        | Employer (Owner)       |
| POST `/api/v1/job-applications` | Candidate only         |
| GET `/api/v1/jobs`              | All(Employer specific) |

---

### 3.3 Job Management (Employers)

#### Functional Requirements:

- Employers can:
  - Create jobs
  - Update and delete their own jobs
  - View job listings
- Job fields:
  - `title` (required)
  - `description` (required)
  - `companyName` (required)
  - `location` (required)
  - `jobType` (required)
  - `salaryRange` (optional)
  - `skills` (optional)
  - `createdBy` (required)
  - `jobStatus`: `Active` | `Inactive`
  - Timestamps: `createdAt`, `updatedAt`

---

### 3.4 Job Viewing (Candidates)

#### Functional Requirements:

- View all jobs
- Optional features:
  - Pagination
  - Search by title, location, keyword

---

### 3.5 Job Applications (Candidates)

#### Functional Requirements:

- Apply to jobs
- Application fields:
  - `jobId` (required)
  - `candidateId` (required)
  - `coverLetter` (optional)
  - `resume` (optional)
  - `appliedAt` (auto-generated)

---

### 3.6 Admin Functionalities

#### Functional Requirements:

- View all jobs
- View all applications
- (Optional) Ban/unban users (soft delete)

---

### 3.7 Real-time Notification

#### Functional Requirements:

- Notify employer when a candidate applies
- Use Socket.io
- Notification includes:
  - Job title
  - Candidate name (if available)
  - Time of application

---

## 4. External Interface Requirements

### 4.1 REST API

- JSON-based HTTP APIs
- Uses standard HTTP response codes
- Documented via:
  - Swagger UI or
  - Postman Collection

### 4.2 Database

- MongoDB
- Mongoose ODM
- Collections:
  - `users`
  - `jobs`
  - `applications`

### 4.3 Real-time API

- **Socket.io**
- Event: `job:applied` → sent to employer room

---

## 5. Non-functional Requirements

| Requirement     | Description                                       |
| --------------- | ------------------------------------------------- |
| Security        | JWT auth, bcrypt password hashing                 |
| Performance     | Support for pagination & indexed fields           |
| Scalability     | Dockerized; can scale via container orchestration |
| Reliability     | Use of logging (Winston) and error handling       |
| Documentation   | Postman-based API docs                            |
| Maintainability | Modular folder structure using clean architecture |
| Portability     | Environment-specific config using `.env`          |
| Dev Experience  | Hot-reload with `ts-node-dev`, proper linting     |

---

## 6. Environment Setup

### 6.1 Development

- Node.js ≥ 16
- MongoDB local
- Docker + Docker Compose
- TypeScript
- Tools: Postman, VSCode

### 6.2 Production

- Dockerized containers
- Env vars loaded from `.env`
- MongoDB Atlas or hosted DB

---

## 7. Deployment Instructions

1. Clone the repo
2. Create `.env` file
3. Run:
   ```bash
   docker-compose up --build
   ```
4. Access API at: http://localhost:5000/api/v1

# 📦 Entity Definitions

Below is a structured set of entities tailored for the **Job Portal Application**, using consistent naming and relational references.

---

## 📌 Role

```ts
Role {
  id: string;            // e.g., "r_00001"
  title: 'admin' | 'employer' | 'candidate';
}
```

## 📌 User

```ts
User {
  id: string;
  role: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 📌 Job

```ts
Job {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  salaryRange?: {
    min: number;
    max: number;
  };
  skills?: string[];
  createdBy: string;     // FK to User.id
  jobStatus: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

## 📌 JobApplication

```ts
JobApplication {
  id: string;
  jobId: string;         // FK to Job.id
  candidateId: string;   // FK to User.id
  coverLetter?: string;
  resume?: string;
  appliedAt: Date;
}
```

## 📌 Notification

```ts
Notification {
  id: string;
  recipientId: string;   // FK to User.id (employer)
  jobId: string;         // FK to Job.id
  message: string;
  read: boolean;
  createdAt: Date;
}
```

# 🔌 API Endpoints – Job Portal Backend System

---

## 🧾 Auth

### 🧑‍💼 Register New User

- **Method:** POST
- **Access:** Public (Verified)
- **Description:** Create a new user account
- **Path:** `/auth/register`
- **Request Body:**
  - `name`
  - `email`
  - `password`
  - `roles` array (enum: admin | employer | candidate) — default: candidate
- **Responses:**
  - **201**
    - `statusCode`
    - `status`
    - `message`
    - `data`: { `access_token` }
  - **400 | 500**
    - `statusCode`
    - `status`
    - `message`

---

### 🔐 Login

- **Method:** POST
- **Access:** Public
- **Description:** Login using credentials
- **Path:** `/auth/login`
- **Request Body:**
  - `email`
  - `password`
- **Responses:**
  - **200**
    - `statusCode`
    - `status`
    - `message`
    - `data`: { `access_token` }
  - **400 | 404 | 500**
    - `statusCode`
    - `status`
    - `message`

---

## 📄 Job

### ➕ Create Job Post

- **Method:** POST
- **Access:** Private (employer)
- **Path:** `/jobs`
- **Request Body:**
  - `title*`
  - `description*`
  - `companyName*`
  - `location*`
  - `jobType*`
  - `salaryRange` (min, max)
  - `skills`
- **Responses:**
  - **201**
  - **400 | 500**

---

### 📥 List All Jobs

- **Method:** GET
- **Access:** Public
- **Path:** `/jobs`
- **Query:**
  - `page`
  - `limit`
  - `search`
  - `location`
  - `jobType`
- **Responses:**
  - **200**: List of jobs
  - **404 | 500**

---

### 🔍 Get Single Job

- **Method:** GET
- **Access:** Public
- **Path:** `/jobs/{id}`
- **Responses:**
  - **200**
  - **404 | 500**

---

### ✏️ Update Job

- **Method:** PATCH
- **Access:** Private (employer)
- **Path:** `/jobs/{id}`
- **Request Body:**
  - Any editable job fields
- **Responses:**
  - **200 | 400 | 404 | 500**

---

### ❌ Delete Job

- **Method:** DELETE
- **Access:** Private (employer)
- **Path:** `/jobs/{id}`
- **Responses:**
  - **204 | 404 | 500**

---

## 🧾 Job Application

### 📬 Apply to Job

- **Method:** POST
- **Access:** Private (candidate)
- **Path:** `/job-applications`
- **Request Body:**
  - `jobId*`
  - `coverLetter`
  - `resume`
- **Responses:**
  - **201**
  - **400 | 404 | 500**

### 📄 View Job Applications

- **Method:** GET
- **Access:** Private (admin)
- **Path:** `/job-applications`
- **Responses:**
  - **200 | 404 | 500**

---

## 🔔 Notifications (Socket.io)

> Real-time notifications are pushed via Socket.io to employers when a candidate applies to a job.

**Event: `job:applied`**  
**Payload:**

```json
{
	"recipientId": "_uniqueId",
	"jobId": "_uniqueId",
	"message": "New application for Frontend Developer"
}
```
