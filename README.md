# CoreSync Engine

CoreSync Engine is a production-ready, decoupled REST API built with Node.js, TypeScript, and Express. It utilizes a relational PostgreSQL database managed via Prisma 7 and includes enterprise-grade security features like token-based authentication guards and role-based access logic. 

Designed independently as a robust backend template to demonstrate clean architecture, type safety, and scalable development practices.

## 🚀 Key Architectural Features

* **Strict Route Guarding:** Custom middleware for extraction, token validation, and session-context injection using JSON Web Tokens (JWT).
* **Prisma 7 & PostgreSQL:** Modern relational database schema mapping, containerized cleanly to isolate local development infrastructure.
* **TypeScript Native:** End-to-end type safety, from data models to middleware request lifecycle extensions.
* **Production-Grade Directory Structure:** Completely decoupled layers separating route management, controller logic, and middleware enforcement.

## 🛠️ Tech Stack & Tools

* **Runtime:** Node.js (v18+)
* **Language:** TypeScript
* **Framework:** Express.js
* **ORM:** Prisma 7
* **Database:** PostgreSQL
* **Containerization:** Docker & Docker Compose

## 📦 Local Installation & Setup

Ensure you have [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/) installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/coresync-api.git](https://github.com/YOUR_GITHUB_USERNAME/coresync-api.git)
   cd coresync-api