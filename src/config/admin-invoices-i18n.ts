import type { Language } from "@/types";

export const ADMIN_INVOICE_LOCALES: Record<Language, string> = {
  es: "es-ES",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
};

const invoiceMessages = {
  es: {
    loading: "Cargando facturas...",
    loadError: "No se pudieron cargar las facturas.",

    title: "Facturas",
    description: "Consulta los recibos emitidos y su estado de envío.",
    refresh: "Actualizar",

    metrics: {
      issued: "Facturas emitidas",
      issuedSubtitle: "Recibos registrados",
      total: "Facturación total",
      totalSubtitle: "Importe acumulado",
      sent: "Enviadas",
      sentSubtitle: "Recibos enviados por email",
      pending: "Pendientes de envío",
      pendingSubtitle: "Recibos todavía no enviados",
    },

    filters: {
      search: "Buscar por factura, ID, sesión o importe...",
      all: "Todos los envíos",
      sent: "Enviadas",
      pending: "Pendientes",
      visible: (visible: number, total: number) =>
        `${visible} de ${total} facturas visibles.`,
    },

    history: {
      title: "Historial de facturas",
      description: "Las facturas más recientes aparecen primero.",
      emptyTitle: "No se encontraron facturas",
      emptyDescription:
        "Cambia los filtros o espera a que se emita un nuevo recibo.",
    },

    table: {
      invoice: "Factura",
      session: "Sesión",
      total: "Total",
      email: "Email",
      date: "Fecha",
      actions: "Acciones",
    },

    emailStatus: {
      sent: "Enviada",
      pending: "Pendiente",
    },

    actions: {
      viewPdf: "Ver PDF",
      showDetail: "Ver detalle",
      hideDetail: "Ocultar detalle",
    },

    detail: {
      title: "Detalle de la factura",
      line: "línea",
      lines: "líneas",
      registered: "registradas",
      total: "Total",
      noItems: "No hay detalle de artículos disponible.",
      product: "Producto",
      quantity: "Cant.",
      price: "Precio",
      subtotal: "Subtotal",
      fallbackProduct: "Producto",
    },
  },

  en: {
    loading: "Loading invoices...",
    loadError: "Invoices could not be loaded.",

    title: "Invoices",
    description: "View issued receipts and their delivery status.",
    refresh: "Refresh",

    metrics: {
      issued: "Invoices issued",
      issuedSubtitle: "Registered receipts",
      total: "Total billed",
      totalSubtitle: "Accumulated amount",
      sent: "Sent",
      sentSubtitle: "Receipts sent by email",
      pending: "Pending delivery",
      pendingSubtitle: "Receipts not yet sent",
    },

    filters: {
      search: "Search by invoice, ID, session or amount...",
      all: "All deliveries",
      sent: "Sent",
      pending: "Pending",
      visible: (visible: number, total: number) =>
        `${visible} of ${total} invoices shown.`,
    },

    history: {
      title: "Invoice history",
      description: "The most recent invoices appear first.",
      emptyTitle: "No invoices found",
      emptyDescription:
        "Change the filters or wait for a new receipt to be issued.",
    },

    table: {
      invoice: "Invoice",
      session: "Session",
      total: "Total",
      email: "Email",
      date: "Date",
      actions: "Actions",
    },

    emailStatus: {
      sent: "Sent",
      pending: "Pending",
    },

    actions: {
      viewPdf: "View PDF",
      showDetail: "View details",
      hideDetail: "Hide details",
    },

    detail: {
      title: "Invoice details",
      line: "line",
      lines: "lines",
      registered: "registered",
      total: "Total",
      noItems: "No item details are available.",
      product: "Product",
      quantity: "Qty.",
      price: "Price",
      subtotal: "Subtotal",
      fallbackProduct: "Product",
    },
  },

  de: {
    loading: "Rechnungen werden geladen...",
    loadError: "Die Rechnungen konnten nicht geladen werden.",

    title: "Rechnungen",
    description:
      "Ausgestellte Belege und deren Versandstatus anzeigen.",
    refresh: "Aktualisieren",

    metrics: {
      issued: "Ausgestellte Rechnungen",
      issuedSubtitle: "Registrierte Belege",
      total: "Gesamtabrechnung",
      totalSubtitle: "Kumulierter Betrag",
      sent: "Gesendet",
      sentSubtitle: "Per E-Mail gesendete Belege",
      pending: "Ausstehender Versand",
      pendingSubtitle: "Noch nicht gesendete Belege",
    },

    filters: {
      search: "Nach Rechnung, ID, Sitzung oder Betrag suchen...",
      all: "Alle Versandstatus",
      sent: "Gesendet",
      pending: "Ausstehend",
      visible: (visible: number, total: number) =>
        `${visible} von ${total} Rechnungen angezeigt.`,
    },

    history: {
      title: "Rechnungsverlauf",
      description: "Die neuesten Rechnungen werden zuerst angezeigt.",
      emptyTitle: "Keine Rechnungen gefunden",
      emptyDescription:
        "Ändern Sie die Filter oder warten Sie auf einen neuen Beleg.",
    },

    table: {
      invoice: "Rechnung",
      session: "Sitzung",
      total: "Gesamt",
      email: "E-Mail",
      date: "Datum",
      actions: "Aktionen",
    },

    emailStatus: {
      sent: "Gesendet",
      pending: "Ausstehend",
    },

    actions: {
      viewPdf: "PDF anzeigen",
      showDetail: "Details anzeigen",
      hideDetail: "Details ausblenden",
    },

    detail: {
      title: "Rechnungsdetails",
      line: "Position",
      lines: "Positionen",
      registered: "erfasst",
      total: "Gesamt",
      noItems: "Keine Artikeldetails verfügbar.",
      product: "Produkt",
      quantity: "Menge",
      price: "Preis",
      subtotal: "Zwischensumme",
      fallbackProduct: "Produkt",
    },
  },

  fr: {
    loading: "Chargement des factures...",
    loadError: "Impossible de charger les factures.",

    title: "Factures",
    description: "Consultez les reçus émis et leur statut d’envoi.",
    refresh: "Actualiser",

    metrics: {
      issued: "Factures émises",
      issuedSubtitle: "Reçus enregistrés",
      total: "Facturation totale",
      totalSubtitle: "Montant cumulé",
      sent: "Envoyées",
      sentSubtitle: "Reçus envoyés par e-mail",
      pending: "En attente d’envoi",
      pendingSubtitle: "Reçus pas encore envoyés",
    },

    filters: {
      search: "Rechercher par facture, ID, session ou montant...",
      all: "Tous les envois",
      sent: "Envoyées",
      pending: "En attente",
      visible: (visible: number, total: number) =>
        `${visible} sur ${total} factures affichées.`,
    },

    history: {
      title: "Historique des factures",
      description: "Les factures les plus récentes apparaissent en premier.",
      emptyTitle: "Aucune facture trouvée",
      emptyDescription:
        "Modifiez les filtres ou attendez l’émission d’un nouveau reçu.",
    },

    table: {
      invoice: "Facture",
      session: "Session",
      total: "Total",
      email: "E-mail",
      date: "Date",
      actions: "Actions",
    },

    emailStatus: {
      sent: "Envoyée",
      pending: "En attente",
    },

    actions: {
      viewPdf: "Voir le PDF",
      showDetail: "Voir le détail",
      hideDetail: "Masquer le détail",
    },

    detail: {
      title: "Détail de la facture",
      line: "ligne",
      lines: "lignes",
      registered: "enregistrées",
      total: "Total",
      noItems: "Aucun détail d’article disponible.",
      product: "Produit",
      quantity: "Qté",
      price: "Prix",
      subtotal: "Sous-total",
      fallbackProduct: "Produit",
    },
  },

  it: {
    loading: "Caricamento fatture...",
    loadError: "Impossibile caricare le fatture.",

    title: "Fatture",
    description: "Consulta le ricevute emesse e il loro stato di invio.",
    refresh: "Aggiorna",

    metrics: {
      issued: "Fatture emesse",
      issuedSubtitle: "Ricevute registrate",
      total: "Fatturazione totale",
      totalSubtitle: "Importo accumulato",
      sent: "Inviate",
      sentSubtitle: "Ricevute inviate via e-mail",
      pending: "In attesa di invio",
      pendingSubtitle: "Ricevute non ancora inviate",
    },

    filters: {
      search: "Cerca per fattura, ID, sessione o importo...",
      all: "Tutti gli invii",
      sent: "Inviate",
      pending: "In attesa",
      visible: (visible: number, total: number) =>
        `${visible} di ${total} fatture visualizzate.`,
    },

    history: {
      title: "Cronologia fatture",
      description: "Le fatture più recenti vengono mostrate per prime.",
      emptyTitle: "Nessuna fattura trovata",
      emptyDescription:
        "Modifica i filtri o attendi l’emissione di una nuova ricevuta.",
    },

    table: {
      invoice: "Fattura",
      session: "Sessione",
      total: "Totale",
      email: "E-mail",
      date: "Data",
      actions: "Azioni",
    },

    emailStatus: {
      sent: "Inviata",
      pending: "In attesa",
    },

    actions: {
      viewPdf: "Visualizza PDF",
      showDetail: "Vedi dettagli",
      hideDetail: "Nascondi dettagli",
    },

    detail: {
      title: "Dettaglio fattura",
      line: "riga",
      lines: "righe",
      registered: "registrate",
      total: "Totale",
      noItems: "Nessun dettaglio degli articoli disponibile.",
      product: "Prodotto",
      quantity: "Qtà",
      price: "Prezzo",
      subtotal: "Subtotale",
      fallbackProduct: "Prodotto",
    },
  },

  pt: {
    loading: "A carregar faturas...",
    loadError: "Não foi possível carregar as faturas.",

    title: "Faturas",
    description: "Consulte os recibos emitidos e o respetivo estado de envio.",
    refresh: "Atualizar",

    metrics: {
      issued: "Faturas emitidas",
      issuedSubtitle: "Recibos registados",
      total: "Faturação total",
      totalSubtitle: "Montante acumulado",
      sent: "Enviadas",
      sentSubtitle: "Recibos enviados por e-mail",
      pending: "Pendentes de envio",
      pendingSubtitle: "Recibos ainda não enviados",
    },

    filters: {
      search: "Pesquisar por fatura, ID, sessão ou montante...",
      all: "Todos os envios",
      sent: "Enviadas",
      pending: "Pendentes",
      visible: (visible: number, total: number) =>
        `${visible} de ${total} faturas apresentadas.`,
    },

    history: {
      title: "Histórico de faturas",
      description: "As faturas mais recentes aparecem primeiro.",
      emptyTitle: "Nenhuma fatura encontrada",
      emptyDescription:
        "Altere os filtros ou aguarde a emissão de um novo recibo.",
    },

    table: {
      invoice: "Fatura",
      session: "Sessão",
      total: "Total",
      email: "E-mail",
      date: "Data",
      actions: "Ações",
    },

    emailStatus: {
      sent: "Enviada",
      pending: "Pendente",
    },

    actions: {
      viewPdf: "Ver PDF",
      showDetail: "Ver detalhes",
      hideDetail: "Ocultar detalhes",
    },

    detail: {
      title: "Detalhes da fatura",
      line: "linha",
      lines: "linhas",
      registered: "registadas",
      total: "Total",
      noItems: "Não existem detalhes de artigos disponíveis.",
      product: "Produto",
      quantity: "Qtd.",
      price: "Preço",
      subtotal: "Subtotal",
      fallbackProduct: "Produto",
    },
  },
} satisfies Record<Language, unknown>;

export function getAdminInvoiceMessages(language: Language) {
  return invoiceMessages[language];
}