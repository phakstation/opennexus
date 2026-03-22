# Synthetic Data Generation for Botswana Healthcare Stock Management Map

## Overview

This document describes the synthetic data generation process for the district-level pharmaceutical stock risk map dashboard. The data is synthesized from three primary pharmaceutical datasets:

1. **NAPPI Prices CSV** - National Pharmaceutical Product Index pricing data
2. **Medicine Price List 2026 (Updated)** - Comprehensive medicine pricing and inventory
3. **Query SQL Schema** - Database structure for NAPPI EML, ATC-DDD, product suppliers, and district boundaries

## Data Structure

### District Risk Data

The map displays risk levels for 9 Botswana districts based on synthetic stock availability:

```typescript
type RiskLevel = "critical" | "warning" | "good"

interface DistrictData {
  district: District
  riskLevel: RiskLevel
  stockDays: number           // Average days of medicine stock
  facilitiesReporting: number // Facilities with current data
  totalFacilities: number     // Total facilities in district
  riskScore: number           // 0-100 risk percentage
}
```

### Risk Level Classification

- **Critical** (Red): < 15 days of stock - immediate replenishment needed
- **Warning** (Orange): 15-30 days of stock - attention required
- **Good** (Green): > 30 days of stock - adequate coverage

### Medicine Inventory Data

Medicine stock is synthesized with realistic variations:

```typescript
interface DistrictMedicineInventory {
  district: District
  medicineId: string
  medicineName: string
  stockOnHand: number         // Current units in stock
  monthlyConsumption: number  // Average monthly usage
  stockDays: number           // Calculated as (stockOnHand / monthlyConsumption) * 30
  unitPrice: number           // From NAPPI pricing
  napiCode?: string           // NAPPI product code
  riskLevel: RiskLevel
}
```

## Data Generation Process

### 1. Medicine Categories

Medicines are organized into 4 clinical categories:

- **TB (Tuberculosis)**: Rifampicin, Isoniazid, Pyrazinamide, Ethambutol
- **Antimalarial**: Artemether-Lumefantrine, Quinine Sulphate, Artesunate, Sulfadoxine-Pyrimethamine
- **Chronic Care**: Metformin, Amlodipine, Enalapril, Hydrochlorothiazide
- **HIV/AIDS**: Tenofovir, Emtricitabine, Efavirenz, Lopinavir

### 2. Pricing Data Integration

Unit prices are extracted from the NAPPI Prices CSV:
- Metformin 500mg: P12.84 (from NAPPI code 719285011)
- Enalapril 10mg: P59.62 (from NAPPI code 759783004)
- Folic Acid 5mg: P1.35 (from generic pricing)
- Acyclovir Cream 5g: P41.30

### 3. District-Level Aggregation

For each district:

1. **Population-based facility count**: Facilities = District Population / 50,000
   - Central (638,604): 12 facilities
   - Ghanzi (43,355): 3 facilities
   - North-West (175,631): 3 facilities

2. **Facility type distribution**:
   - 15% Hospitals
   - 45% Clinics
   - 40% Health Posts

3. **Stock level calculation**:
   - Consumption varies 70-130% of base by facility type
   - Hospital facilities have 3x consumption vs health posts
   - Risk-based stock: Critical = 0-15 days, Warning = 15-35 days, Good = 30-60+ days

### 4. Synthetic Variation

To ensure realistic data:
- ±5% variation on unit prices
- Random facility-level stock variations within district risk level
- Stochastic facility reporting (90% reporting rate)
- Time-based last update dates (within last 7 days)

## Current District Status

| District | Risk Level | Stock Days | Facilities | Status |
|----------|-----------|-----------|-----------|--------|
| Central | Good | 45 | 12/48 | ✅ Adequate |
| Ghanzi | **Critical** | 7 | 8/12 | ⚠️ Emergency |
| Kgalagadi | Good | 45 | 10/10 | ✅ Full |
| Kgatleng | Good | 38 | 15/16 | ✅ Good |
| Kweneng | Warning | 21 | 28/32 | ⚠️ Monitoring |
| North-East | Good | 52 | 14/14 | ✅ Excellent |
| **North-West** | **Critical** | 9 | 18/24 | ⚠️ Emergency |
| South-East | Good | 60 | 12/12 | ✅ Excellent |
| Southern | Warning | 24 | 22/28 | ⚠️ Watch |

## Critical Medicines by District

### Ghanzi District (Critical)
- Isoniazid 100mg: 7 stock days
- Pyrazinamide 500mg: 16 stock days

### North-West District (Critical)
- Ethambutol 400mg: 19 stock days
- Enalapril 10mg: 22 stock days

## Facility-Level Data

Example facilities with medicine stock:

### Central District
- **Sekgoma Memorial Hospital**: 42 patient beds
  - Rifampicin: 8,500 units (116 stock days)
  - Metformin: 4,200 units (70 stock days)

### North-West District
- **Letsholathebe II Hospital**: 450 patients served
  - Ethambutol: 320 units (19 stock days) ⚠️ CRITICAL
  - Enalapril: 450 units (22 stock days) ⚠️ CRITICAL

## Data Files

### Location
- Production data: `/lib/data.ts`
- Generation scripts: `/scripts/generate_synthetic_data.py`
- TypeScript generator: `/scripts/generate-synthetic-map-data.ts`

### Usage

```typescript
import { DISTRICT_RISK_DATA, DISTRICT_MEDICINE_INVENTORY } from '@/lib/data'

// Get district risk data
const districtRisk = DISTRICT_RISK_DATA['Central']

// Get medicines for a district
const medicines = DISTRICT_MEDICINE_INVENTORY.filter(m => m.district === 'Central')
```

## Integration with Healthcare System

### Patient Impact Calculation

Risk score × Patients Served = Patients at Risk

Example (North-West - Ethambutol):
- Risk Score: 78% (critical)
- Facilities Affected: 18
- Patients Served: ~450 per facility
- **Patients at Risk: ~6,500 patients**

### Treatment Continuity Alert

When stock days < 15:
1. Alert generated to district logistics
2. Shipment expedited from CMS
3. Clinical staff notified of supply limitation
4. Patient treatment prioritization activated

## Future Enhancements

### Real-time Data Integration
- Connect to actual NAPPI product database
- Live facility reporting via mobile app
- Real-time consumption tracking

### Predictive Analytics
- Demand forecasting based on seasonal patterns
- Supply chain optimization
- Stockout prediction modeling

### Advanced Visualizations
- Heatmaps by medicine category
- Time-series stock trend analysis
- Geographic supply chain optimization

## References

### Source Datasets
- NAPPI Product Database: National Pharmaceutical Product Index
- Medicine Price List 2026: Ministry of Health & Wellness
- District Boundary Data: HASC-1 subdivision codes

### Related Documentation
- `/docs/ARCHITECTURE.md` - System architecture
- `/docs/API.md` - API endpoints for stock data
- `/docs/DASHBOARD.md` - Dashboard usage guide
