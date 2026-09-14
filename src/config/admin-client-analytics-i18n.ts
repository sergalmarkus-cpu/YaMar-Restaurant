import type {
  Language,
} from "@/types";

interface ClientAnalyticsMessages {
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
    uniqueCustomers: string;
    uniqueCustomersSubtitle: string;

    newCustomers: string;
    newCustomersSubtitle: string;

    returningCustomers: string;
    returningCustomersSubtitle: string;

    visits: string;
    visitsSubtitle: string;

    identifiedCustomers: string;
    identifiedCustomersSubtitle: string;

    anonymousCustomers: string;
    anonymousCustomersSubtitle: string;

    payingCustomers: string;
    payingCustomersSubtitle: string;

    associatedRevenue: string;
    associatedRevenueSubtitle: string;

    averageSpend: string;
    averageSpendSubtitle: string;

    averageVisits: string;
    averageVisitsSubtitle: string;

    repeatRate: string;
    repeatRateSubtitle: string;
  };

  chart: {
    title: string;
    subtitle: string;
    visits: string;
    customers: string;
    newCustomers: string;
    returningCustomers: string;
  };

  topCustomers: {
    title: string;
    subtitle: string;
    empty: string;
    customer: string;
    visits: string;
    amountPaid: string;
  };

  daily: {
    title: string;
    subtitle: string;
    date: string;
    visits: string;
    customers: string;
    newCustomers: string;
    returningCustomers: string;
  };
}

export const ADMIN_CLIENT_ANALYTICS_MESSAGES: Record<
  Language,
  ClientAnalyticsMessages
