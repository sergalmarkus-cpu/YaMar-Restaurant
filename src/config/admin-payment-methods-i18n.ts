import type {
  Language,
  PaymentMethod,
} from "@/types";

interface AdminPaymentMethodsMessages {
  loading: string;

  page: {
    title: string;
    subtitle: string;
    refresh: string;
    refreshing: string;
  };

  stats: {
    configured: string;
    active: string;
    inactive: string;
  };

  empty: {
    title: string;
    description: string;
  };

  fields: {
    displayName: string;
    sortOrder: string;
    status: string;
  };

  status: {
    active: string;
    inactive: string;
  };

  actions: {
    reset: string;
    save: string;
    saving: string;
  };

  validation: {
    sortOrder: string;
    displayName: string;
  };

  errors: {
    load: string;
    update: string;
  };

  success: {
    updated: (
      name: string
    ) => string;
  };

  info: string;

  methods: Record<
    PaymentMethod,
    string
  >;
}

export const ADMIN_PAYMENT_METHODS_MESSAGES: Record<
  Language,
  AdminPaymentMethodsMessages
> = {
  es: {
    loading:
      "Cargando métodos de pago...",

    page: {
      title:
        "Métodos de pago",
      subtitle:
        "Configura los métodos de pago disponibles en el establecimiento.",
      refresh:
        "Actualizar",
      refreshing:
        "Actualizando...",
    },

    stats: {
      configured:
        "Métodos configurados",
      active:
        "Activos",
      inactive:
        "Inactivos",
    },

    empty: {
      title:
        "No hay métodos de pago",
      description:
        "No se encontraron métodos de pago para este establecimiento.",
    },

    fields: {
      displayName:
        "Nombre visible",
      sortOrder:
        "Orden",
      status:
        "Estado",
    },

    status: {
      active:
        "Activo",
      inactive:
        "Inactivo",
    },

    actions: {
      reset:
        "Restablecer",
      save:
        "Guardar",
      saving:
        "Guardando...",
    },

    validation: {
      sortOrder:
        "El orden debe ser un número entero entre 0 y 100.",
      displayName:
        "El nombre visible no puede superar los 80 caracteres.",
    },

    errors: {
      load:
        "No se pudieron cargar los métodos de pago.",
      update:
        "No se pudo actualizar el método de pago.",
    },

    success: {
      updated: (
        name
      ) =>
        `${name} actualizado correctamente.`,
    },

    info:
      "Los métodos de pago base se crean automáticamente para cada establecimiento. Desde esta pantalla puedes decidir cuáles estarán disponibles, cambiar su nombre visible y controlar su orden.",

    methods: {
      card:
        "Tarjeta",
      cash:
        "Efectivo",
      transfer:
        "Transferencia bancaria",
      paypal:
        "PayPal",
      apple_pay:
        "Apple Pay",
      google_pay:
        "Google Pay",
    },
  },

  en: {
    loading:
      "Loading payment methods...",

    page: {
      title:
        "Payment methods",
      subtitle:
        "Configure the payment methods available for the establishment.",
      refresh:
        "Refresh",
      refreshing:
        "Refreshing...",
    },

    stats: {
      configured:
        "Configured methods",
      active:
        "Active",
      inactive:
        "Inactive",
    },

    empty: {
      title:
        "No payment methods",
      description:
        "No payment methods were found for this establishment.",
    },

    fields: {
      displayName:
        "Display name",
      sortOrder:
        "Order",
      status:
        "Status",
    },

    status: {
      active:
        "Active",
      inactive:
        "Inactive",
    },

    actions: {
      reset:
        "Reset",
      save:
        "Save",
      saving:
        "Saving...",
    },

    validation: {
      sortOrder:
        "The order must be an integer between 0 and 100.",
      displayName:
        "The display name cannot exceed 80 characters.",
    },

    errors: {
      load:
        "Payment methods could not be loaded.",
      update:
        "The payment method could not be updated.",
    },

    success: {
      updated: (
        name
      ) =>
        `${name} updated successfully.`,
    },

    info:
      "Base payment methods are created automatically for each establishment. From this screen you can choose which ones are available, change their display name and control their order.",

    methods: {
      card:
        "Card",
      cash:
        "Cash",
      transfer:
        "Bank transfer",
      paypal:
        "PayPal",
      apple_pay:
        "Apple Pay",
      google_pay:
        "Google Pay",
    },
  },

  de: {
    loading:
      "Zahlungsmethoden werden geladen...",

    page: {
      title:
        "Zahlungsmethoden",
      subtitle:
        "Konfigurieren Sie die verfügbaren Zahlungsmethoden des Betriebs.",
      refresh:
        "Aktualisieren",
      refreshing:
        "Wird aktualisiert...",
    },

    stats: {
      configured:
        "Konfigurierte Methoden",
      active:
        "Aktiv",
      inactive:
        "Inaktiv",
    },

    empty: {
      title:
        "Keine Zahlungsmethoden",
      description:
        "Für diesen Betrieb wurden keine Zahlungsmethoden gefunden.",
    },

    fields: {
      displayName:
        "Anzeigename",
      sortOrder:
        "Reihenfolge",
      status:
        "Status",
    },

    status: {
      active:
        "Aktiv",
      inactive:
        "Inaktiv",
    },

    actions: {
      reset:
        "Zurücksetzen",
      save:
        "Speichern",
      saving:
        "Wird gespeichert...",
    },

    validation: {
      sortOrder:
        "Die Reihenfolge muss eine ganze Zahl zwischen 0 und 100 sein.",
      displayName:
        "Der Anzeigename darf höchstens 80 Zeichen lang sein.",
    },

    errors: {
      load:
        "Die Zahlungsmethoden konnten nicht geladen werden.",
      update:
        "Die Zahlungsmethode konnte nicht aktualisiert werden.",
    },

    success: {
      updated: (
        name
      ) =>
        `${name} erfolgreich aktualisiert.`,
    },

    info:
      "Die grundlegenden Zahlungsmethoden werden für jeden Betrieb automatisch erstellt. Hier können Sie festlegen, welche verfügbar sind, ihren Anzeigenamen ändern und ihre Reihenfolge steuern.",

    methods: {
      card:
        "Karte",
      cash:
        "Bar",
      transfer:
        "Banküberweisung",
      paypal:
        "PayPal",
      apple_pay:
        "Apple Pay",
      google_pay:
        "Google Pay",
    },
  },

  fr: {
    loading:
      "Chargement des moyens de paiement...",

    page: {
      title:
        "Moyens de paiement",
      subtitle:
        "Configurez les moyens de paiement disponibles dans l’établissement.",
      refresh:
        "Actualiser",
      refreshing:
        "Actualisation...",
    },

    stats: {
      configured:
        "Moyens configurés",
      active:
        "Actifs",
      inactive:
        "Inactifs",
    },

    empty: {
      title:
        "Aucun moyen de paiement",
      description:
        "Aucun moyen de paiement n’a été trouvé pour cet établissement.",
    },

    fields: {
      displayName:
        "Nom affiché",
      sortOrder:
        "Ordre",
      status:
        "Statut",
    },

    status: {
      active:
        "Actif",
      inactive:
        "Inactif",
    },

    actions: {
      reset:
        "Réinitialiser",
      save:
        "Enregistrer",
      saving:
        "Enregistrement...",
    },

    validation: {
      sortOrder:
        "L’ordre doit être un nombre entier compris entre 0 et 100.",
      displayName:
        "Le nom affiché ne peut pas dépasser 80 caractères.",
    },

    errors: {
      load:
        "Impossible de charger les moyens de paiement.",
      update:
        "Impossible de mettre à jour le moyen de paiement.",
    },

    success: {
      updated: (
        name
      ) =>
        `${name} mis à jour avec succès.`,
    },

    info:
      "Les moyens de paiement de base sont créés automatiquement pour chaque établissement. Depuis cet écran, vous pouvez choisir ceux qui sont disponibles, modifier leur nom affiché et définir leur ordre.",

    methods: {
      card:
        "Carte",
      cash:
        "Espèces",
      transfer:
        "Virement bancaire",
      paypal:
        "PayPal",
      apple_pay:
        "Apple Pay",
      google_pay:
        "Google Pay",
    },
  },

  it: {
    loading:
      "Caricamento dei metodi di pagamento...",

    page: {
      title:
        "Metodi di pagamento",
      subtitle:
        "Configura i metodi di pagamento disponibili nella struttura.",
      refresh:
        "Aggiorna",
      refreshing:
        "Aggiornamento...",
    },

    stats: {
      configured:
        "Metodi configurati",
      active:
        "Attivi",
      inactive:
        "Inattivi",
    },

    empty: {
      title:
        "Nessun metodo di pagamento",
      description:
        "Non sono stati trovati metodi di pagamento per questa struttura.",
    },

    fields: {
      displayName:
        "Nome visualizzato",
      sortOrder:
        "Ordine",
      status:
        "Stato",
    },

    status: {
      active:
        "Attivo",
      inactive:
        "Inattivo",
    },

    actions: {
      reset:
        "Ripristina",
      save:
        "Salva",
      saving:
        "Salvataggio...",
    },

    validation: {
      sortOrder:
        "L’ordine deve essere un numero intero compreso tra 0 e 100.",
      displayName:
        "Il nome visualizzato non può superare gli 80 caratteri.",
    },

    errors: {
      load:
        "Impossibile caricare i metodi di pagamento.",
      update:
        "Impossibile aggiornare il metodo di pagamento.",
    },

    success: {
      updated: (
        name
      ) =>
        `${name} aggiornato correttamente.`,
    },

    info:
      "I metodi di pagamento di base vengono creati automaticamente per ogni struttura. Da questa schermata puoi scegliere quali rendere disponibili, modificarne il nome visualizzato e controllarne l’ordine.",

    methods: {
      card:
        "Carta",
      cash:
        "Contanti",
      transfer:
        "Bonifico bancario",
      paypal:
        "PayPal",
      apple_pay:
        "Apple Pay",
      google_pay:
        "Google Pay",
    },
  },

  pt: {
    loading:
      "A carregar métodos de pagamento...",

    page: {
      title:
        "Métodos de pagamento",
      subtitle:
        "Configure os métodos de pagamento disponíveis no estabelecimento.",
      refresh:
        "Atualizar",
      refreshing:
        "A atualizar...",
    },

    stats: {
      configured:
        "Métodos configurados",
      active:
        "Ativos",
      inactive:
        "Inativos",
    },

    empty: {
      title:
        "Sem métodos de pagamento",
      description:
        "Não foram encontrados métodos de pagamento para este estabelecimento.",
    },

    fields: {
      displayName:
        "Nome apresentado",
      sortOrder:
        "Ordem",
      status:
        "Estado",
    },

    status: {
      active:
        "Ativo",
      inactive:
        "Inativo",
    },

    actions: {
      reset:
        "Repor",
      save:
        "Guardar",
      saving:
        "A guardar...",
    },

    validation: {
      sortOrder:
        "A ordem deve ser um número inteiro entre 0 e 100.",
      displayName:
        "O nome apresentado não pode exceder 80 caracteres.",
    },

    errors: {
      load:
        "Não foi possível carregar os métodos de pagamento.",
      update:
        "Não foi possível atualizar o método de pagamento.",
    },

    success: {
      updated: (
        name
      ) =>
        `${name} atualizado com sucesso.`,
    },

    info:
      "Os métodos de pagamento base são criados automaticamente para cada estabelecimento. Neste ecrã pode escolher quais ficam disponíveis, alterar o nome apresentado e controlar a respetiva ordem.",

    methods: {
      card:
        "Cartão",
      cash:
        "Dinheiro",
      transfer:
        "Transferência bancária",
      paypal:
        "PayPal",
      apple_pay:
        "Apple Pay",
      google_pay:
        "Google Pay",
    },
  },
};