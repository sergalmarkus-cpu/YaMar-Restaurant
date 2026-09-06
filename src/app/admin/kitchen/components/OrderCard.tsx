'use client';

import { Clock3 } from 'lucide-react';

interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  tableName: string | null;
  total: number;
  status: string;
  createdAt: string;
}

interface Props {
  order: Order;
  onStatusChange: (id: number, status: string) => void;
}

export default function OrderCard({
  order,
  onStatusChange,
}: Props) {

  const created = new Date(order.createdAt);

  const minutes = Math.floor(
    (Date.now() - created.getTime()) / 60000
  );

  const nextStatus: Record<string, string | null> = {
    pending: "accepted",
    accepted: "preparing",
    preparing: "ready",
    ready: "delivered",
    delivered: null,
  };

  const labels: Record<string, string> = {
    pending: "Aceptar",
    accepted: "Preparar",
    preparing: "Marcar listo",
    ready: "Entregar",
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">

      <div className="flex justify-between">

        <h3 className="font-bold">
          #{order.orderNumber}
        </h3>

        <span className="font-semibold">
          €{Number(order.total).toFixed(2)}
        </span>

      </div>

      <p className="mt-2 text-gray-600">
        Mesa {order.tableName ?? order.tableId}
      </p>

      <div className="mt-3 flex items-center gap-2 text-orange-600">

        <Clock3 size={16}/>

        {minutes} min

      </div>

      {nextStatus[order.status] && (

        <button
          onClick={() =>
            onStatusChange(
              order.id,
              nextStatus[order.status]!
            )
          }
          className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
        >
          {labels[order.status]}
        </button>

      )}

    </div>
  );

}