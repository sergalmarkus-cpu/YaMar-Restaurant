import type {
  Language,
} from "@/types";

export interface AdminEstablishmentsMessages {
  loading: string;
  title: string;
  subtitle: string;
  empty: string;
  loadError: string;
  updateError: string;
  activate: string;
  deactivate: string;
}

export const ADMIN_ESTABLISHMENTS_MESSAGES: Record<
  Language,
  AdminEstablishmentsMessages
> = {
  es: {
    loading: "Cargando establecimiento...",
    title: "Establecimiento",
    subtitle: "Gestión del establecimiento actual",
    empty: "No hay ningún establecimiento disponible.",
    loadError: "No se pudo cargar el establecimiento.",
    updateError: "No se pudo actualizar el establecimiento.",
    activate: "Activar establecimiento",
    deactivate: "Desactivar establecimiento",
  },

  en: {
    loading: "Loading establishment...",
    title: "Establishment",
    subtitle: "Manage the current establishment",
    empty: "No establishment is available.",
    loadError: "The establishment could not be loaded.",
    updateError: "The establishment could not be updated.",
    activate: "Activate establishment",
    deactivate: "Deactivate establishment",
  },

  de: {
    loading: "Betrieb wird geladen...",
    title: "Betrieb",
    subtitle: "Verwaltung des aktuellen Betriebs",
    empty: "Kein Betrieb verfügbar.",
    loadError: "Der Betrieb konnte nicht geladen werden.",
    updateError: "Der Betrieb konnte nicht aktualisiert werden.",
    activate: "Betrieb aktivieren",
    deactivate: "Betrieb deaktivieren",
  },

  fr: {
    loading: "Chargement de l’établissement...",
    title: "Établissement",
    subtitle: "Gestion de l’établissement actuel",
    empty: "Aucun établissement disponible.",
    loadError: "Impossible de charger l’établissement.",
    updateError: "Impossible de mettre à jour l’établissement.",
    activate: "Activer l’établissement",
    deactivate: "Désactiver l’établissement",
  },

  it: {
    loading: "Caricamento della struttura...",
    title: "Struttura",
    subtitle: "Gestione della struttura attuale",
    empty: "Nessuna struttura disponibile.",
    loadError: "Impossibile caricare la struttura.",
    updateError: "Impossibile aggiornare la struttura.",
    activate: "Attiva struttura",
    deactivate: "Disattiva struttura",
  },

  pt: {
    loading: "A carregar estabelecimento...",
    title: "Estabelecimento",
    subtitle: "Gestão do estabelecimento atual",
    empty: "Nenhum estabelecimento disponível.",
    loadError: "Não foi possível carregar o estabelecimento.",
    updateError: "Não foi possível atualizar o estabelecimento.",
    activate: "Ativar estabelecimento",
    deactivate: "Desativar estabelecimento",
  },
};