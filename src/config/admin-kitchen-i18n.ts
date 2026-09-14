import type {
  Language,
} from "@/types";

export type AdminKitchenLanguage =
  Language;

export type KitchenOrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivered";

interface AdminKitchenMessages {
  header: {
    title: string;
    subtitle: string;
    refresh: string;
  };

  status: Record<
    KitchenOrderStatus,
    string
  >;

  stats: Record<
    KitchenOrderStatus,
    string
  >;

  board: {
    loadError: string;
    updateError: string;
  };

  card: {
    table: string;
    minutes: string;
    actions: {
      pending: string;
      accepted: string;
      preparing: string;
      ready: string;
    };
  };
}

export const ADMIN_KITCHEN_MESSAGES: Record<
  AdminKitchenLanguage,
  AdminKitchenMessages
> = {
  es: {
    header: {
      title: "Cocina",
      subtitle:
        "Sistema de visualización de cocina",
      refresh: "Actualizar",
    },

    status: {
      pending: "Pendientes",
      accepted: "Aceptados",
      preparing: "Preparando",
      ready: "Listos",
      delivered: "Entregados",
    },

    stats: {
      pending: "Pendientes",
      accepted: "Aceptados",
      preparing: "Preparando",
      ready: "Listos",
      delivered: "Entregados",
    },

    board: {
      loadError:
        "No se pudieron cargar los pedidos de cocina.",
      updateError:
        "No se pudo actualizar el estado del pedido.",
    },

    card: {
      table: "Mesa",
      minutes: "min",
      actions: {
        pending: "Aceptar",
        accepted: "Preparar",
        preparing:
          "Marcar listo",
        ready: "Entregar",
      },
    },
  },

  en: {
    header: {
      title: "Kitchen",
      subtitle:
        "Kitchen Display System",
      refresh: "Refresh",
    },

    status: {
      pending: "Pending",
      accepted: "Accepted",
      preparing: "Preparing",
      ready: "Ready",
      delivered: "Delivered",
    },

    stats: {
      pending: "Pending",
      accepted: "Accepted",
      preparing: "Preparing",
      ready: "Ready",
      delivered: "Delivered",
    },

    board: {
      loadError:
        "Kitchen orders could not be loaded.",
      updateError:
        "The order status could not be updated.",
    },

    card: {
      table: "Table",
      minutes: "min",
      actions: {
        pending: "Accept",
        accepted: "Prepare",
        preparing:
          "Mark as ready",
        ready: "Deliver",
      },
    },
  },

  de: {
    header: {
      title: "Küche",
      subtitle:
        "Küchenanzeigesystem",
      refresh:
        "Aktualisieren",
    },

    status: {
      pending: "Ausstehend",
      accepted: "Angenommen",
      preparing:
        "In Zubereitung",
      ready: "Bereit",
      delivered:
        "Ausgeliefert",
    },

    stats: {
      pending: "Ausstehend",
      accepted: "Angenommen",
      preparing:
        "In Zubereitung",
      ready: "Bereit",
      delivered:
        "Ausgeliefert",
    },

    board: {
      loadError:
        "Die Küchenbestellungen konnten nicht geladen werden.",
      updateError:
        "Der Bestellstatus konnte nicht aktualisiert werden.",
    },

    card: {
      table: "Tisch",
      minutes: "Min.",
      actions: {
        pending: "Annehmen",
        accepted:
          "Zubereiten",
        preparing:
          "Als bereit markieren",
        ready: "Ausliefern",
      },
    },
  },

  fr: {
    header: {
      title: "Cuisine",
      subtitle:
        "Système d’affichage en cuisine",
      refresh:
        "Actualiser",
    },

    status: {
      pending: "En attente",
      accepted: "Acceptées",
      preparing:
        "En préparation",
      ready: "Prêtes",
      delivered: "Livrées",
    },

    stats: {
      pending: "En attente",
      accepted: "Acceptées",
      preparing:
        "En préparation",
      ready: "Prêtes",
      delivered: "Livrées",
    },

    board: {
      loadError:
        "Impossible de charger les commandes de cuisine.",
      updateError:
        "Impossible de mettre à jour le statut de la commande.",
    },

    card: {
      table: "Table",
      minutes: "min",
      actions: {
        pending: "Accepter",
        accepted: "Préparer",
        preparing:
          "Marquer comme prête",
        ready: "Livrer",
      },
    },
  },

  it: {
    header: {
      title: "Cucina",
      subtitle:
        "Sistema di visualizzazione cucina",
      refresh: "Aggiorna",
    },

    status: {
      pending: "In attesa",
      accepted: "Accettati",
      preparing:
        "In preparazione",
      ready: "Pronti",
      delivered:
        "Consegnati",
    },

    stats: {
      pending: "In attesa",
      accepted: "Accettati",
      preparing:
        "In preparazione",
      ready: "Pronti",
      delivered:
        "Consegnati",
    },

    board: {
      loadError:
        "Impossibile caricare gli ordini della cucina.",
      updateError:
        "Impossibile aggiornare lo stato dell’ordine.",
    },

    card: {
      table: "Tavolo",
      minutes: "min",
      actions: {
        pending: "Accetta",
        accepted: "Prepara",
        preparing:
          "Segna come pronto",
        ready: "Consegna",
      },
    },
  },

  pt: {
    header: {
      title: "Cozinha",
      subtitle:
        "Sistema de visualização da cozinha",
      refresh: "Atualizar",
    },

    status: {
      pending: "Pendentes",
      accepted: "Aceites",
      preparing:
        "Em preparação",
      ready: "Prontos",
      delivered:
        "Entregues",
    },

    stats: {
      pending: "Pendentes",
      accepted: "Aceites",
      preparing:
        "Em preparação",
      ready: "Prontos",
      delivered:
        "Entregues",
    },

    board: {
      loadError:
        "Não foi possível carregar os pedidos da cozinha.",
      updateError:
        "Não foi possível atualizar o estado do pedido.",
    },

    card: {
      table: "Mesa",
      minutes: "min",
      actions: {
        pending: "Aceitar",
        accepted: "Preparar",
        preparing:
          "Marcar como pronto",
        ready: "Entregar",
      },
    },
  },
};