'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { NFCTag, NFC_TAGS } from '@/lib/data'
import { Wifi, WifiOff, Plus, RotateCw } from 'lucide-react'

interface NFCScannerProps {
  onTagScanned?: (tag: NFCTag) => void
}

export function NFCScanner({ onTagScanned }: NFCScannerProps) {
  const [nfcInput, setNfcInput] = useState('')
  const [scannedTags, setScannedTags] = useState<NFCTag[]>([])
  const [lastScanned, setLastScanned] = useState<NFCTag | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleSimulateScan = () => {
    if (!nfcInput.trim()) return

    const foundTag = NFC_TAGS.find(
      (tag) =>
        tag.nfcCode.toLowerCase() === nfcInput.toLowerCase() ||
        tag.tagId.toLowerCase() === nfcInput.toLowerCase()
    )

    if (foundTag) {
      setScannedTags((prev) => {
        const existing = prev.find((t) => t.tagId === foundTag.tagId)
        if (existing) return prev
        return [...prev, foundTag]
      })
      setLastScanned(foundTag)
      if (onTagScanned) {
        onTagScanned(foundTag)
      }
      setNfcInput('')
    } else {
      alert('NFC tag not found. Try one of the valid NFC codes.')
      setNfcInput('')
    }
  }

  const handleQuickScan = (tag: NFCTag) => {
    setScannedTags((prev) => {
      const existing = prev.find((t) => t.tagId === tag.tagId)
      if (existing) return prev
      return [...prev, tag]
    })
    setLastScanned(tag)
    if (onTagScanned) {
      onTagScanned(tag)
    }
  }

  const clearScans = () => {
    setScannedTags([])
    setLastScanned(null)
  }

  return (
    <div className="space-y-6">
      {/* Scanner Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wifi className="text-blue-500" size={20} />
            NFC Scanner
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Scan NFC tags or enter NFC codes manually
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste NFC code here (e.g., 04:96:8F:A2:42:26:80)"
              value={nfcInput}
              onChange={(e) => setNfcInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSimulateScan()
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSimulateScan} disabled={!nfcInput.trim()}>
              Scan
            </Button>
          </div>

          {/* Info text */}
          <p className="text-xs text-gray-500">
            Available test NFC codes: 04:96:8F:A2:42:26:80, 04:A8:7F:B3:52:36:90, 04:C2:5D:E1:78:42:A0
          </p>
        </CardContent>
      </Card>

      {/* Last Scanned Item */}
      {lastScanned && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Wifi className="text-blue-600" size={18} />
              Last Scanned
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Medicine</p>
                <p className="font-semibold">{lastScanned.medicineName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <Badge className="mt-1">{lastScanned.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-600">Batch</p>
                <p className="text-sm font-mono">{lastScanned.batchNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Facility</p>
                <p className="text-sm">{lastScanned.facility}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanned Items List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Scanned Items ({scannedTags.length})</CardTitle>
          {scannedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearScans}>
              <RotateCw size={16} className="mr-2" />
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {scannedTags.length === 0 ? (
            <div className="text-center py-8">
              <WifiOff className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No items scanned yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scannedTags.map((tag) => (
                <div
                  key={tag.tagId}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{tag.medicineName}</p>
                      <p className="text-sm text-gray-600">{tag.tagId}</p>
                    </div>
                    <Badge className={tag.scanned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {tag.scanned ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-medium">
                        {tag.quantity} {tag.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Expiry</p>
                      <p className="font-medium">{tag.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium">{tag.location || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Scan Available Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Tags for Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {NFC_TAGS.slice(0, 4).map((tag) => (
              <Button
                key={tag.tagId}
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => handleQuickScan(tag)}
              >
                <Plus className="mr-2" size={16} />
                <div className="text-left">
                  <p className="text-sm font-medium">{tag.medicineName}</p>
                  <p className="text-xs text-gray-500">{tag.tagId}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
