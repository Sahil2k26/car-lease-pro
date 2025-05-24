"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

const mockLessees = [
  { id: "L001", name: "John Smith", vehicleId: "V001", amount: 500 },
  { id: "L002", name: "Sarah Johnson", vehicleId: "V002", amount: 500 },
  { id: "L003", name: "Mike Davis", vehicleId: "V003", amount: 500 },
  { id: "L006", name: "Lisa Garcia", vehicleId: "V008", amount: 500 },
  { id: "L010", name: "Amanda White", vehicleId: "V014", amount: 500 },
]

export default function ProcessPaymentPage() {
  const router = useRouter()
  const [selectedLessee, setSelectedLessee] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [amount, setAmount] = useState("500")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processStatus, setProcessStatus] = useState<"idle" | "success" | "error">("idle")

  const handleProcess = async () => {
    if (!selectedLessee || !paymentMethod) return

    setIsProcessing(true)
    setProcessStatus("idle")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate 95% success rate
      const success = Math.random() > 0.05

      if (success) {
        setProcessStatus("success")
        setTimeout(() => {
          router.push("/payments")
        }, 2000)
      } else {
        throw new Error("Payment processing failed")
      }
    } catch (error) {
      setProcessStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedLesseeData = mockLessees.find((l) => l.id === selectedLessee)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/payments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payments
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Process Payment</h1>
          <p className="text-muted-foreground">Manually process a lease payment</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Processing
            </CardTitle>
            <CardDescription>Select lessee and payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lessee">Select Lessee</Label>
              <Select value={selectedLessee} onValueChange={setSelectedLessee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lessee" />
                </SelectTrigger>
                <SelectContent>
                  {mockLessees.map((lessee) => (
                    <SelectItem key={lessee.id} value={lessee.id}>
                      {lessee.name} - {lessee.vehicleId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {processStatus === "success" && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Payment processed successfully! Redirecting to payments page...
                </AlertDescription>
              </Alert>
            )}

            {processStatus === "error" && (
              <Alert className="border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Payment processing failed. Please try again or contact support.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleProcess}
              className="w-full"
              disabled={!selectedLessee || !paymentMethod || isProcessing}
            >
              {isProcessing ? "Processing Payment..." : "Process Payment"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Review payment details before processing</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedLesseeData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Lessee:</p>
                    <p className="font-medium">{selectedLesseeData.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Vehicle:</p>
                    <p className="font-medium">{selectedLesseeData.vehicleId}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Amount:</p>
                    <p className="font-medium text-lg">${amount}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Method:</p>
                    <p className="font-medium">{paymentMethod || "Not selected"}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="font-medium text-muted-foreground mb-2">Transaction Details:</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      Processing Date: <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </p>
                    <p>
                      Transaction ID: <span className="font-medium">TXN{Date.now()}</span>
                    </p>
                    <p>
                      Status: <span className="font-medium text-yellow-600">Pending Processing</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a lessee to see payment details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
