import { 
  Euro, 
  ShoppingCart, 
  Users, 
  TrendingUp 
} from 'lucide-react';
import StatsCard from './dashboard/StatsCard';
import SalesChart from './dashboard/SalesChart';
import RecentOrders from './dashboard/RecentOrders';
import TopProducts from './dashboard/TopProducts';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Resumen general de tu negocio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Ventas Hoy"
          value="€24,350"
          icon={Euro}
          trend={{ value: 12.5, isPositive: true }}
          subtitle="vs €21,650 ayer"
        />
        
        <StatsCard
          title="Pedidos"
          value="154"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
          subtitle="vs 142 ayer"
        />
        
        <StatsCard
          title="Clientes"
          value="87"
          icon={Users}
          trend={{ value: 3.1, isPositive: false }}
          subtitle="vs 90 ayer"
        />
        
        <StatsCard
          title="Ticket Medio"
          value="€32"
          icon={TrendingUp}
          trend={{ value: 5.4, isPositive: true }}
          subtitle="vs €30.40 ayer"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado de Cocina
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Pedidos listos</span>
              </div>
              <span className="text-2xl font-bold text-green-600">6</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Preparando</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">2</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Retrasados</span>
              </div>
              <span className="text-2xl font-bold text-red-600">1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders and Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}