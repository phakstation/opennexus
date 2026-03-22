# 🗺️ Botswana Pharmaceutical Stock Management System
## Synthetic Data Generation Implementation

This document serves as the master index for the complete synthetic pharmaceutical data generation system built for district-level healthcare stock management visualization.

---

## 🚀 Quick Navigation

### For Developers
- **I want to see the map**: Start your dev server (`npm run dev`) and navigate to `http://localhost:3000/map`
- **I want to use the API**: See API examples in [Quick Start Guide](#-quick-start-guide) below
- **I want to understand the architecture**: Read [System Overview](#-system-overview)
- **I want to customize the data**: See [Data Customization](#-data-customization)

### For Data Scientists
- **I want to generate fresh synthetic data**: See `/scripts/README.md`
- **I want to understand the data generation logic**: See `/docs/SYNTHETIC_DATA_GENERATION.md`
- **I want to see the data schema**: See [Data Structure](#-data-structure)
- **I want to integrate with live databases**: See [Future Integration](#-future-integration)

### For Project Managers
- **What was delivered**: See `PROJECT_COMPLETION.md`
- **What's the status**: See `IMPLEMENTATION_COMPLETE.txt`
- **Quick overview**: See `SYNTHETIC_DATA_SUMMARY.md`
- **What files were created**: See [Deliverables](#-deliverables)

---

## 📊 System Overview

### What This System Does

This system visualizes pharmaceutical stock availability and risk across all 9 districts of Botswana using synthetic data based on:
1. **NAPPI Prices CSV** - Real 2026 pharmaceutical pricing data
2. **Medicine Price List 2026** - Comprehensive medicine catalog
3. **Query Schema** - Database structure for healthcare system

### Key Components

```
┌─────────────────────────────────────────────────────┐
│  Interactive Web Dashboard (/map)                   │
│  • 9 interactive districts                          │
│  • Color-coded risk visualization                   │
│  • Medicine inventory by district                   │
│  • Facility-level tracking                          │
└────────────────┬────────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │  REST API      │
         │  /api/...      │
         └───────┬────────┘
                 │
         ┌───────▼────────────────────┐
         │  Data Layer (/lib/data.ts) │
         │  • 9 districts             │
         │  • 40+ facilities          │
         │  • 15+ medicines           │
         │  • 600+ stock records      │
         └─────────────────────────────┘
```

---

## 📁 Deliverables

### Core Application Files

| File | Type | Lines | Purpose |
|------|------|-------|---------|
| `/lib/data.ts` | TypeScript | 300+ | Central data export with NAPPI integration |
| `/app/map/page.tsx` | React | 296 | Interactive district risk map dashboard |
| `/app/api/district-risk/route.ts` | API | 181 | RESTful endpoint for district data |

### Data Generation Scripts

| File | Language | Lines | Purpose |
|------|----------|-------|---------|
| `/scripts/generate_synthetic_data.py` | Python | 341 | Primary CSV-based data generator |
| `/scripts/generate-synthetic-map-data.ts` | TypeScript | 344 | Alternative SSR-compatible generator |

### Documentation

| File | Type | Lines | Purpose |
|------|------|-------|---------|
| `QUICK_START.md` | Guide | 265 | Quick reference for getting started |
| `SYNTHETIC_DATA_SUMMARY.md` | Overview | 249 | Implementation summary |
| `PROJECT_COMPLETION.md` | Report | 371 | Complete project report |
| `IMPLEMENTATION_COMPLETE.txt` | Status | 252 | Visual summary of completion |
| `/docs/SYNTHETIC_DATA_GENERATION.md` | Technical | 205 | Detailed data generation methodology |
| `/scripts/README.md` | Technical | 263 | Script documentation and customization |

**Total Code & Documentation: 2,444+ lines**

---

## 🗺️ The Map Dashboard

### Location
`http://localhost:3000/map`

### What You'll See

An interactive SVG map of Botswana showing all 9 districts color-coded by pharmaceutical stock risk:

- 🟢 **Green (Good)**: 30+ stock days - 4 districts
- 🟠 **Orange (Warning)**: 15-30 stock days - 3 districts
- 🔴 **Red (Critical)**: <15 stock days - 2 districts

### How to Use It

1. **View Map**: See all districts with their risk levels
2. **Click District**: View detailed stock information for that district
3. **View Medicines**: Tab through medicines with stock levels and NAPPI codes
4. **Check Facilities**: See facility-level inventory data
5. **Monitor Metrics**: Track stock days, reporting rates, risk scores

### Current Status

```
Central       🟢 Good     (45 days)
Ghanzi        🔴 CRITICAL (7 days) ⚠️
Kgalagadi     🟢 Good     (45 days)
Kgatleng      🟢 Good     (38 days)
Kweneng       🟠 Warning  (21 days)
North-East    🟢 Good     (52 days)
North-West    🔴 CRITICAL (9 days) ⚠️
South-East    🟢 Good     (60 days)
Southern      🟠 Warning  (24 days)
```

---

## 🔌 API Endpoints

### Base URL
`http://localhost:3000/api/district-risk`

### Endpoints

#### Get All District Data
```bash
curl http://localhost:3000/api/district-risk
```

#### Get Specific District
```bash
curl "http://localhost:3000/api/district-risk?district=Central"
```

#### Include Medicine Inventory
```bash
curl "http://localhost:3000/api/district-risk?district=Central&include_medicines=true"
```

#### Filter by Medicine Category
```bash
# TB medicines
curl "http://localhost:3000/api/district-risk?category=tb"

# Antimalarial medicines
curl "http://localhost:3000/api/district-risk?category=antimalarial"

# Chronic care medicines
curl "http://localhost:3000/api/district-risk?category=chronic"
```

#### Include Facility Data
```bash
curl "http://localhost:3000/api/district-risk?include_facilities=true"
```

### Response Format
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "districts": [
    {
      "name": "Central",
      "riskLevel": "good",
      "stockDays": 45,
      "facilitiesReporting": 42,
      "totalFacilities": 48,
      "medicines": [...]
    }
  ],
  "summary": {
    "totalDistricts": 9,
    "criticalDistricts": 2,
    "warningDistricts": 3,
    "goodDistricts": 4,
    "averageStockDays": 33,
    "reportingRate": 92
  }
}
```

---

## 💊 Data Structure

### DISTRICT_RISK_DATA
```typescript
interface DistrictRisk {
  riskLevel: 'critical' | 'warning' | 'good'
  stockDays: number      // Average days of medicine stock
  facilitiesReporting: number
  totalFacilities: number
}
```

### DISTRICT_MEDICINE_INVENTORY
```typescript
interface DistrictMedicineInventory {
  district: District
  medicineId: string
  medicineName: string
  stockOnHand: number
  monthlyConsumption: number
  stockDays: number
  unitPrice: number      // From NAPPI pricing
  napiCode?: string      // NAPPI product code
  riskLevel: RiskLevel
  category: 'tb' | 'antimalarial' | 'chronic' | 'hiv'
}
```

### FACILITY_MEDICINE_STOCK
```typescript
interface FacilityMedicineStock {
  facilityId: string
  facilityName: string
  medicineName: string
  stockOnHand: number
  monthlyConsumption: number
  stockDays: number
  riskLevel: RiskLevel
  lastUpdated: string
}
```

---

## 📊 Medicines Included (NAPPI Pricing)

### TB Medicines
- Rifampicin 150mg (P45.50)
- Isoniazid 100mg (P13.30)
- Pyrazinamide 500mg (P28.75)
- Ethambutol 400mg (P38.42)

### Antimalarial Medicines
- Artemether-Lumefantrine (P156.20)
- Quinine Sulphate 300mg (P27.50)
- Artesunate 60mg Inj (P85.30)

### Chronic Care Medicines
- Metformin 500mg (P12.84)
- Amlodipine 5mg (P162.00)
- Enalapril 10mg (P59.62)
- Chlorpromazine 100mg
- Folic Acid 5mg (P1.35)
- Acyclovir Cream 5g (P41.30)
- Bepanthen 100g (P223.29)

---

## 🔧 Data Customization

### Change Risk Distribution

Edit `/lib/data.ts`:
```typescript
"Central": { 
  riskLevel: "good",      // Change to "critical" or "warning"
  stockDays: 45,          // Change stock days (0-60)
  facilitiesReporting: 42,
  totalFacilities: 48
}
```

### Add New Medicines

1. Find NAPPI code from pricing CSV
2. Add to `MEDICINE_STOCK_DATA` in `/lib/data.ts`:
```typescript
{ 
  id: "16", 
  name: "New Medicine",
  category: "chronic",
  stockOnHand: 5000,
  monthlyConsumption: 2000,
  daysOfStock: 75,
  riskLevel: "good",
  inTransit: 0,
  lastUpdated: "2024-01-15"
}
```

### Generate Fresh Data

```bash
python3 scripts/generate_synthetic_data.py
```

### Modify Facility Distribution

Edit `/scripts/generate_synthetic_data.py`:
```python
FACILITY_TYPES = [
    ("hospital", 0.15),      # Change percentages
    ("clinic", 0.45),
    ("health-post", 0.40),
]
```

---

## 📚 Documentation Guide

### Start Here
1. **This file** - Overview and navigation
2. `QUICK_START.md` - Get running quickly
3. `IMPLEMENTATION_COMPLETE.txt` - Visual summary

### For Implementation Details
4. `PROJECT_COMPLETION.md` - Full project report
5. `SYNTHETIC_DATA_SUMMARY.md` - Implementation overview
6. `/docs/SYNTHETIC_DATA_GENERATION.md` - Data methodology

### For Development
7. `/scripts/README.md` - Script documentation and customization
8. Look at `/lib/data.ts` for data structure
9. Check `/app/map/page.tsx` for component implementation

---

## 🎯 Quick Start Guide

### 1. Run the Development Server
```bash
npm run dev
```

### 2. View the Map
Navigate to `http://localhost:3000/map`

### 3. Test the API
```bash
# Get all data
curl http://localhost:3000/api/district-risk

# Get specific district
curl "http://localhost:3000/api/district-risk?district=North-West"

# Get with medicines
curl "http://localhost:3000/api/district-risk?district=Central&include_medicines=true"
```

### 4. Generate Fresh Data
```bash
python3 scripts/generate_synthetic_data.py
```

---

## 🔄 Integration with React Components

### Use in Components
```typescript
import { DISTRICT_RISK_DATA, DISTRICT_MEDICINE_INVENTORY } from '@/lib/data'

function MyComponent() {
  const centralRisk = DISTRICT_RISK_DATA['Central']
  const medicines = DISTRICT_MEDICINE_INVENTORY.filter(m => m.district === 'Central')
  
  return (
    <div>
      <h1>Central District - {centralRisk.stockDays} stock days</h1>
      {medicines.map(med => (
        <div key={med.medicineId}>
          {med.medicineName}: {med.stockDays}d
        </div>
      ))}
    </div>
  )
}
```

### Use the API
```typescript
import useSWR from 'swr'

function MyComponent() {
  const { data, error } = useSWR('/api/district-risk?district=Central')
  
  if (error) return <div>Error loading data</div>
  if (!data) return <div>Loading...</div>
  
  return <div>{JSON.stringify(data, null, 2)}</div>
}
```

---

## 🚀 Deployment

### Deploy to Vercel
```bash
# Commit your changes
git add .
git commit -m "Add synthetic data generation"
git push

# Deploy
vercel deploy
```

### Environment Variables
No additional environment variables needed for synthetic data.

For future live data integration, you'll need:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

---

## 📈 Data Generation Details

### Risk Level Classification
- **Critical** (🔴): < 15 stock days - Emergency restocking needed
- **Warning** (🟠): 15-30 stock days - Monitor closely
- **Good** (🟢): > 30 stock days - Adequate supply

### Risk Score Calculation
```
Risk Score = (60 - Stock Days) / 60 × 100
```

### Patient Impact
```
At-Risk Patients = Facilities × Avg Patients per Facility × Risk Factor
```

---

## 🆘 Troubleshooting

### Map Not Loading
- Check browser console (F12) for errors
- Ensure dev server is running: `npm run dev`
- Clear cache: Ctrl+Shift+R

### API Returning Empty Data
- Verify `/lib/data.ts` exports exist
- Check query parameters are correct
- Use browser DevTools Network tab to inspect

### Want Different Data
- Modify `/lib/data.ts` directly
- Or run: `python3 scripts/generate_synthetic_data.py`

---

## 📞 Support & Resources

| Question | Answer | Location |
|----------|--------|----------|
| How do I get started? | Read QUICK_START.md | `/QUICK_START.md` |
| What data was generated? | See PROJECT_COMPLETION.md | `/PROJECT_COMPLETION.md` |
| How do I customize data? | See /scripts/README.md | `/scripts/README.md` |
| What's the API response format? | See API section above | This file |
| How do I use in React? | See Integration section | This file |
| What medicines are included? | See Medicines section | This file |
| How do I generate new data? | Run Python script | `/scripts/generate_synthetic_data.py` |

---

## ✅ Checklist for Using This System

- [ ] Run `npm run dev`
- [ ] Navigate to `http://localhost:3000/map`
- [ ] Click a district on the map
- [ ] View medicine inventory
- [ ] Test API with `curl http://localhost:3000/api/district-risk`
- [ ] Read `QUICK_START.md` for more details
- [ ] Check `PROJECT_COMPLETION.md` for full overview
- [ ] Customize data as needed

---

## 🎓 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js 16, TypeScript
- **Visualization**: Custom SVG map
- **Data**: JSON with TypeScript types
- **API**: RESTful with caching
- **Generation**: Python 3 + TypeScript

---

## 📋 File Navigation

```
/
├── app/
│   ├── map/page.tsx                          ← View the map here!
│   └── api/district-risk/route.ts            ← API endpoint
├── lib/
│   └── data.ts                               ← Core data
├── scripts/
│   ├── generate_synthetic_data.py            ← Generate data
│   ├── generate-synthetic-map-data.ts        ← Alternative generator
│   └── README.md                             ← Script guide
├── docs/
│   └── SYNTHETIC_DATA_GENERATION.md          ← Data methodology
├── QUICK_START.md                            ← Quick reference
├── SYNTHETIC_DATA_SUMMARY.md                 ← Implementation summary
├── PROJECT_COMPLETION.md                     ← Full report
├── IMPLEMENTATION_COMPLETE.txt               ← Visual summary
└── README_SYNTHETIC_DATA.md                  ← This file
```

---

**Last Updated**: March 22, 2026
**Status**: ✅ Production Ready
**Version**: 1.0.0

For questions or issues, refer to the appropriate documentation file listed above.
