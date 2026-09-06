'use client';

import {
  ShoppingCart,
  Clock,
  ChefHat,
  CheckCircle,
} from 'lucide-react';

interface Props {
  total: number;
  pending: number;
  preparing: number;
  delivered: number;
}

export default function StatsCards({
  total,
  pending,
  preparing,
  delivered,
}: Props) {

  const cards = [
    {
      title: 'Pedidos',
      value: total,
      icon: ShoppingCart,
      color: 'bg-indigo-500',
    },
    {
      title: 'Pendientes',
      value: pending,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Preparando',
      value: preparing,
      icon: ChefHat,
      color: 'bg-orange-500',
    },
    {
      title: 'Entregados',
      value: delivered,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

      {cards.map((card) => {

        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-sm border p-5"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>

              </div>

              <div
                className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center`}
              >
                <Icon
                  size={22}
                  className="text-white"
                />
              </div>

            </div>

          </div>
        );

      })}

    </div>
  );
}