'use client';

import {
  BookOpen,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  ArrowUpDown,
  Clock,
} from 'lucide-react';

interface Menu {
  id: number;
  name: any;
  description: any;
  type: string;
  icon: string;
  displayOrder: number;
  active: boolean;
  hasSchedule: boolean;
}

interface Props {
  menus: Menu[];
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
  onToggle: (menu: Menu) => void;
  onSchedule: (menu: Menu) => void;
}

function getMenuName(name: any) {
  if (typeof name === 'string') {
    return name;
  }

  if (name?.es) {
    return name.es;
  }

  if (name?.en) {
    return name.en;
  }

  return 'Sin nombre';
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'restaurant':
      return 'Restaurante';

    case 'snacks':
      return 'Snacks';

    case 'cocktails':
      return 'Cócteles';

    case 'coffee':
      return 'Cafetería';

    case 'breakfast':
      return 'Desayunos';

    case 'desserts':
      return 'Postres';

    default:
      return type;
  }
}

export default function MenusGrid({
  menus,
  onEdit,
  onDelete,
  onToggle,
  onSchedule,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {menus.map((menu) => (
        <div
          key={menu.id}
          className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <BookOpen
                    className="text-indigo-600"
                    size={24}
                  />
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    {getMenuName(menu.name)}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {getTypeLabel(menu.type)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggle(menu)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                  menu.active
                    ? 'bg-green-100'
                    : 'bg-gray-100'
                }`}
              >
                {menu.active ? (
                  <Power
                    size={18}
                    className="text-green-600"
                  />
                ) : (
                  <PowerOff
                    size={18}
                    className="text-gray-500"
                  />
                )}
              </button>
            </div>

            <div className="mt-6 flex justify-between items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  menu.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {menu.active
                  ? 'Activo'
                  : 'Inactivo'}
              </span>

              <div className="flex items-center gap-2">
                {menu.hasSchedule ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    Programado
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                    Sin horario
                  </span>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ArrowUpDown size={15} />
                  Orden {menu.displayOrder}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t bg-gray-50 p-4 flex gap-2">
            <button
              type="button"
              onClick={() => onSchedule(menu)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border bg-white hover:bg-gray-100 py-2 transition"
            >
              <Clock size={17} />
              Horarios
            </button>

            <button
              type="button"
              onClick={() => onEdit(menu)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 transition"
            >
              <Pencil size={17} />
              Editar
            </button>

            <button
              type="button"
              onClick={() => onDelete(menu)}
              className="w-12 flex justify-center items-center rounded-xl border hover:bg-red-50 transition"
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