export type AdminDashboardLanguage =
  | "es"
  | "en"
  | "de"
  | "fr"
  | "it"
  | "pt";

export type AdminDashboardOrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled";

export interface AdminDashboardMessages {
  loading: string;

  restrictedTitle: string;
  restrictedDescription: string;

  loadErrorTitle: string;
  unexpectedError: string;
  retry: string;

  page: {
    title: string;

    summary: (
      establishmentName: string
    ) => string;

    refresh: string;
    refreshing: string;
  };

  stats: {
    salesToday: string;
    orders: string;
    customers: string;
    averageTicket: string;

    yesterday: (
      value: string | number
    ) => string;

    trendComparison: string;
  };

  kitchen: {
    title: string;
    description: string;
    ready: string;
    preparing: string;
    delayed: string;
  };

  salesChart: {
    title: string;
    description: string;
    sales: string;
  };

  recentOrders: {
    title: string;
    description: string;
    viewAll: string;
    empty: string;

    table: (
      tableId: number
    ) => string;

    oneProduct: string;
    manyProducts: string;

    unknownDate: string;
    now: string;

    minutesAgo: (
      minutes: number
    ) => string;

    hoursAgo: (
      hours: number
    ) => string;

    statuses: Record<
      AdminDashboardOrderStatus,
      string
    >;
  };

  topProducts: {
    title: string;
    description: string;
    viewProducts: string;
    empty: string;
    fallbackProduct: string;
    oneUnit: string;
    manyUnits: string;
  };
}

export const ADMIN_DASHBOARD_MESSAGES: Record<
  AdminDashboardLanguage,
  AdminDashboardMessages
