'use client';

import {
  Clock3,
  CheckCircle2,
  ChefHat,
  Truck,
  PackageCheck,
} from 'lucide-react';

const stats = [
  {
    title: 'Pendientes',
    value: 0,
    icon: Clock3,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
  },
  {
    title: 'Aceptados',
    value: 0,
    icon: CheckCircle2,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    title: 'Preparando',
    value: 0,
    icon: ChefHat,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  {
    title: 'Listos',
    value: 0,
    icon: PackageCheck,
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
  {
    title: 'Entregados',
    value: 0,
    icon: Truck,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
  },
];

export default function KitchenStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

      {stats.map((stat) => {

        const Icon = stat.icon;

        return (

          <div
            key={stat.title}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {stat.value}
                </h2>

              </div>

              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <Icon className={`h-7 w-7 ${stat.color}`} />
              </div>

            </div>

          </div>

        );

      })}

    </div>
  );
}