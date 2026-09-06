'use client';

import {
  BookOpen,
  CheckCircle,
  Clock3,
  XCircle,
} from 'lucide-react';

interface Props {
  total: number;
  active: number;
  scheduled: number;
  inactive: number;
}

export default function StatsCards({
  total,
  active,
  scheduled,
  inactive,
}: Props) {
  const cards = [
    {
      title: 'Total Menús',
      value: total,
      icon: BookOpen,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Activos',
      value: active,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Programados',
      value: scheduled,
      icon: Clock3,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Inactivos',
      value: inactive,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg}`}
              >
                <Icon
                  size={28}
                  className={card.color}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}