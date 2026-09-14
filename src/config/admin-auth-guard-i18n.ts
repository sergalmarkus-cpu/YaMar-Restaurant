import type {
  Language,
} from "@/types";

export interface AdminAuthGuardMessages {
  loading: string;
  redirecting: string;
  redirectingToLogin: string;
}

export const ADMIN_AUTH_GUARD_MESSAGES: Record<
  Language,
  AdminAuthGuardMessages
> = {
  es: {
    loading:
      "Cargando...",
    redirecting:
      "Redirigiendo...",
    redirectingToLogin:
      "Redirigiendo al inicio de sesión...",
  },

  en: {
    loading:
      "Loading...",
    redirecting:
      "Redirecting...",
    redirectingToLogin:
      "Redirecting to sign in...",
  },

  de: {
    loading:
      "Wird geladen...",
    redirecting:
      "Weiterleitung...",
    redirectingToLogin:
      "Weiterleitung zur Anmeldung...",
  },

  fr: {
    loading:
      "Chargement...",
    redirecting:
      "Redirection...",
    redirectingToLogin:
      "Redirection vers la connexion...",
  },

  it: {
    loading:
      "Caricamento...",
    redirecting:
      "Reindirizzamento...",
    redirectingToLogin:
      "Reindirizzamento all’accesso...",
  },

  pt: {
    loading:
      "A carregar...",
    redirecting:
      "A redirecionar...",
    redirectingToLogin:
      "A redirecionar para o início de sessão...",
  },
};