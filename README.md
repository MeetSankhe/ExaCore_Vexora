# VyaparFlow — Export Logistics Readiness Platform

> **Export Logistics SaaS Platform for Indian MSMEs**  
> *Initial Pilot Geography: Palghar Industrial Region, Maharashtra*

VyaparFlow is a SaaS coordination platform designed for Indian MSMEs to convert complex, multi-agency export readiness workflows into one clear, explainable, and trackable digital operating system.

---

## 🚀 Quick Start & Launch Instructions

### 1. Development Server
The application server is running locally at:
```bash
http://localhost:3000
```

To restart or run locally from scratch:
```bash
# 1. Install dependencies
npm install

# 2. Synchronize database schema & seed golden demo dataset
npx prisma db push
npx prisma db seed

# 3. Start Next.js development server
npm run dev
```

---

## 🔑 Demo Credentials & Account Switcher

VyaparFlow includes an **Account Switcher Dropdown** and quick-role buttons in the top header bar on all screens.

| Persona | Email | Password | Primary Workflow |
| :--- | :--- | :--- | :--- |
| **Palghar MSME Exporter** | `msme@palghar-exports.com` | `password123` | Palghar Quality Agro Pvt Ltd (Alphonso Mango Pulp → UAE) |
| **Service Provider** | `provider@freight.com` | `password123` | Freight Forwarder, Certification Lab, CHA Customs Portal |
| **Platform Admin** | `admin@vyaparflow.com` | `password123` | Compliance Rules Engine Configurator & Audit Logs |

---

## 🏗️ Architecture & Core Components

- **Frontend Framework**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS.
- **Database & Persistence**: Prisma ORM with SQLite database (`dev.db`).
- **Deterministic Compliance Rules Engine**: Configures product-country requirements without opaque AI models (`lib/services/readiness.ts`).
- **Readiness Scoring Engine (0–100)**: Evaluates 5 weighted categories (Business 20%, Documents 25%, Certifications 20%, Packaging 15%, Shipment 20%) with critical dispatch blocker overrides.
- **Export Document Generator**: Server-side PDF generator (`lib/services/documentGenerator.ts`) for Commercial Invoice and Packing List drafts.
- **Logistics Rate Engine**: Multi-carrier quote comparison (cost, transit days, inclusions/exclusions).
