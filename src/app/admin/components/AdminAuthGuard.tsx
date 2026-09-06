"use client";

import {
  useEffect,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useAdminAuthStore,
} from "@/auth/admin-auth.store";

export default function AdminAuthGuard({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const {
    user,
    refreshToken,
    hydrated,
  } =
    useAdminAuthStore();

  const isLoginPage =
    pathname ===
    "/admin/login";

  useEffect(
    () => {
      if (!hydrated) {
        return;
      }

      /*
       * Sin usuario o refresh token no hay
       * sesión administrativa recuperable.
       */
      if (
        !user ||
        !refreshToken
      ) {
        if (
          !isLoginPage
        ) {
          router.replace(
            "/admin/login"
          );
        }

        return;
      }

      /*
       * Si ya estamos autenticados y entramos
       * en /admin/login, volvemos al dashboard.
       */
      if (
        isLoginPage
      ) {
        router.replace(
          "/admin"
        );
      }
    },
    [
      hydrated,
      user,
      refreshToken,
      isLoginPage,
      router,
    ]
  );

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Cargando...
        </p>
      </div>
    );
  }

  if (isLoginPage) {
    if (
      user &&
      refreshToken
    ) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">
            Redirigiendo...
          </p>
        </div>
      );
    }

    return (
      <>
        {children}
      </>
    );
  }

  if (
    !user ||
    !refreshToken
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Redirigiendo al inicio de sesión...
        </p>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}