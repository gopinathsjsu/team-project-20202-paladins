# 📚 BookTable Backend

BookTable is a full-stack restaurant reservation platform inspired by OpenTable. This is the backend service built with **Spring Boot**, using **MongoDB** for storage and providing **JWT + OAuth2 authentication**, **role-based access**, and REST APIs for frontend integration.

---

## 🚀 Tech Stack

- **Java 17**
- **Spring Boot 3**
- **Spring Security 6 (JWT + OAuth2)**
- **MongoDB**
- **Maven**
- **Docker & Docker Compose**
- **Swagger (OpenAPI 3)**
- **GitHub Actions (CI/CD)**

---

## 🔐 Authentication Options

Supports two login methods:

- ✅ **Email/Password Login (JWT)**
- ✅ **Google OAuth2 Login**

---

### 📟 User Roles & Access

| Role                | Permissions |
|---------------------|-------------|
| `CUSTOMER`          | Search, Book, Cancel reservations |
| `RESTAURANT_MANAGER`| Add/Edit Restaurant Listings |
| `ADMIN`             | Approve/Delete Listings, View Analytics |

---

## 🧪 Testing

Standalone unit tests are included for core utility classes like `JwtUtil`.

```bash
./mvnw test
```

---

## 📆 Sample Public API

```http
GET /api/public/hello
```

✅ Returns `Hello from BookTable!`  
✅ No authentication required  
✅ Use this to verify the backend is running

---

## 🔎 API Documentation (Swagger UI)

Interactive API docs with token support are available at:

```
http://localhost:8080/swagger-ui.html
```

- Click **Authorize 🔐** to enter your JWT token
- Protected endpoints (e.g., `/api/admin/**`) are marked with a 🔒 icon
- Public endpoints are open by default

---

## 🔐 Google OAuth2 Login

### Set Config in `application.properties`

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

- After successful login, Redirected to frontend with token:

```http
http://localhost:3000/oauth2/success?token=YOUR_JWT
```


---

## ❌ Unauthorized Requests

If you hit a protected API without a token, you'll receive:

```json
{
  "error": "Unauthorized",
  "message": "JWT token is missing or invalid"
}
```


---

## 🛠️ Running the App Locally

### Clone the Repository

```bash
git clone https://github.com/gopinathsjsu/team-project-20202-paladins.git
cd team-project-20202-paladins/booktable-backend
```

## Getting Started Locally

### Run with Docker Compose (Recommended)

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

## 📚 Academic Note

This project is developed as part of a team-based Software Engineering course with emphasis on:
- Agile Scrum methodology
- Clean architecture
- End-to-end team collaboration
