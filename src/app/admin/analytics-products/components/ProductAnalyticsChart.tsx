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
  locale: string;
  title: string;
  subtitle: string;
  unitsLabel: string;
  revenueLabel: string;
  unitsSoldLabel: string;
}

function formatMoney(
  value: number,
  currency: string,
  locale: string
) {
  if (!currency) {
    return new Intl.NumberFormat(
      locale,
      {
        maximumFractionDigits:
          2,
      }
    ).format(
      value
    );
  }

  try {
    return new Intl.NumberFormat(
      locale,
      {
        style:
          "currency",
        currency,
        maximumFractionDigits:
          2,
      }
    ).format(
      value
    );
  } catch {
    return `${new Intl.NumberFormat(
      locale,
      {
        minimumFractionDigits:
          2,
        maximumFractionDigits:
          2,
      }
    ).format(value)} ${currency}`;
  }
}

function formatDayLabel(
  value: string,
  locale: string
) {
  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      day:
        "2-digit",
      month:
        "short",
    }
  ).format(
    date
  );
}

export default function ProductAnalyticsChart({
  data,
  currency,
  locale,
  title,
  subtitle,
  unitsLabel,
  revenueLabel,
  unitsSoldLabel,
}: Props) {
  const localizedData =
    data.map(
      (
        day
      ) => ({
        ...day,
        localizedLabel:
          formatDayLabel(
            day.date,
            locale
          ),
      })
    );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <ComposedChart
            data={
              localizedData
            }
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="localizedLabel"
              stroke="#64748b"
              fontSize={12}
              minTickGap={20}
            />

            <YAxis
              yAxisId="units"
              stroke="#64748b"
              fontSize={12}
              allowDecimals={
                false
              }
            />

            <YAxis
              yAxisId="revenue"
              orientation="right"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(
                value
              ) =>
                formatMoney(
                  Number(value),
                  currency,
                  locale
                )
              }
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
              ) => {
                if (
                  name ===
                  revenueLabel
                ) {
                  return [
                    formatMoney(
                      Number(
                        value ??
                          0
                      ),
                      currency,
                      locale
                    ),
                    revenueLabel,
                  ];
                }

                return [
                  Number(
                    value ??
                      0
                  ),
                  unitsLabel,
                ];
              }}
            />

            <Bar
              yAxisId="units"
              dataKey="units"
              name={
                unitsLabel
              }
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
              name={
                revenueLabel
              }
              stroke="#059669"
              strokeWidth={3}
              dot={{
                fill:
                  "#059669",
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
            {
              unitsSoldLabel
            }
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 bg-emerald-600" />

          <span>
            {
              revenueLabel
            }
          </span>
        </div>
      </div>
    </div>
  );
}