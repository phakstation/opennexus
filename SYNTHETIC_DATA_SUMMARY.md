# Synthetic Data Generation Implementation Summary

## Overview

This implementation generates realistic district-level pharmaceutical stock risk data for a Botswana healthcare management system using data from:
- **NAPPI Prices CSV** (2026 updated pharmaceutical pricing)
- **Medicine Price List 2026** (comprehensive medicine catalog)
- **Query Schema** (database structure for NAPPI products)

The synthetic data powers an interactive risk map dashboard that visualizes medicine availability across all 9 Botswana districts.

## What Was Generated

### 1. Data Generation Scripts

#### `/scripts/generate_synthetic_data.py`
- Python script that parses NAPPI pricing CSV
- Generates realistic facility-level inventory
- Creates district-level aggregations
- Outputs JSON with 9 districts, 40+ facilities, 15 medicines each
- Features seeded random generation for reproducibility

**Run with:**
```bash
python3 /vercel/share/v0-project/scripts/generate_synthetic_data.py
```

#### `/scripts/generate-synthetic-map-data.ts`
- TypeScript implementation for Next.js integration
- Type-safe data generation
- Fallback medicine list when CSV unavailable
- Designed for SSR/server-side execution

#### `/scripts/README.md`
- Comprehensive documentation for both generators
- Data schema explanations
- Customization options
- Integration guides

### 2. Enhanced Data Layer

#### `/lib/data.ts` (Updated)
Enhanced with synthetic pharmaceutical data:
- **DISTRICT_RISK_DATA**: 9 districts with varying risk levels (2 critical, 3 warning, 4 good)
- **DISTRICT_MEDICINE_INVENTORY**: 13+ real medicines with NAPPI codes from pricing data
- **FACILITY_MEDICINE_STOCK**: Facility-level stock tracking for 5 major facilities
- **MEDICINE_STOCK_DATA**: 15 medicines with realistic pricing from NAPPI data

**Risk Distribution:**
- Central: Good (45 stock days)
- Ghanzi: **Critical** (7 stock days) ⚠️
- Kgalagadi: Good (45 stock days)
- Kgatleng: Good (38 stock days)
- Kweneng: Warning (21 stock days)
- North-East: Good (52 stock days)
- **North-West: Critical** (9 stock days) ⚠️
- South-East: Good (60 stock days)
- Southern: Warning (24 stock days)

### 3. Interactive Map Dashboard

#### `/app/map/page.tsx` (NEW)
Complete district risk visualization page featuring:
- **Interactive SVG map** showing all 9 districts color-coded by risk
- **District detail panel** with real-time metrics
- **Medicine inventory tabs** showing NAPPI-priced medicines by district
- **Facility tracking** with medicine-specific stock levels
- **Responsive design** for mobile/tablet/desktop
- **National overview statistics** showing 2 critical, 3 warning, 4 good districts

**Features:**
- Click district to view detailed stock information
- Tab between medicines and facilities
- Real-time risk scoring and facility reporting rates
- Color-coded risk indicators with icon guidance

### 4. API Endpoints

#### `/app/api/district-risk/route.ts` (NEW)
RESTful API for retrieving synthetic district data:

```bash
# Get all districts
GET /api/district-risk

# Get specific district with medicines
GET /api/district-risk?district=Central&include_medicines=true

# Get TB medicines only
GET /api/district-risk?category=tb

# Include facility-level data
GET /api/district-risk?include_facilities=true
```

**Response includes:**
- District risk levels and stock days
- Medicine inventory with NAPPI codes
- Facility stock tracking
- National summary statistics

### 5. Documentation

#### `/docs/SYNTHETIC_DATA_GENERATION.md`
Comprehensive guide covering:
- Data structure and schemas
- Risk classification logic
- Medicine categories and pricing
- District aggregation algorithms
- Current status of all 9 districts
- Critical medicines by district
- Patient impact calculations
- Integration with healthcare workflows

#### `/scripts/README.md`
Technical documentation for developers:
- Script usage instructions
- Input data formats
- Data schema definitions
- Customization options
- Performance considerations
- Troubleshooting guide

## Data Integration

### Pharmaceutical Data Sources

