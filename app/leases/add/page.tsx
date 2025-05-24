"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, FileText, CheckCircle, AlertCircle, CalendarIcon, Car, User } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock data for available vehicles and lessees
const availableVehicles = [
  {
    id: "V004",
    name: "2022 Chevrolet Malibu",
    licensePlate: "GHI-789",
    year: 2022,
    make: "Chevrolet",
    model: "Malibu",
    color: "White",
    mileage: 18000,
    suggestedRate: 420,
  },
  {
    id: "V007",
    name: "2022 Mercedes C-Class",
    licensePlate: "JKL-012",
    year: 2022,
    make: "Mercedes",
    model: "C-Class",
    color: "Silver",
    mileage: 12000,
    suggestedRate: 650,
  },
  {
    id: "V010",
    name: "2023 Acura TLX",
    licensePlate: "MNO-345",
    year: 2023,
    make: "Acura",
    model: "TLX",
    color: "Black",
    mileage: 8000,
    suggestedRate: 580,
  },
  {
    id: "V012",
    name: "2023 Cadillac XT5",
    licensePlate: "PQR-678",
    year: 2023,
    make: "Cadillac",
    model: "XT5",
    color: "Blue",
    mileage: 5000,
    suggestedRate: 720,
  },
  {
    id: "V015",
    name: "2022 Genesis G90",
    licensePlate: "STU-901",
    year: 2022,
    make: "Genesis",
    model: "G90",
    color: "Black",
    mileage: 15000,
    suggestedRate: 800,
  },
]

