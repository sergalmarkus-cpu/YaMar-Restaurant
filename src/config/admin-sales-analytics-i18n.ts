import type {
  Language,
} from "@/types";

type SalesAnalyticsMessages = {
  loading: string;
  loadError: string;

  page: {
    title: string;
    subtitle: string;
    refresh: string;
    refreshing: string;
    days: (
      value: number
    ) => string;
  };

  period: {
    last7: string;
    last30: string;
    last90: string;
    timezone: string;
  };

  metrics: {
    totalSales: string;
    totalSalesSubtitle: string;

    completedPayments: string;
    completedPaymentsSubtitle: string;

    orders: string;
    ordersSubtitle: string;

    payingCustomers: string;
    payingCustomersSubtitle: string;

    averageTicket: string;
    averageTicketSubtitle: string;

    dailyAverage: string;
    dailyAverageSubtitle: string;
  };

  chart: {
    title: string;
    subtitle: string;
    sales: string;
  };

  bestDay: {
    title: string;
    subtitle: string;
    empty: string;
  };

  daily: {
    title: string;
    subtitle: string;
    date: string;
    sales: string;
    payments: string;
    orders: string;
    customers: string;
  };
};

export const ADMIN_SALES_ANALYTICS_MESSAGES: Record<
  Language,
  SalesAnalyticsMessages
