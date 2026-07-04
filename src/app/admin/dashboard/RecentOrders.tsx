const orders = [
  { id: 1, table: 'Mesa 12', items: 3, total: 45.50, status: 'pending', time: '5 min' },
  { id: 2, table: 'Mesa 4', items: 2, total: 32.00, status: 'preparing', time: '12 min' },
  { id: 3, table: 'Terraza 8', items: 5, total: 78.30, status: 'ready', time: '18 min' },
  { id: 4, table: 'Mesa 15', items: 2, total: 28.90, status: 'delivered', time: '25 min' },
];

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  preparing: { label: 'Preparando', color: 'bg-blue-100 text-blue-800' },
  ready: { label: 'Listo', color: 'bg-green-100 text-green-800' },
  delivered: { label: 'Entregado', color: 'bg-gray-100 text-gray-800' },
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Pedidos recientes
        </h3>
        <a 
          href="/admin/orders" 
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Ver todos →
        </a>
      </div>
      
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">
                  #{order.id}
                </span>
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{order.table}</p>
                <p className="text-sm text-gray-500">
                  {order.items} productos • Hace {order.time}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-900">
                €{order.total.toFixed(2)}
              </span>
              
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusConfig[order.status as keyof typeof statusConfig].color
                }`}
              >
                {statusConfig[order.status as keyof typeof statusConfig].label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}