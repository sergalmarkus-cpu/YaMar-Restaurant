"use client";

import {
  create,
} from "zustand";

import {
  persist,
} from "zustand/middleware";

import type {
  JwtPayload,
} from "./auth.types";

export interface AdminUser {
  id: number;
  establishmentId: number;
  email: string;
  name: string;
  role: JwtPayload["role"];
}

interface AdminAuthState {
  user: AdminUser | null;

  accessToken: string | null;

  refreshToken: string | null;

  hydrated: boolean;

  setHydrated: (
    hydrated: boolean
  ) => void;

  setSession: (
    user: AdminUser,
    accessToken: string,
    refreshToken: string
  ) => void;

  setAccessToken: (
    accessToken: string
  ) => void;

  clearSession: () => void;
}

export const useAdminAuthStore =
  create<AdminAuthState>()(
    persist(
      (set) => ({
        user: null,

        accessToken: null,

        refreshToken: null,

        hydrated: false,

        setHydrated: (
          hydrated
        ) =>
          set({
            hydrated,
          }),

        setSession: (
          user,
          accessToken,
          refreshToken
        ) =>
          set({
            user,
            accessToken,
            refreshToken,
          }),

        setAccessToken: (
          accessToken
        ) =>
          set({
            accessToken,
          }),

        clearSession: () =>
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
          }),
      }),
      {
        name:
          "yamar-admin-auth",

        partialize: (
          state
        ) => ({
          user:
            state.user,

          accessToken:
            state.accessToken,

          refreshToken:
            state.refreshToken,
        }),

        onRehydrateStorage:
          () =>
          (
            state
          ) => {
            state?.setHydrated(
              true
            );
          },
      }
    )
  );