"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { mockVehicles } from "@/lib/mock-data"

// Mock available vehicles


interface FormData {
  name: string
  vehicleId: string
  email: string
  phone: string
}

interface FormErrors {
  name?: string
  vehicleId?: string
  email?: string
  phone?: string
}

export default function AddLesseePage() {
  const availableVehicles=mockVehicles.filter((v)=>v.status==="available");
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    vehicleId: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Lessee name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Vehicle validation
    if (!formData.vehicleId) {
      newErrors.vehicleId = "Please select a vehicle"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation
    const phoneRegex = /^$$\d{3}$$\s\d{3}-\d{4}$/
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be in format (555) 123-4567"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone: formatted })
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
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate random success/failure for demo
      const success = Math.random() > 0.1 // 90% success rate

      if (success) {
        setSubmitStatus("success")
        setTimeout(() => {
          router.push("/lessees")
        }, 2000)
      } else {
        throw new Error("Registration failed")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedVehicle = availableVehicles.find((v) => v.id === formData.vehicleId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/lessees">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lessees
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Lessee</h1>
          <p className="text-muted-foreground">Register a new lessee for vehicle leasing</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lessee Registration</CardTitle>
            <CardDescription>Enter the required information to register a new lessee</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Lessee Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle ID/Number *</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                >
                  <SelectTrigger className={errors.vehicleId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select an available vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.id} - {vehicle.year + " " + vehicle.make +" " + vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleId && <p className="text-sm text-red-500">{errors.vehicleId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={14}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              {submitStatus === "success" && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Lessee registered successfully! Redirecting to lessees list...
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === "error" && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Registration failed. Please try again or contact support.
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register Lessee"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Registration Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Summary</CardTitle>
              <CardDescription>Review the information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Lessee Name:</p>
                  <p>{formData.name || "Not entered"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Vehicle:</p>
                  <p>{selectedVehicle ? selectedVehicle.year+" "+selectedVehicle.make+" "+selectedVehicle.model : "Not selected"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Email:</p>
                  <p>{formData.email || "Not entered"}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Phone:</p>
                  <p>{formData.phone || "Not entered"}</p>
                </div>
              </div>

              {selectedVehicle && (
                <div className="pt-4 border-t">
                  <p className="font-medium text-muted-foreground mb-2">Lease Details:</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      Monthly Payment: <span className="font-medium">$500.00</span>
                    </p>
                    <p>
                      Vehicle ID: <span className="font-medium">{selectedVehicle.id}</span>
                    </p>
                    <p>
                      License Plate: <span className="font-medium">{selectedVehicle.licensePlate}</span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Vehicles Info */}
          <Card>
            <CardHeader>
              <CardTitle>Available Vehicles ({availableVehicles.length})</CardTitle>
              <CardDescription>Vehicles ready for lease assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`p-2 border rounded text-sm ${
                      formData.vehicleId === vehicle.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                  >
                    <p className="font-medium">{vehicle.id}</p>
                    <p className="text-muted-foreground">{vehicle.year+" "+vehicle.make+" "+vehicle.model}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
