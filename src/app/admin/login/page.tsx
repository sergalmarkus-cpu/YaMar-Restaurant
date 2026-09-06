"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useAdminAuthStore,
} from "@/auth/admin-auth.store";

export default function AdminLoginPage() {
  const router =
    useRouter();

  const setSession =
    useAdminAuthStore(
      (
        state
      ) =>
        state.setSession
    );

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    setLoading(
      true
    );

    try {
      const response =
        await fetch(
          "/api/auth/login",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email:
                  email.trim(),

                password,
              }),
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            "No se pudo iniciar sesión."
        );

        return;
      }

      const {
        user,
        accessToken,
        refreshToken,
      } =
        json.data;

      if (
        !user ||
        typeof accessToken !==
          "string" ||
        typeof refreshToken !==
          "string"
      ) {
        setError(
          "La respuesta de autenticación no es válida."
        );

        return;
      }

      setSession(
        user,
        accessToken,
        refreshToken
      );

      router.replace(
        "/admin"
      );
    } catch (
      loginError
    ) {
      console.error(
        "Error during admin login:",
        loginError
      );

      setError(
        "No se pudo conectar con el servidor."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            YaMar
          </h1>

          <p className="mt-2 text-gray-500">
            Panel de administración
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(
                event
              ) =>
                setEmail(
                  event.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@ejemplo.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={
                password
              }
              onChange={(
                event
              ) =>
                setPassword(
                  event.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium px-4 py-3 transition"
          >
            {loading
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}