> = {
  es: {
    loading:
      "Cargando analíticas...",
    loadError:
      "No se pudieron cargar las analíticas de clientes.",

    page: {
      title:
        "Analíticas de clientes",
      subtitle:
        "Consulta las visitas, la captación, la recurrencia y el comportamiento de tus clientes.",
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
      uniqueCustomers:
        "Clientes únicos",
      uniqueCustomersSubtitle:
        "Clientes distintos durante el período",

      newCustomers:
        "Clientes nuevos",
      newCustomersSubtitle:
        "Primera visita registrada en el período",

      returningCustomers:
        "Clientes recurrentes",
      returningCustomersSubtitle:
        "Ya habían visitado el establecimiento",

      visits:
        "Visitas",
      visitsSubtitle:
        "Sesiones registradas durante el período",

      identifiedCustomers:
        "Clientes identificados",
      identifiedCustomersSubtitle:
        "Clientes con identidad reconocible",

      anonymousCustomers:
        "Clientes anónimos",
      anonymousCustomersSubtitle:
        "Sesiones sin identificación de cliente",

      payingCustomers:
        "Clientes pagadores",
      payingCustomersSubtitle:
        "Clientes con al menos un pago completado",

      associatedRevenue:
        "Facturación asociada",
      associatedRevenueSubtitle:
        "Pagos cobrados de clientes del período",

      averageSpend:
        "Gasto medio",
      averageSpendSubtitle:
        "Importe medio por cliente pagador",

      averageVisits:
        "Visitas medias",
      averageVisitsSubtitle:
        "Visitas por cliente único",

      repeatRate:
        "Tasa de repetición",
      repeatRateSubtitle:
        "Porcentaje de clientes recurrentes",
    },

    chart: {
      title:
        "Evolución de clientes",
      subtitle:
        "Visitas y comportamiento de clientes durante el período seleccionado.",
      visits:
        "Visitas",
      customers:
        "Clientes",
      newCustomers:
        "Nuevos",
      returningCustomers:
        "Recurrentes",
    },

    topCustomers: {
      title:
        "Clientes destacados",
      subtitle:
        "Clientes identificados ordenados por importe pagado y número de visitas.",
      empty:
        "Todavía no hay clientes identificados suficientes para mostrar este ranking.",
      customer:
        "Cliente",
      visits:
        "Visitas",
      amountPaid:
        "Importe pagado",
    },

    daily: {
      title:
        "Detalle diario",
      subtitle:
        "Desglose diario de visitas, clientes nuevos y clientes recurrentes.",
      date:
        "Fecha",
      visits:
        "Visitas",
      customers:
        "Clientes",
      newCustomers:
        "Nuevos",
      returningCustomers:
        "Recurrentes",
    },
  },

  en: {
    loading:
      "Loading analytics...",
    loadError:
      "Customer analytics could not be loaded.",

    page: {
      title:
        "Customer analytics",
      subtitle:
        "View customer visits, acquisition, retention and behaviour.",
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
      uniqueCustomers:
        "Unique customers",
      uniqueCustomersSubtitle:
        "Distinct customers during the period",

      newCustomers:
        "New customers",
      newCustomersSubtitle:
        "First recorded visit during the period",

      returningCustomers:
        "Returning customers",
      returningCustomersSubtitle:
        "Customers who had visited before",

      visits:
        "Visits",
      visitsSubtitle:
        "Sessions recorded during the period",

      identifiedCustomers:
        "Identified customers",
      identifiedCustomersSubtitle:
        "Customers with a recognisable identity",

      anonymousCustomers:
        "Anonymous customers",
      anonymousCustomersSubtitle:
        "Sessions without customer identification",

      payingCustomers:
        "Paying customers",
      payingCustomersSubtitle:
        "Customers with at least one completed payment",

      associatedRevenue:
        "Associated revenue",
      associatedRevenueSubtitle:
        "Collected customer payments during the period",

      averageSpend:
        "Average spend",
      averageSpendSubtitle:
        "Average amount per paying customer",

      averageVisits:
        "Average visits",
      averageVisitsSubtitle:
        "Visits per unique customer",

      repeatRate:
        "Repeat rate",
      repeatRateSubtitle:
        "Percentage of returning customers",
    },

    chart: {
      title:
        "Customer trend",
      subtitle:
        "Customer visits and behaviour during the selected period.",
      visits:
        "Visits",
      customers:
        "Customers",
      newCustomers:
        "New",
      returningCustomers:
        "Returning",
    },

    topCustomers: {
      title:
        "Top customers",
      subtitle:
        "Identified customers ranked by amount paid and number of visits.",
      empty:
        "There are not enough identified customers yet to show this ranking.",
      customer:
        "Customer",
      visits:
        "Visits",
      amountPaid:
        "Amount paid",
    },

    daily: {
      title:
        "Daily details",
      subtitle:
        "Daily breakdown of visits, new customers and returning customers.",
      date:
        "Date",
      visits:
        "Visits",
      customers:
        "Customers",
      newCustomers:
        "New",
      returningCustomers:
        "Returning",
    },
  },

  de: {
    loading:
      "Analysen werden geladen...",
    loadError:
      "Die Kundenanalysen konnten nicht geladen werden.",

    page: {
      title:
        "Kundenanalysen",
      subtitle:
        "Besuche, Neukundengewinnung, Wiederkehr und Kundenverhalten anzeigen.",
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
      uniqueCustomers:
        "Eindeutige Kunden",
      uniqueCustomersSubtitle:
        "Unterschiedliche Kunden im Zeitraum",

      newCustomers:
        "Neue Kunden",
      newCustomersSubtitle:
        "Erster erfasster Besuch im Zeitraum",

      returningCustomers:
        "Wiederkehrende Kunden",
      returningCustomersSubtitle:
        "Kunden, die den Betrieb bereits besucht hatten",

      visits:
        "Besuche",
      visitsSubtitle:
        "Erfasste Sitzungen im Zeitraum",

      identifiedCustomers:
        "Identifizierte Kunden",
      identifiedCustomersSubtitle:
        "Kunden mit erkennbarer Identität",

      anonymousCustomers:
        "Anonyme Kunden",
      anonymousCustomersSubtitle:
        "Sitzungen ohne Kundenidentifikation",

      payingCustomers:
        "Zahlende Kunden",
      payingCustomersSubtitle:
        "Kunden mit mindestens einer abgeschlossenen Zahlung",

      associatedRevenue:
        "Zugeordneter Umsatz",
      associatedRevenueSubtitle:
        "Eingenommene Kundenzahlungen im Zeitraum",

      averageSpend:
        "Durchschnittsausgaben",
      averageSpendSubtitle:
        "Durchschnittlicher Betrag pro zahlendem Kunden",

      averageVisits:
        "Durchschnittliche Besuche",
      averageVisitsSubtitle:
        "Besuche pro eindeutigem Kunden",

      repeatRate:
        "Wiederkehrrate",
      repeatRateSubtitle:
        "Anteil wiederkehrender Kunden",
    },

    chart: {
      title:
        "Kundenentwicklung",
      subtitle:
        "Besuche und Kundenverhalten im ausgewählten Zeitraum.",
      visits:
        "Besuche",
      customers:
        "Kunden",
      newCustomers:
        "Neu",
      returningCustomers:
        "Wiederkehrend",
    },

    topCustomers: {
      title:
        "Top-Kunden",
      subtitle:
        "Identifizierte Kunden nach gezahltem Betrag und Anzahl der Besuche.",
      empty:
        "Es gibt noch nicht genügend identifizierte Kunden für diese Rangliste.",
      customer:
        "Kunde",
      visits:
        "Besuche",
      amountPaid:
        "Gezahlter Betrag",
    },

    daily: {
      title:
        "Tagesdetails",
      subtitle:
        "Tägliche Aufschlüsselung von Besuchen, neuen und wiederkehrenden Kunden.",
      date:
        "Datum",
      visits:
        "Besuche",
      customers:
        "Kunden",
      newCustomers:
        "Neu",
      returningCustomers:
        "Wiederkehrend",
    },
  },

  fr: {
    loading:
      "Chargement des analyses...",
    loadError:
      "Impossible de charger les analyses des clients.",

    page: {
      title:
        "Analyse des clients",
      subtitle:
        "Consultez les visites, l’acquisition, la fidélisation et le comportement de vos clients.",
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
      uniqueCustomers:
        "Clients uniques",
      uniqueCustomersSubtitle:
        "Clients distincts pendant la période",

      newCustomers:
        "Nouveaux clients",
      newCustomersSubtitle:
        "Première visite enregistrée pendant la période",

      returningCustomers:
        "Clients récurrents",
      returningCustomersSubtitle:
        "Clients ayant déjà visité l’établissement",

      visits:
        "Visites",
      visitsSubtitle:
        "Sessions enregistrées pendant la période",

      identifiedCustomers:
        "Clients identifiés",
      identifiedCustomersSubtitle:
        "Clients disposant d’une identité reconnaissable",

      anonymousCustomers:
        "Clients anonymes",
      anonymousCustomersSubtitle:
        "Sessions sans identification du client",

      payingCustomers:
        "Clients payants",
      payingCustomersSubtitle:
        "Clients ayant au moins un paiement effectué",

      associatedRevenue:
        "Chiffre d’affaires associé",
      associatedRevenueSubtitle:
        "Paiements encaissés des clients pendant la période",

      averageSpend:
        "Dépense moyenne",
      averageSpendSubtitle:
        "Montant moyen par client payant",

      averageVisits:
        "Visites moyennes",
      averageVisitsSubtitle:
        "Visites par client unique",

      repeatRate:
        "Taux de récurrence",
      repeatRateSubtitle:
        "Pourcentage de clients récurrents",
    },

    chart: {
      title:
        "Évolution des clients",
      subtitle:
        "Visites et comportement des clients pendant la période sélectionnée.",
      visits:
        "Visites",
      customers:
        "Clients",
      newCustomers:
        "Nouveaux",
      returningCustomers:
        "Récurrents",
    },

    topCustomers: {
      title:
        "Clients principaux",
      subtitle:
        "Clients identifiés classés par montant payé et nombre de visites.",
      empty:
        "Il n’y a pas encore assez de clients identifiés pour afficher ce classement.",
      customer:
        "Client",
      visits:
        "Visites",
      amountPaid:
        "Montant payé",
    },

    daily: {
      title:
        "Détail quotidien",
      subtitle:
        "Ventilation quotidienne des visites, nouveaux clients et clients récurrents.",
      date:
        "Date",
      visits:
        "Visites",
      customers:
        "Clients",
      newCustomers:
        "Nouveaux",
      returningCustomers:
        "Récurrents",
    },
  },

  it: {
    loading:
      "Caricamento delle analisi...",
    loadError:
      "Impossibile caricare le analisi dei clienti.",

    page: {
      title:
        "Analisi dei clienti",
      subtitle:
        "Consulta visite, acquisizione, fidelizzazione e comportamento dei clienti.",
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
      uniqueCustomers:
        "Clienti unici",
      uniqueCustomersSubtitle:
        "Clienti distinti durante il periodo",

      newCustomers:
        "Nuovi clienti",
      newCustomersSubtitle:
        "Prima visita registrata durante il periodo",

      returningCustomers:
        "Clienti ricorrenti",
      returningCustomersSubtitle:
        "Clienti che avevano già visitato la struttura",

      visits:
        "Visite",
      visitsSubtitle:
        "Sessioni registrate durante il periodo",

      identifiedCustomers:
        "Clienti identificati",
      identifiedCustomersSubtitle:
        "Clienti con identità riconoscibile",

      anonymousCustomers:
        "Clienti anonimi",
      anonymousCustomersSubtitle:
        "Sessioni senza identificazione del cliente",

      payingCustomers:
        "Clienti paganti",
      payingCustomersSubtitle:
        "Clienti con almeno un pagamento completato",

      associatedRevenue:
        "Fatturato associato",
      associatedRevenueSubtitle:
        "Pagamenti incassati dai clienti nel periodo",

      averageSpend:
        "Spesa media",
      averageSpendSubtitle:
        "Importo medio per cliente pagante",

      averageVisits:
        "Visite medie",
      averageVisitsSubtitle:
        "Visite per cliente unico",

      repeatRate:
        "Tasso di ritorno",
      repeatRateSubtitle:
        "Percentuale di clienti ricorrenti",
    },

    chart: {
      title:
        "Andamento dei clienti",
      subtitle:
        "Visite e comportamento dei clienti nel periodo selezionato.",
      visits:
        "Visite",
      customers:
        "Clienti",
      newCustomers:
        "Nuovi",
      returningCustomers:
        "Ricorrenti",
    },

    topCustomers: {
      title:
        "Clienti principali",
      subtitle:
        "Clienti identificati ordinati per importo pagato e numero di visite.",
      empty:
        "Non ci sono ancora abbastanza clienti identificati per mostrare questa classifica.",
      customer:
        "Cliente",
      visits:
        "Visite",
      amountPaid:
        "Importo pagato",
    },

    daily: {
      title:
        "Dettaglio giornaliero",
      subtitle:
        "Ripartizione giornaliera di visite, nuovi clienti e clienti ricorrenti.",
      date:
        "Data",
      visits:
        "Visite",
      customers:
        "Clienti",
      newCustomers:
        "Nuovi",
      returningCustomers:
        "Ricorrenti",
    },
  },

  pt: {
    loading:
      "A carregar análises...",
    loadError:
      "Não foi possível carregar as análises de clientes.",

    page: {
      title:
        "Análises de clientes",
      subtitle:
        "Consulte visitas, aquisição, recorrência e comportamento dos clientes.",
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
      uniqueCustomers:
        "Clientes únicos",
      uniqueCustomersSubtitle:
        "Clientes distintos durante o período",

      newCustomers:
        "Novos clientes",
      newCustomersSubtitle:
        "Primeira visita registada durante o período",

      returningCustomers:
        "Clientes recorrentes",
      returningCustomersSubtitle:
        "Clientes que já tinham visitado o estabelecimento",

      visits:
        "Visitas",
      visitsSubtitle:
        "Sessões registadas durante o período",

      identifiedCustomers:
        "Clientes identificados",
      identifiedCustomersSubtitle:
        "Clientes com identidade reconhecível",

      anonymousCustomers:
        "Clientes anónimos",
      anonymousCustomersSubtitle:
        "Sessões sem identificação do cliente",

      payingCustomers:
        "Clientes pagantes",
      payingCustomersSubtitle:
        "Clientes com pelo menos um pagamento concluído",

      associatedRevenue:
        "Faturação associada",
      associatedRevenueSubtitle:
        "Pagamentos recebidos dos clientes no período",

      averageSpend:
        "Despesa média",
      averageSpendSubtitle:
        "Montante médio por cliente pagante",

      averageVisits:
        "Visitas médias",
      averageVisitsSubtitle:
        "Visitas por cliente único",

      repeatRate:
        "Taxa de recorrência",
      repeatRateSubtitle:
        "Percentagem de clientes recorrentes",
    },

    chart: {
      title:
        "Evolução dos clientes",
      subtitle:
        "Visitas e comportamento dos clientes durante o período selecionado.",
      visits:
        "Visitas",
      customers:
        "Clientes",
      newCustomers:
        "Novos",
      returningCustomers:
        "Recorrentes",
    },

    topCustomers: {
      title:
        "Clientes em destaque",
      subtitle:
        "Clientes identificados ordenados por montante pago e número de visitas.",
      empty:
        "Ainda não existem clientes identificados suficientes para apresentar este ranking.",
      customer:
        "Cliente",
      visits:
        "Visitas",
      amountPaid:
        "Montante pago",
    },

    daily: {
      title:
        "Detalhe diário",
      subtitle:
        "Desagregação diária de visitas, novos clientes e clientes recorrentes.",
      date:
        "Data",
      visits:
        "Visitas",
      customers:
        "Clientes",
      newCustomers:
        "Novos",
      returningCustomers:
        "Recorrentes",
    },
  },
};