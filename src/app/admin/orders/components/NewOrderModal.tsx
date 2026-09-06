'use client';

import { useEffect, useState } from 'react';

interface Table {
  id: number;
  number: string;
}

interface Product {
  id: number;
  name: string | { es?: string; en?: string; de?: string };
  price: number;
}

export default function NewOrderModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [tables, setTables] = useState<Table[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [tableId, setTableId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    loadData();
  }, [open]);

  async function loadData() {
    const tablesRes = await fetch('/api/tables');
    const tablesJson = await tablesRes.json();

    if (tablesJson.success) {
      setTables(tablesJson.data);
    }

    const productsRes = await fetch('/api/products');
    const productsJson = await productsRes.json();

    if (productsJson.success) {
      setProducts(productsJson.data);
    }
  }

  if (!open) return null;

  const selectedProduct = products.find(
    (p) => p.id === Number(productId)
  );

  const unitPrice = selectedProduct
    ? Number(selectedProduct.price)
    : 0;

  const subtotal = unitPrice * quantity;

  async function createOrder() {
    setSaving(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          tableId: Number(tableId),
          notes,

          items: [
            {
              productId: Number(productId),
              quantity,
            },
          ],
        }),
      });

      const json = await response.json();

      if (json.success) {
        onCreated();
      } else {
        alert(json.error);
      }
    } catch (err) {
      console.error(err);
    }

    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-full max-w-xl p-6">

        <h2 className="text-xl font-bold mb-6">
          Nuevo pedido
        </h2>

        <div className="space-y-5">

          <div>

            <label className="block mb-2 font-medium">
              Mesa
            </label>

            <select
              className="w-full border rounded-lg p-2"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            >
              <option value="">
                Seleccionar mesa
              </option>

              {tables.map((table) => (
                <option
                  key={table.id}
                  value={table.id}
                >
                  Mesa {table.number}
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Producto
            </label>

            <select
              className="w-full border rounded-lg p-2"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">
                Seleccionar producto
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {typeof product.name === 'string'
                    ? product.name
                    : product.name.es ??
                      product.name.en ??
                      product.name.de}
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Cantidad
            </label>

            <input
              type="number"
              min={1}
              className="w-full border rounded-lg p-2"
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Observaciones
            </label>

            <textarea
              rows={3}
              className="w-full border rounded-lg p-2"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />

          </div>

          <div className="bg-gray-100 rounded-lg p-4">

            <div className="flex justify-between">

              <span>Total</span>

              <span className="font-bold">
                € {subtotal.toFixed(2)}
              </span>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancelar
          </button>

          <button
            onClick={createOrder}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white"
          >
            {saving
              ? 'Creando...'
              : 'Crear pedido'}
          </button>

        </div>

      </div>

    </div>
  );
}