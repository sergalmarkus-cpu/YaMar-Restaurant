'use client';

import {
  Grid3X3,
  Users,
 QrCode,
  Edit2,
  Trash2,
} from 'lucide-react';

import type { Table } from '@/types/table';

interface Props {
  tables: Table[];
  onShowQR: (table: Table) => void;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
  onToggle: (table: Table) => void;
}

export default function TablesGrid({
  tables,
  onShowQR,
  onEdit,
  onDelete,
  onToggle,
}: Props) {

  function badge(status: string | null) {

    switch (status) {

      case 'available':
        return 'bg-green-100 text-green-700';

      case 'occupied':
        return 'bg-red-100 text-red-700';

      case 'reserved':
        return 'bg-yellow-100 text-yellow-700';

      case 'cleaning':
        return 'bg-blue-100 text-blue-700';

      default:
        return 'bg-gray-100 text-gray-700';

    }

  }

  function label(status: string | null) {

    switch (status) {

      case 'available':
        return 'Disponible';

      case 'occupied':
        return 'Ocupada';

      case 'reserved':
        return 'Reservada';

      case 'cleaning':
        return 'Limpieza';

      default:
        return status;

    }

  }

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

      {tables.map((table) => (

        <div
          key={table.id}
          className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition"
        >

          <div className="p-6">

            <div className="flex justify-between items-start">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                  <Grid3X3
                    className="text-indigo-600"
                    size={24}
                  />

                </div>

                <div>

                  <h3 className="font-bold text-lg">

                    Mesa {table.code}

                  </h3>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">

                    <Users size={15} />

                    {table.capacity} personas

                  </div>

                </div>

              </div>

              <button
                onClick={() => onToggle(table)}
                className={`w-3 h-3 rounded-full ${
                  table.active
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />

            </div>

            <div className="mt-5">

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${badge(table.status)}`}
              >
                {label(table.status)}
              </span>

            </div>

          </div>

          <div className="border-t bg-gray-50 p-4 flex gap-2">

            <button
              onClick={() => onShowQR(table)}
              className="flex-1 flex justify-center items-center gap-2 bg-white border rounded-xl py-2 hover:bg-gray-100 transition"
            >

              <QrCode size={17} />

              QR

            </button>

            <button
              onClick={() => onEdit(table)}
              className="p-2 rounded-xl hover:bg-indigo-100 transition"
            >

              <Edit2
                size={18}
                className="text-indigo-600"
              />

            </button>

            <button
              onClick={() => onDelete(table)}
              className="p-2 rounded-xl hover:bg-red-100 transition"
            >

              <Trash2
                size={18}
                className="text-red-600"
              />

            </button>

          </div>

        </div>

      ))}

    </div>

  );

}