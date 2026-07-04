'use client';

import { useState, useEffect } from 'react';
import { 
  Grid3X3, 
  Plus, 
  QrCode, 
  Users, 
  Edit2, 
  Trash2,
  Download,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface Area {
  id: number;
  name: string;
  establishmentId: number;
  active: boolean;
}

interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  qrCode: string;
  status: string;
  active: boolean;
  areaId: number;
  area?: Area;
}

export default function TablesList() {
  const [tables, setTables] = useState<Table[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState<{ table: Table; qrImage: string } | null>(null);

  useEffect(() => {
    fetchAreas();
    fetchTables();
  }, [selectedArea]);

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas');
      const data = await response.json();
      if (data.success) {
        setAreas(data.data);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const url = selectedArea 
        ? `/api/tables?areaId=${selectedArea}`
        : '/api/tables';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setTables(data.data);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQR = async (table: Table) => {
    try {
      const response = await fetch('/api/tables/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: table.qrCode,
          tableNumber: table.tableNumber,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowQR({ table, qrImage: data.data.qrImage });
      }
    } catch (error) {
      console.error('Error generating QR:', error);
    }
  };

  const downloadQR = () => {
    if (!showQR) return;
    
    const link = document.createElement('a');
    link.href = showQR.qrImage;
    link.download = `mesa-${showQR.table.tableNumber}-qr.png`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      cleaning: 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      available: 'Disponible',
      occupied: 'Ocupada',
      reserved: 'Reservada',
      cleaning: 'Limpieza',
    };
    return labels[status as keyof typeof labels] || status;
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
          <h2 className="text-2xl font-bold text-gray-900">Mesas</h2>
          <p className="text-gray-600 mt-1">
            Gestiona las mesas de tu establecimiento
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus size={20} />
          Nueva Mesa
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={selectedArea || ''}
          onChange={(e) => setSelectedArea(e.target.value ? parseInt(e.target.value) : null)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Todas las áreas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Grid3X3 size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Mesa {table.tableNumber}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Users size={14} />
                      {table.capacity} personas
                    </p>
                  </div>
                </div>
              </div>
              
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
                {getStatusLabel(table.status)}
              </span>
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-50 flex items-center justify-between gap-2">
              <button
                onClick={() => generateQR(table)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                <QrCode size={16} />
                Ver QR
              </button>
              
              <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                <Edit2 size={16} />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tables.length === 0 && (
        <div className="text-center py-12">
          <Grid3X3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay mesas
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza creando tu primera mesa
          </p>
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Código QR - Mesa {showQR.table.tableNumber}
            </h3>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <img 
                src={showQR.qrImage} 
                alt="QR Code" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={downloadQR}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Download size={20} />
                Descargar
              </button>
              
              <button
                onClick={() => setShowQR(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}