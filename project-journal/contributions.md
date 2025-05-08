# 👥 Team Roles and Contributions

Our team worked collaboratively as full-stack developers, each taking ownership of specific features from design to deployment.
Below is a summary of contributions, with particular emphasis on individual strengths and responsibilities.

## 👤 Ashish Bhusal – Full Stack Developer 

Ashish contributed across the entire stack with a strong focus on secure authentication, admin/manager functionality including approval workflows, CI/CD, and cloud automation.

### 🚀 Key Contributions

-   **Authentication & Authorization**
  -   Implemented end-to-end **login/signup** functionality using **JWT** and **Google OAuth2**.
  -   Enabled **role-based access control** across both frontend and backend (Customer, Manager, Admin).
  -   Ensured secure token handling, protected routes, and proper redirect behavior for authenticated users.

-   **Admin & Manager Features**
  -   Designed and implemented **Admin APIs** for managing restaurants, including **approval and disapproval workflows** for restaurant submissions or changes.
  -   Developed **Manager Dashboard** with integrated frontend views and backend support for creating, updating, and managing restaurant status (e.g., pending approval, approved, rejected).

-   **DevOps & Deployment Automation**
  -   **Dockerized** both frontend (React + Nginx) and backend (Spring Boot).
  -   Built a **CI/CD pipeline** using **GitHub Actions** to:
    -   Build and push Docker images to Docker Hub.
    -   Inject secrets dynamically using GitHub Secrets.
    -   SSH into EC2 and deploy using Docker Compose.

-   **Infrastructure Provisioning**
  -   Used **Terraform** to provision EC2 instances and set up deployment-ready infrastructure.
  -   Ensured reproducible infrastructure and separation between development and production environments.

---

## 👤 Nishan – Full Stack Developer 

Nishan played a crucial role in developing core backend services, implementing analytics, and supporting deployment processes.

### 🚀 Key Contributions

-   **Analytics & Reporting**
  -   Integrated an **analytics framework** to track user interactions and restaurant performance metrics.
  -   Developed dashboards or reporting features to visualize key data points for business insights.

-   **Booking & Restaurant API Development**
  -   Designed and implemented robust **RESTful APIs** for managing bookings (create, view, cancel) and restaurant data (listings, details, availability).
  -   Ensured API scalability and proper data validation for core business logic.

-   **Deployment & Operational Support**
  -   Collaborated on the **deployment strategy** and assisted in troubleshooting deployment issues.
  -   Contributed to scripting and configuration management for server environments.

---

## 👤 Vatsal – Full Stack Developer

Vatsal focused on the critical aspects of the booking system, user reviews, and the underlying database architecture.

### 🚀 Key Contributions

-   **Booking System Logic**
  -   Developed the core backend logic for the **booking engine**, including availability checks, reservation processing, and confirmation workflows.
  -   Implemented features to manage booking modifications and cancellations.

-   **User Reviews & Ratings System**
  -   Designed and implemented the **reviews module**, allowing users to submit, view, and rate restaurants.
  -   Developed backend support for review moderation and display logic.

-   **Database Design & Schema Management**
  -   Led the design and implementation of the **database schema** (e.g., using SQL or NoSQL databases).
  -   Ensured data integrity, relationships, and optimized queries for performance.

---

## 👤 Ganesh – Full Stack Developer 

Ganesh was instrumental in developing the platform's search capabilities, email notification system, and key administrative functionalities.

### 🚀 Key Contributions

-   **Search Functionality**
  -   Implemented a comprehensive **search feature** allowing users to find restaurants based on