// Botswana Districts
export const BOTSWANA_DISTRICTS = [
  "Central",
  "Ghanzi", 
  "Kgalagadi",
  "Kgatleng",
  "Kweneng",
  "North-East",
  "North-West",
  "South-East",
  "Southern",
] as const

export type District = (typeof BOTSWANA_DISTRICTS)[number]

// Risk levels
export type RiskLevel = "critical" | "warning" | "good"

// Medicine categories
export const MEDICINE_CATEGORIES = {
  tb: ["Rifampicin", "Isoniazid", "Pyrazinamide", "Ethambutol", "Rifampicin/Isoniazid FDC"],
  antimalarial: ["Artemether-Lumefantrine", "Quinine Sulphate", "Artesunate", "Sulfadoxine-Pyrimethamine"],
  chronic: ["Metformin 500mg", "Amlodipine 5mg", "Enalapril 10mg", "Hydrochlorothiazide 25mg", "Atenolol 50mg"],
} as const

export type MedicineCategory = keyof typeof MEDICINE_CATEGORIES

// User roles
export type UserRole = "cms" | "facility" | "logistics" | "clinician" | "surveillance" | "patient"

export const USER_ROLES: Record<UserRole, { label: string; description: string }> = {
  cms: { label: "CMS Planner", description: "Central Medical Stores planning and procurement" },
  facility: { label: "Facility Manager", description: "Pharmacy and stock management at health facilities" },
  logistics: { label: "Logistics Team", description: "Supply chain and distribution management" },
  clinician: { label: "Clinician", description: "Healthcare providers prescribing and dispensing" },
  surveillance: { label: "Surveillance Team", description: "Epidemiological monitoring and analysis" },
  patient: { label: "Patient", description: "Access your medications and treatment schedule" },
}

// Mock district risk data
export const DISTRICT_RISK_DATA: Record<District, { riskLevel: RiskLevel; stockDays: number; facilitiesReporting: number; totalFacilities: number }> = {
  "Central": { riskLevel: "good", stockDays: 45, facilitiesReporting: 42, totalFacilities: 45 },
  "Ghanzi": { riskLevel: "warning", stockDays: 18, facilitiesReporting: 8, totalFacilities: 10 },
  "Kgalagadi": { riskLevel: "critical", stockDays: 7, facilitiesReporting: 5, totalFacilities: 8 },
  "Kgatleng": { riskLevel: "good", stockDays: 38, facilitiesReporting: 12, totalFacilities: 12 },
  "Kweneng": { riskLevel: "warning", stockDays: 22, facilitiesReporting: 28, totalFacilities: 32 },
  "North-East": { riskLevel: "good", stockDays: 52, facilitiesReporting: 15, totalFacilities: 15 },
  "North-West": { riskLevel: "warning", stockDays: 15, facilitiesReporting: 18, totalFacilities: 22 },
  "South-East": { riskLevel: "good", stockDays: 60, facilitiesReporting: 8, totalFacilities: 8 },
  "Southern": { riskLevel: "critical", stockDays: 9, facilitiesReporting: 20, totalFacilities: 25 },
}

// Mock medicine stock data
export interface MedicineStock {
  id: string
  name: string
  category: MedicineCategory
  stockOnHand: number
  monthlyConsumption: number
  daysOfStock: number
  riskLevel: RiskLevel
  inTransit: number
  lastUpdated: string
}

