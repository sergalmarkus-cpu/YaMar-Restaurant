'use client';

import { useEffect, useState } from 'react';

interface Area {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewTableModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [code, setCode] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [areaId, setAreaId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    loadAreas();
  }, [open]);

  async function loadAreas() {
    try {
      const res = await fetch('/api/areas');

      if (!res.ok) {
        throw new Error('No se pudieron cargar las áreas.');
      }

      const json = await res.json();

      if (json.success) {
        setAreas(json.data);
      }
    } catch (error) {
      console.error('Error cargando áreas:', error);
    }
  }

  async function saveTable() {
    const normalizedCode = code.trim();

    if (!normalizedCode) {
      alert('Introduce el código de la mesa.');
      return;
    }

    if (capacity < 1) {
      alert('La capacidad debe ser de al menos 1 persona.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        establishmentId: 1,
        areaId: areaId ? Number(areaId) : null,
        code: normalizedCode,
        capacity,
        active: true,
      };

      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        console.error('Error creando mesa:', json);

        alert(
          json.message ?? 'No se pudo crear la mesa.'
        );

        return;
      }

      setCode('');
      setCapacity(4);
      setAreaId('');

      onCreated();
      onClose();
    } catch (error) {
      console.error('Error creando mesa:', error);

      alert('Se produjo un error al crear la mesa.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            Nueva mesa
          </h2>
        </div>

        <div className="space-y-5 p-6">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Código
            </label>

            <input
              value={code}
              onChange={(event) =>
                setCode(event.target.value)
              }
              className="w-full rounded-xl border p-3"
              placeholder="Ej.: A12"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Área
            </label>

            <select
              value={areaId}
              onChange={(event) =>
                setAreaId(event.target.value)
              }
              className="w-full rounded-xl border p-3"
              disabled={saving}
            >
              <option value="">
                Sin área
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

          <div>
            <label className="mb-2 block text-sm font-medium">
              Capacidad
            </label>

            <input
              type="number"
              min={1}
              value={capacity}
              onChange={(event) =>
                setCapacity(
                  Math.max(
                    1,
                    Number(event.target.value)
                  )
                )
              }
              className="w-full rounded-xl border p-3"
              disabled={saving}
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border px-5 py-3 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={saveTable}
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>

        </div>

      </div>
    </div>
  );
}