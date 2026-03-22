/**
 * Synthetic Data Generator for Botswana Healthcare Stock Management Map
 * 
 * This script generates realistic district-level stock risk data by:
 * 1. Parsing pharmaceutical pricing data (NAPPI Prices)
 * 2. Parsing medicine inventory data (Medicine Price List 2026)
 * 3. Creating synthetic facility-level stock positions for each district
 * 4. Calculating district-level risk aggregations
 */

import * as fs from 'fs';
import * as path from 'path';

// Types
interface MedicinePrice {
  description: string;
  quantity_unit: string;
  medicine_fee: number;
  nappi_code: string;
}

interface DistrictStock {
  district: string;
  hasc_code: string;
  facilities: FacilityStock[];
  totalStockValue: number;
  averageStockDays: number;
  riskLevel: 'critical' | 'warning' | 'good';
  riskScore: number;
  criticalMedicines: CriticalMedicine[];
}

interface FacilityStock {
  facilityId: string;
  facilityName: string;
  facilityType: 'hospital' | 'clinic' | 'health-post';
  medicines: MedicineStock[];
  totalValue: number;
  avgStockDays: number;
  riskLevel: 'critical' | 'warning' | 'good';
  patientsServed: number;
  lastReportDate: string;
}

interface MedicineStock {
  nappi_code: string;
  medicineName: string;
  stockOnHand: number;
  monthlyConsumption: number;
  stockDays: number;
  unitPrice: number;
  totalValue: number;
  riskLevel: 'critical' | 'warning' | 'good';
}

interface CriticalMedicine {
  medicineName: string;
  stockDays: number;
  affectedFacilities: number;
  patientsAtRisk: number;
}

// Botswana Districts with HASC codes
const BOTSWANA_DISTRICTS = [
  { name: 'Central', hasc: 'BW.CE', population: 638604 },
  { name: 'Ghanzi', hasc: 'BW.GH', population: 43355 },
  { name: 'Kgalagadi', hasc: 'BW.KG', population: 52890 },
  { name: 'Kgatleng', hasc: 'BW.KL', population: 91660 },
  { name: 'Kweneng', hasc: 'BW.KW', population: 304549 },
  { name: 'North-East', hasc: 'BW.NE', population: 70025 },
  { name: 'North-West', hasc: 'BW.NW', population: 175631 },
  { name: 'South-East', hasc: 'BW.SE', population: 89492 },
  { name: 'Southern', hasc: 'BW.SO', population: 222647 },
];

// Critical medicine categories
const MEDICINE_CATEGORIES = {
  TB: ['Rifampicin', 'Isoniazid', 'Pyrazinamide', 'Ethambutol'],
  ANTIMALARIAL: ['Artemether', 'Lumefantrine', 'Quinine', 'Artesunate'],
  CHRONIC: ['Metformin', 'Amlodipine', 'Enalapril', 'Hydrochlorothiazide'],
  HIV: ['Tenofovir', 'Emtricitabine', 'Efavirenz', 'Lopinavir'],
};

// Facility types distribution
const FACILITY_TYPES: { type: 'hospital' | 'clinic' | 'health-post'; weight: number }[] = [
  { type: 'hospital', weight: 0.15 },
  { type: 'clinic', weight: 0.45 },
  { type: 'health-post', weight: 0.40 },
];

class SyntheticDataGenerator {
  private medicines: MedicinePrice[] = [];
  private seededRandom = this.createSeededRandom(42);

