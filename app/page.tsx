import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Car, DollarSign, AlertTriangle, TrendingUp, Users, Calendar, IndianRupee } from "lucide-react"
import Link from "next/link"
import { PaymentChart } from "@/components/payment-chart"
import { mockLessees } from "@/lib/mock-data"
import { mockVehicles } from "@/lib/mock-data"


const totalVehicles = mockVehicles.length
const leasedVehicles = mockVehicles.filter((v) => v.status === "leased").length
const availableVehicles = totalVehicles - leasedVehicles

const totalExpectedMonthly =mockVehicles.filter((v)=>v.status==="leased").reduce((t,v)=>t+v.monthlyRate,0)
const paidThisMonth = mockLessees.filter((l) => l.paymentStatus === "paid").reduce((t,l)=>(t+(mockVehicles.find((v)=>v.id===l.vehicleId)?.monthlyRate ?? 0)),0)
const overduePayments = mockLessees.filter((l) => l.paymentStatus === "overdue" || l.paymentStatus === "failed")
const pendingPayments = mockLessees.filter((l) => l.paymentStatus === "pending")

const collectionRate = (paidThisMonth / totalExpectedMonthly) * 100

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lease Management Dashboard</h1>
        <p className="text-muted-foreground">Monitor your fleet, lessees, and payment collections</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Status</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leasedVehicles}/{totalVehicles}
            </div>
            <p className="text-xs text-muted-foreground">Vehicles Leased</p>
            <Progress value={(leasedVehicles / totalVehicles) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Collections</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{paidThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">of ₹{totalExpectedMonthly.toLocaleString()} expected</p>
            <Progress value={collectionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <div
              className={`text-xs mt-1 ${collectionRate >= 90 ? "text-green-600" : collectionRate >= 75 ? "text-yellow-600" : "text-red-600"}`}
            >
              {collectionRate >= 90 ? "Excellent" : collectionRate >= 75 ? "Good" : "Needs Attention"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overduePayments.length}</div>
            <p className="text-xs text-muted-foreground">Overdue/Failed</p>
            <p className="text-xs text-yellow-600 mt-1">{pendingPayments.length} pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Payment Collections Overview</CardTitle>
          <CardDescription>Monthly payment collection trends</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentChart />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Lessees with Payment Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Payment Issues ({overduePayments.length + pendingPayments.length})
            </CardTitle>
            <CardDescription>Lessees requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...overduePayments, ...pendingPayments].slice(0, 6).map((lessee) => (
                <div key={lessee.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{lessee.name}</p>
                    <p className="text-xs text-muted-foreground">Vehicle: {lessee.vehicleId}</p>
                    <p className="text-xs text-muted-foreground">Due: {lessee.nextDue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{mockVehicles.find((v)=>(v.id===lessee.vehicleId))?.monthlyRate??0}</p>
                    <Badge
                      variant={
                        lessee.paymentStatus === "overdue"
                          ? "destructive"
                          : lessee.paymentStatus === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {lessee.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/payments">View All Payments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest lease and payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Payment Received</p>
                  <p className="text-xs text-muted-foreground">Amanda White - V014</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+₹500</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                <div className="space-y-1">
                  <p className="text-sm font-medium">New Lease Created</p>
                  <p className="text-xs text-muted-foreground">Kevin Anderson - V016</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Payment Failed</p>
                  <p className="text-xs text-muted-foreground">Jennifer Lee - V011</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">₹500</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Payment Reminder Sent</p>
                  <p className="text-xs text-muted-foreground">Sarah Johnson - V002</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Reminder</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button asChild className="h-20 flex-col">
              <Link href="/lessees/add">
                <Users className="h-6 w-6 mb-2" />
                Add New Lessee
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/payments/process">
                <DollarSign className="h-6 w-6 mb-2" />
                Process Payment
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/payments/overdue">
                <AlertTriangle className="h-6 w-6 mb-2" />
                Handle Overdue
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/vehicles">
                <Car className="h-6 w-6 mb-2" />
                Manage Fleet
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
