'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function InteractiveDataViz() {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')

  const barData = [
    { name: 'Hospitals', count: 245, percentage: 28 },
    { name: 'Police', count: 156, percentage: 18 },
    { name: 'Fire', count: 189, percentage: 21 },
    { name: 'Pharmacies', count: 312, percentage: 25 },
    { name: 'Shelters', count: 75, percentage: 8 },
  ]

  const pieData = barData.map(item => ({ name: item.name, value: item.percentage }))
  const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6']

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Services Distribution</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded transition font-semibold ${
              chartType === 'bar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-4 py-2 rounded transition font-semibold ${
              chartType === 'pie'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pie Chart
          </button>
        </div>
      </div>

      {chartType === 'bar' ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {barData.map((item, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-lg text-center hover:shadow-md transition">
            <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: COLORS[idx] }} />
            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
            <p className="text-lg font-bold text-gray-700">{item.count}</p>
            <p className="text-xs text-gray-500">{item.percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}
