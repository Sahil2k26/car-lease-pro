"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, AlertTriangle, CreditCard, Filter, Download } from "lucide-react"
import type { Payment } from "@/types"

// Mock payment data
const mockPayments: (Payment & { lesseeName: string; vehicleId: string })[] = [
  {
    id: "P001",
    lesseeId: "L001",
    lesseeName: "John Smith",
    vehicleId: "V001",
    amount: 500,
    dueDate: new Date("2024-02-15"),
    paidDate: new Date("2024-02-14"),
    status: "paid",
    paymentMethod: "Credit Card",
    transactionId: "TXN001234",
  },
  {
    id: "P002",
    lesseeId: "L002",
    lesseeName: "Sarah Johnson",
    vehicleId: "V002",
    amount: 500,
    dueDate: new Date("2024-01-15"),
    status: "overdue",
    attemptCount: 2,
  },
  {
    id: "P003",
    lesseeId: "L003",
    lesseeName: "Mike Davis",
    vehicleId: "V003",
    amount: 500,
    dueDate: new Date("2024-02-10"),
    status: "pending",
  },
  {
    id: "P004",
    lesseeId: "L008",
    lesseeName: "Jennifer Lee",
    vehicleId: "V011",
    amount: 500,
    dueDate: new Date("2024-02-05"),
    status: "failed",
    attemptCount: 3,
  },
  {
    id: "P005",
    lesseeId: "L011",
    lesseeName: "Kevin Anderson",
    vehicleId: "V016",
    amount: 500,
    dueDate: new Date("2024-01-25"),
    status: "overdue",
    attemptCount: 1,
  },
]

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [payments, setPayments] = useState(mockPayments)
  const [selectedPayment, setSelectedPayment] = useState<(typeof mockPayments)[0] | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.lesseeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Payment["status"]) => {
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

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date()
    const diffTime = today.getTime() - dueDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const processPayment = async (paymentId: string, method: string) => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1

      setPayments((prev) =>
        prev.map((payment) => {
          if (payment.id === paymentId) {
            return {
              ...payment,
              status: success ? ("paid" as const) : ("failed" as const),
              paidDate: success ? new Date() : undefined,
              paymentMethod: success ? method : undefined,
              transactionId: success ? `TXN${Date.now()}` : undefined,
              attemptCount: success ? undefined : (payment.attemptCount || 0) + 1,
            }
          }
          return payment
        }),
      )

      setSelectedPayment(null)
    } catch (error) {
      console.error("Payment processing failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const retryPayment = async (paymentId: string) => {
    setIsProcessing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const success = Math.random() > 0.3 // 70% success rate for retries

      setPayments((prev) =>
        prev.map((payment) => {
          if (payment.id === paymentId) {
            return {
              ...payment,
              status: success ? ("paid" as const) : ("failed" as const),
              paidDate: success ? new Date() : undefined,
              paymentMethod: success ? "Auto Retry" : undefined,
              transactionId: success ? `TXN${Date.now()}` : undefined,
              attemptCount: (payment.attemptCount || 0) + 1,
            }
          }
          return payment
        }),
      )
    } catch (error) {
      console.error("Payment retry failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === "paid").length,
    pending: payments.filter((p) => p.status === "pending").length,
    overdue: payments.filter((p) => p.status === "overdue").length,
    failed: payments.filter((p) => p.status === "failed").length,
    totalCollected: payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    totalExpected: payments.reduce((sum, p) => sum + p.amount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">Process and track lease payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Manual Payment</DialogTitle>
                <DialogDescription>Record a payment received outside the system</DialogDescription>
              </DialogHeader>
              {/* Manual payment form would go here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.paid} payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Payments</CardTitle>
              <CardDescription>Complete payment history and status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lessee</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Details</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.lesseeName}</div>
                          <div className="text-sm text-muted-foreground">ID: {payment.lesseeId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{payment.vehicleId}</TableCell>
                      <TableCell className="font-medium">${payment.amount}</TableCell>
                      <TableCell>
                        <div>
                          <div>{payment.dueDate.toLocaleDateString()}</div>
                          {payment.status === "overdue" && (
                            <div className="text-sm text-red-600">{getDaysOverdue(payment.dueDate)} days overdue</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                        {payment.attemptCount && payment.attemptCount > 1 && (
                          <div className="text-xs text-muted-foreground mt-1">{payment.attemptCount} attempts</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.paidDate && (
                          <div className="text-sm">
                            <div>Paid: {payment.paidDate.toLocaleDateString()}</div>
                            <div className="text-muted-foreground">{payment.paymentMethod}</div>
                            {payment.transactionId && (
                              <div className="text-xs text-muted-foreground">{payment.transactionId}</div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {payment.status === "pending" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedPayment(payment)}>
                                  Process
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Process Payment</DialogTitle>
                                  <DialogDescription>
                                    Process payment for {payment.lesseeName} - {payment.vehicleId}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <Label>Amount</Label>
                                      <p className="font-medium">${payment.amount}</p>
                                    </div>
                                    <div>
                                      <Label>Due Date</Label>
                                      <p className="font-medium">{payment.dueDate.toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Payment Method</Label>
                                    <Select defaultValue="credit-card">
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="credit-card">Credit Card</SelectItem>
                                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="check">Check</SelectItem>
                                        <SelectItem value="cash">Cash</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button
                                    className="w-full"
                                    onClick={() => processPayment(payment.id, "Credit Card")}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? "Processing..." : "Process Payment"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {(payment.status === "failed" || payment.status === "overdue") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => retryPayment(payment.id)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Retrying..." : "Retry"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>Payments awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments
                  .filter((p) => p.status === "pending")
                  .map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{payment.lesseeName}</p>
                        <p className="text-sm text-muted-foreground">Vehicle: {payment.vehicleId}</p>
                        <p className="text-sm text-muted-foreground">Due: {payment.dueDate.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold">${payment.amount}</p>
                        <Button size="sm" onClick={() => processPayment(payment.id, "Auto Process")}>
                          Process Now
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Payments</CardTitle>
              <CardDescription>Payments past their due date requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments
                  .filter((p) => p.status === "overdue")
                  .map((payment) => (
                    <Alert key={payment.id} className="border-red-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {payment.lesseeName} - {payment.vehicleId}
                            </p>
                            <p className="text-sm">
                              ${payment.amount} overdue by {getDaysOverdue(payment.dueDate)} days
                            </p>
                            {payment.attemptCount && (
                              <p className="text-xs text-muted-foreground">
                                {payment.attemptCount} collection attempts made
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Send Reminder
                            </Button>
                            <Button size="sm" onClick={() => retryPayment(payment.id)}>
                              Retry Payment
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle>Failed Payments</CardTitle>
              <CardDescription>Payments that failed processing and need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments
                  .filter((p) => p.status === "failed")
                  .map((payment) => (
                    <Alert key={payment.id} className="border-red-200">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {payment.lesseeName} - {payment.vehicleId}
                            </p>
                            <p className="text-sm">${payment.amount} payment failed</p>
                            <p className="text-xs text-muted-foreground">{payment.attemptCount} attempts made</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Contact Lessee
                            </Button>
                            <Button size="sm" onClick={() => retryPayment(payment.id)}>
                              Retry Payment
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
