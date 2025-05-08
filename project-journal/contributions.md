# 👥 Team Roles and Contributions

Our team worked collaboratively as full-stack developers, each taking ownership of specific features from design to deployment.
Below is a summary of contributions, with particular emphasis on individual strengths and responsibilities.

## 👤 Ashish Bhusal – Full Stack Developer | DevOps & Infra Lead

Ashish contributed across the entire stack with a strong focus on secure authentication, admin/manager functionality, CI/CD, and cloud automation.

### 🚀 Key Contributions

- **Authentication & Authorization**
  - Implemented end-to-end **login/signup** functionality using **JWT** and **Google OAuth2**
  - Enabled **role-based access control** across both frontend and backend (Customer, Manager, Admin)
  - Ensured secure token handling, protected routes, and proper redirect behavior for authenticated users

- **Admin & Manager Features**
  - Designed and implemented **Admin APIs** for managing restaurants
  - Developed **Manager Dashboard** with integrated frontend views and backend support for creating and updating restaurants.

- **DevOps & Deployment Automation**
  - **Dockerized** both frontend (React + Nginx) and backend (Spring Boot)
  - Built a **CI/CD pipeline** using **GitHub Actions** to:
    - Build and push Docker images to Docker Hub
    - Inject secrets dynamically using GitHub Secrets
    - SSH into EC2 and deploy using Docker Compose

- **Infrastructure Provisioning**
  - Used **Terraform** to provision EC2 instances and set up deployment-ready infrastructure
  - Ensured reproducible infrastructure and separation between development and production environments

---
