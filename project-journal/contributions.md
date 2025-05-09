# 👥 Team Roles and Contributions

Our team worked collaboratively as full-stack developers, each taking ownership of specific features from design to
deployment.
Below is a summary of contributions, with particular emphasis on individual strengths and responsibilities.

## 👤 Ashish Bhusal – Full Stack Developer

Ashish contributed across the entire stack with a strong focus on secure authentication, admin/manager functionality
including approval workflows, CI/CD, and cloud automation.

### 🚀 Key Contributions

**Authentication & Authorization**
  - Implemented end-to-end **login/signup** functionality using **JWT** and **Google OAuth2**.
  - Enabled **role-based access control** across both frontend and backend (Customer, Manager, Admin).
  - Ensured secure token handling, protected routes, and proper redirect behavior for authenticated users.

**Admin & Manager Features**
  - Designed and implemented **Admin APIs** for managing restaurants, including **approval and disapproval workflows** for
    restaurant submissions or changes.
  - Developed **Manager Dashboard** with integrated frontend views and backend support for creating, updating, and
    managing restaurant status (e.g., pending approval, approved, rejected).

**DevOps & Deployment Automation**
- **Dockerized** both frontend (React + Nginx) and backend (Spring Boot).
- Built a **CI/CD pipeline** using **GitHub Actions** to:
  - Build and push Docker images to Docker Hub.
  - Inject secrets dynamically using GitHub Secrets.
  - SSH into EC2 and deploy using Docker Compose.
  - Set up MongoDB Atlas and prepare seed scripts

- **Infrastructure Provisioning**
  - Used **Terraform** to provision EC2 instances and set up deployment-ready infrastructure.
  - Ensured reproducible infrastructure and separation between development and production environments.

---

## 👤 Nishan – Full Stack Developer

Nishan played a crucial role in developing core backend services, implementing analytics, and supporting deployment
processes.

### 🚀 Key Contributions

- **Booking & Restaurant API Development**
  - Designed and implemented robust **RESTful APIs** for managing bookings (create, view, cancel) and restaurant data (
    listings, details, availability).
  - Developed the core backend logic for the **booking engine**, including availability checks, reservation processing,
        and confirmation workflows.
  - Ensured API scalability and proper data validation for core business logic.


- **Analytics & Reporting**
  - Integrated an **analytics framework** to track restaurant performance metrics.
  - Developed dashboards or reporting features to visualize key data points for reporting.


- **Deployment & Operational Support**
  - Collaborated on the **deployment strategy** and assisted in troubleshooting deployment issues.
  - Contributed setting up deployment based on AWS Load Balancer and Auto Scaling Group 

---

## 👤 Vatsal – Full Stack Developer

Vatsal focused on the critical aspects of the booking system, user reviews, and the underlying database architecture.

### 🚀 Key Contributions

- **Frontend Development & UI Initialization**
  - Initialized the frontend/UI project setup from scratch.
  - Built the **restaurant details page**, integrating restaurant data, **embedded reviews**, and **Google Maps** for location display.
  - Implemented the complete **booking flow in the UI**, including booking creation, **viewing bookings**, and cancellation interface.
  - Developed the **search UI component** for restaurant discovery and filtering.

- **Booking System Logic**
  - Developed the **cancel component** in the booking API to support flexible cancellations.
  - Implemented UI and logic allowing users to **view their upcoming, past, and cancelled bookings**, with the ability to **cancel active bookings**.
  - Ensured seamless interaction between frontend and backend during the booking lifecycle.

- **User Reviews & Ratings System**
  - Created full **CRUD operations for user reviews**, enabling submission, editing, deletion, and viewing.
  - Integrated the reviews module into the restaurant details page for better user experience.

- **Database Design & Schema Implementation**
  - Created and structured the core **databases**, ensuring appropriate schema relationships and data integrity.
  - Contributed to database optimization for performance and scalability.

---

## 👤 Ganesh – Full Stack Developer

Ganesh was instrumental in developing the platform's search capabilities, email notification system, and key
administrative functionalities.

### 🚀 Key Contributions

- **Search Functionality**
  - Implemented a comprehensive search feature allowing users to find restaurants based on various criteria such as name, location (city, state, zip), cuisine type, and availability.
  - Optimized search queries on the backend and refined frontend display logic for performance and enhanced user experience.

- **Email Notification System**
  - Designed and integrated an email notification system (e.g., using Mailjet or similar services) for critical user interactions.
  - Developed email templates and backend triggers for booking confirmations, cancellations, account verifications, and password resets.

- **Admin Restaurant Management**
  - Developed APIs and UI components enabling restaurant admins to manage, approve, and delete restaurants.
  - Development of key user-facing sections, including the restaurant listing pages, detailed restaurant views,
 
- **WireFrames**
  - Built wireframes for the application.
