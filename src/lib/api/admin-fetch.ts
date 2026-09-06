"use client";

import {
  useAdminAuthStore,
} from "@/auth/admin-auth.store";

interface PersistedAdminAuthState {
  state?: {
    accessToken?: string | null;
    refreshToken?: string | null;
  };
}

let refreshPromise:
  Promise<string | null> | null =
  null;

function getAuthState() {
  return useAdminAuthStore.getState();
}

/*
 * Recupera como respaldo la sesión persistida.
 *
 * Esto evita una carrera durante la hidratación
 * inicial de Zustand.
 */
function getPersistedAuth() {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }

  try {
    const raw =
      window.localStorage.getItem(
        "yamar-admin-auth"
      );

    if (!raw) {
      return {
        accessToken: null,
        refreshToken: null,
      };
    }

    const parsed =
      JSON.parse(
        raw
      ) as PersistedAdminAuthState;

    return {
      accessToken:
        typeof parsed.state
          ?.accessToken ===
        "string"
          ? parsed.state
              .accessToken
          : null,

      refreshToken:
        typeof parsed.state
          ?.refreshToken ===
        "string"
          ? parsed.state
              .refreshToken
          : null,
    };
  } catch (
    error
  ) {
    console.error(
      "Error reading persisted admin authentication:",
      error
    );

    return {
      accessToken: null,
      refreshToken: null,
    };
  }
}

function getAccessToken() {
  const {
    accessToken,
  } =
    getAuthState();

  if (accessToken) {
    return accessToken;
  }

  return getPersistedAuth()
    .accessToken;
}

function getRefreshToken() {
  const {
    refreshToken,
  } =
    getAuthState();

  if (refreshToken) {
    return refreshToken;
  }

  return getPersistedAuth()
    .refreshToken;
}

function clearAuthentication() {
  getAuthState()
    .clearSession();

  /*
   * clearSession() normalmente actualiza
   * también la persistencia de Zustand.
   *
   * Eliminamos explícitamente el almacenamiento
   * como protección adicional.
   */
  if (
    typeof window !==
    "undefined"
  ) {
    window.localStorage.removeItem(
      "yamar-admin-auth"
    );
  }
}

async function refreshAccessToken():
Promise<string | null> {
  /*
   * Si varias peticiones reciben 401
   * simultáneamente, hacemos un solo refresh.
   */
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise =
    (async () => {
      const refreshToken =
        getRefreshToken();

      if (!refreshToken) {
        clearAuthentication();

        return null;
      }

      try {
        const response =
          await fetch(
            "/api/auth/refresh",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  refreshToken,
                }),
            }
          );

        if (!response.ok) {
          clearAuthentication();

          return null;
        }

        const json =
          await response.json();

        const newAccessToken =
          json?.data
            ?.accessToken;

        if (
          typeof newAccessToken !==
            "string" ||
          !newAccessToken
        ) {
          clearAuthentication();

          return null;
        }

        /*
         * Guardamos el nuevo access token
         * en Zustand. El middleware persist
         * actualizará también localStorage.
         */
        getAuthState()
          .setAccessToken(
            newAccessToken
          );

        return newAccessToken;
      } catch (
        error
      ) {
        console.error(
          "Error refreshing admin access token:",
          error
        );

        clearAuthentication();

        return null;
      }
    })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise =
      null;
  }
}

function buildHeaders(
  headers:
    HeadersInit | undefined,
  accessToken:
    string | null
) {
  const result =
    new Headers(
      headers
    );

  if (accessToken) {
    result.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }

  return result;
}

export async function adminFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  /*
   * Usamos primero Zustand y, si todavía
   * no está hidratado, localStorage.
   */
  const accessToken =
    getAccessToken();

  let response =
    await fetch(
      input,
      {
        ...init,

        headers:
          buildHeaders(
            init.headers,
            accessToken
          ),
      }
    );

  /*
   * No todo 401 significa necesariamente
   * que tengamos que expulsar al usuario.
   *
   * Primero intentamos renovar.
   */
  if (
    response.status !==
    401
  ) {
    return response;
  }

  const newAccessToken =
    await refreshAccessToken();

  if (!newAccessToken) {
    return response;
  }

  /*
   * Repetimos exactamente una vez.
   */
  response =
    await fetch(
      input,
      {
        ...init,

        headers:
          buildHeaders(
            init.headers,
            newAccessToken
          ),
      }
    );

  if (
    response.status ===
    401
  ) {
    clearAuthentication();
  }

  return response;
}