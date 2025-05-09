[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/5Qp4_Wqy)

# Team Project for 202 Section-02

Team: The Paladins

- Ganesh Thampi
- Vatsal Gandhi
- Nishan Paudel
- Ashish Bhusal

### Live Website http://ec2-54-151-32-141.us-west-1.compute.amazonaws.com/


# 🍽️ BookTable - Restaurant Table Reservation System

## 📋 Table of Contents

- [Team Project for 202 Section-02](#team-project-for-202-section-02)
- [🍽️ BookTable - Restaurant Table Reservation System](#️-booktable---restaurant-table-reservation-system)
  - [📋 Table of Contents](#-table-of-contents)
  - [📌 Project Overview](#-project-overview)
  - [📌 BookTable - Feature Set](#-booktable-feature-set)
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

## 📌 BookTable - Feature Set

### 🔐 Authentication & Authorization

* **JWT-based Login/Signup** for Customers and Restaurant Managers
* **Google OAuth2 login** integration for seamless access
* **Role-Based Access Control** to authorize access for Customers, Managers, and Admins
* Conditional UI rendering based on user roles

### 🍽️ Customer-Facing Features

* **Search Restaurants** by date, time, number of people, and optionally location (City/State/Zip)
* **View Restaurant Cards** with:

  * Name, Cuisine, Cost rating, Review count, Ratings, and Availability
  * Dynamic booking slots (±30 minutes)
* **Restaurant Detail View** with:

  * Descriptions, photos, reviews, and Google Maps location
* **Book a Table** with real-time availability and receive email/SMS confirmation
* **View & Cancel Bookings** via the dashboard

### 🧑‍🍳 Restaurant Manager Features

* **Add New Restaurant Listings** with detailed metadata:

  * Address, contact info, hours, table sizes, and booking availability
* **Upload and Edit Restaurant Details,** including descriptions and images
* **Dashboard View** of all managed restaurants with reservation stats and status
* **Edit/Delete Restaurant Listings** directly from the dashboard

### 👨‍💼 Admin Features

* **Restaurant Approval Panel**

  * View pending restaurant listings with manager contact info
  * Approve or reject new submissions
* **Restaurant Moderation**

  * Remove non-compliant listings
* **Analytics Dashboard** showing:

  * Total monthly reservations based on time periods
  * Reservations based on restaurants

### 📅 Reservation Management

* **Create Reservation** API and UI
* **Cancel Reservation** with confirmation and backend updates
* **SMS/Email Notification Integration** for confirmed reservations
* **Booking validation** to prevent double booking and invalid times

### 🌐 Deployment & Infrastructure

* **Dockerized Frontend and Backend** for platform independence
* **CI/CD Pipeline** using GitHub Actions

  * Auto-build Docker images
  * Push to Docker Hub
  * Deploy to AWS EC2 using Docker Compose
* **Dynamic Secret Injection** using GitHub Secrets
* **Terraform Infrastructure Provisioning** for deployment and future scalability
* AWS AutoScaling Group with Load Balancer

### 🛠️ Technology Stack

* **Frontend:** React, Redux Toolkit, Material UI, Axios
* **Backend:** Spring Boot, Spring Security, OAuth2, JWT
* **Database:** MongoDB Atlas
* **DevOps:** Docker, GitHub Actions, AWS EC2, Terraform, Nginx, DockerHub
* **APIs:** RESTful, JSON-based with input validation and error handling


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

Changes pushed to the `master` branch are automatically deployed to S3 via GitHub Actions.

To view the deployed frontend:
1. Visit the S3 static website URL: http://booktable-preview-frontend-dev.s3-website-us-east-1.amazonaws.com/

2. This site reflects the most recent deployment from the `master` branch and is ideal for internal testing or pre-production reviews.

---

## 🤝 Contributing

- Use conventional commit messages (e.g., `feat:`, `fix:`, `chore:`)
- Write clear, modular, well-documented code
- Use PRs for all changes
- Keep frontend and backend folders scoped and clean
- Keep deployment and configuration scripts inside the `deployment/` folder
