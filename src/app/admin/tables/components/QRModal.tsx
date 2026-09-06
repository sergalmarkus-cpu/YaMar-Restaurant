'use client';

import { Download, X } from 'lucide-react';

interface Props {
  open: boolean;
  tableCode: string;
  qrImage: string;
  onClose: () => void;
}

export default function QRModal({
  open,
  tableCode,
  qrImage,
  onClose,
}: Props) {

  if (!open) return null;

  function downloadQR() {

    const link = document.createElement('a');

    link.href = qrImage;
    link.download = `mesa-${tableCode}.png`;

    link.click();

  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        <div className="flex justify-between items-center border-b p-6">

          <div>

            <h2 className="text-xl font-bold">
              Código QR
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Mesa {tableCode}
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        <div className="p-8">

          <img
            src={qrImage}
            alt="Código QR"
            className="w-full rounded-xl border"
          />

        </div>

        <div className="border-t p-6 flex gap-3">

          <button
            onClick={downloadQR}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition"
          >

            <Download size={18} />

            Descargar

          </button>

          <button
            onClick={onClose}
            className="px-5 border rounded-xl hover:bg-gray-100 transition"
          >
            Cerrar
          </button>

        </div>

      </div>

    </div>

  );

}