'use client';

import {
  Receipt,
  Clock,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';

interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  status: string;
  total: number;
  createdAt: string;
}

interface Props {
  orders: Order[];
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export default function OrdersGrid({
  orders,
  onView,
  onEdit,
  onDelete,
}: Props) {

  function badge(status: string) {

    switch (status) {

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'accepted':
        return 'bg-blue-100 text-blue-700';

      case 'preparing':
        return 'bg-orange-100 text-orange-700';

      case 'ready':
        return 'bg-green-100 text-green-700';

      case 'delivering':
        return 'bg-indigo-100 text-indigo-700';

      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';

    }

  }

  function label(status: string) {

    switch (status) {

      case 'pending':
        return 'Pendiente';

      case 'accepted':
        return 'Aceptado';

      case 'preparing':
        return 'Preparando';

      case 'ready':
        return 'Listo';

      case 'delivering':
        return 'En reparto';

      case 'delivered':
        return 'Entregado';

      case 'cancelled':
        return 'Cancelado';

      default:
        return status;

    }

  }

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      {orders.map((order) => (

        <div
          key={order.id}
          className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition"
        >

          <div className="p-6">

            <div className="flex justify-between">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

                  <Receipt
                    size={24}
                    className="text-indigo-600"
                  />

                </div>

                <div>

                  <h3 className="font-bold">

                    {order.orderNumber}

                  </h3>

                  <p className="text-sm text-gray-500">

                    Mesa {order.tableId}

                  </p>

                </div>

              </div>

              <div className="text-right">

                <div className="font-bold text-lg">

                  € {Number(order.total).toFixed(2)}

                </div>

                <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">

                  <Clock size={13} />

                  {new Date(order.createdAt).toLocaleTimeString()}

                </div>

              </div>

            </div>

            <div className="mt-5">

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${badge(order.status)}`}
              >
                {label(order.status)}
              </span>

            </div>

          </div>

          <div className="border-t bg-gray-50 p-4 flex gap-2">

            <button
              onClick={() => onView(order)}
              className="flex-1 flex justify-center items-center gap-2 bg-white border rounded-xl py-2 hover:bg-gray-100"
            >

              <Eye size={17} />

              Ver

            </button>

            <button
              onClick={() => onEdit(order)}
              className="p-2 rounded-xl hover:bg-indigo-100"
            >

              <Edit2
                size={18}
                className="text-indigo-600"
              />

            </button>

            <button
              onClick={() => onDelete(order)}
              className="p-2 rounded-xl hover:bg-red-100"
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