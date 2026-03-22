#!/usr/bin/env python3
"""
Synthetic Data Generator for Botswana Healthcare Stock Management Map
Generates realistic district-level stock risk data from pharmaceutical pricing data.
"""

import csv
import json
import random
from pathlib import Path
from typing import List, Dict, Any
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta


@dataclass
class MedicineStock:
    nappi_code: str
    medicineName: str
    stockOnHand: int
    monthlyConsumption: int
    stockDays: int
    unitPrice: float
    totalValue: float
    riskLevel: str


@dataclass
class FacilityStock:
    facilityId: str
    facilityName: str
    facilityType: str
    medicines: List[Dict[str, Any]]
    totalValue: float
    avgStockDays: int
    riskLevel: str
    patientsServed: int
    lastReportDate: str


@dataclass
class CriticalMedicine:
    medicineName: str
    stockDays: int
    affectedFacilities: int
    patientsAtRisk: int


@dataclass
class DistrictStock:
    district: str
    hasc_code: str
    facilities: List[Dict[str, Any]]
    totalStockValue: float
    averageStockDays: int
    riskLevel: str
    riskScore: int
    criticalMedicines: List[Dict[str, Any]]


# Botswana Districts with HASC codes
BOTSWANA_DISTRICTS = [
    {"name": "Central", "hasc": "BW.CE", "population": 638604},
    {"name": "Ghanzi", "hasc": "BW.GH", "population": 43355},
    {"name": "Kgalagadi", "hasc": "BW.KG", "population": 52890},
    {"name": "Kgatleng", "hasc": "BW.KL", "population": 91660},
    {"name": "Kweneng", "hasc": "BW.KW", "population": 304549},
    {"name": "North-East", "hasc": "BW.NE", "population": 70025},
    {"name": "North-West", "hasc": "BW.NW", "population": 175631},
    {"name": "South-East", "hasc": "BW.SE", "population": 89492},
    {"name": "Southern", "hasc": "BW.SO", "population": 222647},
]

FACILITY_TYPES = [
    ("hospital", 0.15),
    ("clinic", 0.45),
    ("health-post", 0.40),
]

FACILITY_NAMES = {
    "hospital": ["Primary Hospital", "Referral Hospital", "District Hospital"],
    "clinic": ["Primary Clinic", "Health Clinic", "Community Clinic"],
    "health-post": ["Health Post", "Sub-dispensary", "Community Health Post"],
}


class SeededRandom:
    def __init__(self, seed: int):
        self.seed = seed

    def random(self) -> float:
        self.seed = (self.seed * 9301 + 49297) % 233280
        return self.seed / 233280


