import type {
  Language,
} from "@/types";

export type AdminPaymentStatus =
  | "pending"
  | "partial"
  | "paid"
  | "refunded";

export type AdminPaymentMethod =
  | "card"
  | "cash"
  | "transfer"
  | "paypal"
  | "apple_pay"
  | "google_pay";

interface AdminPaymentsMessages {
  payments: {
    loading: string;

    page: {
      title: string;
      subtitle: string;
      refresh: string;
      refreshing: string;
    };

    stats: {
      registered: string;
      allStatuses: string;
      collected: string;
      paidCount: (
        count: number
      ) => string;
      pendingAmount: string;
      pendingDescription: string;
      refunds: string;
      refundsDescription: string;
    };

    filters: {
      search: string;
      allStatuses: string;
      allMethods: string;
      visible: (
        shown: number,
        total: number
      ) => string;
    };

    history: {
      title: string;
      subtitle: string;
    };

    empty: {
      title: string;
      description: string;
    };

    table: {
      payment: string;
      method: string;
      amount: string;
      status: string;
      date: string;
      reference: string;
      actions: string;
      session: string;
      split: string;
      transaction: string;
      receipt: string;
      noActions: string;
      updating: string;
    };

    statuses: Record<
      AdminPaymentStatus,
      string
    >;

    methods: Record<
      AdminPaymentMethod,
      string
    >;

    actions: {
      paid: string;
      partial: string;
      refunded: string;
    };

    confirmations: {
      refund: (
        id: number
      ) => string;

      statusChange: (
        id: number,
        from: string,
        to: string
      ) => string;
    };

    success: {
      updated: (
        id: number
      ) => string;
    };

    errors: {
      load: string;
      update: string;
    };
  };
}

export const ADMIN_PAYMENTS_MESSAGES: Record<
  Language,
  AdminPaymentsMessages