> = {
  es: {
    loading:
      "Cargando analíticas...",
    loadError:
      "No se pudieron cargar las analíticas de ventas.",

    page: {
      title:
        "Analíticas de ventas",
      subtitle:
        "Consulta la evolución de ventas, pedidos y clientes del establecimiento.",
      refresh:
        "Actualizar",
      refreshing:
        "Actualizando...",
      days: (
        value
      ) =>
        `${value} días`,
    },

    period: {
      last7:
        "Últimos 7 días",
      last30:
        "Últimos 30 días",
      last90:
        "Últimos 90 días",
      timezone:
        "Zona horaria",
    },

    metrics: {
      totalSales:
        "Ventas totales",
      totalSalesSubtitle:
        "Pagos efectivamente cobrados",

      completedPayments:
        "Pagos completados",
      completedPaymentsSubtitle:
        "Transacciones con estado pagado",

      orders:
        "Pedidos",
      ordersSubtitle:
        "Pedidos no cancelados",

      payingCustomers:
        "Clientes pagadores",
      payingCustomersSubtitle:
        "Sesiones con al menos un pago",

      averageTicket:
        "Ticket medio",
      averageTicketSubtitle:
        "Ventas por cliente pagador",

      dailyAverage:
        "Media diaria",
      dailyAverageSubtitle:
        "Ventas medias por día del período",
    },

    chart: {
      title:
        "Evolución de ventas",
      subtitle:
        "Importe cobrado por día durante el período seleccionado.",
      sales:
        "Ventas",
    },

    bestDay: {
      title:
        "Mejor día",
      subtitle:
        "Día con mayor facturación dentro del período.",
      empty:
        "Todavía no existen ventas en este período.",
    },

    daily: {
      title:
        "Detalle diario",
      subtitle:
        "Desglose completo del período seleccionado.",
      date:
        "Fecha",
      sales:
        "Ventas",
      payments:
        "Pagos",
      orders:
        "Pedidos",
      customers:
        "Clientes",
    },
  },

  en: {
    loading:
      "Loading analytics...",
    loadError:
      "Sales analytics could not be loaded.",

    page: {
      title:
        "Sales analytics",
      subtitle:
        "Track sales, orders and customer activity for the establishment.",
      refresh:
        "Refresh",
      refreshing:
        "Refreshing...",
      days: (
        value
      ) =>
        `${value} days`,
    },

    period: {
      last7:
        "Last 7 days",
      last30:
        "Last 30 days",
      last90:
        "Last 90 days",
      timezone:
        "Time zone",
    },

    metrics: {
      totalSales:
        "Total sales",
      totalSalesSubtitle:
        "Successfully collected payments",

      completedPayments:
        "Completed payments",
      completedPaymentsSubtitle:
        "Transactions with paid status",

      orders:
        "Orders",
      ordersSubtitle:
        "Non-cancelled orders",

      payingCustomers:
        "Paying customers",
      payingCustomersSubtitle:
        "Sessions with at least one payment",

      averageTicket:
        "Average ticket",
      averageTicketSubtitle:
        "Sales per paying customer",

      dailyAverage:
        "Daily average",
      dailyAverageSubtitle:
        "Average sales per day in the period",
    },

    chart: {
      title:
        "Sales trend",
      subtitle:
        "Amount collected per day during the selected period.",
      sales:
        "Sales",
    },

    bestDay: {
      title:
        "Best day",
      subtitle:
        "Day with the highest sales during the period.",
      empty:
        "There are no sales in this period yet.",
    },

    daily: {
      title:
        "Daily details",
      subtitle:
        "Complete breakdown of the selected period.",
      date:
        "Date",
      sales:
        "Sales",
      payments:
        "Payments",
      orders:
        "Orders",
      customers:
        "Customers",
    },
  },

  de: {
    loading:
      "Analysen werden geladen...",
    loadError:
      "Die Verkaufsanalysen konnten nicht geladen werden.",

    page: {
      title:
        "Verkaufsanalysen",
      subtitle:
        "Entwicklung von Verkäufen, Bestellungen und Kunden des Betriebs anzeigen.",
      refresh:
        "Aktualisieren",
      refreshing:
        "Wird aktualisiert...",
      days: (
        value
      ) =>
        `${value} Tage`,
    },

    period: {
      last7:
        "Letzte 7 Tage",
      last30:
        "Letzte 30 Tage",
      last90:
        "Letzte 90 Tage",
      timezone:
        "Zeitzone",
    },

    metrics: {
      totalSales:
        "Gesamtumsatz",
      totalSalesSubtitle:
        "Erfolgreich eingegangene Zahlungen",

      completedPayments:
        "Abgeschlossene Zahlungen",
      completedPaymentsSubtitle:
        "Transaktionen mit Status bezahlt",

      orders:
        "Bestellungen",
      ordersSubtitle:
        "Nicht stornierte Bestellungen",

      payingCustomers:
        "Zahlende Kunden",
      payingCustomersSubtitle:
        "Sitzungen mit mindestens einer Zahlung",

      averageTicket:
        "Durchschnittsbon",
      averageTicketSubtitle:
        "Umsatz pro zahlendem Kunden",

      dailyAverage:
        "Tagesdurchschnitt",
      dailyAverageSubtitle:
        "Durchschnittlicher Tagesumsatz im Zeitraum",
    },

    chart: {
      title:
        "Umsatzentwicklung",
      subtitle:
        "Eingenommener Betrag pro Tag im ausgewählten Zeitraum.",
      sales:
        "Umsatz",
    },

    bestDay: {
      title:
        "Bester Tag",
      subtitle:
        "Tag mit dem höchsten Umsatz im Zeitraum.",
      empty:
        "In diesem Zeitraum gibt es noch keine Verkäufe.",
    },

    daily: {
      title:
        "Tagesdetails",
      subtitle:
        "Vollständige Aufschlüsselung des ausgewählten Zeitraums.",
      date:
        "Datum",
      sales:
        "Umsatz",
      payments:
        "Zahlungen",
      orders:
        "Bestellungen",
      customers:
        "Kunden",
    },
  },

  fr: {
    loading:
      "Chargement des analyses...",
    loadError:
      "Impossible de charger les analyses des ventes.",

    page: {
      title:
        "Analyse des ventes",
      subtitle:
        "Consultez l’évolution des ventes, des commandes et des clients de l’établissement.",
      refresh:
        "Actualiser",
      refreshing:
        "Actualisation...",
      days: (
        value
      ) =>
        `${value} jours`,
    },

    period: {
      last7:
        "7 derniers jours",
      last30:
        "30 derniers jours",
      last90:
        "90 derniers jours",
      timezone:
        "Fuseau horaire",
    },

    metrics: {
      totalSales:
        "Ventes totales",
      totalSalesSubtitle:
        "Paiements effectivement encaissés",

      completedPayments:
        "Paiements effectués",
      completedPaymentsSubtitle:
        "Transactions avec le statut payé",

      orders:
        "Commandes",
      ordersSubtitle:
        "Commandes non annulées",

      payingCustomers:
        "Clients payants",
      payingCustomersSubtitle:
        "Sessions avec au moins un paiement",

      averageTicket:
        "Panier moyen",
      averageTicketSubtitle:
        "Ventes par client payant",

      dailyAverage:
        "Moyenne quotidienne",
      dailyAverageSubtitle:
        "Ventes moyennes par jour sur la période",
    },

    chart: {
      title:
        "Évolution des ventes",
      subtitle:
        "Montant encaissé par jour pendant la période sélectionnée.",
      sales:
        "Ventes",
    },

    bestDay: {
      title:
        "Meilleur jour",
      subtitle:
        "Jour ayant généré le chiffre d’affaires le plus élevé de la période.",
      empty:
        "Aucune vente n’a encore été enregistrée sur cette période.",
    },

    daily: {
      title:
        "Détail quotidien",
      subtitle:
        "Ventilation complète de la période sélectionnée.",
      date:
        "Date",
      sales:
        "Ventes",
      payments:
        "Paiements",
      orders:
        "Commandes",
      customers:
        "Clients",
    },
  },

  it: {
    loading:
      "Caricamento delle analisi...",
    loadError:
      "Impossibile caricare le analisi delle vendite.",

    page: {
      title:
        "Analisi delle vendite",
      subtitle:
        "Consulta l’andamento di vendite, ordini e clienti della struttura.",
      refresh:
        "Aggiorna",
      refreshing:
        "Aggiornamento...",
      days: (
        value
      ) =>
        `${value} giorni`,
    },

    period: {
      last7:
        "Ultimi 7 giorni",
      last30:
        "Ultimi 30 giorni",
      last90:
        "Ultimi 90 giorni",
      timezone:
        "Fuso orario",
    },

    metrics: {
      totalSales:
        "Vendite totali",
      totalSalesSubtitle:
        "Pagamenti effettivamente incassati",

      completedPayments:
        "Pagamenti completati",
      completedPaymentsSubtitle:
        "Transazioni con stato pagato",

      orders:
        "Ordini",
      ordersSubtitle:
        "Ordini non annullati",

      payingCustomers:
        "Clienti paganti",
      payingCustomersSubtitle:
        "Sessioni con almeno un pagamento",

      averageTicket:
        "Scontrino medio",
      averageTicketSubtitle:
        "Vendite per cliente pagante",

      dailyAverage:
        "Media giornaliera",
      dailyAverageSubtitle:
        "Vendite medie giornaliere nel periodo",
    },

    chart: {
      title:
        "Andamento delle vendite",
      subtitle:
        "Importo incassato ogni giorno durante il periodo selezionato.",
      sales:
        "Vendite",
    },

    bestDay: {
      title:
        "Giorno migliore",
      subtitle:
        "Giorno con il fatturato più alto nel periodo.",
      empty:
        "Non ci sono ancora vendite in questo periodo.",
    },

    daily: {
      title:
        "Dettaglio giornaliero",
      subtitle:
        "Ripartizione completa del periodo selezionato.",
      date:
        "Data",
      sales:
        "Vendite",
      payments:
        "Pagamenti",
      orders:
        "Ordini",
      customers:
        "Clienti",
    },
  },

  pt: {
    loading:
      "A carregar análises...",
    loadError:
      "Não foi possível carregar as análises de vendas.",

    page: {
      title:
        "Análises de vendas",
      subtitle:
        "Consulte a evolução das vendas, pedidos e clientes do estabelecimento.",
      refresh:
        "Atualizar",
      refreshing:
        "A atualizar...",
      days: (
        value
      ) =>
        `${value} dias`,
    },

    period: {
      last7:
        "Últimos 7 dias",
      last30:
        "Últimos 30 dias",
      last90:
        "Últimos 90 dias",
      timezone:
        "Fuso horário",
    },

    metrics: {
      totalSales:
        "Vendas totais",
      totalSalesSubtitle:
        "Pagamentos efetivamente recebidos",

      completedPayments:
        "Pagamentos concluídos",
      completedPaymentsSubtitle:
        "Transações com estado pago",

      orders:
        "Pedidos",
      ordersSubtitle:
        "Pedidos não cancelados",

      payingCustomers:
        "Clientes pagantes",
      payingCustomersSubtitle:
        "Sessões com pelo menos um pagamento",

      averageTicket:
        "Ticket médio",
      averageTicketSubtitle:
        "Vendas por cliente pagante",

      dailyAverage:
        "Média diária",
      dailyAverageSubtitle:
        "Vendas médias por dia no período",
    },

    chart: {
      title:
        "Evolução das vendas",
      subtitle:
        "Montante recebido por dia durante o período selecionado.",
      sales:
        "Vendas",
    },

    bestDay: {
      title:
        "Melhor dia",
      subtitle:
        "Dia com maior faturação no período.",
      empty:
        "Ainda não existem vendas neste período.",
    },

    daily: {
      title:
        "Detalhe diário",
      subtitle:
        "Desagregação completa do período selecionado.",
      date:
        "Data",
      sales:
        "Vendas",
      payments:
        "Pagamentos",
      orders:
        "Pedidos",
      customers:
        "Clientes",
    },
  },
};