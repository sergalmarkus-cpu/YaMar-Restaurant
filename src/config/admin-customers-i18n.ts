export const ADMIN_CUSTOMERS_MESSAGES = {
  es: {
    loading: "Cargando clientes...",
    loadError: "No se pudieron cargar los clientes.",

    title: "Clientes",
    subtitle:
      "Historial agregado de clientes y visitantes del establecimiento.",

    identifiedCustomers:
      "Clientes identificados",
    currentlyInVenue:
      "Ahora en sala",
    collected:
      "Cobrado",
    accumulatedPoints:
      "Puntos acumulados",

    searchPlaceholder:
      "Buscar por nombre, email, teléfono o habitación...",

    noCustomers:
      "No hay clientes que mostrar.",

    customer:
      "Cliente",
    visits:
      "Visitas",
    orders:
      "Pedidos",
    points:
      "Puntos",
    lastVisit:
      "Última visita",

    visitor:
      "Visitante",
    noEmail:
      "Sin email",
    room:
      "Habitación",
    inVenue:
      "En sala",

    completed:
      "completados",
    cancelled:
      "cancelados",
    ordersPrefix:
      "Pedidos",
  },

  en: {
    loading: "Loading customers...",
    loadError: "Customers could not be loaded.",

    title: "Customers",
    subtitle:
      "Aggregated history of customers and visitors to the establishment.",

    identifiedCustomers:
      "Identified customers",
    currentlyInVenue:
      "Currently on site",
    collected:
      "Collected",
    accumulatedPoints:
      "Accumulated points",

    searchPlaceholder:
      "Search by name, email, phone or room...",

    noCustomers:
      "There are no customers to display.",

    customer:
      "Customer",
    visits:
      "Visits",
    orders:
      "Orders",
    points:
      "Points",
    lastVisit:
      "Last visit",

    visitor:
      "Visitor",
    noEmail:
      "No email",
    room:
      "Room",
    inVenue:
      "On site",

    completed:
      "completed",
    cancelled:
      "cancelled",
    ordersPrefix:
      "Orders",
  },

  de: {
    loading: "Kunden werden geladen...",
    loadError:
      "Die Kunden konnten nicht geladen werden.",

    title: "Kunden",
    subtitle:
      "Zusammengefasste Historie der Kunden und Besucher des Betriebs.",

    identifiedCustomers:
      "Identifizierte Kunden",
    currentlyInVenue:
      "Derzeit vor Ort",
    collected:
      "Eingenommen",
    accumulatedPoints:
      "Gesammelte Punkte",

    searchPlaceholder:
      "Nach Name, E-Mail, Telefon oder Zimmer suchen...",

    noCustomers:
      "Keine Kunden vorhanden.",

    customer:
      "Kunde",
    visits:
      "Besuche",
    orders:
      "Bestellungen",
    points:
      "Punkte",
    lastVisit:
      "Letzter Besuch",

    visitor:
      "Besucher",
    noEmail:
      "Keine E-Mail",
    room:
      "Zimmer",
    inVenue:
      "Vor Ort",

    completed:
      "abgeschlossen",
    cancelled:
      "storniert",
    ordersPrefix:
      "Bestellungen",
  },

  fr: {
    loading: "Chargement des clients...",
    loadError:
      "Impossible de charger les clients.",

    title: "Clients",
    subtitle:
      "Historique agrégé des clients et visiteurs de l’établissement.",

    identifiedCustomers:
      "Clients identifiés",
    currentlyInVenue:
      "Actuellement sur place",
    collected:
      "Encaissé",
    accumulatedPoints:
      "Points cumulés",

    searchPlaceholder:
      "Rechercher par nom, e-mail, téléphone ou chambre...",

    noCustomers:
      "Aucun client à afficher.",

    customer:
      "Client",
    visits:
      "Visites",
    orders:
      "Commandes",
    points:
      "Points",
    lastVisit:
      "Dernière visite",

    visitor:
      "Visiteur",
    noEmail:
      "Sans e-mail",
    room:
      "Chambre",
    inVenue:
      "Sur place",

    completed:
      "terminées",
    cancelled:
      "annulées",
    ordersPrefix:
      "Commandes",
  },

  it: {
    loading: "Caricamento clienti...",
    loadError:
      "Impossibile caricare i clienti.",

    title: "Clienti",
    subtitle:
      "Cronologia aggregata dei clienti e dei visitatori della struttura.",

    identifiedCustomers:
      "Clienti identificati",
    currentlyInVenue:
      "Attualmente presenti",
    collected:
      "Incassato",
    accumulatedPoints:
      "Punti accumulati",

    searchPlaceholder:
      "Cerca per nome, e-mail, telefono o camera...",

    noCustomers:
      "Nessun cliente da mostrare.",

    customer:
      "Cliente",
    visits:
      "Visite",
    orders:
      "Ordini",
    points:
      "Punti",
    lastVisit:
      "Ultima visita",

    visitor:
      "Visitatore",
    noEmail:
      "Nessuna e-mail",
    room:
      "Camera",
    inVenue:
      "Presente",

    completed:
      "completati",
    cancelled:
      "annullati",
    ordersPrefix:
      "Ordini",
  },

  pt: {
    loading: "A carregar clientes...",
    loadError:
      "Não foi possível carregar os clientes.",

    title: "Clientes",
    subtitle:
      "Histórico agregado de clientes e visitantes do estabelecimento.",

    identifiedCustomers:
      "Clientes identificados",
    currentlyInVenue:
      "Atualmente no local",
    collected:
      "Recebido",
    accumulatedPoints:
      "Pontos acumulados",

    searchPlaceholder:
      "Pesquisar por nome, e-mail, telefone ou quarto...",

    noCustomers:
      "Não há clientes para apresentar.",

    customer:
      "Cliente",
    visits:
      "Visitas",
    orders:
      "Pedidos",
    points:
      "Pontos",
    lastVisit:
      "Última visita",

    visitor:
      "Visitante",
    noEmail:
      "Sem e-mail",
    room:
      "Quarto",
    inVenue:
      "No local",

    completed:
      "concluídos",
    cancelled:
      "cancelados",
    ordersPrefix:
      "Pedidos",
  },
} as const;

export type AdminCustomersLanguage =
  keyof typeof ADMIN_CUSTOMERS_MESSAGES;