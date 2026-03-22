# Data Generation Scripts

This directory contains scripts for generating and managing pharmaceutical synthetic data for the Botswana healthcare stock management system.

## Scripts

### `generate_synthetic_data.py`

Python script that generates realistic district-level pharmaceutical stock data from NAPPI pricing information.

**Features:**
- Parses NAPPI prices CSV (optional)
- Generates facility-level inventory
- Calculates district-level aggregations
- Outputs JSON data for map visualization
- Creates realistic variation in stock levels by risk category

**Usage:**

```bash
python3 generate_synthetic_data.py
```

**Output:**
- Creates `/lib/synthetic-map-data.json` with 9 districts
- Generates 3-12 facilities per district
- Produces 40+ total facility records
- Includes medicine-specific inventory

**Sample Output Structure:**

```json
[
  {
    "district": "Central",
    "hasc_code": "BW.CE",
    "facilities": [...],
    "totalStockValue": 450000.50,
    "averageStockDays": 45,
    "riskLevel": "good",
    "riskScore": 25,
    "criticalMedicines": [...]
  }
]
```

### `generate-synthetic-map-data.ts`

TypeScript implementation of the data generator for use within the Next.js application.

**Features:**
- Seeded random number generation for reproducibility
- Type-safe data structures
- Synchronous generation for SSR compatibility
- Fallback medicine list if NAPPI data unavailable

**Usage:**

```typescript
import { SyntheticDataGenerator } from '@/scripts/generate-synthetic-map-data'

const generator = new SyntheticDataGenerator()
const data = generator.generate('/path/to/nappi-prices.csv')
```

## Input Data

### NAPPI Prices CSV

Expected columns:
```
DESCRIPTION,QUANTITY_UNIT,MEDICINE_FEE,NAPPI_CODE
Alcophyllex syrup,200ml,26.07,701742011
Metformin tabs 500mg,30,12.84,719285011
...
```

Location: `/user_read_only_context/text_attachments/NAppi-Prices-ikcwr.csv`

### Medicine Price List 2026

Provides additional pricing and classification data for ~3,000 medicines.

Location: `/user_read_only_context/text_attachments/Medicine-Price-List-2026-UPDATED-hHdiV.csv`

## Data Schema

### District Risk Data

```typescript
interface DistrictRisk {
  district: string
  hasc_code: string
  facilities: FacilityStock[]
  totalStockValue: number
  averageStockDays: number
  riskLevel: 'critical' | 'warning' | 'good'
  riskScore: number (0-100)
  criticalMedicines: CriticalMedicine[]
}
```

### Facility Stock

```typescript
interface FacilityStock {
  facilityId: string
  facilityName: string
  facilityType: 'hospital' | 'clinic' | 'health-post'
  medicines: MedicineStock[]
  totalValue: number
  avgStockDays: number
  riskLevel: 'critical' | 'warning' | 'good'
  patientsServed: number
  lastReportDate: string (ISO date)
}
```

### Medicine Stock

```typescript
interface MedicineStock {
  nappi_code: string
  medicineName: string
  stockOnHand: number
  monthlyConsumption: number
  stockDays: number
  unitPrice: number
  totalValue: number
  riskLevel: 'critical' | 'warning' | 'good'
}
```

## Risk Level Classification

- **Critical** (Red): < 15 stock days
- **Warning** (Orange): 15-30 stock days
- **Good** (Green): > 30 stock days

## Customization

### Modifying Risk Distribution

In `generate_synthetic_data.py`, adjust the stock day ranges:

```python
if districtRisk.riskLevel === "critical":
    stockDays = Math.floor(Math.random() * 15)  # 0-15 days
elif districtRisk.riskLevel === "warning":
    stockDays = Math.floor(Math.random() * 20 + 15)  # 15-35 days
else:
    stockDays = Math.floor(Math.random() * 30 + 30)  # 30-60 days
```

### Facility Distribution

Modify `FACILITY_TYPES` to change facility type distribution:

```python
FACILITY_TYPES = [
    ("hospital", 0.15),      # 15% hospitals
    ("clinic", 0.45),        # 45% clinics
    ("health-post", 0.40),   # 40% health posts
]
```

### Seeded Randomization

For reproducible results, all scripts use seeded random number generation (seed=42). To change:

```python
self.rng = SeededRandom(12345)  # Different seed for different results
```

## Integration with Application

### Using Generated Data

The map component automatically imports from `/lib/data.ts`:

```typescript
import { DISTRICT_RISK_DATA, DISTRICT_MEDICINE_INVENTORY } from '@/lib/data'

export function BotswanaMap({ onDistrictClick }) {
  const riskData = DISTRICT_RISK_DATA[selectedDistrict]
  // ... render map with risk colors
}
```

### Real-time Updates

To use live database data instead of synthetic data:

1. Update `/lib/supabase/client.ts` with Supabase connection
2. Create API endpoint: `/api/district-risk`
3. Replace imports in components:

```typescript
// Before (synthetic)
import { DISTRICT_RISK_DATA } from '@/lib/data'

// After (live)
const { data: DISTRICT_RISK_DATA } = useSWR('/api/district-risk')
```

## Performance Considerations

### Generation Time
- Full dataset: ~100-200ms
- Per-district generation: ~10-20ms

### Memory Usage
- ~500KB JSON output for 9 districts with 40+ facilities
- ~2MB in-memory during generation

### Data Volume
- 9 districts
- 40 facilities
- 15 medicines per facility
- Total records: ~600 medicine stock entries

## Troubleshooting

### Issue: CSV file not found
**Solution:** Ensure NAPPI prices CSV exists at expected path. Script will fall back to generated medicines.

```bash
ls user_read_only_context/text_attachments/NAppi-Prices-ikcwr.csv
```

### Issue: Missing Python dependencies
**Solution:** Install required modules:

```bash
pip3 install -r requirements.txt
```

## Future Development

- [ ] Real-time NAPPI database connection
- [ ] Machine learning-based demand forecasting
- [ ] Automated shipment optimization
- [ ] Multi-year historical data generation
- [ ] Climate/seasonal variation modeling
- [ ] Supply chain simulation engine

## Contributing

When adding new data generation features:

1. Maintain backward compatibility with existing data structures
2. Add comprehensive docstrings
3. Include type annotations
4. Test with both CSV and fallback modes
5. Update this README with changes

## Support

For issues or questions:
- Check existing data in `/lib/data.ts`
- Review schema in `/docs/SYNTHETIC_DATA_GENERATION.md`
- Test scripts in isolation before integration