> = {
  es: {
    payments: {
      loading:
        "Cargando cobros...",

      page: {
        title: "Cobros",
        subtitle:
          "Consulta y gestiona los pagos registrados en el establecimiento.",
        refresh: "Actualizar",
        refreshing:
          "Actualizando...",
      },

      stats: {
        registered:
          "Cobros registrados",
        allStatuses:
          "Todos los estados",
        collected:
          "Importe cobrado",
        paidCount: (
          count
        ) =>
          `${count} ${
            count === 1
              ? "pago completado"
              : "pagos completados"
          }`,
        pendingAmount:
          "Importe pendiente",
        pendingDescription:
          "Pagos pendientes o parciales",
        refunds:
          "Reembolsos",
        refundsDescription:
          "Pagos marcados como reembolsados",
      },

      filters: {
        search:
          "Buscar por ID, sesión o transacción...",
        allStatuses:
          "Todos los estados",
        allMethods:
          "Todos los métodos",
        visible: (
          shown,
          total
        ) =>
          `${shown} de ${total} cobros visibles.`,
      },

      history: {
        title:
          "Historial de cobros",
        subtitle:
          "Los registros más recientes aparecen primero.",
      },

      empty: {
        title:
          "No se encontraron cobros",
        description:
          "Cambia los filtros o espera a que se registre un nuevo pago.",
      },

      table: {
        payment: "Pago",
        method: "Método",
        amount: "Importe",
        status: "Estado",
        date: "Fecha",
        reference:
          "Referencia",
        actions:
          "Acciones",
        session:
          "Sesión",
        split:
          "División",
        transaction:
          "Transacción",
        receipt:
          "Recibo",
        noActions:
          "Sin acciones",
        updating:
          "Actualizando...",
      },

      statuses: {
        pending:
          "Pendiente",
        partial:
          "Parcial",
        paid:
          "Pagado",
        refunded:
          "Reembolsado",
      },

      methods: {
        card: "Tarjeta",
        cash: "Efectivo",
        transfer:
          "Transferencia",
        paypal: "PayPal",
        apple_pay:
          "Apple Pay",
        google_pay:
          "Google Pay",
      },

      actions: {
        paid:
          "Marcar pagado",
        partial:
          "Marcar parcial",
        refunded:
          "Reembolsar",
      },

      confirmations: {
        refund: (
          id
        ) =>
          `¿Confirmas que quieres marcar el pago #${id} como reembolsado?`,

        statusChange: (
          id,
          from,
          to
        ) =>
          `¿Confirmas el cambio del pago #${id} de "${from}" a "${to}"?`,
      },

      success: {
        updated: (
          id
        ) =>
          `Pago #${id} actualizado correctamente.`,
      },

      errors: {
        load:
          "No se pudieron cargar los cobros.",
        update:
          "No se pudo actualizar el estado del pago.",
      },
    },
  },

  en: {
    payments: {
      loading:
        "Loading payments...",

      page: {
        title: "Payments",
        subtitle:
          "View and manage the payments registered for the establishment.",
        refresh: "Refresh",
        refreshing:
          "Refreshing...",
      },

      stats: {
        registered:
          "Registered payments",
        allStatuses:
          "All statuses",
        collected:
          "Amount collected",
        paidCount: (
          count
        ) =>
          `${count} ${
            count === 1
              ? "completed payment"
              : "completed payments"
          }`,
        pendingAmount:
          "Pending amount",
        pendingDescription:
          "Pending or partial payments",
        refunds: "Refunds",
        refundsDescription:
          "Payments marked as refunded",
      },

      filters: {
        search:
          "Search by ID, session or transaction...",
        allStatuses:
          "All statuses",
        allMethods:
          "All methods",
        visible: (
          shown,
          total
        ) =>
          `${shown} of ${total} payments shown.`,
      },

      history: {
        title:
          "Payment history",
        subtitle:
          "The most recent records are shown first.",
      },

      empty: {
        title:
          "No payments found",
        description:
          "Change the filters or wait for a new payment to be registered.",
      },

      table: {
        payment: "Payment",
        method: "Method",
        amount: "Amount",
        status: "Status",
        date: "Date",
        reference:
          "Reference",
        actions:
          "Actions",
        session:
          "Session",
        split:
          "Split",
        transaction:
          "Transaction",
        receipt:
          "Receipt",
        noActions:
          "No actions",
        updating:
          "Updating...",
      },

      statuses: {
        pending:
          "Pending",
        partial:
          "Partial",
        paid: "Paid",
        refunded:
          "Refunded",
      },

      methods: {
        card: "Card",
        cash: "Cash",
        transfer:
          "Bank transfer",
        paypal: "PayPal",
        apple_pay:
          "Apple Pay",
        google_pay:
          "Google Pay",
      },

      actions: {
        paid:
          "Mark as paid",
        partial:
          "Mark as partial",
        refunded:
          "Refund",
      },

      confirmations: {
        refund: (
          id
        ) =>
          `Confirm marking payment #${id} as refunded?`,

        statusChange: (
          id,
          from,
          to
        ) =>
          `Confirm changing payment #${id} from "${from}" to "${to}"?`,
      },

      success: {
        updated: (
          id
        ) =>
          `Payment #${id} updated successfully.`,
      },

      errors: {
        load:
          "Payments could not be loaded.",
        update:
          "The payment status could not be updated.",
      },
    },
  },

  de: {
    payments: {
      loading:
        "Zahlungen werden geladen...",

      page: {
        title: "Zahlungen",
        subtitle:
          "Registrierte Zahlungen des Betriebs anzeigen und verwalten.",
        refresh:
          "Aktualisieren",
        refreshing:
          "Wird aktualisiert...",
      },

      stats: {
        registered:
          "Registrierte Zahlungen",
        allStatuses:
          "Alle Status",
        collected:
          "Eingenommener Betrag",
        paidCount: (
          count
        ) =>
          `${count} ${
            count === 1
              ? "abgeschlossene Zahlung"
              : "abgeschlossene Zahlungen"
          }`,
        pendingAmount:
          "Ausstehender Betrag",
        pendingDescription:
          "Ausstehende oder teilweise Zahlungen",
        refunds:
          "Erstattungen",
        refundsDescription:
          "Als erstattet markierte Zahlungen",
      },

      filters: {
        search:
          "Nach ID, Sitzung oder Transaktion suchen...",
        allStatuses:
          "Alle Status",
        allMethods:
          "Alle Zahlungsmethoden",
        visible: (
          shown,
          total
        ) =>
          `${shown} von ${total} Zahlungen angezeigt.`,
      },

      history: {
        title:
          "Zahlungsverlauf",
        subtitle:
          "Die neuesten Einträge werden zuerst angezeigt.",
      },

      empty: {
        title:
          "Keine Zahlungen gefunden",
        description:
          "Ändern Sie die Filter oder warten Sie auf eine neue Zahlung.",
      },

      table: {
        payment: "Zahlung",
        method:
          "Zahlungsmethode",
        amount: "Betrag",
        status: "Status",
        date: "Datum",
        reference:
          "Referenz",
        actions:
          "Aktionen",
        session:
          "Sitzung",
        split:
          "Aufteilung",
        transaction:
          "Transaktion",
        receipt: "Beleg",
        noActions:
          "Keine Aktionen",
        updating:
          "Wird aktualisiert...",
      },

      statuses: {
        pending:
          "Ausstehend",
        partial:
          "Teilweise",
        paid: "Bezahlt",
        refunded:
          "Erstattet",
      },

      methods: {
        card: "Karte",
        cash: "Bar",
        transfer:
          "Banküberweisung",
        paypal: "PayPal",
        apple_pay:
          "Apple Pay",
        google_pay:
          "Google Pay",
      },

      actions: {
        paid:
          "Als bezahlt markieren",
        partial:
          "Als teilweise markieren",
        refunded:
          "Erstatten",
      },

      confirmations: {
        refund: (
          id
        ) =>
          `Zahlung #${id} als erstattet markieren?`,

        statusChange: (
          id,
          from,
          to
        ) =>
          `Status der Zahlung #${id} von "${from}" auf "${to}" ändern?`,
      },

      success: {
        updated: (
          id
        ) =>
          `Zahlung #${id} erfolgreich aktualisiert.`,
      },

      errors: {
        load:
          "Die Zahlungen konnten nicht geladen werden.",
        update:
          "Der Zahlungsstatus konnte nicht aktualisiert werden.",
      },
    },
  },

  fr: {
    payments: {
      loading:
        "Chargement des paiements...",

      page: {
        title: "Encaissements",
        subtitle:
          "Consultez et gérez les paiements enregistrés dans l’établissement.",
        refresh:
          "Actualiser",
        refreshing:
          "Actualisation...",
      },

      stats: {
        registered:
          "Paiements enregistrés",
        allStatuses:
          "Tous les statuts",
        collected:
          "Montant encaissé",
        paidCount: (
          count
        ) =>
          `${count} ${
            count === 1
              ? "paiement effectué"
              : "paiements effectués"
          }`,
        pendingAmount:
          "Montant en attente",
        pendingDescription:
          "Paiements en attente ou partiels",
        refunds:
          "Remboursements",
        refundsDescription:
          "Paiements marqués comme remboursés",
      },

      filters: {
        search:
          "Rechercher par ID, session ou transaction...",
        allStatuses:
          "Tous les statuts",
        allMethods:
          "Tous les moyens de paiement",
        visible: (
          shown,
          total
        ) =>
          `${shown} sur ${total} paiements affichés.`,
      },

      history: {
        title:
          "Historique des paiements",
        subtitle:
          "Les enregistrements les plus récents apparaissent en premier.",
      },

      empty: {
        title:
          "Aucun paiement trouvé",
        description:
          "Modifiez les filtres ou attendez l’enregistrement d’un nouveau paiement.",
      },

      table: {
        payment: "Paiement",
        method: "Moyen",
        amount: "Montant",
        status: "Statut",
        date: "Date",
        reference:
          "Référence",
        actions:
          "Actions",
        session:
          "Session",
        split:
          "Division",
        transaction:
          "Transaction",
        receipt: "Reçu",
        noActions:
          "Aucune action",
        updating:
          "Mise à jour...",
      },

      statuses: {
        pending:
          "En attente",
        partial:
          "Partiel",
        paid: "Payé",
        refunded:
          "Remboursé",
      },

      methods: {
        card: "Carte",
        cash: "Espèces",
        transfer:
          "Virement bancaire",
        paypal: "PayPal",
        apple_pay:
          "Apple Pay",
        google_pay:
          "Google Pay",
      },

      actions: {
        paid:
          "Marquer comme payé",
        partial:
          "Marquer comme partiel",
        refunded:
          "Rembourser",
      },

      confirmations: {
        refund: (
          id
        ) =>
          `Confirmer le remboursement du paiement #${id} ?`,

        statusChange: (
          id,
          from,
          to
        ) =>
          `Confirmer le passage du paiement #${id} de « ${from} » à « ${to} » ?`,
      },

      success: {
        updated: (
          id
        ) =>
          `Paiement #${id} mis à jour avec succès.`,
      },

      errors: {
        load:
          "Impossible de charger les paiements.",
        update:
          "Impossible de mettre à jour le statut du paiement.",
      },
    },
  },

  it: {
    payments: {
      loading:
        "Caricamento dei pagamenti...",

      page: {
        title: "Pagamenti",
        subtitle:
          "Consulta e gestisci i pagamenti registrati nella struttura.",
        refresh:
          "Aggiorna",
        refreshing:
          "Aggiornamento...",
      },

      stats: {
        registered:
          "Pagamenti registrati",
        allStatuses:
          "Tutti gli stati",
        collected:
          "Importo incassato",
        paidCount: (
          count
        ) =>
          `${count} ${
            count === 1
              ? "pagamento completato"
              : "pagamenti completati"
          }`,
        pendingAmount:
          "Importo in sospeso",
        pendingDescription:
          "Pagamenti in attesa o parziali",
        refunds:
          "Rimborsi",
        refundsDescription:
          "Pagamenti contrassegnati come rimborsati",
      },

      filters: {
        search:
          "Cerca per ID, sessione o transazione...",
        allStatuses:
          "Tutti gli stati",
        allMethods:
          "Tutti i metodi",
        visible: (
          shown,
          total
        ) =>
          `${shown} di ${total} pagamenti visualizzati.`,
      },

      history: {
        title:
          "Cronologia pagamenti",
        subtitle:
          "I record più recenti vengono visualizzati per primi.",
      },

      empty: {
        title:
          "Nessun pagamento trovato",
        description:
          "Modifica i filtri o attendi la registrazione di un nuovo pagamento.",
      },

      table: {
        payment:
          "Pagamento",
        method: "Metodo",
        amount: "Importo",
        status: "Stato",
        date: "Data",
        reference:
          "Riferimento",
        actions:
          "Azioni",
        session:
          "Sessione",
        split:
          "Divisione",
        transaction:
          "Transazione",
        receipt:
          "Ricevuta",
        noActions:
          "Nessuna azione",
        updating:
          "Aggiornamento...",
      },

      statuses: {
        pending:
          "In attesa",
        partial:
          "Parziale",
        paid: "Pagato",
        refunded:
          "Rimborsato",
      },

      methods: {
        card: "Carta",
        cash: "Contanti",
        transfer:
          "Bonifico bancario",
        paypal: "PayPal",
        apple_pay:
          "Apple Pay",
        google_pay:
          "Google Pay",
      },

      actions: {
        paid:
          "Segna come pagato",
        partial:
          "Segna come parziale",
        refunded:
          "Rimborsa",
      },

      confirmations: {
        refund: (
          id
        ) =>
          `Confermare il rimborso del pagamento #${id}?`,

        statusChange: (
          id,
          from,
          to
        ) =>
          `Confermare il passaggio del pagamento #${id} da "${from}" a "${to}"?`,
      },

      success: {
        updated: (
          id
        ) =>
          `Pagamento #${id} aggiornato correttamente.`,
      },

      errors: {
        load:
          "Impossibile caricare i pagamenti.",
        update:
          "Impossibile aggiornare lo stato del pagamento.",
      },
    },
  },

  pt: {
    payments: {
      loading:
        "A carregar pagamentos...",

      page: {
        title: "Pagamentos",
        subtitle:
          "Consulte e faça a gestão dos pagamentos registados no estabelecimento.",
        refresh:
          "Atualizar",
        refreshing:
          "A atualizar...",
      },

      stats: {
        registered:
          "Pagamentos registados",
        allStatuses:
          "Todos os estados",
        collected:
          "Montante recebido",
        paidCount: (
          count
        ) =>
          `${count} ${
            count === 1
              ? "pagamento concluído"
              : "pagamentos concluídos"
          }`,
        pendingAmount:
          "Montante pendente",
        pendingDescription:
          "Pagamentos pendentes ou parciais",
        refunds:
          "Reembolsos",
        refundsDescription:
          "Pagamentos marcados como reembolsados",
      },

      filters: {
        search:
          "Pesquisar por ID, sessão ou transação...",
        allStatuses:
          "Todos os estados",
        allMethods:
          "Todos os métodos",
        visible: (
          shown,
          total
        ) =>
          `${shown} de ${total} pagamentos visíveis.`,
      },

      history: {
        title:
          "Histórico de pagamentos",
        subtitle:
          "Os registos mais recentes aparecem primeiro.",
      },

      empty: {
        title:
          "Nenhum pagamento encontrado",
        description:
          "Altere os filtros ou aguarde o registo de um novo pagamento.",
      },

      table: {
        payment:
          "Pagamento",
        method: "Método",
        amount: "Montante",
        status: "Estado",
        date: "Data",
        reference:
          "Referência",
        actions:
          "Ações",
        session:
          "Sessão",
        split:
          "Divisão",
        transaction:
          "Transação",
        receipt: "Recibo",
        noActions:
          "Sem ações",
        updating:
          "A atualizar...",
      },

      statuses: {
        pending:
          "Pendente",
        partial:
          "Parcial",
        paid: "Pago",
        refunded:
          "Reembolsado",
      },

      methods: {
        card: "Cartão",
        cash: "Dinheiro",
        transfer:
          "Transferência bancária",
        paypal: "PayPal",
        apple_pay:
          "Apple Pay",
        google_pay:
          "Google Pay",
      },

      actions: {
        paid:
          "Marcar como pago",
        partial:
          "Marcar como parcial",
        refunded:
          "Reembolsar",
      },

      confirmations: {
        refund: (
          id
        ) =>
          `Confirmar o reembolso do pagamento #${id}?`,

        statusChange: (
          id,
          from,
          to
        ) =>
          `Confirmar a alteração do pagamento #${id} de "${from}" para "${to}"?`,
      },

      success: {
        updated: (
          id
        ) =>
          `Pagamento #${id} atualizado com sucesso.`,
      },

      errors: {
        load:
          "Não foi possível carregar os pagamentos.",
        update:
          "Não foi possível atualizar o estado do pagamento.",
      },
    },
  },
};