const existingLessees = [
  { id: "L001", name: "John Smith", email: "john.smith@email.com", phone: "(555) 123-4567" },
  { id: "L002", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 987-6543" },
  { id: "L003", name: "Mike Davis", email: "mike.davis@email.com", phone: "(555) 456-7890" },
  { id: "L004", name: "Emily Wilson", email: "emily.w@email.com", phone: "(555) 234-5678" },
  { id: "L005", name: "David Brown", email: "david.brown@email.com", phone: "(555) 345-6789" },
]

interface LeaseFormData {
  vehicleId: string
  lesseeType: "existing" | "new"
  lesseeId: string
  newLessee: {
    name: string
    email: string
    phone: string
  }
  startDate: Date | undefined
  endDate: Date | undefined
  monthlyPayment: string
  securityDeposit: string
  mileageLimit: string
  terms: string
  notes: string
}

interface FormErrors {
  vehicleId?: string
  lesseeId?: string
  newLessee?: {
    name?: string
    email?: string
    phone?: string
  }
  startDate?: string
  endDate?: string
  monthlyPayment?: string
  securityDeposit?: string
  mileageLimit?: string
  terms?: string
}

export default function AddLeasePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LeaseFormData>({
    vehicleId: "",
    lesseeType: "existing",
    lesseeId: "",
    newLessee: {
      name: "",
      email: "",
      phone: "",
    },
    startDate: undefined,
    endDate: undefined,
    monthlyPayment: "",
    securityDeposit: "",
    mileageLimit: "12000",
    terms: "",
    notes: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const selectedVehicle = availableVehicles.find((v) => v.id === formData.vehicleId)
  const selectedLessee = existingLessees.find((l) => l.id === formData.lesseeId)

  // Auto-calculate end date when start date changes (default 12 months)
  const handleStartDateChange = (date: Date | undefined) => {
    setFormData((prev) => {
      const newData = { ...prev, startDate: date }
      if (date && !prev.endDate) {
        const endDate = new Date(date)
        endDate.setFullYear(endDate.getFullYear() + 1)
        newData.endDate = endDate
      }
      return newData
    })
  }

  // Auto-suggest monthly payment when vehicle is selected
  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = availableVehicles.find((v) => v.id === vehicleId)
    setFormData((prev) => ({
      ...prev,
      vehicleId,
      monthlyPayment: vehicle ? vehicle.suggestedRate.toString() : "",
      securityDeposit: vehicle ? (vehicle.suggestedRate * 2).toString() : "",
    }))
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const handleNewLesseePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData((prev) => ({
      ...prev,
      newLessee: { ...prev.newLessee, phone: formatted },
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Vehicle validation
    if (!formData.vehicleId) {
      newErrors.vehicleId = "Please select a vehicle"
    }

    // Lessee validation
    if (formData.lesseeType === "existing") {
      if (!formData.lesseeId) {
        newErrors.lesseeId = "Please select a lessee"
      }
    } else {
      const lesseeErrors: FormErrors["newLessee"] = {}

      if (!formData.newLessee.name.trim()) {
        lesseeErrors.name = "Name is required"
      } else if (formData.newLessee.name.trim().length < 2) {
        lesseeErrors.name = "Name must be at least 2 characters"
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.newLessee.email.trim()) {
        lesseeErrors.email = "Email is required"
      } else if (!emailRegex.test(formData.newLessee.email)) {
        lesseeErrors.email = "Please enter a valid email address"
      }

      const phoneRegex = /^$$\d{3}$$ \d{3}-\d{4}$/
      if (!formData.newLessee.phone.trim()) {
        lesseeErrors.phone = "Phone number is required"
      } else if (!phoneRegex.test(formData.newLessee.phone)) {
        lesseeErrors.phone = "Phone must be in format (555) 123-4567"
      }

      if (Object.keys(lesseeErrors).length > 0) {
        newErrors.newLessee = lesseeErrors
      }
    }

    // Date validation
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = "End date must be after start date"
    }

    // Payment validation
    const monthlyPayment = Number.parseFloat(formData.monthlyPayment)
    if (!formData.monthlyPayment) {
      newErrors.monthlyPayment = "Monthly payment is required"
    } else if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
      newErrors.monthlyPayment = "Please enter a valid payment amount"
    } else if (monthlyPayment < 100) {
      newErrors.monthlyPayment = "Monthly payment must be at least $100"
    }

    const securityDeposit = Number.parseFloat(formData.securityDeposit)
    if (!formData.securityDeposit) {
      newErrors.securityDeposit = "Security deposit is required"
    } else if (isNaN(securityDeposit) || securityDeposit < 0) {
      newErrors.securityDeposit = "Please enter a valid deposit amount"
    }

    const mileageLimit = Number.parseInt(formData.mileageLimit)
    if (!formData.mileageLimit) {
      newErrors.mileageLimit = "Mileage limit is required"
    } else if (isNaN(mileageLimit) || mileageLimit <= 0) {
      newErrors.mileageLimit = "Please enter a valid mileage limit"
    } else if (mileageLimit < 5000) {
      newErrors.mileageLimit = "Mileage limit must be at least 5,000 miles"
    }

    if (!formData.terms.trim()) {
      newErrors.terms = "Lease terms and conditions are required"
    } else if (formData.terms.trim().length < 50) {
      newErrors.terms = "Terms must be at least 50 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate random success/failure for demo (95% success rate)
      const success = Math.random() > 0.05

      if (success) {
        setSubmitStatus("success")
        setTimeout(() => {
          router.push("/leases")
        }, 2000)
      } else {
        throw new Error("Lease creation failed")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateLeaseDuration = () => {
    if (!formData.startDate || !formData.endDate) return null
    const diffTime = formData.endDate.getTime() - formData.startDate.getTime()
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    return diffMonths
  }

  const calculateTotalValue = () => {
    const months = calculateLeaseDuration()
    const monthlyPayment = Number.parseFloat(formData.monthlyPayment)
    if (!months || !monthlyPayment) return null
    return months * monthlyPayment
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/leases">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leases
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Lease Agreement</h1>
          <p className="text-muted-foreground">Set up a new lease agreement between lessee and vehicle</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Selection
              </CardTitle>
              <CardDescription>Choose an available vehicle for the lease</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Available Vehicle *</Label>
                <Select value={formData.vehicleId} onValueChange={handleVehicleChange}>
                  <SelectTrigger className={errors.vehicleId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select an available vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {vehicle.name} - {vehicle.licensePlate}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            ${vehicle.suggestedRate}/mo
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleId && <p className="text-sm text-red-500">{errors.vehicleId}</p>}
              </div>

              {selectedVehicle && (
                <div className="p-4 bg-blue-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Selected Vehicle Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Make & Model:</p>
                      <p className="font-medium">
                        {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">License Plate:</p>
                      <p className="font-medium">{selectedVehicle.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Color:</p>
                      <p className="font-medium">{selectedVehicle.color}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mileage:</p>
                      <p className="font-medium">{selectedVehicle.mileage.toLocaleString()} miles</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lessee Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Lessee Information
              </CardTitle>
              <CardDescription>Select existing lessee or add new one</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Lessee Type *</Label>
                <Select
                  value={formData.lesseeType}
                  onValueChange={(value: "existing" | "new") => setFormData((prev) => ({ ...prev, lesseeType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existing">Existing Lessee</SelectItem>
                    <SelectItem value="new">New Lessee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.lesseeType === "existing" ? (
                <div className="space-y-2">
                  <Label htmlFor="lessee">Select Lessee *</Label>
                  <Select
                    value={formData.lesseeId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, lesseeId: value }))}
                  >
                    <SelectTrigger className={errors.lesseeId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choose an existing lessee" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingLessees.map((lessee) => (
                        <SelectItem key={lessee.id} value={lessee.id}>
                          {lessee.name} - {lessee.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.lesseeId && <p className="text-sm text-red-500">{errors.lesseeId}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newLesseeName">Full Name *</Label>
                    <Input
                      id="newLesseeName"
                      placeholder="Enter full name"
                      value={formData.newLessee.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          newLessee: { ...prev.newLessee, name: e.target.value },
                        }))
                      }
                      className={errors.newLessee?.name ? "border-red-500" : ""}
                    />
                    {errors.newLessee?.name && <p className="text-sm text-red-500">{errors.newLessee.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newLesseeEmail">Email *</Label>
                      <Input
                        id="newLesseeEmail"
                        type="email"
                        placeholder="Enter email"
                        value={formData.newLessee.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            newLessee: { ...prev.newLessee, email: e.target.value },
                          }))
                        }
                        className={errors.newLessee?.email ? "border-red-500" : ""}
                      />
                      {errors.newLessee?.email && <p className="text-sm text-red-500">{errors.newLessee.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newLesseePhone">Phone *</Label>
                      <Input
                        id="newLesseePhone"
                        placeholder="(555) 123-4567"
                        value={formData.newLessee.phone}
                        onChange={handleNewLesseePhoneChange}
                        maxLength={14}
                        className={errors.newLessee?.phone ? "border-red-500" : ""}
                      />
                      {errors.newLessee?.phone && <p className="text-sm text-red-500">{errors.newLessee.phone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {selectedLessee && (
                <div className="p-4 bg-green-50 rounded-lg border">
                  <h4 className="font-medium mb-2">Selected Lessee</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name:</p>
                      <p className="font-medium">{selectedLessee.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email:</p>
                      <p className="font-medium">{selectedLessee.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone:</p>
                      <p className="font-medium">{selectedLessee.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lease Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Lease Terms & Conditions
              </CardTitle>
              <CardDescription>Define the lease duration, payments, and terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lease Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground",
                          errors.startDate && "border-red-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={handleStartDateChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Lease End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground",
                          errors.endDate && "border-red-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                        disabled={(date) => !formData.startDate || date <= formData.startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyPayment">Monthly Payment ($) *</Label>
                  <Input
                    id="monthlyPayment"
                    type="number"
                    placeholder="500"
                    value={formData.monthlyPayment}
                    onChange={(e) => setFormData((prev) => ({ ...prev, monthlyPayment: e.target.value }))}
                    className={errors.monthlyPayment ? "border-red-500" : ""}
                  />
                  {errors.monthlyPayment && <p className="text-sm text-red-500">{errors.monthlyPayment}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">Security Deposit ($) *</Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    placeholder="1000"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, securityDeposit: e.target.value }))}
                    className={errors.securityDeposit ? "border-red-500" : ""}
                  />
                  {errors.securityDeposit && <p className="text-sm text-red-500">{errors.securityDeposit}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileageLimit">Annual Mileage Limit *</Label>
                  <Select
                    value={formData.mileageLimit}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, mileageLimit: value }))}
                  >
                    <SelectTrigger className={errors.mileageLimit ? "border-red-500" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10000">10,000 miles</SelectItem>
                      <SelectItem value="12000">12,000 miles</SelectItem>
                      <SelectItem value="15000">15,000 miles</SelectItem>
                      <SelectItem value="18000">18,000 miles</SelectItem>
                      <SelectItem value="20000">20,000 miles</SelectItem>
                      <SelectItem value="25000">25,000 miles</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.mileageLimit && <p className="text-sm text-red-500">{errors.mileageLimit}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions *</Label>
                <Textarea
                  id="terms"
                  placeholder="Enter detailed lease terms and conditions, including responsibilities, restrictions, maintenance requirements, insurance requirements, early termination clauses, etc."
                  value={formData.terms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, terms: e.target.value }))}
                  className={cn("min-h-32", errors.terms && "border-red-500")}
                />
                <p className="text-xs text-muted-foreground">{formData.terms.length}/50 characters minimum</p>
                {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes or special conditions for this lease..."
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Lease agreement created successfully! Redirecting to leases page...
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert className="border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to create lease agreement. Please check all fields and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Creating Lease Agreement..." : "Create Lease Agreement"}
          </Button>
        </div>

        {/* Sidebar - Lease Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Lease Agreement Summary</CardTitle>
              <CardDescription>Review all details before creating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Summary */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">VEHICLE</h4>
                {selectedVehicle ? (
                  <div className="space-y-1">
                    <p className="font-medium">{selectedVehicle.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {selectedVehicle.id}</p>
                    <p className="text-sm text-muted-foreground">Plate: {selectedVehicle.licensePlate}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No vehicle selected</p>
                )}
              </div>

              <Separator />

              {/* Lessee Summary */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">LESSEE</h4>
                {formData.lesseeType === "existing" && selectedLessee ? (
                  <div className="space-y-1">
                    <p className="font-medium">{selectedLessee.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLessee.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedLessee.phone}</p>
                  </div>
                ) : formData.lesseeType === "new" && formData.newLessee.name ? (
                  <div className="space-y-1">
                    <p className="font-medium">{formData.newLessee.name}</p>
                    <p className="text-sm text-muted-foreground">{formData.newLessee.email}</p>
                    <p className="text-sm text-muted-foreground">{formData.newLessee.phone}</p>
                    <Badge variant="outline" className="text-xs">
                      New Lessee
                    </Badge>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No lessee selected</p>
                )}
              </div>

              <Separator />

              {/* Lease Terms Summary */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">LEASE TERMS</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {calculateLeaseDuration() ? `${calculateLeaseDuration()} months` : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">
                      {formData.startDate ? format(formData.startDate, "MMM dd, yyyy") : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">
                      {formData.endDate ? format(formData.endDate, "MMM dd, yyyy") : "Not set"}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial Summary */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">FINANCIAL TERMS</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Payment:</span>
                    <span className="font-medium">
                      {formData.monthlyPayment
                        ? `$${Number.parseFloat(formData.monthlyPayment).toLocaleString()}`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Security Deposit:</span>
                    <span className="font-medium">
                      {formData.securityDeposit
                        ? `$${Number.parseFloat(formData.securityDeposit).toLocaleString()}`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage Limit:</span>
                    <span className="font-medium">
                      {formData.mileageLimit
                        ? `${Number.parseInt(formData.mileageLimit).toLocaleString()}/year`
                        : "Not set"}
                    </span>
                  </div>
                  {calculateTotalValue() && (
                    <>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total Lease Value:</span>
                        <span className="text-lg">${calculateTotalValue()?.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Validation Status */}
              <div className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Vehicle Selected:</span>
                    <Badge variant={formData.vehicleId ? "default" : "secondary"}>
                      {formData.vehicleId ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Lessee Selected:</span>
                    <Badge
                      variant={
                        (formData.lesseeType === "existing" && formData.lesseeId) ||
                        (formData.lesseeType === "new" &&
                          formData.newLessee.name &&
                          formData.newLessee.email &&
                          formData.newLessee.phone)
                          ? "default"
                          : "secondary"
                      }
                    >
                      {(formData.lesseeType === "existing" && formData.lesseeId) ||
                      (formData.lesseeType === "new" &&
                        formData.newLessee.name &&
                        formData.newLessee.email &&
                        formData.newLessee.phone)
                        ? "✓"
                        : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Dates Set:</span>
                    <Badge variant={formData.startDate && formData.endDate ? "default" : "secondary"}>
                      {formData.startDate && formData.endDate ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Payment Terms:</span>
                    <Badge variant={formData.monthlyPayment && formData.securityDeposit ? "default" : "secondary"}>
                      {formData.monthlyPayment && formData.securityDeposit ? "✓" : "✗"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Terms & Conditions:</span>
                    <Badge variant={formData.terms.length >= 50 ? "default" : "secondary"}>
                      {formData.terms.length >= 50 ? "✓" : "✗"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
