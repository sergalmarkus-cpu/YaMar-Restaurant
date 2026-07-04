'use client';

import { useState } from 'react';
import { Search, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';

interface TopbarProps {
  sidebarCollapsed: boolean;
}

export default function Topbar({ sidebarCollapsed }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, text: 'Nuevo pedido en Mesa 12', time: 'Hace 2 min', type: 'order' },
    { id: 2, text: 'Pedido #1545 completado', time: 'Hace 5 min', type: 'success' },
    { id: 3, text: 'Nueva valoración de cliente', time: 'Hace 10 min', type: 'rating' },
  ];

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-30 transition-all duration-300
        ${sidebarCollapsed ? 'left-16' : 'left-64'}
      `}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos, productos, mesas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer"
                    >
                      <p className="text-sm text-gray-900">{notif.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-gray-50 text-center">
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-indigo-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">Administrador</p>
                <p className="text-xs text-gray-500">admin@yam ar.com</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="py-1">
                  <button className="w-full px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50">
                    <User size={16} />
                    <span className="text-sm">Mi perfil</span>
                  </button>
                  <button className="w-full px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50">
                    <Settings size={16} />
                    <span className="text-sm">Configuración</span>
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50">
                    <LogOut size={16} />
                    <span className="text-sm">Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}