"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesAnalyticsDay {
  date: string;
  label: string;
  sales: number;
  payments: number;
  orders: number;
  customers: number;
}

interface Props {
  data: SalesAnalyticsDay[];
  currency: string;
}

function formatMoney(
  value: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat(
      "es-ES",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export default function SalesAnalyticsChart({
  data,
  currency,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Evolución de ventas
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Importe cobrado por día durante el período seleccionado.
        </p>
      </div>

      <div className="h-[340px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
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
              tickFormatter={(value) =>
                formatMoney(
                  Number(value),
                  currency
                )
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
              }}
              formatter={(value) => [
                formatMoney(
                  Number(value ?? 0),
                  currency
                ),
                "Ventas",
              ]}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{
                fill: "#4f46e5",
                r: 3,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}