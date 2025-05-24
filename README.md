# 🚗 Car Leasing Platform MVP

A modern car leasing management system built using **Next.js 14**, **TypeScript**, and **Tailwind CSS**, designed for managing lease agreements, lessee registration, and lease payments for a fleet of 20 vehicles.

> Built with the help of AI developer tools: GitHub Copilot, ChatGPT, and Vercel's V0.

---

## ✨ Features

### 1. 🔐 Lessee Registration
- Capture lessee name, vehicle ID/number, email, and phone
- Real-time form validation with formatted phone inputs
- Vehicle selection dropdown (shows only available vehicles)
- Live registration summary preview

### 2. 💳 Lease Payment Simulation
- Simulated payments via Credit Card, Bank Transfer, Check, or Cash
- Success and failure scenarios with retry mechanism
- Audit trail of all transactions (payment history per lessee)
- Pending and overdue payments tracked automatically

### 3. 📊 Lease Management Dashboard
- **Fleet Utilization**: Vehicles leased vs available
- **Lease Revenue**: Total collected vs expected payments (assumes $500/month per vehicle)
- **Overdue Accounts**: List of lessees with missed or late payments
- **Activity Feed**: Latest platform events and actions

---

## 🎨 UX & UI Design

- Clean, modern interface using **shadcn/ui**
- Responsive layout (desktop + mobile)
- Color-coded status badges: `Paid`, `Pending`, `Overdue`, `Failed`
- Visual indicators: Progress bars, charts, tables
- Sidebar-based navigation for easy access to:
  - Dashboard
  - Lessees
  - Vehicles
  - Payments

---

## 🧠 AI Tools Used

| Tool            | Purpose                                         | Benefit                                    |
|-----------------|-------------------------------------------------|--------------------------------------------|
| **ChatGPT**     | Project understanding, architecture, and queries | Improved planning, logic clarity, and ideation |
| **GitHub Copilot** | Code debugging and refinement                | Faster troubleshooting and cleaner code     |
| **V0 (Vercel)** | Generated UI scaffolding with mock data         | Accelerated UI development and layout setup |

---

## 📦 Tech Stack

| Category       | Tech                          |
|----------------|-------------------------------|
| Frontend       | [Next.js 14](https://nextjs.org) (App Router) |
| Language       | TypeScript                    |
| Styling        | Tailwind CSS                  |
| UI Components  | shadcn/ui                     |
| Icons          | lucide-react                  |
| State Handling | React state & context         |
| Hosting        | Vercel                        |

---

## 📈 Metrics Dashboard

| Metric                                | Description                                             |
|---------------------------------------|---------------------------------------------------------|
| **North Star Metric**                 | Total Lease Payments Collected                          |
| % Vehicles Leased                     | Tracks fleet utilization                                |
| Overdue Payment Count                 | Indicates possible issues with lessee compliance        |
| On-Time Payment Rate                  | Helps gauge lessee behavior                            |
| Lessee Retention (if added later)     | Tracks customer satisfaction over time (future scope)   |

---

## ✅ Edge Case Handling

- ❌ Invalid Form Inputs → Blocked with real-time validation
- 🔁 Payment Failures → Retry enabled with status display
- ⏳ Overdue Payments → Auto-calculated and flagged
- 🛑 Duplicate Vehicle Assignments → Blocked in selection dropdown
- 🪶 Loading States → Skeletons and spinners during data processing

---

## 🧪 Getting Started

To run the project locally:

```bash
# Clone the repo
git clone https://github.com/Sahil2k26/car-lease-pro.git

# Move into the project directory
cd car-lease-pro

# Install dependencies
npm install

# Run the development server
npm run dev
