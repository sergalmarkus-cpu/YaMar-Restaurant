'use client';

import {
  Building2,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';

import {
  useAdminAuthStore,
} from '@/auth/admin-auth.store';

function getRoleLabel(
  role: string | undefined
) {
  switch (role) {
    case 'admin':
      return 'Administrador';

    case 'manager':
      return 'Gerente';

    case 'waiter':
      return 'Camarero';

    case 'kitchen':
      return 'Cocina';

    case 'bar':
      return 'Bar';

    case 'cashier':
      return 'Caja';

    default:
      return 'Usuario';
  }
}

export default function ProfilePage() {
  const user =
    useAdminAuthStore(
      (state) => state.user
    );

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">
          No se ha podido cargar la información del usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Mi perfil
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Información de tu cuenta administrativa.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <User size={26} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h2>

              <p className="text-sm text-gray-500">
                {getRoleLabel(
                  user.role
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <Mail size={18} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Correo electrónico
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <ShieldCheck
                size={18}
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Rol
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {getRoleLabel(
                  user.role
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <Building2
                size={18}
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Establecimiento
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                #{user.establishmentId}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}