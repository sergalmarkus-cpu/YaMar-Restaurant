import {
  ArrowDown,
  ArrowUp,
  type LucideIcon,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;

  trend?: {
    value: number;
    isPositive: boolean;
  };

  subtitle?: string;
  trendComparison?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  trendComparison,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  trend.isPositive
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUp
                    size={14}
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDown
                    size={14}
                    aria-hidden="true"
                  />
                )}

                {Math.abs(
                  trend.value
                )}
                %
              </span>

              {trendComparison && (
                <span className="text-xs text-gray-500">
                  {trendComparison}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="ml-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
            <Icon
              size={24}
              className="text-indigo-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}