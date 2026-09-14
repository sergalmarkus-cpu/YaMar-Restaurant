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
  locale: string;
  title: string;
  subtitle: string;
  salesLabel: string;
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
        maximumFractionDigits: 2,
      }
    ).format(value);
  }

  try {
    return new Intl.NumberFormat(
      locale,
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(value);
  } catch {
    return `${new Intl.NumberFormat(
      locale,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
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
      day: "2-digit",
      month: "short",
    }
  ).format(date);
}

export default function SalesAnalyticsChart({
  data,
  currency,
  locale,
  title,
  subtitle,
  salesLabel,
}: Props) {
  const localizedData =
    data.map(
      (day) => ({
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

      <div className="h-[340px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
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
                value
              ) => [
                formatMoney(
                  Number(
                    value ??
                      0
                  ),
                  currency,
                  locale
                ),
                salesLabel,
              ]}
            />

            <Line
              type="monotone"
              dataKey="sales"
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}