> = {
  es: {
    loading:
      "Cargando dashboard...",

    restrictedTitle:
      "Acceso restringido",

    restrictedDescription:
      "Tu perfil no tiene permisos para consultar el dashboard general. Puedes seguir utilizando las secciones habilitadas para tu rol desde el menú.",

    loadErrorTitle:
      "No se pudo cargar el dashboard",

    unexpectedError:
      "Se produjo un error inesperado.",

    retry:
      "Reintentar",

    page: {
      title:
        "Dashboard",

      summary: (
        establishmentName
      ) =>
        `Resumen general de ${establishmentName}`,

      refresh:
        "Actualizar",

      refreshing:
        "Actualizando...",
    },

    stats: {
      salesToday:
        "Ventas hoy",

      orders:
        "Pedidos",

      customers:
        "Clientes",

      averageTicket:
        "Ticket medio",

      yesterday: (
        value
      ) =>
        `Ayer: ${value}`,

      trendComparison:
        "vs ayer",
    },

    kitchen: {
      title:
        "Estado de cocina",

      description:
        "Situación actual de los pedidos activos.",

      ready:
        "Pedidos listos",

      preparing:
        "Preparando",

      delayed:
        "Retrasados",
    },

    salesChart: {
      title:
        "Ventas de los últimos 7 días",

      description:
        "Importes efectivamente cobrados.",

      sales:
        "Ventas",
    },

    recentOrders: {
      title:
        "Pedidos recientes",

      description:
        "Últimos pedidos registrados.",

      viewAll:
        "Ver todos",

      empty:
        "Todavía no hay pedidos registrados.",

      table: (
        tableId
      ) =>
        `Mesa ${tableId}`,

      oneProduct:
        "producto",

      manyProducts:
        "productos",

      unknownDate:
        "fecha desconocida",

      now:
        "ahora",

      minutesAgo: (
        minutes
      ) =>
        `hace ${minutes} min`,

      hoursAgo: (
        hours
      ) =>
        `hace ${hours} h`,

      statuses: {
        pending:
          "Pendiente",

        accepted:
          "Aceptado",

        preparing:
          "Preparando",

        ready:
          "Listo",

        delivering:
          "Entregando",

        delivered:
          "Entregado",

        cancelled:
          "Cancelado",
      },
    },

    topProducts: {
      title:
        "Productos más vendidos",

      description:
        "Ranking de los últimos 7 días.",

      viewProducts:
        "Ver productos",

      empty:
        "Todavía no hay ventas suficientes para generar el ranking.",

      fallbackProduct:
        "Producto",

      oneUnit:
        "unidad vendida",

      manyUnits:
        "unidades vendidas",
    },
  },

  en: {
    loading:
      "Loading dashboard...",

    restrictedTitle:
      "Restricted access",

    restrictedDescription:
      "Your profile does not have permission to view the general dashboard. You can continue using the sections available for your role from the menu.",

    loadErrorTitle:
      "The dashboard could not be loaded",

    unexpectedError:
      "An unexpected error occurred.",

    retry:
      "Retry",

    page: {
      title:
        "Dashboard",

      summary: (
        establishmentName
      ) =>
        `Overview of ${establishmentName}`,

      refresh:
        "Refresh",

      refreshing:
        "Refreshing...",
    },

    stats: {
      salesToday:
        "Sales today",

      orders:
        "Orders",

      customers:
        "Customers",

      averageTicket:
        "Average ticket",

      yesterday: (
        value
      ) =>
        `Yesterday: ${value}`,

      trendComparison:
        "vs yesterday",
    },

    kitchen: {
      title:
        "Kitchen status",

      description:
        "Current status of active orders.",

      ready:
        "Ready orders",

      preparing:
        "Preparing",

      delayed:
        "Delayed",
    },

    salesChart: {
      title:
        "Sales over the last 7 days",

      description:
        "Amounts actually collected.",

      sales:
        "Sales",
    },

    recentOrders: {
      title:
        "Recent orders",

      description:
        "Latest registered orders.",

      viewAll:
        "View all",

      empty:
        "There are no registered orders yet.",

      table: (
        tableId
      ) =>
        `Table ${tableId}`,

      oneProduct:
        "item",

      manyProducts:
        "items",

      unknownDate:
        "unknown date",

      now:
        "now",

      minutesAgo: (
        minutes
      ) =>
        `${minutes} min ago`,

      hoursAgo: (
        hours
      ) =>
        `${hours} h ago`,

      statuses: {
        pending:
          "Pending",

        accepted:
          "Accepted",

        preparing:
          "Preparing",

        ready:
          "Ready",

        delivering:
          "Delivering",

        delivered:
          "Delivered",

        cancelled:
          "Cancelled",
      },
    },

    topProducts: {
      title:
        "Best-selling products",

      description:
        "Ranking for the last 7 days.",

      viewProducts:
        "View products",

      empty:
        "There are not enough sales yet to generate the ranking.",

      fallbackProduct:
        "Product",

      oneUnit:
        "unit sold",

      manyUnits:
        "units sold",
    },
  },

  de: {
    loading:
      "Dashboard wird geladen...",

    restrictedTitle:
      "Eingeschränkter Zugriff",

    restrictedDescription:
      "Dein Profil ist nicht berechtigt, das allgemeine Dashboard anzuzeigen. Du kannst die für deine Rolle verfügbaren Bereiche weiterhin über das Menü verwenden.",

    loadErrorTitle:
      "Das Dashboard konnte nicht geladen werden",

    unexpectedError:
      "Ein unerwarteter Fehler ist aufgetreten.",

    retry:
      "Erneut versuchen",

    page: {
      title:
        "Dashboard",

      summary: (
        establishmentName
      ) =>
        `Übersicht von ${establishmentName}`,

      refresh:
        "Aktualisieren",

      refreshing:
        "Wird aktualisiert...",
    },

    stats: {
      salesToday:
        "Umsatz heute",

      orders:
        "Bestellungen",

      customers:
        "Kunden",

      averageTicket:
        "Durchschnittsbon",

      yesterday: (
        value
      ) =>
        `Gestern: ${value}`,

      trendComparison:
        "vs. gestern",
    },

    kitchen: {
      title:
        "Küchenstatus",

      description:
        "Aktueller Status der aktiven Bestellungen.",

      ready:
        "Fertige Bestellungen",

      preparing:
        "In Zubereitung",

      delayed:
        "Verspätet",
    },

    salesChart: {
      title:
        "Umsatz der letzten 7 Tage",

      description:
        "Tatsächlich eingegangene Beträge.",

      sales:
        "Umsatz",
    },

    recentOrders: {
      title:
        "Letzte Bestellungen",

      description:
        "Zuletzt erfasste Bestellungen.",

      viewAll:
        "Alle anzeigen",

      empty:
        "Noch keine Bestellungen vorhanden.",

      table: (
        tableId
      ) =>
        `Tisch ${tableId}`,

      oneProduct:
        "Artikel",

      manyProducts:
        "Artikel",

      unknownDate:
        "unbekanntes Datum",

      now:
        "jetzt",

      minutesAgo: (
        minutes
      ) =>
        `vor ${minutes} Min.`,

      hoursAgo: (
        hours
      ) =>
        `vor ${hours} Std.`,

      statuses: {
        pending:
          "Ausstehend",

        accepted:
          "Angenommen",

        preparing:
          "In Zubereitung",

        ready:
          "Bereit",

        delivering:
          "In Zustellung",

        delivered:
          "Ausgeliefert",

        cancelled:
          "Storniert",
      },
    },

    topProducts: {
      title:
        "Meistverkaufte Produkte",

      description:
        "Rangliste der letzten 7 Tage.",

      viewProducts:
        "Produkte anzeigen",

      empty:
        "Es liegen noch nicht genügend Verkäufe für eine Rangliste vor.",

      fallbackProduct:
        "Produkt",

      oneUnit:
        "verkaufte Einheit",

      manyUnits:
        "verkaufte Einheiten",
    },
  },

  fr: {
    loading:
      "Chargement du tableau de bord...",

    restrictedTitle:
      "Accès restreint",

    restrictedDescription:
      "Votre profil n'est pas autorisé à consulter le tableau de bord général. Vous pouvez continuer à utiliser les sections accessibles à votre rôle depuis le menu.",

    loadErrorTitle:
      "Impossible de charger le tableau de bord",

    unexpectedError:
      "Une erreur inattendue s'est produite.",

    retry:
      "Réessayer",

    page: {
      title:
        "Tableau de bord",

      summary: (
        establishmentName
      ) =>
        `Vue d’ensemble de ${establishmentName}`,

      refresh:
        "Actualiser",

      refreshing:
        "Actualisation...",
    },

    stats: {
      salesToday:
        "Ventes aujourd’hui",

      orders:
        "Commandes",

      customers:
        "Clients",

      averageTicket:
        "Panier moyen",

      yesterday: (
        value
      ) =>
        `Hier : ${value}`,

      trendComparison:
        "vs hier",
    },

    kitchen: {
      title:
        "État de la cuisine",

      description:
        "Situation actuelle des commandes actives.",

      ready:
        "Commandes prêtes",

      preparing:
        "En préparation",

      delayed:
        "En retard",
    },

    salesChart: {
      title:
        "Ventes des 7 derniers jours",

      description:
        "Montants effectivement encaissés.",

      sales:
        "Ventes",
    },

    recentOrders: {
      title:
        "Commandes récentes",

      description:
        "Dernières commandes enregistrées.",

      viewAll:
        "Tout afficher",

      empty:
        "Aucune commande n’a encore été enregistrée.",

      table: (
        tableId
      ) =>
        `Table ${tableId}`,

      oneProduct:
        "article",

      manyProducts:
        "articles",

      unknownDate:
        "date inconnue",

      now:
        "à l’instant",

      minutesAgo: (
        minutes
      ) =>
        `il y a ${minutes} min`,

      hoursAgo: (
        hours
      ) =>
        `il y a ${hours} h`,

      statuses: {
        pending:
          "En attente",

        accepted:
          "Acceptée",

        preparing:
          "En préparation",

        ready:
          "Prête",

        delivering:
          "En livraison",

        delivered:
          "Livrée",

        cancelled:
          "Annulée",
      },
    },

    topProducts: {
      title:
        "Produits les plus vendus",

      description:
        "Classement des 7 derniers jours.",

      viewProducts:
        "Voir les produits",

      empty:
        "Les ventes sont encore insuffisantes pour générer le classement.",

      fallbackProduct:
        "Produit",

      oneUnit:
        "unité vendue",

      manyUnits:
        "unités vendues",
    },
  },

  it: {
    loading:
      "Caricamento dashboard...",

    restrictedTitle:
      "Accesso limitato",

    restrictedDescription:
      "Il tuo profilo non dispone dei permessi per visualizzare il dashboard generale. Puoi continuare a utilizzare dal menu le sezioni disponibili per il tuo ruolo.",

    loadErrorTitle:
      "Impossibile caricare il dashboard",

    unexpectedError:
      "Si è verificato un errore imprevisto.",

    retry:
      "Riprova",

    page: {
      title:
        "Dashboard",

      summary: (
        establishmentName
      ) =>
        `Panoramica di ${establishmentName}`,

      refresh:
        "Aggiorna",

      refreshing:
        "Aggiornamento...",
    },

    stats: {
      salesToday:
        "Vendite di oggi",

      orders:
        "Ordini",

      customers:
        "Clienti",

      averageTicket:
        "Scontrino medio",

      yesterday: (
        value
      ) =>
        `Ieri: ${value}`,

      trendComparison:
        "vs ieri",
    },

    kitchen: {
      title:
        "Stato cucina",

      description:
        "Situazione attuale degli ordini attivi.",

      ready:
        "Ordini pronti",

      preparing:
        "In preparazione",

      delayed:
        "In ritardo",
    },

    salesChart: {
      title:
        "Vendite degli ultimi 7 giorni",

      description:
        "Importi effettivamente incassati.",

      sales:
        "Vendite",
    },

    recentOrders: {
      title:
        "Ordini recenti",

      description:
        "Ultimi ordini registrati.",

      viewAll:
        "Vedi tutti",

      empty:
        "Non ci sono ancora ordini registrati.",

      table: (
        tableId
      ) =>
        `Tavolo ${tableId}`,

      oneProduct:
        "articolo",

      manyProducts:
        "articoli",

      unknownDate:
        "data sconosciuta",

      now:
        "adesso",

      minutesAgo: (
        minutes
      ) =>
        `${minutes} min fa`,

      hoursAgo: (
        hours
      ) =>
        `${hours} h fa`,

      statuses: {
        pending:
          "In attesa",

        accepted:
          "Accettato",

        preparing:
          "In preparazione",

        ready:
          "Pronto",

        delivering:
          "In consegna",

        delivered:
          "Consegnato",

        cancelled:
          "Annullato",
      },
    },

    topProducts: {
      title:
        "Prodotti più venduti",

      description:
        "Classifica degli ultimi 7 giorni.",

      viewProducts:
        "Vedi prodotti",

      empty:
        "Non ci sono ancora vendite sufficienti per generare la classifica.",

      fallbackProduct:
        "Prodotto",

      oneUnit:
        "unità venduta",

      manyUnits:
        "unità vendute",
    },
  },

  pt: {
    loading:
      "A carregar o painel...",

    restrictedTitle:
      "Acesso restrito",

    restrictedDescription:
      "O seu perfil não tem permissão para consultar o painel geral. Pode continuar a utilizar através do menu as secções disponíveis para a sua função.",

    loadErrorTitle:
      "Não foi possível carregar o painel",

    unexpectedError:
      "Ocorreu um erro inesperado.",

    retry:
      "Tentar novamente",

    page: {
      title:
        "Painel",

      summary: (
        establishmentName
      ) =>
        `Visão geral de ${establishmentName}`,

      refresh:
        "Atualizar",

      refreshing:
        "A atualizar...",
    },

    stats: {
      salesToday:
        "Vendas hoje",

      orders:
        "Pedidos",

      customers:
        "Clientes",

      averageTicket:
        "Ticket médio",

      yesterday: (
        value
      ) =>
        `Ontem: ${value}`,

      trendComparison:
        "vs ontem",
    },

    kitchen: {
      title:
        "Estado da cozinha",

      description:
        "Situação atual dos pedidos ativos.",

      ready:
        "Pedidos prontos",

      preparing:
        "Em preparação",

      delayed:
        "Atrasados",
    },

    salesChart: {
      title:
        "Vendas dos últimos 7 dias",

      description:
        "Montantes efetivamente recebidos.",

      sales:
        "Vendas",
    },

    recentOrders: {
      title:
        "Pedidos recentes",

      description:
        "Últimos pedidos registados.",

      viewAll:
        "Ver todos",

      empty:
        "Ainda não existem pedidos registados.",

      table: (
        tableId
      ) =>
        `Mesa ${tableId}`,

      oneProduct:
        "item",

      manyProducts:
        "itens",

      unknownDate:
        "data desconhecida",

      now:
        "agora",

      minutesAgo: (
        minutes
      ) =>
        `há ${minutes} min`,

      hoursAgo: (
        hours
      ) =>
        `há ${hours} h`,

      statuses: {
        pending:
          "Pendente",

        accepted:
          "Aceite",

        preparing:
          "Em preparação",

        ready:
          "Pronto",

        delivering:
          "Em entrega",

        delivered:
          "Entregue",

        cancelled:
          "Cancelado",
      },
    },

    topProducts: {
      title:
        "Produtos mais vendidos",

      description:
        "Ranking dos últimos 7 dias.",

      viewProducts:
        "Ver produtos",

      empty:
        "Ainda não existem vendas suficientes para gerar o ranking.",

      fallbackProduct:
        "Produto",

      oneUnit:
        "unidade vendida",

      manyUnits:
        "unidades vendidas",
    },
  },
};