'use client';

import { useState, useEffect } from 'react';
import { Menu, Plus, Edit2, Trash2, Calendar, Clock } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  active: boolean;
  schedule: any;
  createdAt: Date;
}

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menus');
      const data = await response.json();
      
      if (data.success) {
        setMenus(data.data);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cartas / Menús</h2>
          <p className="text-gray-600 mt-1">
            Gestiona los menús disponibles (Desayuno, Comida, Cena)
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus size={20} />
          Nueva Carta
        </button>
      </div>

      {/* Empty State */}
      {menus.length === 0 && (
        <div className="text-center py-12">
          <Menu size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay cartias creadas
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza creando tu primera carta
          </p>
        </div>
      )}

      {/* Cards */}
      {menus.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Menu size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {menu.name}
                      </h3>
                      <p className="text-sm text-gray-500">/{menu.slug}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {/* TODO: Toggle activo */}}
                    className={`p-2 ${menu.active ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {menu.active ? '✅' : '❌'}
                  </button>
                </div>
                
                {menu.description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {menu.description}
                  </p>
                )}
              </div>

              {/* Schedule Info */}
              <div className="px-6 py-4 bg-gray-50 space-y-2">
                {menu.schedule?.enabled && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>Horario: {menu.schedule.hours.start} - {menu.schedule.hours.end}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Activo</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Ver productos →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}