# 📚 BookTable Backend

BookTable is a full-stack restaurant reservation platform inspired by OpenTable. This is the backend service built with **Spring Boot**, using **MongoDB** as the database and providing **JWT + OAuth2 authentication**, **role-based access**, and REST APIs for frontend integration.

---

## 🚀 Tech Stack

- **Java 17**
- **Spring Boot 3**
- **Spring Security 6** (OAuth2 + JWT)
- **MongoDB** (NoSQL Database)
- **Maven** (Build tool)
- **AWS** (For deployment - EC2, Load Balancer)

---

## 🔐 Authentication & Authorization

The backend supports two login options:

- ✅ **Google OAuth2 Login**
- ✅ **Email/Password Login (JWT)**

### 🧾 User Roles & Access

| Role                | Permissions |
|---------------------|-------------|
| `CUSTOMER`          | Search, Book, Cancel reservations |
| `RESTAURANT_MANAGER`| Add/Edit Restaurant Listings |
| `ADMIN`             | Approve/Delete Listings, View Analytics |

Authorization is handled via Spring Security filters using role-based access control (RBAC).

---

## 📦 Sample Public API

- **Endpoint:** `GET /api/hello`
- **Access:** Public (no authentication)
- **Response:** `"Hello from BookTable!"`

Use this to verify the backend is running correctly.

---

## 🛠️ Getting Started Locally

### Option A: Run with Docker Compose (Recommended)

1. Navigate to the deployment folder:

```bash
cd ../Deployment
```

2. Start all services:

```bash
docker-compose up --build
```

3. Access services:
- Spring Boot backend: [http://localhost:8080](http://localhost:8080)
- Mongo Express (GUI): [http://localhost:8081](http://localhost:8081)

MongoDB is automatically started in a container with user `root` and password `example`.

> 💡 You can view your database through Mongo Express.

---

### Option B: Run Manually (Non-Docker)

1. Clone the Repository

```bash
git clone https://github.com/gopinathsjsu/team-project-20202-paladins.git
cd team-project-20202-paladins/booktable-backend
```

2. Configure MongoDB

Ensure MongoDB is running locally at:

```
mongodb://localhost:27017/booktable
```

Create a `.env` file or edit `application.properties`:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/booktable
spring.security.oauth2.client.registration.google.client-id=GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=GOOGLE_CLIENT_SECRET
```

3. Run the App

```bash
./mvnw spring-boot:run
```

---

## 🧪 Testing APIs

Use **Postman** or your browser to test endpoints like:

```
http://localhost:8080/api/hello
```

---

## 📚 Academic Note

This project is developed as part of a team-based Software Engineering course with emphasis on:
- Agile Scrum methodology
- Clean architecture
- End-to-end team collaboration
