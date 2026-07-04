const products = [
  { id: 1, name: 'Paella Valenciana', sales: 45, revenue: 1350, trend: 12 },
  { id: 2, name: 'Hamburguesa Premium', sales: 38, revenue: 532, trend: 8 },
  { id: 3, name: 'Ensalada César', sales: 32, revenue: 384, trend: -3 },
  { id: 4, name: 'Mojito', sales: 56, revenue: 392, trend: 15 },
  { id: 5, name: 'Tarta de queso', sales: 28, revenue: 168, trend: 5 },
];

export default function TopProducts() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Productos más vendidos
        </h3>
        <a 
          href="/admin/analytics-products" 
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Ver análisis →
        </a>
      </div>
      
      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-sm">
                  {index + 1}
                </span>
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {product.sales} unidades vendidas
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                €{product.revenue}
              </p>
              <p
                className={`text-xs font-medium ${
                  product.trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.trend > 0 ? '↑' : '↓'} {Math.abs(product.trend)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}