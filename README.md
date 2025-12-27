# ✈️ TripGo - Travel Booking Application

Welcome to the **TripGo** repository, a comprehensive travel booking platform built for **Đồ án Chuyên ngành 2**. This repository contains the source code for both the **Backend API** and the **Frontend Web Application**.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-8.11-yellow)
![Redis](https://img.shields.io/badge/Redis-Latest-red)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

## 📖 About The Project

**TripGo** is a full-stack system designed to provide a seamless travel booking experience:

- 🏨 **Hotel & Tour Booking**: Full reservation flow for users.
- 🔍 **Advanced Search**: High-performance search powered by Elasticsearch.
- 💬 **Real-time Chat**: WebSocket-based support chat between Users and Admins.
- 💳 **Payments**: Secure integration with PayOS.
- 📊 **Admin Dashboard**: Comprehensive management of bookings, users, and services.

## 🚀 Live Demo & API Documentation

- **Backend API (Swagger UI)**: [https://tripgo-api.onrender.com/swagger-ui/index.html](https://tripgo-api.onrender.com/swagger-ui/index.html)
  > [!WARNING] > **Render Free Tier**: The server sleeps after 15 mins of inactivity. Please wait 1-2 mins for the first request to wake it up.

## 🛠️ Tech Stack

### 🎨 Frontend (Client)

The frontend is built with **React** to ensure a dynamic and responsive user interface.

- **Core**: React 18, React Router DOM v6
- **Styling**: Bootstrap 5, React Bootstrap, SCSS/CSS
- **State & API**: Context API, Axios
- **Real-time**: StompJS, SockJS (WebSocket communication)
- **UI Components**:
  - `react-datepicker` (Date selection)
  - `react-slick`, `slick-carousel` (Sliders)
  - `react-image-gallery` (Image viewing)
  - `react-toastify` (Notifications)
  - `yet-another-react-lightbox` (Media display)

### ⚙️ Backend (Server)

Robust RESTful API built with Java and Spring Boot.

- **Core**: Java 17, Spring Boot 3
- **Database**: MySQL (Main), Redis (Caching)
- **Search Engine**: Elasticsearch
- **Message Broker**: Apache Kafka (Optional/Enabled features)
- **Containerization**: Docker
- **Deployment**: Render

## 📂 Project Structure

The repository is organized to house the React frontend within the `src` directory, standard for Create React App projects.

### Frontend Directories (`src/`)

- **`pages/User`**: Components for the customer-facing portal (Home, Hotel Detail, Tour Booking, Profile).
- **`pages/Admin`**: Components for the administration dashboard (Statistics, User Management, Chat Console).
- **`components`**: Reusable UI components (Navbar, Footer, Cards).
- **`api`**: Axios configuration and API service calls.
- **`assets`**: Static images and styles.

## 🌍 Project Repositories

- **Main Repository**: [https://github.com/datqn123/DACN2.git](https://github.com/datqn123/DACN2.git)
- **Recommender System**: [https://github.com/datqn123/recommender-trip-go-api.git](https://github.com/datqn123/recommender-trip-go-api.git)

## 💻 Getting Started (Local Dev)

### Prerequisites

- Node.js & npm
- JDK 17+
- Maven
- Docker (optional but recommended for DBs)

### 1. Clone the Repo

```bash
git clone https://github.com/datqn123/DACN2.git
cd dacn2
```

### 2. Backend Setup

- Configure `src/main/resources/application.properties` with your MySQL/Redis credentials.
- Run dependencies via Docker:
  ```bash
  docker-compose up -d
  ```
- Start the Spring Boot application.

### 3. Frontend Setup

Navigate to the root directory (where `package.json` is located):

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`.

## 📬 Contact & Support

If you have any questions about this project/capstone, feel free to reach out!

---

_Happy Coding!_ 🚀
