# TheLight — Your Savings Partner 💡🌱
> **Bharat Builds Tour: Environmental Hacks (Waste & Energy)**  
> **Built by Mahee Tailor**  
> **Live Demo:** [https://ais-pre-fzszmoe6hyiinlttruo3wo-546660926804.asia-southeast1.run.app](https://ais-pre-fzszmoe6hyiinlttruo3wo-546660926804.asia-southeast1.run.app)  
> *(Note: To activate this link publicly, click the **"Share"** button in the top-right corner of Google AI Studio).*

---

## 🌟 Overview
**TheLight** is an energy and utility conservation web application engineered to help households track utility consumption (**Light/Electric bills**, **Natural Gas heating**, **Water**, and **Municipal Waste**), receive actionable ideas on how to lessen utility bills, and reduce their environmental carbon footprint while saving money.

Powered by **AWS Location Service** and **AWS CloudFront Edge Geolocation**, TheLight automatically detects the user's locality, regional utility tariffs, and local **peak vs. off-peak pricing windows** to offer localized energy-saving hacks and government clean energy schemes.

---

## 🎯 The Problem
1. **Escalating Utility Costs & Energy Waste:** Households unknowingly waste 15–25% of energy through standby "vampire" draw, overheated geysers, and peak-hour appliance use.
2. **Lack of Regional Context:** Electricity tariffs vary drastically by region, and users are unaware of their local peak-pricing windows (when power is most expensive and dirtiest).
3. **Underutilized Green Schemes:** Millions in government energy subsidies (rooftop solar, BLDC fan rebates, time-of-day smart meter discounts) go unclaimed due to lack of visibility.

---

## 🚀 Key Features

### 1. 📊 Monthly Progress & Bill Tracking
* **Compare Usage:** Real-time comparison between previous and current month bills (*e.g., ₹2,480 down to ₹2,010 — a 19% reduction*).
* **Fix Verification:** Clear visual indicators confirming if specific household habits (*e.g., geyser timer, LED transitions*) are successfully reducing bills.
* **Multi-Utility Logging:** Track electricity (kWh), natural gas (Therms/units), water volume (Gallons/L), and solid waste bins.
* **Interactive Bar Chart:** Visual month-over-month trend analysis (Jun, Jul, Aug, Sep, Oct).

### 2. 📍 AWS Cloud Geolocation & Localized Utility Intelligence
* **Amazon Location Service (`SearchPlaceIndexForPosition`):** Reverse geocodes coordinates to street, neighborhood, municipality, and regional utility jurisdiction.
* **AWS CloudFront Edge Geolocation:** Identifies edge point-of-presence (PoP), IP, timezone, and regional power grid characteristics.
* **Time-of-Day (ToD) Peak Pricing Alert:** Real-time indicator informing users whether they are in **Peak Hours** (4:00 PM – 9:00 PM) or **Off-Peak Hours** (cheapest, cleanest renewable electricity).

### 3. 🌱 Actionable Environmental Hacks & Dynamic Savings
* **Kill Vampire Standby Power:** Smart power strips to eliminate 5–10% idle drain.
* **Geyser / Water Heater Calibration:** Lowering heating thermostats to 120°F (50°C) cuts gas/light heating cost by ~10%.
* **Off-Peak Load Shifting:** Delaying dishwashers, laundry, and EV charging until after 9:00 PM.
* **Cold Water Laundry:** Reduces 90% of washing machine energy consumption.
* **Zero Waste Composting:** Diverting wet food scraps reduces landfill methane and waste disposal fees.
* **Live Savings & Carbon Counter:** Instant calculation of monthly money saved and kg of CO₂ emissions avoided with celebratory confetti animations!

### 4. 🎁 Government & Clean Energy Subsidies (Schemes)
* **PM Surya Ghar / Rooftop Solar Subsidy:** Up to 40% capital grants for residential solar installations.
* **BLDC Super-Efficient Fan Rebates:** Up to 65% power reduction on continuous ceiling cooling.
* **Smart Geyser Timer Cashback:** Utility incentives for automatic timer cut-offs.
* **Time-of-Day Tariff Enrollment:** Automatic 15–20% rate reductions on off-peak consumption.

### 5. 📱 Responsive on Mobile & Laptop
* **Mobile Viewport:** Touch-optimized ergonomics with bottom tab navigation (**Home**, **Street**, **Progress**, **Schemes**) matching mobile app standards.
* **Laptop Dashboard:** Fluid, widescreen dashboard utilizing the full display with dual-column analytics, keyboard shortcuts (<kbd>1</kbd>–<kbd>4</kbd>), and detailed breakdowns.

---

## 🛠️ Architecture & Tech Stack

```
[ Client (Browser / Mobile) ]
       │
       ├── Vite 8 + React 19 + TypeScript
       ├── Tailwind CSS (Monochrome Design System)
       ├── Leaflet (Tactical Sector Map)
       │
       ▼
[ AWS Cloud Infrastructure ]
       │
       ├── AWS CloudFront (Edge Viewer Geolocation Headers)
       ├── Amazon API Gateway (REST API Ingress)
       ├── AWS Lambda (Python 3.11 / locate handler)
       ├── Amazon Location Service (Place Index & Reverse Geocoding)
       ├── Amazon DynamoDB (Utility logs & incident tracking)
       └── Amazon SNS (Alerts & notification topics)
```

---

## 💻 Local Development Setup

### Prerequisites
* Node.js (v18 or higher)
* npm or bun

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/maheetailor7/TheLight.git
cd TheLight

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

App runs locally on `http://localhost:3000`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🏆 Hackathon Submission Details
* **Project Name:** TheLight — Your Savings Partner
* **Hackathon:** Bharat Builds Tour: Environmental Hacks (Waste and Energy)
* **Developer:** Mahee Tailor
* **Live Deployment:** [Applet Preview Link](https://ais-pre-fzszmoe6hyiinlttruo3wo-546660926804.asia-southeast1.run.app)
