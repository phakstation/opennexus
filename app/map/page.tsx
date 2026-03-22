'use client';

import { useState } from 'react';
import { BotswanaMap } from '@/components/maps/botswana-map';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DISTRICT_RISK_DATA,
  DISTRICT_MEDICINE_INVENTORY,
  FACILITY_MEDICINE_STOCK,
  type District,
  type RiskLevel,
} from '@/lib/data';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  TrendingDown,
  MapPin,
  Building2,
} from 'lucide-react';

const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case 'critical':
      return 'text-destructive';
    case 'warning':
      return 'text-accent';
    case 'good':
      return 'text-success';
  }
};

const getRiskBgColor = (level: RiskLevel) => {
  switch (level) {
    case 'critical':
      return 'bg-destructive/10 border-destructive/30';
    case 'warning':
      return 'bg-accent/10 border-accent/30';
    case 'good':
      return 'bg-success/10 border-success/30';
  }
};

const getRiskIcon = (level: RiskLevel) => {
  switch (level) {
    case 'critical':
      return <AlertCircle className="w-4 h-4" />;
    case 'warning':
      return <Clock className="w-4 h-4" />;
    case 'good':
      return <CheckCircle2 className="w-4 h-4" />;
  }
};

export default function DistrictRiskMapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const districtData = selectedDistrict ? DISTRICT_RISK_DATA[selectedDistrict] : null;
  const districtMedicines = selectedDistrict
    ? DISTRICT_MEDICINE_INVENTORY.filter((m) => m.district === selectedDistrict)
    : [];
  const facilityData = selectedDistrict
    ? FACILITY_MEDICINE_STOCK.filter((f) => {
        // Map facility district based on name patterns
        const nameUpper = f.facilityName.toUpperCase();
        const selectedUpper = selectedDistrict.toUpperCase();
        return nameUpper.includes(selectedUpper);
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">District Stock Risk Map</h1>
          <p className="text-muted-foreground">
            Real-time pharmaceutical stock risk analysis across Botswana districts based on NAPPI pricing data and medicine inventory
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <BotswanaMap
                onDistrictClick={setSelectedDistrict}
                selectedDistrict={selectedDistrict}
                className="h-96"
                showLabels={true}
              />
            </Card>

            {/* Overview Stats */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">National Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Districts</p>
                  <p className="text-2xl font-bold text-foreground mt-1">9</p>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-sm text-muted-foreground">Critical Risk</p>
                  <p className="text-2xl font-bold text-destructive mt-1">2</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground">Warning</p>
                  <p className="text-2xl font-bold text-accent mt-1">3</p>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-sm text-muted-foreground">Good Status</p>
                  <p className="text-2xl font-bold text-success mt-1">4</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Detail Panel */}
          <div className="space-y-6">
            {selectedDistrict && districtData ? (
              <>
                {/* District Header */}
                <Card className={`p-6 border-l-4 ${getRiskBgColor(districtData.riskLevel)}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getRiskIcon(districtData.riskLevel)}
                        <h2 className="text-xl font-semibold text-foreground">
                          {selectedDistrict} District
                        </h2>
                      </div>
                      <Badge variant="outline" className={getRiskColor(districtData.riskLevel)}>
                        {districtData.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>

                {/* Key Metrics */}
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">
                    Key Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Stock Days</span>
                      <span className="font-semibold text-foreground">
                        {districtData.stockDays} days
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Facilities Reporting</span>
                        <span className="font-semibold text-foreground">
                          {districtData.facilitiesReporting}/{districtData.totalFacilities}
                        </span>
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full"
                          style={{
                            width: `${(districtData.facilitiesReporting / districtData.totalFacilities) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Risk Score</span>
                        <span className={`font-semibold ${getRiskColor(districtData.riskLevel)}`}>
                          {Math.round((districtData.stockDays / 60) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            districtData.riskLevel === 'critical'
                              ? 'bg-destructive'
                              : districtData.riskLevel === 'warning'
                              ? 'bg-accent'
                              : 'bg-success'
                          }`}
                          style={{
                            width: `${Math.round((districtData.stockDays / 60) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tabs for medicines and facilities */}
                <Tabs defaultValue="medicines" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="medicines">Medicines</TabsTrigger>
                    <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  </TabsList>

                  <TabsContent value="medicines" className="space-y-3">
                    <Card className="p-4">
                      {districtMedicines.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {districtMedicines.map((med) => (
                            <div
                              key={`${med.district}-${med.medicineId}`}
                              className={`p-3 rounded-lg border ${getRiskBgColor(med.riskLevel)}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <p className="text-sm font-medium text-foreground">
                                  {med.medicineName}
                                </p>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getRiskColor(med.riskLevel)}`}
                                >
                                  {med.stockDays}d
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>
                                  Stock: {med.stockOnHand.toLocaleString()} | Monthly: {med.monthlyConsumption.toLocaleString()}
                                </p>
                                <p>Price: P{med.unitPrice.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground py-4">
                          No medicine data available
                        </p>
                      )}
                    </Card>
                  </TabsContent>

                  <TabsContent value="facilities" className="space-y-3">
                    <Card className="p-4">
                      {facilityData.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {facilityData.map((fac) => (
                            <div
                              key={fac.facilityId}
                              className={`p-3 rounded-lg border ${getRiskBgColor(fac.riskLevel)}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-2">
                                  <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  <p className="text-sm font-medium text-foreground">
                                    {fac.facilityName}
                                  </p>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getRiskColor(fac.riskLevel)}`}
                                >
                                  {fac.stockDays}d
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1 ml-6">
                                <p className="capitalize">
                                  Medicine: {fac.medicineName}
                                </p>
                                <p>
                                  Stock: {fac.stockOnHand.toLocaleString()} | Usage: {fac.monthlyConsumption.toLocaleString()}/mo
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground py-4">
                          No facility data available
                        </p>
                      )}
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card className="p-6">
                <p className="text-center text-muted-foreground">
                  Select a district on the map to view detailed stock information
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
