import type {
  Language,
} from "@/types";

export type AdminOrdersLanguage =
  Language;

export type AdminOrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled";

interface AdminOrdersMessages {
  stats: {
    orders: string;
    pending: string;
    preparing: string;
    delivered: string;
  };

  status: Record<
    AdminOrderStatus,
    string
  >;

  grid: {
    table: string;
    view: string;
    edit: string;
    delete: string;
  };

  edit: {
    title: string;
    status: string;
    notes: string;
    cancel: string;
    save: string;
    saving: string;
    updateError: string;
  };

  create: {
    title: string;
    table: string;
    selectTable: string;
    tablePrefix: string;
    product: string;
    selectProduct: string;
    quantity: string;
    notes: string;
    total: string;
    cancel: string;
    create: string;
    creating: string;
    createError: string;
  };

  list: {
    deleteConfirm: (
      orderNumber: string
    ) => string;

    deleteError: string;
  };

  history: {
    title: string;
    description: string;
    allStatuses: string;
    refresh: string;
    refreshing: string;
    loading: string;
    loadError: string;
    noOrders: string;
    noOrdersDescription: string;
    noFilteredOrders: string;
    order: string;
    table: string;
    total: string;
    status: string;
    date: string;
    idPrefix: string;
    tablePrefix: string;
    noStatus: string;
    oneShown: string;
    manyShown: string;
  };
}

export const ADMIN_ORDERS_MESSAGES: Record<
  AdminOrdersLanguage,
  AdminOrdersMessages
