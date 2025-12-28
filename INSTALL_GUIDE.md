# Production & Development Installation Guide

This document provides step-by-step instructions to install and run the **Technical Visit (Visite Technique)** application.

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Java 21** (JDK 21)
- **Node.js** (v18 or later) & **npm**
- **Docker** (optional, for easier database setup)
- **MySQL** (if not using Docker)
- **Angular CLI** (`npm install -g @angular/cli`)

---

## 🚀 Backend Setup (Spring Boot)

The backend is located in the root directory.

### 1. Database Configuration
If you have Docker installed, you can start MySQL using a container. Otherwise, ensure a MySQL server is running locally.

Create a database named `visite-technique`:
```sql
CREATE DATABASE `visite-technique` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update the configuration in `src/main/resources/application.properties` (or `application-dev.properties`):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/visite-technique
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2. Run the Backend
From the root directory:
```bash
./mvnw clean spring-boot:run
```
The API will be available at `http://localhost:8085`.
Swagger UI: `http://localhost:8085/swagger-ui/index.html`

---

## 🎨 Frontend Setup (Angular)

The frontend is located in the `frontend/` directory.

### 1. Install Dependencies
Navigate to the frontend directory and install the necessary packages:
```bash
cd frontend
npm install
```

### 2. Configuration
Check `frontend/src/environments/environment.ts` to ensure the API URL matches your backend:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8085/api'
};
```

### 3. Run the Frontend
Start the development server:
```bash
npm start
```
The application will be available at `http://localhost:4200`.

---

## 🔐 Credentials (Default)

- **Admin**: `admin` / `admin`
- **User**: `user` / `user`

---

## 🌍 Internationalization (i18n)

The application supports multiple languages:
- **French** (Default)
- **English**
- **Arabic** (RTL support included)

To add a new language, create a JSON file in `frontend/src/assets/i18n/` and register it in `AppComponent`.
