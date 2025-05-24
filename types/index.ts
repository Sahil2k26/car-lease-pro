export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  color: string
  mileage: number
  status: "available" | "leased" | "maintenance"
  monthlyRate: number
  imageUrl?: string
}

export interface Lessee {
  id: string
  name: string
  vehicleId: string
  email: string
  phone: string
  status: "active" | "inactive" | "pending"
  leaseStartDate: Date
  createdAt: Date
}

export interface LeaseAgreement {
  id: string
  vehicleId: string
  lesseeId: string
  startDate: Date
  endDate: Date
  monthlyPayment: number
  status: "active" | "completed" | "terminated"
  createdAt: Date
}

export interface Payment {
  id: string
  lesseeId: string
  vehicleId: string
  amount: number
  dueDate: Date
  paidDate?: Date
  status: "pending" | "paid" | "overdue" | "failed"
  paymentMethod?: string
  transactionId?: string
  attemptCount?: number
}

export interface PaymentHistory {
  id: string
  lesseeId: string
  payments: Payment[]
  totalPaid: number
  totalExpected: number
  lastPaymentDate?: Date
}
