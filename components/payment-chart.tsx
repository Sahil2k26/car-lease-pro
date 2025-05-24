"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { graphData as data } from "@/lib/mock-data"

export function PaymentChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [
            name === "Expected" || name === "Collected" ? `₹${value}` : `₹${value}%`,
            name === "Expected" ? "Expected" : name === "Collected" ? "Collected" : "Collection Rate",
          ]}
        />
        <Legend />
        <Bar dataKey="expected" fill="#89CFF0" name="Expected" />
        <Bar dataKey="collected" fill="#0096FF" name="Collected" />
      </BarChart>
    </ResponsiveContainer>
  )
}
