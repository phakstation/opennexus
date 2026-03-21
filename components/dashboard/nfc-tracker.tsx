'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NFCTag, NFC_TAGS } from '@/lib/data'
import { Search, Wifi, WifiOff, Thermometer, Droplets, Calendar, MapPin } from 'lucide-react'

interface NFCTrackerProps {
  onScan?: (tag: NFCTag) => void
}

export function NFCTracker({ onScan }: NFCTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<NFCTag | null>(null)
  const [tags] = useState<NFCTag[]>(NFC_TAGS)

  const filteredTags = tags.filter(
    (tag) =>
      tag.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: NFCTag['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'damaged':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  const handleScan = (tag: NFCTag) => {
    setSelectedTag(tag)
    if (onScan) {
      onScan(tag)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by medicine name, tag ID, or batch number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tags List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">NFC Tags ({filteredTags.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTags.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">No tags found</p>
              ) : (
                filteredTags.map((tag) => (
                  <button
                    key={tag.tagId}
                    onClick={() => handleScan(tag)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedTag?.tagId === tag.tagId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{tag.medicineName}</p>
                        <p className="text-xs text-gray-500">{tag.tagId}</p>
                      </div>
                      <div className="flex gap-1">
                        {tag.scanned ? (
                          <Wifi className="text-green-600" size={14} />
                        ) : (
                          <WifiOff className="text-gray-400" size={14} />
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tag Details */}
        <div className="lg:col-span-2">
          {selectedTag ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedTag.medicineName}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{selectedTag.tagId}</p>
                  </div>
                  <Badge className={getStatusColor(selectedTag.status)}>
                    {selectedTag.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* NFC Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">NFC Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">NFC Code</p>
                      <p className="font-mono text-sm mt-1">{selectedTag.nfcCode}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Scan Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedTag.scanned ? (
                          <>
                            <Wifi className="text-green-600" size={16} />
                            <span className="text-sm font-medium">Active</span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="text-gray-400" size={16} />
                            <span className="text-sm font-medium">Not Scanned</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Batch Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Batch Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Batch Number</p>
                      <p className="font-medium text-sm mt-1">{selectedTag.batchNumber}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Manufacturing Date</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="text-gray-500" size={14} />
                        <span className="text-sm">{selectedTag.manufacturingDate}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Expiry Date</p>
                      <div
                        className={`flex items-center gap-2 mt-1 ${
                          isExpired(selectedTag.expiryDate) ? 'text-red-600' : 'text-gray-700'
                        }`}
                      >
                        <Calendar className="text-inherit" size={14} />
                        <span className="text-sm font-medium">{selectedTag.expiryDate}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Quantity</p>
                      <p className="font-medium text-sm mt-1">
                        {selectedTag.quantity} {selectedTag.unit}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location & Facility */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Location</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Facility</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="text-gray-500" size={14} />
                        <span className="text-sm">{selectedTag.facility || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Location</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="text-gray-500" size={14} />
                        <span className="text-sm">{selectedTag.location || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Environmental Data */}
                {(selectedTag.temperature !== undefined || selectedTag.humidity !== undefined) && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700">Environmental Conditions</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTag.temperature !== undefined && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">Temperature</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Thermometer className="text-orange-500" size={16} />
                            <span className="text-sm font-medium">{selectedTag.temperature}°C</span>
                          </div>
                        </div>
                      )}
                      {selectedTag.humidity !== undefined && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">Humidity</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Droplets className="text-blue-500" size={16} />
                            <span className="text-sm font-medium">{selectedTag.humidity}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Last Scanned */}
                {selectedTag.lastScanned && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600">Last Scanned</p>
                    <p className="text-sm font-medium mt-1">{selectedTag.lastScanned}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" size="sm">
                    Scan Now
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Update Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center text-gray-500">
                <Wifi className="mx-auto mb-2 text-gray-400" size={32} />
                <p>Select an NFC tag to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
