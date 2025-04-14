[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/5Qp4_Wqy)

# Team Project for 202 Section-02

Team: The Paladins

- Ganesh Thampi
- Vatsal Gandhi
- Nishan Paudel
- Ashish Bhusal


# 🍽️ BookTable - Restaurant Table Reservation System

## 📋 Table of Contents

- [Team Project for 202 Section-02](#team-project-for-202-section-02)
- [🍽️ BookTable - Restaurant Table Reservation System](#️-booktable---restaurant-table-reservation-system)
  - [📋 Table of Contents](#-table-of-contents)
  - [📌 Project Overview](#-project-overview)
  - [🚀 Tech Stack](#-tech-stack)
  - [🗂️ Monorepo Structure](#️-monorepo-structure)
  - [🧰 Getting Started](#-getting-started)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Build and Run All Services](#2-build-and-run-all-services)
  - [🐳 Docker Compose Usage](#-docker-compose-usage)
    - [Full Stack](#full-stack)
    - [Run Frontend Only](#run-frontend-only)
    - [Run Backend + DB](#run-backend--db)
    - [Tear Down](#tear-down)
  - [🔄 CI/CD Workflow](#-cicd-workflow)
  - [🚀 Deployment](#-deployment)
    - [🏁 Production Deployment](#-production-deployment)
    - [🌐 Accessing the Preview Website](#-accessing-the-preview-website)
  - [🤝 Contributing](#-contributing)

---

## 📌 Project Overview

BookTable is a full-stack restaurant table reservation system designed to facilitate seamless restaurant bookings for customers, restaurant management for owners, and administrative oversight for platform admins.

The application includes:

- A responsive **React frontend** with Material UI
- A **Spring Boot backend** with MongoDB integration
- A **Docker-based development workflow** for full-stack testing
- **GitHub Actions CI/CD** support

---

## 🚀 Tech Stack

- **Frontend**: React, Material UI, React Router, Axios
- **Backend**: Java 21, Spring Boot, Spring Security, MongoDB
- **Database**: MongoDB
- **DevOps**: Docker, Docker Compose, GitHub Actions, AWS EC2 (Production)

---

## 🗂️ Monorepo Structure

```
team-project-20202-paladins/
├── booktable-backend/       # Spring Boot backend
├── frontend/                # React frontend
├── deployment/              # Docker Compose and deployment config
├── .github/workflows/       # GitHub Actions pipelines
└── README.md                # Project documentation
```

---

## 🧰 Getting Started

### 1. Clone the Repository

```bash
git clone <repo_url>
cd team-project-20202-paladins
```

### 2. Build and Run All Services

```bash
cd deployment
docker-compose up --build
```

- React app at: [http://localhost:3000](http://localhost:3000)
- Backend API at: [http://localhost:8080](http://localhost:8080)
- Mongo Express at: [http://localhost:8081](http://localhost:8081)
- Mongo Express default credentials:
    - Username: admin
    - Password: pass

---

## 🐳 Docker Compose Usage

All Docker-related orchestration is handled from the `deployment/` directory.

### Full Stack

```bash
cd deployment
docker-compose up --build
```

### Run Frontend Only

```bash
cd deployment
docker-compose up --no-deps frontend
```

### Run Backend + DB

```bash
cd deployment
docker-compose up backend mongodb
```

### Tear Down

```bash
cd deployment
docker-compose down
```

---

## 🔄 CI/CD Workflow

- GitHub Actions runs on the `master` branch 
- CI-ready structure for future Docker builds and deployments

---

## 🚀 Deployment

### 🏁 Production Deployment

The full-stack application is containerized and deployed to **AWS EC2** using Docker and deployment scripts. This provides:

- Full control over hosting
- Secure and scalable infrastructure
- Integration with AWS ecosystem (e.g., CloudWatch, ACM, Amazon S3)


### 🌐 Accessing the Preview Website

Changes pushed to the `preview` branch are automatically deployed to S3 via GitHub Actions.

To view the deployed frontend:
1. Visit the S3 static website URL: http://booktable-preview-frontend-dev.s3-website-us-east-1.amazonaws.com/

2. This site reflects the most recent deployment from the `preview` branch and is ideal for internal testing or pre-production reviews.

---

## 🤝 Contributing

- Use conventional commit messages (e.g., `feat:`, `fix:`, `chore:`)
- Write clear, modular, well-documented code
- Use PRs for all changes
- Keep frontend and backend folders scoped and clean
- Keep deployment and configuration scripts inside the `deployment/` folder
