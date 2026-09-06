"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ClientAnalyticsDay {
  date: string;
  label: string;
  visits: number;
  customers: number;
  newCustomers: number;
  returningCustomers: number;
}

interface Props {
  data: ClientAnalyticsDay[];
}

function getSeriesLabel(
  name: string
) {
  switch (name) {
    case "visits":
      return "Visitas";

    case "customers":
      return "Clientes";

    case "newCustomers":
      return "Nuevos";

    case "returningCustomers":
      return "Recurrentes";

    default:
      return name;
  }
}

export default function ClientAnalyticsChart({
  data,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Evolución de clientes
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Visitas y comportamiento de clientes durante el período seleccionado.
        </p>
      </div>

      <div className="h-[360px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <ComposedChart
            data={data}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={12}
              minTickGap={20}
            />

            <YAxis
              stroke="#64748b"
              fontSize={12}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor:
                  "#ffffff",
                border:
                  "1px solid #e2e8f0",
                borderRadius:
                  "12px",
              }}
              formatter={(
                value,
                name
              ) => [
                Number(
                  value ??
                    0
                ),
                getSeriesLabel(
                  String(
                    name
                  )
                ),
              ]}
            />

            <Bar
              dataKey="visits"
              name="visits"
              fill="#c7d2fe"
              radius={[
                6,
                6,
                0,
                0,
              ]}
            />

            <Line
              type="monotone"
              dataKey="customers"
              name="customers"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{
                fill:
                  "#4f46e5",
                r: 3,
              }}
              activeDot={{
                r: 6,
              }}
            />

            <Line
              type="monotone"
              dataKey="newCustomers"
              name="newCustomers"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="returningCustomers"
              name="returningCustomers"
              stroke="#d97706"
              strokeWidth={2}
              dot={false}
            />

          </ComposedChart>
        </ResponsiveContainer>

      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-indigo-200" />
          Visitas
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-indigo-600" />
          Clientes
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-600" />
          Nuevos
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-600" />
          Recurrentes
        </div>

      </div>

    </div>
  );
}