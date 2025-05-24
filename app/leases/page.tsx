"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Eye, FileText, Calendar } from "lucide-react"
import type { LeaseAgreement } from "@/types"
import Link from "next/link"

// Mock data
const mockLeases: LeaseAgreement[] = [
  {
    id: "1",
    vehicleId: "1",
    lesseeId: "1",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2025-01-15"),
    monthlyPayment: 450,
    securityDeposit: 900,
    mileageLimit: 12000,
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    vehicleId: "2",
    lesseeId: "2",
    startDate: new Date("2024-01-10"),
    endDate: new Date("2025-01-10"),
    monthlyPayment: 380,
    securityDeposit: 760,
    mileageLimit: 15000,
    status: "active",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    vehicleId: "3",
    lesseeId: "3",
    startDate: new Date("2024-01-08"),
    endDate: new Date("2025-01-08"),
    monthlyPayment: 520,
    securityDeposit: 1040,
    mileageLimit: 10000,
    status: "active",
    createdAt: new Date("2024-01-08"),
  },
]

// Mock data for display purposes
const leaseDetails = [
  {
    id: "1",
    lessee: "John Smith",
    vehicle: "2023 Toyota Camry",
    licensePlate: "ABC-123",
    ...mockLeases[0],
  },
  {
    id: "2",
    lessee: "Sarah Johnson",
    vehicle: "2022 Honda Civic",
    licensePlate: "XYZ-789",
    ...mockLeases[1],
  },
  {
    id: "3",
    lessee: "Mike Davis",
    vehicle: "2023 Ford Explorer",
    licensePlate: "DEF-456",
    ...mockLeases[2],
  },
]

export default function LeasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [leases] = useState(leaseDetails)

  const filteredLeases = leases.filter(
    (lease) =>
      lease.lessee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lease.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: LeaseAgreement["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "terminated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateDaysRemaining = (endDate: Date) => {
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lease Agreements</h1>
          <p className="text-muted-foreground">Manage all lease agreements and contracts</p>
        </div>
        <Button asChild>
          <Link href="/leases/add">
            <Plus className="mr-2 h-4 w-4" />
            Create Lease
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {leases.filter((l) => l.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${leases.reduce((sum, lease) => sum + lease.monthlyPayment, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {leases.filter((l) => calculateDaysRemaining(l.endDate) <= 30).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lease Agreements</CardTitle>
          <CardDescription>View and manage all lease agreements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search leases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lessee</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Lease Period</TableHead>
                <TableHead>Monthly Payment</TableHead>
                <TableHead>Mileage Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeases.map((lease) => {
                const daysRemaining = calculateDaysRemaining(lease.endDate)
                return (
                  <TableRow key={lease.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lease.lessee}</div>
                        <div className="text-sm text-muted-foreground">ID: {lease.lesseeId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lease.vehicle}</div>
                        <div className="text-sm text-muted-foreground">{lease.licensePlate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-3 w-3" />
                          {lease.startDate.toLocaleDateString()} - {lease.endDate.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">${lease.monthlyPayment}/month</div>
                        <div className="text-sm text-muted-foreground">Deposit: ${lease.securityDeposit}</div>
                      </div>
                    </TableCell>
                    <TableCell>{lease.mileageLimit.toLocaleString()} mi/year</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lease.status)}>{lease.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
