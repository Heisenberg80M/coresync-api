## CoreSync API Engine

CoreSync is an enterprise-grade, high-performance Data Synchronization API built with **Node.js**, **Express**, and **TypeScript**. The platform implements an isolated multi-tenant architecture, allowing secure, concurrent external inventory catalog syncing and optimized cloud storage lifecycles.

Built with a fully decoupled database-to-runtime configuration pattern utilizing the latest features of **Prisma 7**, the system relies on native PostgreSQL driver adapters for maximized throughput.

## 🚀 Key Architectural Features

- **Decoupled Database Infrastructure:** Orchestrated locally via Dockerized PostgreSQL containers.
- **Prisma 7 Driver Layer:** Employs `@prisma/adapter-pg` and native connection pooling instead of legacy heavy Rust binaries.
- **Secure Enterprise Data Pipeline:** Uses high-performance relational database `upsert` models to gracefully sync real-time payloads.
- **Zero-Bottleneck Cloud Storage Pattern:** Generates mock AWS S3 Pre-Signed URLs to show how to scale file uploads while keeping server memory usage flat.
- **Identity & Context Shielding:** Built-in JWT token extraction layers that reject unauthorized actors before they ever hit database pipelines.

---

## 🛠️ System Tech Stack

- **Runtime Environment:** Node.js (TypeScript v6.0.x)
- **Framework:** Express.js
- **Database ORM:** Prisma v7.x (with Native PostgreSQL Adapters)
- **Database Engine:** PostgreSQL (Containerized via Docker)
- **Security Protocols:** BcryptJS (12 Salt Rounds), JSON Web Tokens (JWT)

---

## 📦 Local Installation & Setup

### 1. Prerequisites
Ensure you have the following systems active on your machine:
- Docker & Docker Compose
- Node.js (v18 or higher recommended)
- npm

### 2. Clone and Install Dependencies
```bash
git clone [https://github.com/Heisenberg80M/coresync-api.git](https://github.com/Heisenberg80M/coresync-api.git)
cd coresync-api
npm install 
```


### 3. Spin Up Infrastructure & Generate Client Tables
```bash
docker-compose up -d # Start the PostgreSQL database container
npx prisma migrate dev --name init_system_schemas # Run migrations to the Prisma Client binaries
npx prisma generate  # Sync the Prisma Client binaries
```

### 4. Start the Development Server
```bash
npm run dev
```

---

## 📡 Core API Gateway Specifications
All core data endpoints require a valid access token sent inside the header structure:
`Authorization: Bearer <your_jwt_token>`

---

## 🔑 Authentication Services
- `POST /api/v1/auth/register` - Instantiate a new system manager profile.
- `POST /api/v1/auth/login` - Authenticate and fetch a temporary session key.

---

## 🔄 Multi-Tenant Sync Services (Protected)
- `POST /api/v1/sync/products` - Sync a product line. Updates existing records via SKU mapping or creates a new entry if none exist.
- `GET /api/v1/sync/products` - Pull all synchronized catalog arrays belonging only to your active session profile.

---

## ☁️ Cloud Asset Services (Protected)
- `POST /api/v1/storage/presign` - Request a secure, pre-signed AWS S3 asset upload gateway link for high-speed file storage (filename and fileType required).