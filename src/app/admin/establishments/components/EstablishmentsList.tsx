'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, MapPin, Phone, Mail, ToggleLeft, ToggleRight } from 'lucide-react';

interface Establishment {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  phone: string;
  email: string;
  latitude: string | null;
  longitude: string | null;
  currency: string;
  timezone: string;
  active: boolean;
  createdAt: Date;
}

export default function EstablishmentsList() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    try {
      const response = await fetch('/api/establishments');
      const data = await response.json();
      
      if (data.success) {
        setEstablishments(data.data);
      }
    } catch (error) {
      console.error('Error fetching establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/establishments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });
      
      if (response.ok) {
        fetchEstablishments();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const deleteEstablishment = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este establecimiento?')) return;
    
    try {
      const response = await fetch(`/api/establishments/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchEstablishments();
      }
    } catch (error) {
      console.error('Error deleting establishment:', error);
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
          <h2 className="text-2xl font-bold text-gray-900">Establecimientos</h2>
          <p className="text-gray-600 mt-1">
            Gestiona tus restaurantes y hoteles
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Nuevo Establecimiento
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {establishments.map((establishment) => (
          <div
            key={establishment.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Building2 size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {establishment.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      /{establishment.slug}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleActive(establishment.id, establishment.active)}
                  className="p-1"
                >
                  {establishment.active ? (
                    <ToggleRight size={24} className="text-green-600" />
                  ) : (
                    <ToggleLeft size={24} className="text-gray-400" />
                  )}
                </button>
              </div>
              
              {establishment.description && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {establishment.description}
                </p>
              )}
            </div>

            {/* Info */}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span className="line-clamp-1">{establishment.address}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                <span>{establishment.phone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                <span className="line-clamp-1">{establishment.email}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {establishment.currency}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {establishment.timezone}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {/* TODO: Abrir modal de edición */}}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                
                <button
                  onClick={() => deleteEstablishment(establishment.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {establishments.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay establecimientos
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza creando tu primer establecimiento
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Crear Establecimiento
          </button>
        </div>
      )}
    </div>
  );
}