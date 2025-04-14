# 🍽️ Restaurant Table Reservation System - Frontend

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Features](#features)

## 📌 Project Overview
This is the frontend of the **Restaurant Table Reservation System**, built using **React** and styled with **Material UI**. It allows customers to search and book restaurants, restaurant managers to manage listings, and admins to oversee the platform.

## 📌 Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (Latest LTS version recommended) - [Download here](https://nodejs.org/)
- **npm** (Comes with Node.js) or **yarn** (optional)
- **Git** - [Download here](https://git-scm.com/)

## 📌 Getting Started

### 1. Clone the Repository
```bash
git clone <repository_url>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```
This will install all the required dependencies listed in `package.json`.

### 3. Start the Development Server
```bash
npm start
```
The application will start in development mode and open in your default browser at [http://localhost:3000](http://localhost:3000).


## Running with Docker

### ⚙️ 1. Run Frontend Without Backend

You can run just the frontend container, even if the backend is not needed:

```bash
docker-compose up --no-deps frontend
```

- Skips starting backend services
- Useful for UI-only development or when mocking APIs

---

### 🚀 2. Run Everything Together (Full Stack)

To start the entire system (frontend + backend + DB + mongo-express):

```bash
docker-compose up --build
```

- Full end-to-end stack
- React frontend served via Nginx
- Spring Boot backend with MongoDB and visual admin UI (Mongo Express)

## 📌 Project Structure
```
frontend/
├── public/             # Static files
├── src/                # Source files
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── styles/         # Theme and styling
│   ├── utils/          # Utility functions
│   ├── constants/      # Application constants
│   ├── App.js          # Main application component
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## 📌 Dependencies
The project uses several key dependencies:
- React
- Material UI (@mui/material)
- React Router (react-router-dom)
- Axios for API calls

## 📌 Features
- Responsive layout with Material UI
- Restaurant listing and search
- Detailed restaurant view
- Booking system
- User authentication
- Custom theme configuration

## 📌 Team Guidelines
- Follow the established project structure
- Use meaningful commit messages
- Keep components modular and reusable
- Maintain consistent code style
- Document any complex logic
- Coordinate with team members before making major changes
