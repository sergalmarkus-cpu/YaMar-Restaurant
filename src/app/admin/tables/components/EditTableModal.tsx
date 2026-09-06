'use client';

import { useEffect, useState } from 'react';
import type { Table } from '@/types/table';

interface Area {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  table: Table | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditTableModal({
  open,
  table,
  onClose,
  onUpdated,
}: Props) {

  const [areas, setAreas] = useState<Area[]>([]);

  const [code, setCode] = useState('');

  const [capacity, setCapacity] = useState<number | null>(4);

  const [areaId, setAreaId] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {

    if (!open || !table) return;

    setCode(table.code);

    setCapacity(table.capacity ?? 4);

    setAreaId(
      table.areaId
        ? table.areaId.toString()
        : ''
    );

    loadAreas();

  }, [open, table]);

  async function loadAreas() {

    try {

      const res = await fetch('/api/areas');

      const json = await res.json();

      if (json.success) {
        setAreas(json.data);
      }

    } catch (err) {

      console.error(err);

    }

  }

  async function saveChanges() {

    if (!table) return;

    setSaving(true);

    try {

      const res = await fetch(`/api/tables/${table.id}`, {

        method: 'PUT',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          code,

          capacity,

          areaId: areaId
            ? Number(areaId)
            : null,

        }),

      });

      const json = await res.json();

      if (json.success) {

        onUpdated();

        onClose();

      }

    } catch (err) {

      console.error(err);

    }

    setSaving(false);

  }

  if (!open || !table) return null;

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

        <div className="border-b p-6">

          <h2 className="text-xl font-bold">

            Editar Mesa

          </h2>

        </div>

        <div className="p-6 space-y-5">

          <div>

            <label className="block text-sm mb-2">

              Código

            </label>

            <input
              value={code}
              onChange={(e)=>setCode(e.target.value)}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block text-sm mb-2">

              Área

            </label>

            <select
              value={areaId}
              onChange={(e)=>setAreaId(e.target.value)}
              className="w-full border rounded-xl p-3"
            >

              <option value="">

                Sin área

              </option>

              {areas.map(area=>(

                <option
                  key={area.id}
                  value={area.id}
                >

                  {area.name}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block text-sm mb-2">

              Capacidad

            </label>

            <input
              type="number"
              value={capacity ?? ''}
              onChange={(e)=>setCapacity(Number(e.target.value))}
              className="w-full border rounded-xl p-3"
            />

          </div>

        </div>

        <div className="border-t p-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-3 border rounded-xl"
          >

            Cancelar

          </button>

          <button
            disabled={saving}
            onClick={saveChanges}
            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >

            {saving
              ? 'Guardando...'
              : 'Guardar cambios'}

          </button>

        </div>

      </div>

    </div>

  );

}