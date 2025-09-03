"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface AnalyticsChartsProps {
  processedTrends: any[]
  statusDistribution: any[]
  jobMetrics: any[]
}

export function AnalyticsCharts({ processedTrends, statusDistribution, jobMetrics }: AnalyticsChartsProps) {
  return (
    <>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <div className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-lg">
          <div className="p-6 pb-2">
            <h3 className="text-lg font-semibold text-white">Application Trends</h3>
            <p className="text-sm text-slate-400">Monthly application volume over time</p>
          </div>
          <div className="p-6 pt-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="applications" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-lg">
          <div className="p-6 pb-2">
            <h3 className="text-lg font-semibold text-white">Application Status</h3>
            <p className="text-sm text-slate-400">Current distribution of application statuses</p>
          </div>
          <div className="p-6 pt-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Jobs */}
      <div className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-lg">
        <div className="p-6 pb-2">
          <h3 className="text-lg font-semibold text-white">Top Performing Jobs</h3>
          <p className="text-sm text-slate-400">Jobs with the highest application rates</p>
        </div>
        <div className="p-6 pt-2">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={jobMetrics.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="title" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="application_count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