**NAPPI Pricing** (~15 medicines integrated):
- Rifampicin 150mg (P45.50)
- Isoniazid 100mg - Norstan (P13.30)
- Metformin 500mg - Rolab (P12.84)
- Amlodipine 5mg (P162.00)
- Enalapril 10mg - Renitec (P59.62)
- Cepacol Lozenges (P0.70)
- Folic Acid 5mg (P1.35)
- Acyclovir Cream 5g (P41.30)
- Bepanthen 100g (P223.29)
- And 6+ more antimalarial and chronic care medicines

**Price List 2026**:
- 3,000+ medicines in comprehensive catalog
- Pricing ranges from P0.50 to P2,500+
- Categories: treatments, diagnostics, supplies, devices

### Risk Distribution Algorithm

```typescript
For each district:
  1. Calculate population → facility count
  2. Distribute facilities by type (hospital/clinic/health-post)
  3. For each facility:
     - Generate medicines (70-130% consumption variation)
     - Set stock days based on district risk level:
       * Critical: 0-15 days
       * Warning: 15-35 days
       * Good: 30-60+ days
  4. Aggregate facility data to district level
  5. Identify critical medicines (< 15 stock days)
  6. Calculate patient impact risk
```

## Key Metrics

### Generated Data Volume
- **Districts**: 9
- **Facilities**: 40+ total
- **Medicines**: 15+ real NAPPI products per district
- **Total records**: 600+ medicine stock entries
- **Facilities reporting**: 90%+ average reporting rate

### Risk Scenario
- **Critical alert**: Ghanzi & North-West districts
- **At-risk patients**: 6,500+ in North-West (Ethambutol shortage)
- **Warning status**: Southern & Kweneng (partial shortages expected)
- **Safe status**: Central, Kgalagadi, North-East, South-East, Kgatleng

## Implementation Files Summary

| File | Type | Purpose |
|------|------|---------|
| `/lib/data.ts` | TypeScript | Core data exports with NAPPI integration |
| `/app/map/page.tsx` | React | Interactive risk map dashboard |
| `/app/api/district-risk/route.ts` | API | RESTful endpoint for map data |
| `/scripts/generate_synthetic_data.py` | Python | CSV-based data generator |
| `/scripts/generate-synthetic-map-data.ts` | TypeScript | Alternative generator for SSR |
| `/docs/SYNTHETIC_DATA_GENERATION.md` | Documentation | Detailed data generation guide |
| `/scripts/README.md` | Documentation | Script usage and integration guide |

## Usage Examples

### View the Map
Navigate to `http://localhost:3000/map` to see the interactive risk map.

### Fetch District Data via API
```bash
# All districts
curl http://localhost:3000/api/district-risk

# Specific district with medicines
curl "http://localhost:3000/api/district-risk?district=North-West&include_medicines=true"

# TB medicines only
curl "http://localhost:3000/api/district-risk?category=tb"
```

### Use in React Components
```typescript
import { DISTRICT_RISK_DATA, DISTRICT_MEDICINE_INVENTORY } from '@/lib/data'

// Get district risk
const risk = DISTRICT_RISK_DATA['Central']

// Get medicines
const medicines = DISTRICT_MEDICINE_INVENTORY
  .filter(m => m.district === 'Central')
```

## Next Steps

### Immediate Enhancements
1. Connect to live Supabase database
2. Add real-time facility reporting
3. Implement automatic shipment alerts
4. Create export/reporting functionality

### Future Development
1. Machine learning demand forecasting
2. Supply chain optimization engine
3. Multi-year historical trend analysis
4. Mobile app for facility staff
5. Automated treatment continuity monitoring

## Notes

- All data is **synthetic and for demonstration purposes**
- Risk levels are randomly distributed to show map functionality
- Prices are from 2026 NAPPI pricing data
- Facility counts based on district population
- Scripts are reproducible (seeded randomization)
- Full type safety with TypeScript interfaces

## Support

For questions about the implementation:
- Check `/docs/SYNTHETIC_DATA_GENERATION.md` for data details
- Review `/scripts/README.md` for script documentation
- Examine `/lib/data.ts` for data structure
- Test API endpoints with `curl` or Postman
