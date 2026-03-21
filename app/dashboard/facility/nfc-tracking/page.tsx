'use client'

import { useState } from 'react'
import { NFCTracker } from '@/components/dashboard/nfc-tracker'
import { NFCScanner } from '@/components/dashboard/nfc-scanner'
import { NFCInfo } from '@/components/dashboard/nfc-info'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NFC_TAGS, NFCTag } from '@/lib/data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Wifi } from 'lucide-react'

export default function NFCTrackingPage() {
  const [scannedTags, setScannedTags] = useState<NFCTag[]>([])

  const handleTagScanned = (tag: NFCTag) => {
    setScannedTags((prev) => {
      const existing = prev.find((t) => t.tagId === tag.tagId)
      if (existing) return prev
      return [...prev, tag]
    })
  }

  // Calculate statistics
  const totalTags = NFC_TAGS.length
  const scannedCount = NFC_TAGS.filter((tag) => tag.scanned).length
  const activeTags = NFC_TAGS.filter((tag) => tag.status === 'active').length
  const expiredTags = NFC_TAGS.filter((tag) => tag.status === 'expired').length

  // Data by facility
  const facilityData = [
    {
      name: 'CMS Gaborone',
      count: NFC_TAGS.filter((t) => t.facility === 'CMS Gaborone').length,
      scanned: NFC_TAGS.filter((t) => t.facility === 'CMS Gaborone' && t.scanned).length,
    },
    {
      name: 'Princess Marina',
      count: NFC_TAGS.filter((t) => t.facility === 'Princess Marina Hospital').length,
      scanned: NFC_TAGS.filter((t) => t.facility === 'Princess Marina Hospital' && t.scanned).length,
    },
    {
      name: 'Nyangabgwe',
      count: NFC_TAGS.filter((t) => t.facility === 'Nyangabgwe Hospital').length,
      scanned: NFC_TAGS.filter((t) => t.facility === 'Nyangabgwe Hospital' && t.scanned).length,
    },
    {
      name: 'Maun General',
      count: NFC_TAGS.filter((t) => t.facility === 'Maun General Hospital').length,
      scanned: NFC_TAGS.filter((t) => t.facility === 'Maun General Hospital' && t.scanned).length,
    },
    {
      name: 'Tsabong',
      count: NFC_TAGS.filter((t) => t.facility === 'Tsabong Hospital').length,
      scanned: NFC_TAGS.filter((t) => t.facility === 'Tsabong Hospital' && t.scanned).length,
    },
  ]

  // Status distribution
  const statusData = [
    {
      name: 'Active',
      value: NFC_TAGS.filter((t) => t.status === 'active').length,
      color: '#10b981',
    },
    {
      name: 'Inactive',
      value: NFC_TAGS.filter((t) => t.status === 'inactive').length,
      color: '#6b7280',
    },
    {
      name: 'Expired',
      value: NFC_TAGS.filter((t) => t.status === 'expired').length,
      color: '#ef4444',
    },
    {
      name: 'Damaged',
      value: NFC_TAGS.filter((t) => t.status === 'damaged').length,
      color: '#f97316',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">NFC Tracking System</h1>
          <p className="text-gray-600 mt-2">
            Real-time medicine identification and tracking using NFC tags across all facilities
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{totalTags}</span>
                <TrendingUp className="text-blue-500" size={16} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Active tracking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Scanned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{scannedCount}</span>
                <span className="text-sm text-green-600 font-medium">
                  {Math.round((scannedCount / totalTags) * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Recently scanned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">{activeTags}</span>
                <CheckCircle2 className="text-green-500" size={16} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Available for use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">{expiredTags}</span>
                <AlertCircle className="text-red-500" size={16} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Out of stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Facility Scan Status */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Status by Facility</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={facilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="scanned" fill="#3b82f6" name="Scanned" />
                  <Bar dataKey="count" fill="#e5e7eb" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Tag Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="text-blue-600" size={20} />
              NFC Management System
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Complete NFC tracking, scanning, and management tools
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="scanner" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
                <TabsTrigger value="scanner">Scanner</TabsTrigger>
                <TabsTrigger value="tracker">Tracker</TabsTrigger>
                <TabsTrigger value="info">Information</TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="scanner" className="mt-0">
                  <NFCScanner onTagScanned={handleTagScanned} />
                </TabsContent>

                <TabsContent value="tracker" className="mt-0">
                  <NFCTracker onScan={handleTagScanned} />
                </TabsContent>

                <TabsContent value="info" className="mt-0">
                  <NFCInfo />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        {scannedTags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans ({scannedTags.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scannedTags.map((tag) => (
                  <div
                    key={tag.tagId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-medium text-sm">{tag.medicineName}</p>
                      <p className="text-xs text-gray-500">{tag.tagId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {tag.facility}
                      </Badge>
                      <Badge className={tag.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {tag.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
