'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

import StatsCards from './StatsCards';
import TablesGrid from './TablesGrid';
import NewTableModal from './NewTableModal';
import EditTableModal from './EditTableModal';
import QRModal from './QRModal';
import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import type { Table } from '@/types/table';

interface Area {
  id: number;
  name: string;
}

export default function TablesList() {
  const [tables, setTables] = useState<Table[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const [showNewModal, setShowNewModal] = useState(false);

  const [editingTable, setEditingTable] =
    useState<Table | null>(null);

  const [qrTable, setQrTable] =
    useState<Table | null>(null);

  const [qrImage, setQrImage] =
    useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      await Promise.all([
        loadTables(),
        loadAreas(),
      ]);
    } catch (error) {
      console.error(error);

      toast.error(
        'No se pudieron cargar los datos.'
      );
    }

    setLoading(false);
  }

  async function loadTables() {
    const res = await adminFetch("/api/tables");

    const json = await res.json();

    if (json.success) {
      setTables(json.data);
    }
  }

  async function loadAreas() {
    const res = await adminFetch("/api/areas");

    const json = await res.json();

    if (json.success) {
      setAreas(json.data);
    }
  }
  async function toggleTable(table: Table) {
    try {
      const res = await adminFetch(
  `/api/tables/${table.id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify({
      active:
        !table.active,
    }),
  }
);

      const json = await res.json();

      if (json.success) {
        toast.success(
          table.active
            ? 'Mesa desactivada.'
            : 'Mesa activada.'
        );

        loadTables();
      } else {
        toast.error('No se pudo actualizar la mesa.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar la mesa.');
    }
  }

  async function deleteTable(table: Table) {
    if (
      !window.confirm(
        `¿Eliminar definitivamente la mesa ${table.code}?`
      )
    ) {
      return;
    }

    try {
      const res = await adminFetch(
  `/api/tables/${table.id}`,
  {
    method:
      "DELETE",
  }
);

      const json = await res.json();

      if (json.success) {
        toast.success('Mesa eliminada correctamente.');
        loadTables();
      } else {
        toast.error('No se pudo eliminar la mesa.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error eliminando la mesa.');
    }
  }

  async function showQR(table: Table) {
  try {
    const res = await adminFetch(
  "/api/tables/qr",
  {
    method:
      "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body:
      JSON.stringify({
        tableId:
          table.id,
      }),
  }
);

    const json =
      await res.json();

    if (json.success) {
      setQrImage(
        json.data.qrImage
      );

      setQrTable(
        table
      );
    } else {
      toast.error(
        json.error ||
          "No se pudo generar el código QR."
      );
    }
  } catch (error) {
    console.error(
      error
    );

    toast.error(
      "Error generando el código QR."
    );
  }
}

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesSearch =
        table.code
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesArea =
        selectedArea === '' ||
        String(table.areaId ?? '') === selectedArea;

      return matchesSearch && matchesArea;
    });
  }, [tables, search, selectedArea]);

  const stats = useMemo(() => {
    return {
      total: tables.length,
      available: tables.filter(
        (t) => t.status === 'available'
      ).length,
      occupied: tables.filter(
        (t) => t.status === 'occupied'
      ).length,
      reserved: tables.filter(
        (t) => t.status === 'reserved'
      ).length,
    };
  }, [tables]);

  if (loading) {
    return (
      <div className="p-8">
        Cargando mesas...
      </div>
    );
  }
  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Gestión de Mesas
          </h1>

          <p className="text-gray-500 mt-1">
            Administra todas las mesas del establecimiento.
          </p>

        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition"
        >
          <Plus size={18} />
          Nueva mesa
        </button>

      </div>

      <StatsCards
        total={stats.total}
        available={stats.available}
        occupied={stats.occupied}
        reserved={stats.reserved}
      />

      <div className="bg-white rounded-2xl border shadow-sm p-5">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar mesa..."
              className="w-full border rounded-xl pl-10 pr-4 py-3"
            />

          </div>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="border rounded-xl px-4 py-3 lg:w-64"
          >

            <option value="">
              Todas las áreas
            </option>

            {areas.map((area) => (

              <option
                key={area.id}
                value={String(area.id)}
              >
                {area.name}
              </option>

            ))}

          </select>

        </div>

      </div>

      <TablesGrid
        tables={filteredTables}
        onShowQR={showQR}
        onEdit={setEditingTable}
        onDelete={deleteTable}
        onToggle={toggleTable}
      />

      <NewTableModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreated={loadTables}
      />

      <EditTableModal
        open={editingTable !== null}
        table={editingTable}
        onClose={() => setEditingTable(null)}
        onUpdated={() => {
          loadTables();
          setEditingTable(null);
        }}
      />

      <QRModal
        open={qrTable !== null}
        tableCode={qrTable?.code ?? ''}
        qrImage={qrImage}
        onClose={() => {
          setQrTable(null);
          setQrImage('');
        }}
      />

    </div>
  );
}