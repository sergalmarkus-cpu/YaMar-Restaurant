"use client";

import {
  Download,
  X,
} from "lucide-react";

import {
  ADMIN_TABLES_MESSAGES,
} from "@/config/admin-tables-i18n";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

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
  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const messages =
    ADMIN_TABLES_MESSAGES[
      language
    ];

  if (
    !open
  ) {
    return null;
  }

  function downloadQR() {
    const link =
      document.createElement(
        "a"
      );

    link.href =
      qrImage;

    link.download =
      `mesa-${tableCode}.png`;

    link.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold">
              {
                messages.qrCode
              }
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {
                messages.table
              }{" "}
              {
                tableCode
              }
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            title={
              messages.close
            }
            aria-label={
              messages.close
            }
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X
              size={20}
            />
          </button>
        </div>

        <div className="p-8">
          <img
            src={
              qrImage
            }
            alt={
              messages.qrAlt
            }
            className="w-full rounded-xl border"
          />
        </div>

        <div className="flex gap-3 border-t p-6">
          <button
            type="button"
            onClick={
              downloadQR
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-white transition hover:bg-indigo-700"
          >
            <Download
              size={18}
            />

            {
              messages.download
            }
          </button>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-xl border px-5 hover:bg-gray-100"
          >
            {
              messages.close
            }
          </button>
        </div>
      </div>
    </div>
  );
}