> = {
  es: {
    stats: {
      orders: "Pedidos",
      pending: "Pendientes",
      preparing: "Preparando",
      delivered: "Entregados",
    },

    status: {
      pending: "Pendiente",
      accepted: "Aceptado",
      preparing: "Preparando",
      ready: "Listo",
      delivering: "En reparto",
      delivered: "Entregado",
      cancelled: "Cancelado",
    },

    grid: {
      table: "Mesa",
      view: "Ver",
      edit: "Editar",
      delete: "Eliminar",
    },

    edit: {
      title: "Editar pedido",
      status: "Estado",
      notes: "Observaciones",
      cancel: "Cancelar",
      save: "Guardar",
      saving: "Guardando...",
      updateError:
        "No se pudo actualizar el pedido.",
    },

    create: {
      title: "Nuevo pedido",
      table: "Mesa",
      selectTable:
        "Seleccionar mesa",
      tablePrefix: "Mesa",
      product: "Producto",
      selectProduct:
        "Seleccionar producto",
      quantity: "Cantidad",
      notes: "Observaciones",
      total: "Total",
      cancel: "Cancelar",
      create: "Crear pedido",
      creating: "Creando...",
      createError:
        "No se pudo crear el pedido.",
    },

    list: {
      deleteConfirm: (
        orderNumber
      ) =>
        `¿Eliminar el pedido ${orderNumber}?`,

      deleteError:
        "No se pudo eliminar el pedido.",
    },

    history: {
      title: "Historial de pedidos",
      description:
        "Consulta los pedidos registrados en el establecimiento.",
      allStatuses:
        "Todos los estados",
      refresh: "Actualizar",
      refreshing: "Actualizando...",
      loading:
        "Cargando historial de pedidos...",
      loadError:
        "No se pudo cargar el historial de pedidos.",
      noOrders: "No hay pedidos",
      noOrdersDescription:
        "Todavía no se han registrado pedidos en este establecimiento.",
      noFilteredOrders:
        "No hay pedidos que coincidan con el estado seleccionado.",
      order: "Pedido",
      table: "Mesa",
      total: "Total",
      status: "Estado",
      date: "Fecha",
      idPrefix: "ID #",
      tablePrefix: "Mesa #",
      noStatus: "Sin estado",
      oneShown: "pedido mostrado",
      manyShown:
        "pedidos mostrados",
    },
  },

  en: {
    stats: {
      orders: "Orders",
      pending: "Pending",
      preparing: "Preparing",
      delivered: "Delivered",
    },

    status: {
      pending: "Pending",
      accepted: "Accepted",
      preparing: "Preparing",
      ready: "Ready",
      delivering: "Delivering",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },

    grid: {
      table: "Table",
      view: "View",
      edit: "Edit",
      delete: "Delete",
    },

    edit: {
      title: "Edit order",
      status: "Status",
      notes: "Notes",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
      updateError:
        "The order could not be updated.",
    },

    create: {
      title: "New order",
      table: "Table",
      selectTable:
        "Select table",
      tablePrefix: "Table",
      product: "Product",
      selectProduct:
        "Select product",
      quantity: "Quantity",
      notes: "Notes",
      total: "Total",
      cancel: "Cancel",
      create: "Create order",
      creating: "Creating...",
      createError:
        "The order could not be created.",
    },

    list: {
      deleteConfirm: (
        orderNumber
      ) =>
        `Delete order ${orderNumber}?`,

      deleteError:
        "The order could not be deleted.",
    },

    history: {
      title: "Order history",
      description:
        "View the orders registered for the establishment.",
      allStatuses: "All statuses",
      refresh: "Refresh",
      refreshing: "Refreshing...",
      loading:
        "Loading order history...",
      loadError:
        "The order history could not be loaded.",
      noOrders: "No orders",
      noOrdersDescription:
        "No orders have been registered for this establishment yet.",
      noFilteredOrders:
        "No orders match the selected status.",
      order: "Order",
      table: "Table",
      total: "Total",
      status: "Status",
      date: "Date",
      idPrefix: "ID #",
      tablePrefix: "Table #",
      noStatus: "No status",
      oneShown: "order shown",
      manyShown: "orders shown",
    },
  },

  de: {
    stats: {
      orders: "Bestellungen",
      pending: "Ausstehend",
      preparing:
        "In Zubereitung",
      delivered: "Ausgeliefert",
    },

    status: {
      pending: "Ausstehend",
      accepted: "Angenommen",
      preparing:
        "In Zubereitung",
      ready: "Bereit",
      delivering:
        "In Zustellung",
      delivered: "Ausgeliefert",
      cancelled: "Storniert",
    },

    grid: {
      table: "Tisch",
      view: "Ansehen",
      edit: "Bearbeiten",
      delete: "Löschen",
    },

    edit: {
      title:
        "Bestellung bearbeiten",
      status: "Status",
      notes: "Anmerkungen",
      cancel: "Abbrechen",
      save: "Speichern",
      saving: "Speichern...",
      updateError:
        "Die Bestellung konnte nicht aktualisiert werden.",
    },

    create: {
      title: "Neue Bestellung",
      table: "Tisch",
      selectTable:
        "Tisch auswählen",
      tablePrefix: "Tisch",
      product: "Produkt",
      selectProduct:
        "Produkt auswählen",
      quantity: "Menge",
      notes: "Anmerkungen",
      total: "Gesamt",
      cancel: "Abbrechen",
      create:
        "Bestellung erstellen",
      creating: "Erstellen...",
      createError:
        "Die Bestellung konnte nicht erstellt werden.",
    },

    list: {
      deleteConfirm: (
        orderNumber
      ) =>
        `Bestellung ${orderNumber} löschen?`,

      deleteError:
        "Die Bestellung konnte nicht gelöscht werden.",
    },

    history: {
      title:
        "Bestellhistorie",
      description:
        "Zeigt die für den Betrieb registrierten Bestellungen an.",
      allStatuses:
        "Alle Status",
      refresh: "Aktualisieren",
      refreshing:
        "Aktualisierung...",
      loading:
        "Bestellhistorie wird geladen...",
      loadError:
        "Die Bestellhistorie konnte nicht geladen werden.",
      noOrders:
        "Keine Bestellungen",
      noOrdersDescription:
        "Für diesen Betrieb wurden noch keine Bestellungen registriert.",
      noFilteredOrders:
        "Keine Bestellungen entsprechen dem ausgewählten Status.",
      order: "Bestellung",
      table: "Tisch",
      total: "Gesamt",
      status: "Status",
      date: "Datum",
      idPrefix: "ID #",
      tablePrefix: "Tisch #",
      noStatus: "Kein Status",
      oneShown:
        "Bestellung angezeigt",
      manyShown:
        "Bestellungen angezeigt",
    },
  },

  fr: {
    stats: {
      orders: "Commandes",
      pending: "En attente",
      preparing:
        "En préparation",
      delivered: "Livrées",
    },

    status: {
      pending: "En attente",
      accepted: "Acceptée",
      preparing:
        "En préparation",
      ready: "Prête",
      delivering:
        "En livraison",
      delivered: "Livrée",
      cancelled: "Annulée",
    },

    grid: {
      table: "Table",
      view: "Voir",
      edit: "Modifier",
      delete: "Supprimer",
    },

    edit: {
      title:
        "Modifier la commande",
      status: "Statut",
      notes: "Observations",
      cancel: "Annuler",
      save: "Enregistrer",
      saving:
        "Enregistrement...",
      updateError:
        "Impossible de mettre à jour la commande.",
    },

    create: {
      title:
        "Nouvelle commande",
      table: "Table",
      selectTable:
        "Sélectionner une table",
      tablePrefix: "Table",
      product: "Produit",
      selectProduct:
        "Sélectionner un produit",
      quantity: "Quantité",
      notes: "Observations",
      total: "Total",
      cancel: "Annuler",
      create:
        "Créer la commande",
      creating: "Création...",
      createError:
        "Impossible de créer la commande.",
    },

    list: {
      deleteConfirm: (
        orderNumber
      ) =>
        `Supprimer la commande ${orderNumber} ?`,

      deleteError:
        "Impossible de supprimer la commande.",
    },

    history: {
      title:
        "Historique des commandes",
      description:
        "Consultez les commandes enregistrées dans l’établissement.",
      allStatuses:
        "Tous les statuts",
      refresh: "Actualiser",
      refreshing:
        "Actualisation...",
      loading:
        "Chargement de l’historique des commandes...",
      loadError:
        "Impossible de charger l’historique des commandes.",
      noOrders:
        "Aucune commande",
      noOrdersDescription:
        "Aucune commande n’a encore été enregistrée dans cet établissement.",
      noFilteredOrders:
        "Aucune commande ne correspond au statut sélectionné.",
      order: "Commande",
      table: "Table",
      total: "Total",
      status: "Statut",
      date: "Date",
      idPrefix: "ID #",
      tablePrefix: "Table #",
      noStatus: "Sans statut",
      oneShown:
        "commande affichée",
      manyShown:
        "commandes affichées",
    },
  },

  it: {
    stats: {
      orders: "Ordini",
      pending: "In attesa",
      preparing:
        "In preparazione",
      delivered: "Consegnati",
    },

    status: {
      pending: "In attesa",
      accepted: "Accettato",
      preparing:
        "In preparazione",
      ready: "Pronto",
      delivering:
        "In consegna",
      delivered: "Consegnato",
      cancelled: "Annullato",
    },

    grid: {
      table: "Tavolo",
      view: "Visualizza",
      edit: "Modifica",
      delete: "Elimina",
    },

    edit: {
      title: "Modifica ordine",
      status: "Stato",
      notes: "Note",
      cancel: "Annulla",
      save: "Salva",
      saving:
        "Salvataggio...",
      updateError:
        "Impossibile aggiornare l’ordine.",
    },

    create: {
      title: "Nuovo ordine",
      table: "Tavolo",
      selectTable:
        "Seleziona tavolo",
      tablePrefix: "Tavolo",
      product: "Prodotto",
      selectProduct:
        "Seleziona prodotto",
      quantity: "Quantità",
      notes: "Note",
      total: "Totale",
      cancel: "Annulla",
      create: "Crea ordine",
      creating: "Creazione...",
      createError:
        "Impossibile creare l’ordine.",
    },

    list: {
      deleteConfirm: (
        orderNumber
      ) =>
        `Eliminare l’ordine ${orderNumber}?`,

      deleteError:
        "Impossibile eliminare l’ordine.",
    },

    history: {
      title:
        "Cronologia ordini",
      description:
        "Consulta gli ordini registrati nella struttura.",
      allStatuses:
        "Tutti gli stati",
      refresh: "Aggiorna",
      refreshing:
        "Aggiornamento...",
      loading:
        "Caricamento cronologia ordini...",
      loadError:
        "Impossibile caricare la cronologia degli ordini.",
      noOrders: "Nessun ordine",
      noOrdersDescription:
        "Non sono ancora stati registrati ordini in questa struttura.",
      noFilteredOrders:
        "Nessun ordine corrisponde allo stato selezionato.",
      order: "Ordine",
      table: "Tavolo",
      total: "Totale",
      status: "Stato",
      date: "Data",
      idPrefix: "ID #",
      tablePrefix: "Tavolo #",
      noStatus: "Nessuno stato",
      oneShown:
        "ordine visualizzato",
      manyShown:
        "ordini visualizzati",
    },
  },

  pt: {
    stats: {
      orders: "Pedidos",
      pending: "Pendentes",
      preparing:
        "Em preparação",
      delivered: "Entregues",
    },

    status: {
      pending: "Pendente",
      accepted: "Aceite",
      preparing:
        "Em preparação",
      ready: "Pronto",
      delivering:
        "Em entrega",
      delivered: "Entregue",
      cancelled: "Cancelado",
    },

    grid: {
      table: "Mesa",
      view: "Ver",
      edit: "Editar",
      delete: "Eliminar",
    },

    edit: {
      title: "Editar pedido",
      status: "Estado",
      notes: "Observações",
      cancel: "Cancelar",
      save: "Guardar",
      saving: "A guardar...",
      updateError:
        "Não foi possível atualizar o pedido.",
    },

    create: {
      title: "Novo pedido",
      table: "Mesa",
      selectTable:
        "Selecionar mesa",
      tablePrefix: "Mesa",
      product: "Produto",
      selectProduct:
        "Selecionar produto",
      quantity: "Quantidade",
      notes: "Observações",
      total: "Total",
      cancel: "Cancelar",
      create: "Criar pedido",
      creating: "A criar...",
      createError:
        "Não foi possível criar o pedido.",
    },

    list: {
      deleteConfirm: (
        orderNumber
      ) =>
        `Eliminar o pedido ${orderNumber}?`,

      deleteError:
        "Não foi possível eliminar o pedido.",
    },

    history: {
      title:
        "Histórico de pedidos",
      description:
        "Consulte os pedidos registados no estabelecimento.",
      allStatuses:
        "Todos os estados",
      refresh: "Atualizar",
      refreshing:
        "A atualizar...",
      loading:
        "A carregar o histórico de pedidos...",
      loadError:
        "Não foi possível carregar o histórico de pedidos.",
      noOrders:
        "Não existem pedidos",
      noOrdersDescription:
        "Ainda não foram registados pedidos neste estabelecimento.",
      noFilteredOrders:
        "Não existem pedidos correspondentes ao estado selecionado.",
      order: "Pedido",
      table: "Mesa",
      total: "Total",
      status: "Estado",
      date: "Data",
      idPrefix: "ID #",
      tablePrefix: "Mesa #",
      noStatus: "Sem estado",
      oneShown:
        "pedido apresentado",
      manyShown:
        "pedidos apresentados",
    },
  },
};