"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Eye, Phone, Mail, Car } from "lucide-react"
import type { Lessee } from "@/types"
import { mockLessees } from "@/lib/mock-data"
import Link from "next/link"

// Updated mock data to match simplified requirements

export default function LesseesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [lessees] = useState(mockLessees)

  const filteredLessees = lessees.filter(
    (lessee) =>
      lessee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lessee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lessee.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lessee.phone.includes(searchTerm),
  )

  const getStatusColor = (status: Lessee["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: "paid" | "pending" | "overdue" | "failed") => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lessees</h1>
          <p className="text-muted-foreground">Manage registered lessees and their lease information</p>
        </div>
        <Button asChild>
          <Link href="/lessees/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Lessee
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Lessees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Lessees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {lessees.filter((l) => l.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payment Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {lessees.filter((l) => l.paymentStatus === "overdue" || l.paymentStatus === "failed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(lessees.filter((l) => l.paymentStatus === "paid").length * 500).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Lessees</CardTitle>
          <CardDescription>View and manage all registered lessees with their lease details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search lessees by name, email, vehicle ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lessee Name</TableHead>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Contact Information</TableHead>
                <TableHead>Lease Start</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLessees.map((lessee) => (
                <TableRow key={lessee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lessee.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {lessee.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{lessee.vehicleId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        {lessee.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-1 h-3 w-3" />
                        {lessee.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{lessee.leaseStartDate.toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        {Math.floor((new Date().getTime() - lessee.leaseStartDate.getTime()) / (1000 * 60 * 60 * 24))}{" "}
                        days ago
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lessee.status)}>{lessee.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(lessee.paymentStatus)}>{lessee.paymentStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
