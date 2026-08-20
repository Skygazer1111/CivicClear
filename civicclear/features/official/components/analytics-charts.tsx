"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsPayload } from "@/features/official/analytics-types";

function formatHours(hours: number | null) {
  if (hours == null) return "—";
  if (hours < 24) return `${hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(1)} d`;
}

export function AnalyticsCharts({ data }: { data: AnalyticsPayload }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-panel rounded-[1.5rem] p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">
            Complaints over time
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Daily filings in the selected range ({data.total} total).
          </p>
          <div className="mt-4 h-64 w-full">
            {data.overTime.length === 0 ? (
              <p className="pt-16 text-center text-sm text-ink-muted">
                No data in this range.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.overTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d6e2dc" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#5b6b66" }}
                    minTickGap={28}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#5b6b66" }}
                    width={28}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Complaints"
                    stroke="#0f8f78"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#0f8f78" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="glass-panel rounded-[1.5rem] p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">By type</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Volume by complaint category.
          </p>
          <div className="mt-4 h-64 w-full">
            {data.total === 0 ? (
              <p className="pt-16 text-center text-sm text-ink-muted">
                No data in this range.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d6e2dc" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#5b6b66" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#5b6b66" }}
                    width={28}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Complaints"
                    fill="#0f8f78"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <section className="glass-panel rounded-[1.5rem] p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">
          Resolution time
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Average time from filing to resolved (resolved reports only).
        </p>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-ink-muted">Overall average</p>
            <p className="mt-1 font-display text-4xl font-semibold tracking-tight">
              {formatHours(data.resolution.averageHours)}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {data.resolution.resolvedCount} resolved
            </p>
          </div>
          <div className="min-w-0 flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-ink-muted">
                <tr>
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 font-semibold">Average</th>
                  <th className="pb-2 font-semibold">Resolved</th>
                </tr>
              </thead>
              <tbody>
                {data.resolution.byType.map((row) => (
                  <tr key={row.type} className="border-t border-line/60">
                    <td className="py-2 text-ink">{row.label}</td>
                    <td className="py-2 text-ink-muted">
                      {formatHours(row.averageHours)}
                    </td>
                    <td className="py-2 text-ink-muted">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
