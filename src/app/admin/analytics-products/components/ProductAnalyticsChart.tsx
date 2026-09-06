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

interface ProductAnalyticsDay {
  date: string;
  label: string;
  units: number;
  revenue: number;
  orders: number;
}

interface Props {
  data: ProductAnalyticsDay[];
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

export default function ProductAnalyticsChart({
  data,
  currency,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Evolución de productos
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Unidades vendidas y facturación generada durante el período seleccionado.
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
              yAxisId="units"
              stroke="#64748b"
              fontSize={12}
              allowDecimals={false}
            />

            <YAxis
              yAxisId="revenue"
              orientation="right"
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
              formatter={(
                value,
                name
              ) => {
                if (
                  name ===
                  "Facturación"
                ) {
                  return [
                    formatMoney(
                      Number(value ?? 0),
                      currency
                    ),
                    name,
                  ];
                }

                return [
                  Number(
                    value ??
                      0
                  ),
                  name,
                ];
              }}
            />

            <Bar
              yAxisId="units"
              dataKey="units"
              name="Unidades"
              fill="#818cf8"
              radius={[
                5,
                5,
                0,
                0,
              ]}
            />

            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              name="Facturación"
              stroke="#059669"
              strokeWidth={3}
              dot={{
                fill: "#059669",
                r: 3,
              }}
              activeDot={{
                r: 6,
              }}
            />

          </ComposedChart>
        </ResponsiveContainer>

      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-slate-500">

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-indigo-400" />

          <span>
            Unidades vendidas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 bg-emerald-600" />

          <span>
            Facturación
          </span>
        </div>

      </div>

    </div>
  );
}