import { NextRequest, NextResponse } from 'next/server';
import {
  DISTRICT_RISK_DATA,
  DISTRICT_MEDICINE_INVENTORY,
  FACILITY_MEDICINE_STOCK,
  type District,
} from '@/lib/data';

/**
 * GET /api/district-risk
 * 
 * Returns district-level pharmaceutical stock risk data synthesized from NAPPI pricing.
 * Supports filtering by district and medicine category.
 * 
 * Query Parameters:
 * - district: Filter by specific district (optional)
 * - category: Filter medicines by category: tb, antimalarial, chronic, hiv (optional)
 * - include_medicines: Include medicine inventory data (default: true)
 * - include_facilities: Include facility-level data (default: false)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const district = searchParams.get('district') as District | null;
    const category = searchParams.get('category') as string | null;
    const includeMedicines = searchParams.get('include_medicines') !== 'false';
    const includeFacilities = searchParams.get('include_facilities') === 'true';

    let districtRiskData;

    // Get district risk data
    if (district) {
      if (!DISTRICT_RISK_DATA[district]) {
        return NextResponse.json(
          { error: `Invalid district: ${district}` },
          { status: 400 }
        );
      }
      districtRiskData = {
        [district]: DISTRICT_RISK_DATA[district],
      };
    } else {
      districtRiskData = DISTRICT_RISK_DATA;
    }

    // Build response
    const response: Record<string, any> = {
      timestamp: new Date().toISOString(),
      districts: Object.entries(districtRiskData).map(([districtName, riskData]) => {
        const districtObj: Record<string, any> = {
          name: districtName,
          riskLevel: riskData.riskLevel,
          stockDays: riskData.stockDays,
          facilitiesReporting: riskData.facilitiesReporting,
          totalFacilities: riskData.totalFacilities,
        };

        // Include medicine inventory
        if (includeMedicines) {
          let medicines = DISTRICT_MEDICINE_INVENTORY.filter(
            (m) => m.district === districtName
          );

          // Filter by category if specified
          if (category) {
            medicines = medicines.filter((m) => m.category === category);
          }

          districtObj.medicines = medicines.map((m) => ({
            medicineId: m.medicineId,
            name: m.medicineName,
            category: m.category,
            stockOnHand: m.stockOnHand,
            monthlyConsumption: m.monthlyConsumption,
            stockDays: m.stockDays,
            unitPrice: m.unitPrice,
            riskLevel: m.riskLevel,
            napiCode: m.napiCode,
          }));

          districtObj.medicineCount = medicines.length;
          districtObj.criticalMedicines = medicines.filter(
            (m) => m.riskLevel === 'critical'
          ).length;
        }

        // Include facility data
        if (includeFacilities) {
          const facilities = FACILITY_MEDICINE_STOCK.filter((f) => {
            // Determine if facility belongs to this district based on name patterns
            const facilityUppercase = f.facilityName.toUpperCase();
            const districtUppercase = districtName.toUpperCase();
            return facilityUppercase.includes(districtUppercase);
          });

          districtObj.facilities = facilities.map((f) => ({
            facilityId: f.facilityId,
            name: f.facilityName,
            medicine: {
              name: f.medicineName,
              stockOnHand: f.stockOnHand,
              monthlyConsumption: f.monthlyConsumption,
              stockDays: f.stockDays,
              riskLevel: f.riskLevel,
            },
            lastUpdated: f.lastUpdated,
          }));

          districtObj.facilityCount = facilities.length;
        }

        return districtObj;
      }),
    };

    // Add summary statistics
    const allDistricts = Object.values(DISTRICT_RISK_DATA);
    response.summary = {
      totalDistricts: allDistricts.length,
      criticalDistricts: allDistricts.filter((d) => d.riskLevel === 'critical').length,
      warningDistricts: allDistricts.filter((d) => d.riskLevel === 'warning').length,
      goodDistricts: allDistricts.filter((d) => d.riskLevel === 'good').length,
      averageStockDays: Math.round(
        allDistricts.reduce((sum, d) => sum + d.stockDays, 0) / allDistricts.length
      ),
      reportingRate: Math.round(
        (allDistricts.reduce((sum, d) => sum + d.facilitiesReporting, 0) /
          allDistricts.reduce((sum, d) => sum + d.totalFacilities, 0)) *
          100
      ),
    };

    // Set cache headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Error in district-risk API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/district-risk
 * 
 * Generate new synthetic data (for testing/refresh)
 * Requires admin authentication in production
 */
export async function POST(request: NextRequest) {
  try {
    // In production, add authentication check here
    // if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Current implementation returns existing data
    // In future, this could trigger data regeneration from NAPPI database

    const timestamp = new Date().toISOString();
    return NextResponse.json(
      {
        message: 'Synthetic data is auto-generated on application startup',
        timestamp,
        districtCount: Object.keys(DISTRICT_RISK_DATA).length,
        medicineCount: DISTRICT_MEDICINE_INVENTORY.length,
        facilityCount: FACILITY_MEDICINE_STOCK.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in district-risk POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
