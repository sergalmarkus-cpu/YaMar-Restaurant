'use client';

import { ChefHat, RefreshCw } from "lucide-react";

export default function KitchenHeader() {

  return (

    <div className="bg-white rounded-xl border shadow-sm p-6">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="bg-orange-100 p-3 rounded-xl">

            <ChefHat className="w-8 h-8 text-orange-600"/>

          </div>

          <div>

            <h1 className="text-3xl font-bold">
              Cocina
            </h1>

            <p className="text-gray-500">
              Kitchen Display System
            </p>

          </div>

        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() => location.reload()}
        >
          <RefreshCw size={18} />
          Actualizar
        </button>

      </div>

    </div>

  );

}