class SyntheticDataGenerator:
    def __init__(self):
        self.medicines: List[Dict[str, Any]] = []
        self.rng = SeededRandom(42)

    def parse_nappi_prices(self, csv_path: str) -> List[Dict[str, Any]]:
        """Parse NAPPI prices CSV file"""
        medicines = []
        try:
            with open(csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row and row.get('NAPPI_CODE') and row.get('MEDICINE_FEE'):
                        try:
                            fee = float(row.get('MEDICINE_FEE', 0))
                            if fee > 0:
                                medicines.append({
                                    'description': row.get('DESCRIPTION', 'Unknown Medicine'),
                                    'quantity_unit': row.get('QUANTITY_UNIT', '1'),
                                    'medicine_fee': fee,
                                    'nappi_code': row.get('NAPPI_CODE', ''),
                                })
                        except ValueError:
                            continue
            print(f"[v0] Loaded {len(medicines)} medicines from {csv_path}")
        except FileNotFoundError:
            print(f"[v0] Warning: Could not find {csv_path}, using fallback medicines")
            medicines = self.generate_fallback_medicines()

        return medicines[:200]  # Use first 200 medicines

    def generate_fallback_medicines(self) -> List[Dict[str, Any]]:
        """Generate fallback medicines if CSV not found"""
        names = [
            "Rifampicin 150mg", "Isoniazid 100mg", "Pyrazinamide 500mg", "Ethambutol 400mg",
            "Artemether-Lumefantrine", "Quinine Sulphate 300mg", "Artesunate 60mg Inj",
            "Metformin 500mg", "Amlodipine 5mg", "Enalapril 10mg", "Hydrochlorothiazide 25mg",
            "Tenofovir 300mg", "Emtricitabine 200mg", "Efavirenz 600mg", "Lopinavir/Ritonavir",
        ]
        medicines = []
        for i in range(50):
            name = names[i % len(names)]
            medicines.append({
                'description': f"{name} - Variant {(i // len(names)) + 1}",
                'quantity_unit': 'tab',
                'medicine_fee': 50 + random.random() * 500,
                'nappi_code': f"NAP{str(i).zfill(7)}",
            })
        return medicines

    def calculate_risk_level(self, stock_days: int) -> str:
        """Calculate risk level based on stock days"""
        if stock_days < 15:
            return "critical"
        elif stock_days < 30:
            return "warning"
        return "good"

    def generate_medicine_stocks(self, count: int, facility_type: str) -> List[Dict[str, Any]]:
        """Generate medicine stocks for a facility"""
        stocks = []
        selected = self.medicines[:min(count, len(self.medicines))]

        for medicine in selected:
            multiplier = 3 if facility_type == "hospital" else 1
            monthly_consumption = int((50 + self.rng.random() * 200) * multiplier)
            stock_days = int(self.rng.random() * 90)
            stock_on_hand = int(monthly_consumption * (stock_days / 30))
            unit_price = medicine['medicine_fee']
            total_value = stock_on_hand * unit_price

            stocks.append({
                'nappi_code': medicine['nappi_code'],
                'medicineName': medicine['description'][:50],
                'stockOnHand': stock_on_hand,
                'monthlyConsumption': monthly_consumption,
                'stockDays': max(0, stock_days),
                'unitPrice': unit_price,
                'totalValue': total_value,
                'riskLevel': self.calculate_risk_level(stock_days),
            })

        return stocks

    def generate_facility(self, district: str, index: int, medicine_count: int) -> Dict[str, Any]:
        """Generate a single facility"""
        # Select facility type
        rand = self.rng.random()
        cumulative = 0
        facility_type = "clinic"
        for ftype, weight in FACILITY_TYPES:
            cumulative += weight
            if rand < cumulative:
                facility_type = ftype
                break

        # Generate facility name
        name_type = FACILITY_NAMES[facility_type][int(self.rng.random() * 3)]
        facility_name = f"{district} {name_type} {index + 1}"
        facility_id = f"FAC-{district.upper()}-{index + 1}"

        # Generate medicines
        medicines = self.generate_medicine_stocks(
            int(medicine_count * (0.5 + self.rng.random())),
            facility_type
        )

        total_value = sum(m['totalValue'] for m in medicines)
        avg_stock_days = (sum(m['stockDays'] for m in medicines) / len(medicines)) if medicines else 0

        if facility_type == "hospital":
            patients = 300 + int(self.rng.random() * 700)
        elif facility_type == "clinic":
            patients = 50 + int(self.rng.random() * 200)
        else:
            patients = 20 + int(self.rng.random() * 80)

        # Generate last report date (within last 7 days)
        days_ago = int(self.rng.random() * 7)
        last_report = (datetime.now() - timedelta(days=days_ago)).isoformat()

        return {
            'facilityId': facility_id,
            'facilityName': facility_name,
            'facilityType': facility_type,
            'medicines': medicines,
            'totalValue': round(total_value, 2),
            'avgStockDays': int(avg_stock_days),
            'riskLevel': self.calculate_risk_level(int(avg_stock_days)),
            'patientsServed': patients,
            'lastReportDate': last_report,
        }

    def generate_facility_stocks(self, district: str, medicine_count: int) -> List[Dict[str, Any]]:
        """Generate facilities for a district"""
        district_pop = next((d['population'] for d in BOTSWANA_DISTRICTS if d['name'] == district), 50000)
        facility_count = max(3, int(district_pop / 50000))
        facilities = []

        for i in range(facility_count):
            facilities.append(self.generate_facility(district, i, medicine_count))

        return facilities

    def generate_district_data(self, district: str, facilities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate district-level aggregation"""
        total_stock_value = sum(f['totalValue'] for f in facilities)
        avg_stock_days = (sum(f['avgStockDays'] for f in facilities) / len(facilities)) if facilities else 0

        risk_level = self.calculate_risk_level(int(avg_stock_days))
        critical_count = sum(1 for f in facilities if f['riskLevel'] == 'critical')
        risk_score = int((critical_count / len(facilities) * 100)) if facilities else 0

        # Identify critical medicines
        medicine_risk_map = {}
        for facility in facilities:
            for medicine in facility['medicines']:
                if medicine['riskLevel'] == 'critical':
                    key = medicine['medicineName']
                    if key not in medicine_risk_map:
                        medicine_risk_map[key] = {
                            'stockDays': medicine['stockDays'],
                            'facilities': set(),
                            'patients': 0
                        }
                    medicine_risk_map[key]['stockDays'] = min(
                        medicine_risk_map[key]['stockDays'],
                        medicine['stockDays']
                    )
                    medicine_risk_map[key]['facilities'].add(facility['facilityId'])
                    medicine_risk_map[key]['patients'] += facility['patientsServed']

        critical_medicines = [
            {
                'medicineName': name,
                'stockDays': data['stockDays'],
                'affectedFacilities': len(data['facilities']),
                'patientsAtRisk': int(data['patients'] * 0.3),
            }
            for name, data in medicine_risk_map.items()
        ]
        critical_medicines.sort(key=lambda x: x['stockDays'])

        hasc_code = next((d['hasc'] for d in BOTSWANA_DISTRICTS if d['name'] == district), '')

        return {
            'district': district,
            'hasc_code': hasc_code,
            'facilities': facilities,
            'totalStockValue': round(total_stock_value, 2),
            'averageStockDays': int(avg_stock_days),
            'riskLevel': risk_level,
            'riskScore': risk_score,
            'criticalMedicines': critical_medicines[:5],
        }

    def generate(self, nappi_csv_path: str) -> List[Dict[str, Any]]:
        """Main generation function"""
        self.medicines = self.parse_nappi_prices(nappi_csv_path)

        if not self.medicines:
            self.medicines = self.generate_fallback_medicines()

        district_data = []
        for district in BOTSWANA_DISTRICTS:
            facilities = self.generate_facility_stocks(district['name'], len(self.medicines))
            district_stock = self.generate_district_data(district['name'], facilities)
            district_data.append(district_stock)

        return district_data


def main():
    print("[v0] Starting synthetic data generation...")

    # Paths
    import os
    base_path = Path(os.getcwd())
    nappi_path = base_path / "user_read_only_context" / "text_attachments" / "NAppi-Prices-ikcwr.csv"
    output_path = base_path / "lib" / "synthetic-map-data.json"

    # Generate data
    generator = SyntheticDataGenerator()
    district_data = generator.generate(str(nappi_path))

    # Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(district_data, f, indent=2)

    print(f"[v0] Generated synthetic data for {len(district_data)} districts")
    total_facilities = sum(len(d['facilities']) for d in district_data)
    print(f"[v0] Total facilities: {total_facilities}")
    print(f"[v0] Output saved to: {output_path}")

    # Log summary
    print("\n[v0] District Summary:")
    for d in district_data:
        facilities = len(d['facilities'])
        avg_days = d['averageStockDays']
        risk = d['riskLevel']
        print(f"  {d['district']}: {facilities} facilities, {avg_days} avg stock days, Risk: {risk}")


if __name__ == "__main__":
    main()