  createSeededRandom(seed: number) {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  // Parse NAPPI prices CSV
  parseNappiPrices(csvContent: string): MedicinePrice[] {
    const lines = csvContent.split('\n').slice(1); // Skip header
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [description, quantity_unit, medicine_fee, nappi_code] = line.split(',');
        return {
          description: description.trim(),
          quantity_unit: quantity_unit?.trim() || '1',
          medicine_fee: parseFloat(medicine_fee) || 0,
          nappi_code: nappi_code?.trim() || '',
        };
      })
      .filter(m => m.nappi_code && m.medicine_fee > 0);
  }

  // Generate synthetic facility stocks
  generateFacilityStocks(district: string, medicineCount: number): FacilityStock[] {
    const districtPop = BOTSWANA_DISTRICTS.find(d => d.name === district)?.population || 50000;
    const facilityCount = Math.max(3, Math.floor(districtPop / 50000));
    const facilities: FacilityStock[] = [];

    for (let i = 0; i < facilityCount; i++) {
      facilities.push(this.generateFacility(district, i, medicineCount));
    }

    return facilities;
  }

  private generateFacility(district: string, index: number, medicineCount: number): FacilityStock {
    // Select random facility type based on weights
    let rand = this.seededRandom();
    let typeIndex = 0;
    let cumulative = 0;
    for (let i = 0; i < FACILITY_TYPES.length; i++) {
      cumulative += FACILITY_TYPES[i].weight;
      if (rand < cumulative) {
        typeIndex = i;
        break;
      }
    }
    const facilityType = FACILITY_TYPES[typeIndex].type;

    // Generate facility name
    const facilityNames: Record<string, string[]> = {
      'hospital': ['Primary Hospital', 'Referral Hospital', 'District Hospital'],
      'clinic': ['Primary Clinic', 'Health Clinic', 'Community Clinic'],
      'health-post': ['Health Post', 'Sub-dispensary', 'Community Health Post'],
    };
    const nameType = facilityNames[facilityType][Math.floor(this.seededRandom() * 3)];
    const facilityName = `${district} ${nameType} ${index + 1}`;
    const facilityId = `FAC-${district.toUpperCase()}-${index + 1}`;

    // Generate medicines for this facility
    const medicines = this.generateMedicineStocks(
      Math.floor(medicineCount * (0.5 + this.seededRandom())),
      facilityType
    );

    const totalValue = medicines.reduce((sum, m) => sum + m.totalValue, 0);
    const avgStockDays = medicines.length > 0 
      ? medicines.reduce((sum, m) => sum + m.stockDays, 0) / medicines.length
      : 0;

    const patientsServed = facilityType === 'hospital' 
      ? 300 + Math.floor(this.seededRandom() * 700)
      : facilityType === 'clinic'
      ? 50 + Math.floor(this.seededRandom() * 200)
      : 20 + Math.floor(this.seededRandom() * 80);

    const riskLevel = this.calculateRiskLevel(avgStockDays);

    return {
      facilityId,
      facilityName,
      facilityType,
      medicines,
      totalValue,
      avgStockDays: Math.round(avgStockDays),
      riskLevel,
      patientsServed,
      lastReportDate: new Date(Date.now() - Math.floor(this.seededRandom() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    };
  }

  private generateMedicineStocks(count: number, facilityType: string): MedicineStock[] {
    const stocks: MedicineStock[] = [];
    const selectedMedicines = this.medicines.slice(0, Math.min(count, this.medicines.length));

    for (const medicine of selectedMedicines) {
      const monthlyConsumption = Math.floor((50 + this.seededRandom() * 200) * (facilityType === 'hospital' ? 3 : 1));
      const stockDays = Math.floor(this.seededRandom() * 90); // 0-90 days variation
      const stockOnHand = Math.floor(monthlyConsumption * (stockDays / 30));
      const unitPrice = medicine.medicine_fee;
      const totalValue = stockOnHand * unitPrice;

      stocks.push({
        nappi_code: medicine.nappi_code,
        medicineName: medicine.description.substring(0, 50),
        stockOnHand,
        monthlyConsumption,
        stockDays: Math.max(0, stockDays),
        unitPrice,
        totalValue,
        riskLevel: this.calculateRiskLevel(stockDays),
      });
    }

    return stocks;
  }

  private calculateRiskLevel(stockDays: number): 'critical' | 'warning' | 'good' {
    if (stockDays < 15) return 'critical';
    if (stockDays < 30) return 'warning';
    return 'good';
  }

  // Generate district-level aggregation
  generateDistrictData(district: string, facilities: FacilityStock[]): DistrictStock {
    const totalStockValue = facilities.reduce((sum, f) => sum + f.totalValue, 0);
    const avgStockDays = facilities.length > 0
      ? facilities.reduce((sum, f) => sum + f.avgStockDays, 0) / facilities.length
      : 0;

    const riskLevel = this.calculateRiskLevel(avgStockDays);
    const criticalCount = facilities.filter(f => f.riskLevel === 'critical').length;
    const riskScore = Math.round((criticalCount / facilities.length) * 100);

    // Identify critical medicines
    const medicineRiskMap = new Map<string, { stockDays: number; facilities: Set<string>; patients: number }>();
    for (const facility of facilities) {
      for (const medicine of facility.medicines) {
        if (medicine.riskLevel === 'critical') {
          const key = medicine.medicineName;
          const existing = medicineRiskMap.get(key) || { stockDays: 0, facilities: new Set(), patients: 0 };
          existing.stockDays = Math.min(existing.stockDays || 100, medicine.stockDays);
          existing.facilities.add(facility.facilityId);
          existing.patients += facility.patientsServed;
          medicineRiskMap.set(key, existing);
        }
      }
    }

    const criticalMedicines: CriticalMedicine[] = Array.from(medicineRiskMap.entries())
      .map(([name, data]) => ({
        medicineName: name,
        stockDays: data.stockDays,
        affectedFacilities: data.facilities.size,
        patientsAtRisk: Math.floor(data.patients * 0.3),
      }))
      .sort((a, b) => a.stockDays - b.stockDays)
      .slice(0, 5);

    return {
      district,
      hasc_code: BOTSWANA_DISTRICTS.find(d => d.name === district)?.hasc || '',
      facilities,
      totalStockValue,
      averageStockDays: Math.round(avgStockDays),
      riskLevel,
      riskScore,
      criticalMedicines,
    };
  }

  // Main generation function
  generate(nappiCsvPath: string): DistrictStock[] {
    // Read and parse NAPPI prices
    if (fs.existsSync(nappiCsvPath)) {
      const csvContent = fs.readFileSync(nappiCsvPath, 'utf-8');
      this.medicines = this.parseNappiPrices(csvContent).slice(0, 200); // Use first 200 medicines
    }

    if (this.medicines.length === 0) {
      // Fallback medicines if file not found
      this.medicines = this.generateFallbackMedicines();
    }

    // Generate data for all districts
    const districtData: DistrictStock[] = [];
    for (const district of BOTSWANA_DISTRICTS) {
      const facilities = this.generateFacilityStocks(district.name, this.medicines.length);
      const districtStock = this.generateDistrictData(district.name, facilities);
      districtData.push(districtStock);
    }

    return districtData;
  }

  private generateFallbackMedicines(): MedicinePrice[] {
    const medicines: MedicinePrice[] = [];
    const names = [
      'Rifampicin 150mg', 'Isoniazid 100mg', 'Pyrazinamide 500mg', 'Ethambutol 400mg',
      'Artemether-Lumefantrine', 'Quinine Sulphate 300mg', 'Artesunate 60mg Inj',
      'Metformin 500mg', 'Amlodipine 5mg', 'Enalapril 10mg', 'Hydrochlorothiazide 25mg',
      'Tenofovir 300mg', 'Emtricitabine 200mg', 'Efavirenz 600mg', 'Lopinavir/Ritonavir',
    ];

    for (let i = 0; i < 50; i++) {
      const name = names[i % names.length];
      medicines.push({
        description: `${name} - Variant ${Math.floor(i / names.length) + 1}`,
        quantity_unit: 'tab',
        medicine_fee: 50 + Math.random() * 500,
        nappi_code: `NAP${String(i).padStart(7, '0')}`,
      });
    }

    return medicines;
  }
}

// Main execution
async function main() {
  console.log('[v0] Starting synthetic data generation...');

  const nappiPath = path.join(process.cwd(), 'user_read_only_context', 'text_attachments', 'NAppi-Prices-ikcwr.csv');
  const outputPath = path.join(process.cwd(), 'lib', 'synthetic-map-data.json');

  const generator = new SyntheticDataGenerator();
  const districtData = generator.generate(nappiPath);

  // Write output
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(districtData, null, 2));

  console.log(`[v0] Generated synthetic data for ${districtData.length} districts`);
  console.log(`[v0] Total facilities: ${districtData.reduce((sum, d) => sum + d.facilities.length, 0)}`);
  console.log(`[v0] Output saved to: ${outputPath}`);

  // Log summary
  console.log('\n[v0] District Summary:');
  districtData.forEach(d => {
    console.log(`  ${d.district}: ${d.facilities.length} facilities, ${d.averageStockDays} avg stock days, Risk: ${d.riskLevel}`);
  });
}

main().catch(error => {
  console.error('[v0] Error:', error.message);
  process.exit(1);
});
