# KARBON - Coal Mine Carbon Footprint Calculator & Neutrality Roadmap

> **Tagline:** Measure • Reduce • Neutralize  
> **Core Concept:** *"KARBON goes beyond measuring carbon emissions by converting emission data into a structured reduction and carbon-neutrality roadmap."*

---

## 📌 Project Overview

**KARBON** is an industrial-grade, software-based carbon management platform specifically engineered for open-cast and underground coal-mining operations.

### 🚫 Hardware & Sensor-Free Operational Architecture
- **No IoT sensors or hardware required.**
- Coal-mine operational activity data is entered periodically from verified physical site records:
  - Diesel bowser dispensing meters & fuel slips
  - Heavy earthmoving equipment (HEMM) shift logs
  - Main receiving electrical substation (MRSS) utility bills
  - Explosives magazine issue registers
  - Production weighbridge dispatch manifests
  - Seam methane gas content laboratory assays

---

## 📐 Mathematical Calculation Model

Emissions calculations follow the international **GHG Protocol Corporate Standard** and **IPCC Guidelines**:

$$\text{CO}_2\text{e Emissions (kg)} = \text{Activity Quantity} \times \text{Emission Factor}$$

$$\text{Metric Tonnes CO}_2\text{e (tCO}_2\text{e)} = \frac{\text{CO}_2\text{e (kg)}}{1,000}$$

$$\text{Total Mine Carbon Footprint} = \sum (\text{Scope 1 Direct}) + \sum (\text{Scope 2 Purchased Electricity})$$

### Indicative Demo Emission Factors
*(Demo emission factors — replace with certified laboratory/grid factors before formal ESG submission)*
- **Diesel Combustion:** `2.687 kg CO₂e / litre` (Scope 1)
- **Grid Electricity:** `0.820 kg CO₂e / kWh` (Scope 2)
- **Heavy Fleet Haulage:** `2.712 kg CO₂e / litre` (Scope 1)
- **ANFO Blasting Explosives:** `0.175 kg CO₂e / kg` (Scope 1)
- **Fugitive Coal Seam Methane:** `28.000 kg CO₂e / kg CH₄` (Scope 1 GWP-100)

---

## 🧭 The 8-Stage Decarbonization Pipeline

```
Operational Data
      ↓
Carbon Calculation
      ↓
Emission Analysis
      ↓
Hotspot Identification
      ↓
Reduction Targets
      ↓
Reduction Actions
      ↓
Neutrality Roadmap
      ↓
Progress Monitoring
```

---

## 🗂️ Application Structure & Pages

1. **Portal / Login Page:** Role selector (Admin, Field Officer, Mine Manager) & platform introduction.
2. **Dashboard:** KPI summary (Total Footprint, Period delta, Achieved reduction, Hotspot callout, Source breakdown donut, Trend line).
3. **Mine Profile:** Facility configuration (Mine Name, ID, Location, Opencast/Underground, Reporting Period, Responsible Person).
4. **Activity Data Entry:** Tabbed logging for Fuel, Electricity, Transportation, and Other Operations with full CRUD.
5. **Carbon Footprint Calculation:** Itemized table demonstrating `Activity Data × Emission Factor = CO₂e` with factor calibration.
6. **Emission Analysis:** Source-wise contribution, Pareto breakdown, and hotspot abatement recommendations.
7. **Reduction Targets:** Target formulation with baseline benchmarks, target dates, and progress tracking.
8. **Neutrality Roadmap:** Visual timeline of the 7 roadmap milestones towards Net-Zero 2050.
9. **Progress Tracking:** Three-way benchmark: *Baseline vs Current vs Target Goal*.
10. **Audit Reports:** Formal print-ready GHG compliance report with auditor signature block.

---

## 👥 Role-Based Workspaces

- **Environmental Administrator:** Full access to configure emission factors, calibrate baselines, create targets, and author roadmap milestones.
- **Field Officer:** Streamlined operational view focused on entering shift logs, fuel dispenser slips, and substation readings.
- **Mine Operations Manager:** Executive oversight, compliance verification, and report printing.

---

## 🛠️ Technology Stack & Folder Structure

```
KARBON/
│
├── src/                               # Frontend (React 19, TypeScript, Tailwind CSS)
│   ├── components/                    # Header, Sidebar, MetricCard, DemoDataBadge, ProcessFlowBanner
│   ├── pages/                         # 10 Dedicated Pages (Dashboard, Activity, Calculation, Roadmap, etc.)
│   ├── services/                      # api.ts (REST client with automatic prototype store fallback)
│   ├── types/                         # karbon.ts (TypeScript interface declarations)
│   ├── data/                          # fallbackData.ts (Indicative initial defaults)
│   ├── App.tsx                        # Main application controller
│   └── main.tsx                       # React DOM entry point
│
├── backend/                           # Backend (Node.js, Express, REST APIs)
│   ├── config/                        # db.ts (MongoDB connection), emissionFactors.ts
│   ├── controllers/                   # karbonController.ts (Business logic & calculations)
│   ├── models/                        # Mongoose Models (Mine, ActivityRecord, EmissionRecord, ReductionTarget, RoadmapStage)
│   ├── routes/                        # api.ts (REST endpoints)
│   ├── services/                      # emissionCalculator.ts (Deterministic calculation engine)
│   └── data/                          # seedData.ts (Singrauli Colliery IV baseline seed records)
│
├── server.ts                          # Express server with Vite middleware dev mount
├── package.json
└── README.md
```

---

## 🚀 Running the Project in VS Code / Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- *(Optional)* MongoDB Community Edition or MongoDB Atlas cluster

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
To connect MongoDB, update `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/karbon_coalmine
```
*(If `MONGODB_URI` is omitted, the application automatically runs in zero-setup mode using its built-in in-memory / state store with complete interactive CRUD).*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/mine` | Retrieve active mine profile |
| `POST` | `/api/mine` | Update mine profile details |
| `GET` | `/api/activities` | Query operational activity records (`?period=`, `?category=`) |
| `POST` | `/api/activities` | Log new activity record (Fuel, Electricity, Transport, etc.) |
| `PUT` | `/api/activities/:id` | Update an existing activity record |
| `DELETE` | `/api/activities/:id` | Remove an activity record |
| `GET` | `/api/emissions` | Compute carbon footprint & source breakdown for selected period |
| `GET` | `/api/targets` | List reduction targets and current completion percentages |
| `POST` | `/api/targets` | Define a new reduction target |
| `GET` | `/api/roadmap` | Retrieve the 7-stage neutrality timeline |
| `PUT` | `/api/roadmap/:id` | Update stage progress % or completion status |
| `GET` | `/api/progress` | Benchmark Baseline vs Current vs Target Goal |
| `GET` | `/api/factors` | Retrieve configurable emission factors |
| `PUT` | `/api/factors/:key` | Calibrate an operational emission factor value |

---

## 📜 Disclaimer
This software is designed as an operational decision-support tool. Default emission factors are indicative demo values and should be replaced with verified regional factors (e.g. IPCC Tier 2/3 or national grid carbon intensity values) prior to formal regulatory compliance filing.