export const MEDICINE_STOCK_DATA: MedicineStock[] = [
  { id: "1", name: "Rifampicin 150mg", category: "tb", stockOnHand: 45000, monthlyConsumption: 12000, daysOfStock: 112, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-15" },
  { id: "2", name: "Isoniazid 100mg", category: "tb", stockOnHand: 8000, monthlyConsumption: 10000, daysOfStock: 24, riskLevel: "warning", inTransit: 15000, lastUpdated: "2024-01-15" },
  { id: "3", name: "Pyrazinamide 500mg", category: "tb", stockOnHand: 3500, monthlyConsumption: 8000, daysOfStock: 13, riskLevel: "critical", inTransit: 0, lastUpdated: "2024-01-14" },
  { id: "4", name: "Ethambutol 400mg", category: "tb", stockOnHand: 22000, monthlyConsumption: 6000, daysOfStock: 110, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-15" },
  { id: "5", name: "Artemether-Lumefantrine", category: "antimalarial", stockOnHand: 5200, monthlyConsumption: 4500, daysOfStock: 35, riskLevel: "good", inTransit: 8000, lastUpdated: "2024-01-15" },
  { id: "6", name: "Quinine Sulphate 300mg", category: "antimalarial", stockOnHand: 1800, monthlyConsumption: 2200, daysOfStock: 24, riskLevel: "warning", inTransit: 0, lastUpdated: "2024-01-14" },
  { id: "7", name: "Artesunate 60mg", category: "antimalarial", stockOnHand: 4500, monthlyConsumption: 1800, daysOfStock: 75, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-15" },
  { id: "8", name: "Metformin 500mg", category: "chronic", stockOnHand: 2100, monthlyConsumption: 8500, daysOfStock: 7, riskLevel: "critical", inTransit: 20000, lastUpdated: "2024-01-15" },
  { id: "9", name: "Amlodipine 5mg", category: "chronic", stockOnHand: 15000, monthlyConsumption: 7200, daysOfStock: 62, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-15" },
  { id: "10", name: "Enalapril 10mg", category: "chronic", stockOnHand: 6800, monthlyConsumption: 5500, daysOfStock: 37, riskLevel: "good", inTransit: 0, lastUpdated: "2024-01-14" },
]

// Mock shipment data
export interface Shipment {
  id: string
  origin: string
  destination: District
  medicines: string[]
  status: "in-transit" | "delayed" | "delivered" | "pending"
  estimatedArrival: string
  quantity: number
}

export const SHIPMENT_DATA: Shipment[] = [
  { id: "SHP-001", origin: "CMS Gaborone", destination: "Kgalagadi", medicines: ["Pyrazinamide", "Metformin"], status: "in-transit", estimatedArrival: "2024-01-17", quantity: 12000 },
  { id: "SHP-002", origin: "CMS Gaborone", destination: "Southern", medicines: ["Isoniazid", "Rifampicin"], status: "delayed", estimatedArrival: "2024-01-16", quantity: 8500 },
  { id: "SHP-003", origin: "CMS Francistown", destination: "North-West", medicines: ["Artemether-Lumefantrine"], status: "in-transit", estimatedArrival: "2024-01-18", quantity: 5000 },
  { id: "SHP-004", origin: "CMS Gaborone", destination: "Ghanzi", medicines: ["Quinine Sulphate"], status: "pending", estimatedArrival: "2024-01-20", quantity: 3000 },
]

// Mock patient data
export interface Patient {
  id: string
  name: string
  nationalId: string
  facility: string
  district: District
  condition: string
  medications: PatientMedication[]
  treatmentStartDate: string
  nextPickupDate: string
  adherenceRate: number
  riskStatus: RiskLevel
}

export interface PatientMedication {
  name: string
  dosage: string
  frequency: string
  daysSupply: number
  refillsRemaining: number
}

export const PATIENT_DATA: Patient[] = [
  {
    id: "P-001",
    name: "Kelebogile Mosweu",
    nationalId: "***-***-1234",
    facility: "Princess Marina Hospital",
    district: "South-East",
    condition: "TB Treatment",
    medications: [
      { name: "Rifampicin/Isoniazid FDC", dosage: "150/75mg", frequency: "Once daily", daysSupply: 14, refillsRemaining: 4 },
      { name: "Pyrazinamide", dosage: "500mg", frequency: "Once daily", daysSupply: 14, refillsRemaining: 4 },
    ],
    treatmentStartDate: "2023-11-01",
    nextPickupDate: "2024-01-22",
    adherenceRate: 94,
    riskStatus: "good",
  },
  {
    id: "P-002",
    name: "Thabo Molefe",
    nationalId: "***-***-5678",
    facility: "Maun General Hospital",
    district: "North-West",
    condition: "Hypertension + Diabetes",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", daysSupply: 3, refillsRemaining: 2 },
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", daysSupply: 3, refillsRemaining: 2 },
    ],
    treatmentStartDate: "2022-06-15",
    nextPickupDate: "2024-01-16",
    adherenceRate: 78,
    riskStatus: "warning",
  },
  {
    id: "P-003",
    name: "Goitseone Kgosidintsi",
    nationalId: "***-***-9012",
    facility: "Tsabong Primary Hospital",
    district: "Kgalagadi",
    condition: "TB Treatment",
    medications: [
      { name: "Rifampicin", dosage: "150mg", frequency: "Once daily", daysSupply: 0, refillsRemaining: 3 },
    ],
    treatmentStartDate: "2023-12-01",
    nextPickupDate: "2024-01-14",
    adherenceRate: 65,
    riskStatus: "critical",
  },
]

// Mock continuity alerts
export interface ContinuityAlert {
  id: string
  type: "missed-pickup" | "low-adherence" | "stock-risk" | "treatment-gap"
  severity: RiskLevel
  patientId?: string
  patientName?: string
  facility?: string
  district: District
  message: string
  createdAt: string
}

export const CONTINUITY_ALERTS: ContinuityAlert[] = [
  { id: "A-001", type: "missed-pickup", severity: "critical", patientId: "P-003", patientName: "Goitseone K.", facility: "Tsabong Primary Hospital", district: "Kgalagadi", message: "Patient missed TB medication pickup - 3 days overdue", createdAt: "2024-01-15T08:00:00" },
  { id: "A-002", type: "stock-risk", severity: "critical", district: "Kgalagadi", message: "Pyrazinamide stock critically low - 7 days remaining", createdAt: "2024-01-15T06:00:00" },
  { id: "A-003", type: "low-adherence", severity: "warning", patientId: "P-002", patientName: "Thabo M.", facility: "Maun General Hospital", district: "North-West", message: "Patient adherence dropped below 80% - chronic care regimen", createdAt: "2024-01-14T14:30:00" },
  { id: "A-004", type: "stock-risk", severity: "warning", district: "Southern", message: "Isoniazid shipment delayed - may impact 45 patients", createdAt: "2024-01-14T10:00:00" },
  { id: "A-005", type: "treatment-gap", severity: "critical", district: "Southern", message: "9 TB patients at risk of treatment interruption in next 5 days", createdAt: "2024-01-15T07:00:00" },
]

// Facility data
export interface Facility {
  id: string
  name: string
  district: District
  type: "hospital" | "clinic" | "health-post"
  stockStatus: RiskLevel
  patientsServed: number
  lastReportDate: string
}

export const FACILITY_DATA: Facility[] = [
  { id: "F-001", name: "Princess Marina Hospital", district: "South-East", type: "hospital", stockStatus: "good", patientsServed: 2450, lastReportDate: "2024-01-15" },
  { id: "F-002", name: "Nyangabgwe Referral Hospital", district: "Central", type: "hospital", stockStatus: "good", patientsServed: 1890, lastReportDate: "2024-01-15" },
  { id: "F-003", name: "Maun General Hospital", district: "North-West", type: "hospital", stockStatus: "warning", patientsServed: 980, lastReportDate: "2024-01-14" },
  { id: "F-004", name: "Tsabong Primary Hospital", district: "Kgalagadi", type: "hospital", stockStatus: "critical", patientsServed: 420, lastReportDate: "2024-01-13" },
  { id: "F-005", name: "Ghanzi Primary Hospital", district: "Ghanzi", type: "hospital", stockStatus: "warning", patientsServed: 560, lastReportDate: "2024-01-14" },
  { id: "F-006", name: "Kanye Main Hospital", district: "Southern", type: "hospital", stockStatus: "critical", patientsServed: 780, lastReportDate: "2024-01-15" },
]

// National KPIs
export const NATIONAL_KPIS = {
  totalFacilities: 177,
  facilitiesReporting: 156,
  reportingRate: 88,
  nationalStockDays: 34,
  patientsOnTreatment: 12450,
  continuityRate: 91.2,
  criticalAlerts: 8,
  shipmentsInTransit: 12,
}

// Stock trend data for charts
export const STOCK_TREND_DATA = [
  { month: "Aug", tb: 85, antimalarial: 72, chronic: 68 },
  { month: "Sep", tb: 78, antimalarial: 80, chronic: 65 },
  { month: "Oct", tb: 72, antimalarial: 75, chronic: 58 },
  { month: "Nov", tb: 65, antimalarial: 68, chronic: 52 },
  { month: "Dec", tb: 58, antimalarial: 62, chronic: 45 },
  { month: "Jan", tb: 52, antimalarial: 70, chronic: 38 },
]

// Disease incidence data
export const DISEASE_INCIDENCE_DATA = [
  { month: "Aug", tb: 245, malaria: 180, hypertension: 420, diabetes: 380 },
  { month: "Sep", tb: 238, malaria: 165, hypertension: 435, diabetes: 392 },
  { month: "Oct", tb: 252, malaria: 142, hypertension: 448, diabetes: 405 },
  { month: "Nov", tb: 261, malaria: 198, hypertension: 462, diabetes: 418 },
  { month: "Dec", tb: 248, malaria: 225, hypertension: 475, diabetes: 428 },
  { month: "Jan", tb: 255, malaria: 210, hypertension: 488, diabetes: 440 },
]

// ============================================
// MEDICINE DISPENSING & TRACKING SYSTEM
// ============================================

// Medicine-to-Condition Mapping (Treatment-Condition Dataset)
export const MEDICINE_CONDITION_MAP: Record<string, { conditions: string[]; programme: string }> = {
  "Rifampicin": { conditions: ["Tuberculosis"], programme: "TB" },
  "Isoniazid": { conditions: ["Tuberculosis"], programme: "TB" },
  "Pyrazinamide": { conditions: ["Tuberculosis"], programme: "TB" },
  "Ethambutol": { conditions: ["Tuberculosis"], programme: "TB" },
  "Rifampicin/Isoniazid FDC": { conditions: ["Tuberculosis"], programme: "TB" },
  "Artemether-Lumefantrine": { conditions: ["Malaria"], programme: "Malaria" },
  "Quinine Sulphate": { conditions: ["Malaria"], programme: "Malaria" },
  "Artesunate": { conditions: ["Malaria", "Severe Malaria"], programme: "Malaria" },
  "Sulfadoxine-Pyrimethamine": { conditions: ["Malaria Prevention"], programme: "Malaria" },
  "Metformin": { conditions: ["Diabetes Type 2"], programme: "NCD" },
  "Amlodipine": { conditions: ["Hypertension"], programme: "NCD" },
  "Enalapril": { conditions: ["Hypertension", "Heart Failure"], programme: "NCD" },
  "Hydrochlorothiazide": { conditions: ["Hypertension"], programme: "NCD" },
  "Atenolol": { conditions: ["Hypertension", "Angina"], programme: "NCD" },
}

// Dispensing Record
export interface DispensingRecord {
  id: string
  medicineId: string
  medicineName: string
  quantity: number
  date: string
  facilityId: string
  facilityName: string
  district: District
  dispensingStaffId: string
  dispensingStaffName: string
  prescriptionId?: string
  patientEncounterId?: string
  patientId?: string
  programme: string
  batchNumber: string
  expiryDate: string
}

// Mock dispensing records
export const DISPENSING_RECORDS: DispensingRecord[] = [
  { id: "D-001", medicineId: "1", medicineName: "Rifampicin 150mg", quantity: 60, date: "2024-01-15", facilityId: "F-001", facilityName: "Princess Marina Hospital", district: "South-East", dispensingStaffId: "S-001", dispensingStaffName: "Nurse K. Modise", prescriptionId: "RX-4521", patientEncounterId: "E-1001", patientId: "P-001", programme: "TB", batchNumber: "BT-2024-001", expiryDate: "2025-06-15" },
  { id: "D-002", medicineId: "8", medicineName: "Metformin 500mg", quantity: 90, date: "2024-01-15", facilityId: "F-003", facilityName: "Maun General Hospital", district: "North-West", dispensingStaffId: "S-015", dispensingStaffName: "Nurse T. Mogapi", prescriptionId: "RX-4522", patientEncounterId: "E-1002", patientId: "P-002", programme: "NCD", batchNumber: "BT-2024-045", expiryDate: "2025-03-20" },
  { id: "D-003", medicineId: "5", medicineName: "Artemether-Lumefantrine", quantity: 24, date: "2024-01-15", facilityId: "F-003", facilityName: "Maun General Hospital", district: "North-West", dispensingStaffId: "S-015", dispensingStaffName: "Nurse T. Mogapi", prescriptionId: "RX-4523", patientEncounterId: "E-1003", programme: "Malaria", batchNumber: "BT-2024-089", expiryDate: "2024-12-01" },
  { id: "D-004", medicineId: "3", medicineName: "Pyrazinamide 500mg", quantity: 30, date: "2024-01-14", facilityId: "F-004", facilityName: "Tsabong Primary Hospital", district: "Kgalagadi", dispensingStaffId: "S-022", dispensingStaffName: "Nurse M. Seipei", prescriptionId: "RX-4520", patientEncounterId: "E-1004", patientId: "P-003", programme: "TB", batchNumber: "BT-2024-012", expiryDate: "2025-01-10" },
  { id: "D-005", medicineId: "9", medicineName: "Amlodipine 5mg", quantity: 30, date: "2024-01-14", facilityId: "F-006", facilityName: "Kanye Main Hospital", district: "Southern", dispensingStaffId: "S-030", dispensingStaffName: "Nurse B. Phiri", prescriptionId: "RX-4519", patientEncounterId: "E-1005", programme: "NCD", batchNumber: "BT-2024-067", expiryDate: "2025-08-22" },
  { id: "D-006", medicineId: "5", medicineName: "Artemether-Lumefantrine", quantity: 48, date: "2024-01-14", facilityId: "F-003", facilityName: "Maun General Hospital", district: "North-West", dispensingStaffId: "S-016", dispensingStaffName: "Nurse L. Mokgethi", programme: "Malaria", batchNumber: "BT-2024-089", expiryDate: "2024-12-01" },
  { id: "D-007", medicineId: "1", medicineName: "Rifampicin 150mg", quantity: 120, date: "2024-01-13", facilityId: "F-002", facilityName: "Nyangabgwe Referral Hospital", district: "Central", dispensingStaffId: "S-008", dispensingStaffName: "Nurse G. Tsheko", prescriptionId: "RX-4515", patientEncounterId: "E-1006", programme: "TB", batchNumber: "BT-2024-001", expiryDate: "2025-06-15" },
  { id: "D-008", medicineId: "6", medicineName: "Quinine Sulphate 300mg", quantity: 20, date: "2024-01-13", facilityId: "F-005", facilityName: "Ghanzi Primary Hospital", district: "Ghanzi", dispensingStaffId: "S-025", dispensingStaffName: "Nurse P. Kgosi", prescriptionId: "RX-4514", patientEncounterId: "E-1007", programme: "Malaria", batchNumber: "BT-2024-078", expiryDate: "2024-09-30" },
]

// Facility Inventory View
export interface FacilityInventory {
  facilityId: string
  facilityName: string
  district: District
  medicines: {
    medicineId: string
    medicineName: string
    stockOnHand: number
    nearExpiry: number
    expiryDate: string
    lowStockAlert: boolean
    reorderPoint: number
    lastDispensedDate: string
  }[]
  lastUpdated: string
}

export const FACILITY_INVENTORY: FacilityInventory[] = [
  {
    facilityId: "F-001",
    facilityName: "Princess Marina Hospital",
    district: "South-East",
    medicines: [
      { medicineId: "1", medicineName: "Rifampicin 150mg", stockOnHand: 2250, nearExpiry: 0, expiryDate: "2025-06-15", lowStockAlert: false, reorderPoint: 1000, lastDispensedDate: "2024-01-15" },
      { medicineId: "2", medicineName: "Isoniazid 100mg", stockOnHand: 400, nearExpiry: 150, expiryDate: "2024-03-20", lowStockAlert: true, reorderPoint: 500, lastDispensedDate: "2024-01-15" },
      { medicineId: "8", medicineName: "Metformin 500mg", stockOnHand: 105, nearExpiry: 0, expiryDate: "2025-03-20", lowStockAlert: true, reorderPoint: 400, lastDispensedDate: "2024-01-14" },
    ],
    lastUpdated: "2024-01-15T08:30:00"
  },
  {
    facilityId: "F-004",
    facilityName: "Tsabong Primary Hospital",
    district: "Kgalagadi",
    medicines: [
      { medicineId: "3", medicineName: "Pyrazinamide 500mg", stockOnHand: 50, nearExpiry: 50, expiryDate: "2024-02-10", lowStockAlert: true, reorderPoint: 200, lastDispensedDate: "2024-01-14" },
      { medicineId: "1", medicineName: "Rifampicin 150mg", stockOnHand: 180, nearExpiry: 0, expiryDate: "2025-06-15", lowStockAlert: true, reorderPoint: 300, lastDispensedDate: "2024-01-13" },
    ],
    lastUpdated: "2024-01-13T14:20:00"
  },
]

// ============================================
// OUTBREAK/DISEASE SPREAD DETECTION
// ============================================

// Regional Dispensing Aggregation (for outbreak detection)
export interface RegionalDispensingTrend {
  district: District
  period: string
  programme: string
  condition: string
  dispensingCount: number
  previousPeriodCount: number
  changePercent: number
  isSpike: boolean
  isTrending: boolean
}

export const REGIONAL_DISPENSING_TRENDS: RegionalDispensingTrend[] = [
  { district: "North-West", period: "2024-W02", programme: "Malaria", condition: "Malaria", dispensingCount: 245, previousPeriodCount: 142, changePercent: 72.5, isSpike: true, isTrending: true },
  { district: "Kweneng", period: "2024-W02", programme: "TB", condition: "Tuberculosis", dispensingCount: 89, previousPeriodCount: 62, changePercent: 43.5, isSpike: true, isTrending: false },
  { district: "Southern", period: "2024-W02", programme: "NCD", condition: "Hypertension", dispensingCount: 312, previousPeriodCount: 298, changePercent: 4.7, isSpike: false, isTrending: false },
  { district: "Kgalagadi", period: "2024-W02", programme: "TB", condition: "Tuberculosis", dispensingCount: 34, previousPeriodCount: 28, changePercent: 21.4, isSpike: false, isTrending: true },
  { district: "Central", period: "2024-W02", programme: "Malaria", condition: "Malaria", dispensingCount: 78, previousPeriodCount: 65, changePercent: 20.0, isSpike: false, isTrending: false },
  { district: "Ghanzi", period: "2024-W02", programme: "Malaria", condition: "Malaria", dispensingCount: 156, previousPeriodCount: 88, changePercent: 77.3, isSpike: true, isTrending: true },
]

// Outbreak Alert
export interface OutbreakAlert {
  id: string
  district: District
  condition: string
  severity: RiskLevel
  type: "spike" | "trend" | "cluster"
  description: string
  affectedFacilities: number
  dispensingIncrease: number
  detectedAt: string
  recommendedAction: string
}

export const OUTBREAK_ALERTS: OutbreakAlert[] = [
  { id: "OB-001", district: "North-West", condition: "Malaria", severity: "critical", type: "spike", description: "72.5% increase in antimalarial dispensing detected", affectedFacilities: 8, dispensingIncrease: 72.5, detectedAt: "2024-01-14T06:00:00", recommendedAction: "Increase antimalarial stock allocation to North-West district" },
  { id: "OB-002", district: "Ghanzi", condition: "Malaria", severity: "warning", type: "spike", description: "77.3% increase in antimalarial dispensing - seasonal pattern suspected", affectedFacilities: 4, dispensingIncrease: 77.3, detectedAt: "2024-01-14T06:00:00", recommendedAction: "Monitor closely and prepare emergency stock if needed" },
  { id: "OB-003", district: "Kweneng", condition: "Tuberculosis", severity: "warning", type: "trend", description: "Unusual TB medicine consumption increase over 3 weeks", affectedFacilities: 12, dispensingIncrease: 43.5, detectedAt: "2024-01-12T12:00:00", recommendedAction: "Investigate potential TB outbreak; notify surveillance team" },
]

// Heatmap data for disease spread visualization
export interface DistrictHeatmapData {
  district: District
  tb: number
  malaria: number
  hypertension: number
  diabetes: number
  outbreakRisk: RiskLevel
  activeAlerts: number
}

export const DISTRICT_HEATMAP_DATA: DistrictHeatmapData[] = [
  { district: "Central", tb: 45, malaria: 32, hypertension: 180, diabetes: 145, outbreakRisk: "good", activeAlerts: 0 },
  { district: "Ghanzi", tb: 28, malaria: 156, hypertension: 65, diabetes: 48, outbreakRisk: "warning", activeAlerts: 1 },
  { district: "Kgalagadi", tb: 34, malaria: 22, hypertension: 42, diabetes: 35, outbreakRisk: "warning", activeAlerts: 0 },
  { district: "Kgatleng", tb: 38, malaria: 18, hypertension: 95, diabetes: 78, outbreakRisk: "good", activeAlerts: 0 },
  { district: "Kweneng", tb: 89, malaria: 45, hypertension: 210, diabetes: 175, outbreakRisk: "warning", activeAlerts: 1 },
  { district: "North-East", tb: 32, malaria: 28, hypertension: 88, diabetes: 72, outbreakRisk: "good", activeAlerts: 0 },
  { district: "North-West", tb: 52, malaria: 245, hypertension: 120, diabetes: 98, outbreakRisk: "critical", activeAlerts: 1 },
  { district: "South-East", tb: 65, malaria: 15, hypertension: 285, diabetes: 245, outbreakRisk: "good", activeAlerts: 0 },
  { district: "Southern", tb: 72, malaria: 38, hypertension: 195, diabetes: 162, outbreakRisk: "warning", activeAlerts: 0 },
]
