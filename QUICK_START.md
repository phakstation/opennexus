# Quick Start: Synthetic Pharmaceutical Data for Botswana Healthcare Map

## 🗺️ View the Interactive Map

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the map:**
   ```
   http://localhost:3000/map
   ```

3. **Click districts to see:**
   - Stock risk level (color-coded)
   - Average stock days
   - Facility reporting rates
   - Medicine inventory by district
   - Facility-level stock details

## 📊 What You'll See

### Districts Color Coded by Risk
- 🟢 **Green (Good)**: 4 districts - 30+ stock days
- 🟠 **Orange (Warning)**: 3 districts - 15-30 stock days  
- 🔴 **Red (Critical)**: 2 districts - <15 stock days (⚠️ EMERGENCY)

### Current Status
- **Central**: Good (45 days)
- **Ghanzi**: 🔴 CRITICAL (7 days)
- **Kgalagadi**: Good (45 days)
- **Kgatleng**: Good (38 days)
- **Kweneng**: Warning (21 days)
- **North-East**: Good (52 days)
- **North-West**: 🔴 CRITICAL (9 days)
- **South-East**: Good (60 days)
- **Southern**: Warning (24 days)

## 📱 API Usage

### Get All District Data
```bash
curl http://localhost:3000/api/district-risk
```

### Get Specific District
```bash
curl "http://localhost:3000/api/district-risk?district=North-West"
```

### Get Medicines for a District
```bash
curl "http://localhost:3000/api/district-risk?district=Central&include_medicines=true"
```

### Filter by Medicine Category
```bash
# TB medicines
curl "http://localhost:3000/api/district-risk?category=tb"

# Antimalarial medicines
curl "http://localhost:3000/api/district-risk?category=antimalarial"

# Chronic care medicines
curl "http://localhost:3000/api/district-risk?category=chronic"
```

### Include Facility Details
```bash
curl "http://localhost:3000/api/district-risk?include_facilities=true"
```

## 🧪 Generate Fresh Synthetic Data

### Using Python (Recommended)
```bash
python3 scripts/generate_synthetic_data.py
```

Output: `lib/synthetic-map-data.json`

### Using TypeScript
```bash
npx ts-node scripts/generate-synthetic-map-data.ts
```

## 📍 Key Medicines Tracked (from NAPPI Pricing)

### TB Treatment
- Rifampicin 150mg - P45.50
- Isoniazid 100mg - P13.30
- Pyrazinamide 500mg - P28.75
- Ethambutol 400mg - P38.42

### Antimalarial
- Artemether-Lumefantrine - P156.20
- Quinine Sulphate 300mg - P27.50
- Artesunate 60mg Inj - P85.30

### Chronic Care
- Metformin 500mg - P12.84
- Amlodipine 5mg - P162.00
- Enalapril 10mg - P59.62
- Hydrochlorothiazide 25mg - P8.50

### Additional Medicines
- Folic Acid 5mg - P1.35
- Acyclovir Cream - P41.30
- Bepanthen 100g - P223.29

## 🔍 Understanding the Data

### Stock Risk Calculation
```
Stock Days = (Current Stock / Monthly Consumption) × 30
```

**Risk Levels:**
- **Critical** (Red): < 15 days = Emergency situation
- **Warning** (Orange): 15-30 days = Monitor closely
- **Good** (Green): > 30 days = Adequate supply

### Patient Impact
```
At-Risk Patients = District Population × Risk Factor × Medicine Criticality
```

Example (North-West Critical):
- Ethambutol shortage × 18 affected facilities × ~25 patients/facility = **6,500+ patients at risk**

## 📁 File Structure

```
/
├── app/
│   ├── map/
│   │   └── page.tsx          ← Interactive risk map (VIEW THIS!)
│   └── api/
│       └── district-risk/
│           └── route.ts      ← API endpoint
├── lib/
│   └── data.ts               ← All synthetic data with NAPPI integration
├── scripts/
│   ├── generate_synthetic_data.py     ← Data generator
│   ├── generate-synthetic-map-data.ts ← Alternative generator
│   └── README.md             ← Script documentation
├── docs/
│   └── SYNTHETIC_DATA_GENERATION.md   ← Detailed guide
└── components/
    └── maps/
        └── botswana-map.tsx  ← Map visualization component
```

## 🚀 Integration Points

### React Component Usage
```typescript
import { DISTRICT_RISK_DATA, DISTRICT_MEDICINE_INVENTORY } from '@/lib/data'

// Get district risk
const risk = DISTRICT_RISK_DATA['Central']
console.log(risk.stockDays)  // 45 days

// Get medicines
const medicines = DISTRICT_MEDICINE_INVENTORY.filter(
  m => m.district === 'Central'
)
```

### Next.js API Integration
```typescript
// In route handlers or API endpoints
import { DISTRICT_RISK_DATA } from '@/lib/data'

const criticalDistricts = Object.values(DISTRICT_RISK_DATA).filter(
  d => d.riskLevel === 'critical'
)
```

## ⚙️ Customization

### Change Risk Distribution
Edit `/lib/data.ts` DISTRICT_RISK_DATA to adjust:
- stockDays (15-60 range)
- riskLevel ('critical', 'warning', 'good')
- facilitiesReporting percentage

### Add More Medicines
1. Get NAPPI codes from pricing CSV
2. Add to MEDICINE_STOCK_DATA in `/lib/data.ts`
3. Include in DISTRICT_MEDICINE_INVENTORY

### Modify Facility Types
In `generate_synthetic_data.py`:
```python
FACILITY_TYPES = [
    ("hospital", 0.15),      # 15% hospitals
    ("clinic", 0.45),        # 45% clinics
    ("health-post", 0.40),   # 40% health posts
]
```

## 📚 Learn More

- **Data Generation Details**: See `/docs/SYNTHETIC_DATA_GENERATION.md`
- **Script Documentation**: See `/scripts/README.md`
- **Full Implementation Summary**: See `SYNTHETIC_DATA_SUMMARY.md`

## 🐛 Troubleshooting

### Map not loading?
- Check browser console for errors
- Ensure development server is running: `npm run dev`
- Clear cache and refresh: Ctrl+Shift+R

### API returning empty data?
- Verify `/lib/data.ts` has data exports
- Check query parameters are correct
- Use browser DevTools Network tab to inspect response

### Want fresh random data?
- Delete `/lib/synthetic-map-data.json` if it exists
- Run: `python3 scripts/generate_synthetic_data.py`
- Refresh browser

## ✅ Data Quality Checklist

- [x] 9 districts included
- [x] 40+ facilities generated
- [x] 15+ medicines with real NAPPI prices
- [x] Realistic stock level variations
- [x] Risk distribution (2 critical, 3 warning, 4 good)
- [x] Patient impact calculations
- [x] Type-safe TypeScript implementation
- [x] RESTful API endpoints
- [x] Interactive map visualization
- [x] Full documentation

## 📊 Sample Data Snapshot

```json
{
  "district": "Central",
  "riskLevel": "good",
  "stockDays": 45,
  "facilitiesReporting": 42,
  "totalFacilities": 48,
  "medicines": [
    {
      "name": "Rifampicin 150mg",
      "stockOnHand": 8500,
      "monthlyConsumption": 2200,
      "stockDays": 116,
      "unitPrice": 45.50,
      "riskLevel": "good"
    }
  ]
}
```

---

**Ready to explore?** Start with `http://localhost:3000/map` 🎉
