'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { AlertCircle, CheckCircle2, Info, Wifi, Package, Shield, Zap } from 'lucide-react'

export function NFCInfo() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="text-blue-600" size={20} />
            NFC Tracking System Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            The NFC tracking system enables real-time identification and tracking of medicine
            items across the supply chain. Each medicine batch is tagged with a unique NFC code
            for instant verification and temperature/humidity monitoring.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Wifi className="text-blue-600 mb-2" size={20} />
              <h4 className="font-semibold text-sm mb-1">Real-time Tracking</h4>
              <p className="text-xs text-gray-600">
                Instant verification and location tracking of medicine items
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <Shield className="text-green-600 mb-2" size={20} />
              <h4 className="font-semibold text-sm mb-1">Authenticity Verification</h4>
              <p className="text-xs text-gray-600">
                Prevent counterfeits and ensure medicine integrity
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Zap className="text-orange-600 mb-2" size={20} />
              <h4 className="font-semibold text-sm mb-1">Condition Monitoring</h4>
              <p className="text-xs text-gray-600">
                Track temperature and humidity for optimal storage conditions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Key Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-sm">Improved Inventory Accuracy</h4>
                <p className="text-sm text-gray-600">
                  Automated tracking reduces manual errors and discrepancies in stock counts
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-sm">Supply Chain Visibility</h4>
                <p className="text-sm text-gray-600">
                  Track medicines from warehouse to patient in real-time
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-sm">Expiry Date Management</h4>
                <p className="text-sm text-gray-600">
                  Automatic alerts for approaching expiry dates prevent wastage
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-sm">Cold Chain Compliance</h4>
                <p className="text-sm text-gray-600">
                  Monitor temperature and humidity for heat-sensitive medicines
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-sm">Counterfeit Prevention</h4>
                <p className="text-sm text-gray-600">
                  Verify authentic medicines and prevent fake products from entering the supply chain
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFC Tag Structure */}
      <Card>
        <CardHeader>
          <CardTitle>NFC Tag Data Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs font-mono text-gray-600 mb-3">Each NFC tag contains:</p>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-600">tagId</span>
                  <span className="text-gray-600">Unique identifier (e.g., NFC-TB-001-001)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">nfcCode</span>
                  <span className="text-gray-600">Unique NFC code (e.g., 04:96:8F:A2:42:26:80)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">medicineName</span>
                  <span className="text-gray-600">e.g., Rifampicin 150mg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">batchNumber</span>
                  <span className="text-gray-600">Manufacturing batch ID</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">manufacturingDate</span>
                  <span className="text-gray-600">Production date (YYYY-MM-DD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">expiryDate</span>
                  <span className="text-gray-600">Expiration date (YYYY-MM-DD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">quantity</span>
                  <span className="text-gray-600">Number of units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">status</span>
                  <span className="text-gray-600">active | inactive | expired | damaged</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">location</span>
                  <span className="text-gray-600">Storage location (e.g., Shelf A1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">temperature</span>
                  <span className="text-gray-600">Current temperature in Celsius</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">humidity</span>
                  <span className="text-gray-600">Current humidity percentage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">lastScanned</span>
                  <span className="text-gray-600">Timestamp of last scan</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use NFC Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Step 1: Scan NFC Tag</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>
                    Use an NFC-enabled device (smartphone/tablet with NFC reader) to scan the NFC tag on
                    the medicine package. The tag contains a unique NFC code that identifies the specific batch.
                  </p>
                  <p className="text-sm text-gray-600">
                    Alternative: Manually enter the NFC code in the scanner interface
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Step 2: Verify Medicine Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>
                    The system displays all details: medicine name, batch number, manufacturing/expiry dates,
                    quantity, and current location.
                  </p>
                  <p className="text-sm text-gray-600">
                    Check that the displayed information matches the physical package
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Step 3: Check Environmental Conditions</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>
                    Review temperature and humidity readings to ensure the medicine was stored correctly
                    and remains suitable for use.
                  </p>
                  <p className="text-sm text-gray-600">
                    Recommended ranges typically 15-25°C and 30-70% humidity for most medicines
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Step 4: Verify Authenticity</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>
                    Compare the NFC code with the batch number and manufacturing date printed on the
                    package to ensure authenticity and prevent counterfeits.
                  </p>
                  <p className="text-sm text-gray-600">
                    Flag any discrepancies immediately for further investigation
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Step 5: Log Transaction</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>
                    The system automatically records the scan timestamp and location, creating a complete
                    audit trail for supply chain compliance.
                  </p>
                  <p className="text-sm text-gray-600">
                    This data supports traceability in case of recalls or quality issues
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Status Meanings */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Status Meanings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge className="bg-green-100 text-green-800 flex-shrink-0 mt-0.5">ACTIVE</Badge>
            <p className="text-sm">Tag is active and medicine is in good condition, ready for use</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-gray-100 text-gray-800 flex-shrink-0 mt-0.5">INACTIVE</Badge>
            <p className="text-sm">Tag is inactive, may be temporary or awaiting activation</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-red-100 text-red-800 flex-shrink-0 mt-0.5">EXPIRED</Badge>
            <p className="text-sm">
              Expiry date has passed. Medicine must not be used and should be disposed properly
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-orange-100 text-orange-800 flex-shrink-0 mt-0.5">DAMAGED</Badge>
            <p className="text-sm">
              Package or medicine is damaged. Should not be distributed or used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-orange-600" size={20} />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Scan tags during receipt, storage transfer, and dispensing for complete audit trail</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Check temperature/humidity regularly, especially for heat-sensitive medicines</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Always verify NFC codes match physical package information</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Update location when medicine is moved to maintain accurate tracking</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Report any damaged tags or inconsistencies immediately</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Keep NFC tags clean and protected from excessive moisture or heat</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
