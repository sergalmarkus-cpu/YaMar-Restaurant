'use client';

import {
  FolderTree,
  CheckCircle,
  XCircle,
  ArrowUpDown,
} from 'lucide-react';

interface Props {
  total: number;
  active: number;
  inactive: number;
  menus: number;
}

export default function StatsCards({
  total,
  active,
  inactive,
  menus,
}: Props) {

  const cards = [

    {
      title: 'Categorías',
      value: total,
      icon: FolderTree,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },

    {
      title: 'Activas',
      value: active,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },

    {
      title: 'Inactivas',
      value: inactive,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },

    {
      title: 'Menús',
      value: menus,
      icon: ArrowUpDown,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
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

                <p className="text-sm text-gray-500">
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