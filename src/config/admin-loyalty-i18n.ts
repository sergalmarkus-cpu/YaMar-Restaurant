export type AdminLoyaltyLanguage =
  | "es"
  | "en"
  | "de"
  | "fr"
  | "it"
  | "pt";

export interface AdminLoyaltyMessages {
  loading: string;

  title: string;
  subtitle: string;

  refresh: string;
  refreshing: string;

  shownRecords: string;
  shownCustomers: string;
  shownPoints: string;
  shownSpent: string;

  searchRecords: string;
  filterAll: string;
  filterEmail: string;
  filterSession: string;

  emailPlaceholder: string;
  sessionPlaceholder: string;
  selectFilterPlaceholder: string;

  search: string;
  clear: string;
  activeFilter: string;
  activeFilterEmail: string;
  activeFilterSession: string;

  editRecord: string;
  newRecord: string;
  sessionHelp: string;
  cancel: string;

  sessionId: string;
  customerEmail: string;
  points: string;
  totalSpent: string;
  lastVisit: string;
  nullLastVisitHelp: string;

  saving: string;
  saveChanges: string;
  createRecord: string;

  recordsTitle: string;
  recordsSubtitle: string;

  noRecords: string;
  noRecordsDescription: string;

  customer: string;
  spent: string;
  session: string;
  actions: string;

  recordNumber: (id: number) => string;

  edit: string;
  delete: string;

  loadError: string;
  createError: string;
  updateError: string;
  deleteError: string;

  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;

  invalidSessionId: string;
  invalidCustomerEmail: string;
  invalidPoints: string;
  invalidTotalSpent: string;
  invalidLastVisit: string;

  missingFilterValue: string;
  invalidFilterEmail: string;
  invalidFilterSession: string;

  deleteConfirm: (email: string) => string;
}

export const ADMIN_LOYALTY_MESSAGES: Record<
  AdminLoyaltyLanguage,
  AdminLoyaltyMessages
> = {
  es: {
    loading: "Cargando fidelización...",

    title: "Fidelización",
    subtitle:
      "Gestiona los puntos, el gasto acumulado y la última visita de los clientes.",

    refresh: "Actualizar",
    refreshing: "Actualizando...",

    shownRecords: "Registros mostrados",
    shownCustomers: "Clientes mostrados",
    shownPoints: "Puntos mostrados",
    shownSpent: "Gasto mostrado",

    searchRecords: "Buscar registros",
    filterAll: "Todos",
    filterEmail: "Email del cliente",
    filterSession: "ID de sesión",

    emailPlaceholder: "cliente@ejemplo.com",
    sessionPlaceholder: "UUID de la sesión",
    selectFilterPlaceholder: "Selecciona un filtro",

    search: "Buscar",
    clear: "Limpiar",
    activeFilter: "Filtro activo",
    activeFilterEmail: "email",
    activeFilterSession: "sesión",

    editRecord: "Editar registro",
    newRecord: "Nuevo registro",
    sessionHelp:
      "El ID de sesión debe corresponder a una sesión real del establecimiento.",
    cancel: "Cancelar",

    sessionId: "ID de sesión",
    customerEmail: "Email del cliente",
    points: "Puntos",
    totalSpent: "Gasto total",
    lastVisit: "Última visita",
    nullLastVisitHelp:
      "Si la dejas vacía durante una edición, se guardará como null.",

    saving: "Guardando...",
    saveChanges: "Guardar cambios",
    createRecord: "Crear registro",

    recordsTitle: "Registros de fidelización",
    recordsSubtitle:
      "Cada registro está asociado a una sesión concreta.",

    noRecords: "No hay registros",
    noRecordsDescription:
      "No se han encontrado registros de fidelización para el criterio actual.",

    customer: "Cliente",
    spent: "Gasto",
    session: "Sesión",
    actions: "Acciones",

    recordNumber: (id) => `Registro #${id}`,

    edit: "Editar",
    delete: "Eliminar",

    loadError:
      "No se pudieron cargar los registros de fidelización.",
    createError:
      "No se pudo crear el registro de fidelización.",
    updateError:
      "No se pudo actualizar el registro de fidelización.",
    deleteError:
      "No se pudo eliminar el registro de fidelización.",

    createSuccess:
      "Registro de fidelización creado correctamente.",
    updateSuccess:
      "Registro de fidelización actualizado correctamente.",
    deleteSuccess:
      "Registro de fidelización eliminado correctamente.",

    invalidSessionId:
      "El ID de sesión debe ser un UUID válido.",
    invalidCustomerEmail:
      "El email del cliente no es válido.",
    invalidPoints:
      "Los puntos deben ser un número entero igual o mayor que cero.",
    invalidTotalSpent:
      "El gasto total debe tener un formato válido.",
    invalidLastVisit:
      "La fecha de última visita no es válida.",

    missingFilterValue:
      "Introduce un valor para realizar la búsqueda.",
    invalidFilterEmail:
      "Introduce un email válido.",
    invalidFilterSession:
      "Introduce un UUID de sesión válido.",

    deleteConfirm: (email) =>
      `¿Eliminar el registro de fidelización de ${email}? Esta acción no se puede deshacer.`,
  },

  en: {
    loading: "Loading loyalty records...",

    title: "Loyalty",
    subtitle:
      "Manage customer points, accumulated spending and last visit.",

    refresh: "Refresh",
    refreshing: "Refreshing...",

    shownRecords: "Records shown",
    shownCustomers: "Customers shown",
    shownPoints: "Points shown",
    shownSpent: "Spending shown",

    searchRecords: "Search records",
    filterAll: "All",
    filterEmail: "Customer email",
    filterSession: "Session ID",

    emailPlaceholder: "customer@example.com",
    sessionPlaceholder: "Session UUID",
    selectFilterPlaceholder: "Select a filter",

    search: "Search",
    clear: "Clear",
    activeFilter: "Active filter",
    activeFilterEmail: "email",
    activeFilterSession: "session",

    editRecord: "Edit record",
    newRecord: "New record",
    sessionHelp:
      "The session ID must belong to a real session of the establishment.",
    cancel: "Cancel",

    sessionId: "Session ID",
    customerEmail: "Customer email",
    points: "Points",
    totalSpent: "Total spent",
    lastVisit: "Last visit",
    nullLastVisitHelp:
      "If left empty while editing, it will be saved as null.",

    saving: "Saving...",
    saveChanges: "Save changes",
    createRecord: "Create record",

    recordsTitle: "Loyalty records",
    recordsSubtitle:
      "Each record is associated with a specific session.",

    noRecords: "No records",
    noRecordsDescription:
      "No loyalty records were found for the current criteria.",

    customer: "Customer",
    spent: "Spent",
    session: "Session",
    actions: "Actions",

    recordNumber: (id) => `Record #${id}`,

    edit: "Edit",
    delete: "Delete",

    loadError:
      "Loyalty records could not be loaded.",
    createError:
      "The loyalty record could not be created.",
    updateError:
      "The loyalty record could not be updated.",
    deleteError:
      "The loyalty record could not be deleted.",

    createSuccess:
      "Loyalty record created successfully.",
    updateSuccess:
      "Loyalty record updated successfully.",
    deleteSuccess:
      "Loyalty record deleted successfully.",

    invalidSessionId:
      "The session ID must be a valid UUID.",
    invalidCustomerEmail:
      "The customer email is not valid.",
    invalidPoints:
      "Points must be an integer greater than or equal to zero.",
    invalidTotalSpent:
      "Total spending must have a valid format.",
    invalidLastVisit:
      "The last visit date is not valid.",

    missingFilterValue:
      "Enter a value to perform the search.",
    invalidFilterEmail:
      "Enter a valid email address.",
    invalidFilterSession:
      "Enter a valid session UUID.",

    deleteConfirm: (email) =>
      `Delete the loyalty record for ${email}? This action cannot be undone.`,
  },

  de: {
    loading: "Treuedaten werden geladen...",

    title: "Kundenbindung",
    subtitle:
      "Verwalte Punkte, kumulierte Ausgaben und den letzten Besuch der Kunden.",

    refresh: "Aktualisieren",
    refreshing: "Wird aktualisiert...",

    shownRecords: "Angezeigte Einträge",
    shownCustomers: "Angezeigte Kunden",
    shownPoints: "Angezeigte Punkte",
    shownSpent: "Angezeigte Ausgaben",

    searchRecords: "Einträge suchen",
    filterAll: "Alle",
    filterEmail: "Kunden-E-Mail",
    filterSession: "Sitzungs-ID",

    emailPlaceholder: "kunde@beispiel.de",
    sessionPlaceholder: "Sitzungs-UUID",
    selectFilterPlaceholder: "Filter auswählen",

    search: "Suchen",
    clear: "Zurücksetzen",
    activeFilter: "Aktiver Filter",
    activeFilterEmail: "E-Mail",
    activeFilterSession: "Sitzung",

    editRecord: "Eintrag bearbeiten",
    newRecord: "Neuer Eintrag",
    sessionHelp:
      "Die Sitzungs-ID muss zu einer tatsächlichen Sitzung des Betriebs gehören.",
    cancel: "Abbrechen",

    sessionId: "Sitzungs-ID",
    customerEmail: "Kunden-E-Mail",
    points: "Punkte",
    totalSpent: "Gesamtausgaben",
    lastVisit: "Letzter Besuch",
    nullLastVisitHelp:
      "Wird das Feld beim Bearbeiten leer gelassen, wird null gespeichert.",

    saving: "Wird gespeichert...",
    saveChanges: "Änderungen speichern",
    createRecord: "Eintrag erstellen",

    recordsTitle: "Treueeinträge",
    recordsSubtitle:
      "Jeder Eintrag ist einer bestimmten Sitzung zugeordnet.",

    noRecords: "Keine Einträge",
    noRecordsDescription:
      "Für die aktuellen Kriterien wurden keine Treueeinträge gefunden.",

    customer: "Kunde",
    spent: "Ausgaben",
    session: "Sitzung",
    actions: "Aktionen",

    recordNumber: (id) => `Eintrag #${id}`,

    edit: "Bearbeiten",
    delete: "Löschen",

    loadError:
      "Die Treueeinträge konnten nicht geladen werden.",
    createError:
      "Der Treueeintrag konnte nicht erstellt werden.",
    updateError:
      "Der Treueeintrag konnte nicht aktualisiert werden.",
    deleteError:
      "Der Treueeintrag konnte nicht gelöscht werden.",

    createSuccess:
      "Treueeintrag erfolgreich erstellt.",
    updateSuccess:
      "Treueeintrag erfolgreich aktualisiert.",
    deleteSuccess:
      "Treueeintrag erfolgreich gelöscht.",

    invalidSessionId:
      "Die Sitzungs-ID muss eine gültige UUID sein.",
    invalidCustomerEmail:
      "Die Kunden-E-Mail ist ungültig.",
    invalidPoints:
      "Punkte müssen eine ganze Zahl größer oder gleich null sein.",
    invalidTotalSpent:
      "Die Gesamtausgaben haben kein gültiges Format.",
    invalidLastVisit:
      "Das Datum des letzten Besuchs ist ungültig.",

    missingFilterValue:
      "Gib einen Wert für die Suche ein.",
    invalidFilterEmail:
      "Gib eine gültige E-Mail-Adresse ein.",
    invalidFilterSession:
      "Gib eine gültige Sitzungs-UUID ein.",

    deleteConfirm: (email) =>
      `Treueeintrag für ${email} löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,
  },

  fr: {
    loading: "Chargement de la fidélisation...",

    title: "Fidélisation",
    subtitle:
      "Gérez les points, les dépenses cumulées et la dernière visite des clients.",

    refresh: "Actualiser",
    refreshing: "Actualisation...",

    shownRecords: "Enregistrements affichés",
    shownCustomers: "Clients affichés",
    shownPoints: "Points affichés",
    shownSpent: "Dépenses affichées",

    searchRecords: "Rechercher des enregistrements",
    filterAll: "Tous",
    filterEmail: "E-mail du client",
    filterSession: "ID de session",

    emailPlaceholder: "client@exemple.fr",
    sessionPlaceholder: "UUID de la session",
    selectFilterPlaceholder: "Sélectionnez un filtre",

    search: "Rechercher",
    clear: "Effacer",
    activeFilter: "Filtre actif",
    activeFilterEmail: "e-mail",
    activeFilterSession: "session",

    editRecord: "Modifier l'enregistrement",
    newRecord: "Nouvel enregistrement",
    sessionHelp:
      "L'ID de session doit correspondre à une session réelle de l'établissement.",
    cancel: "Annuler",

    sessionId: "ID de session",
    customerEmail: "E-mail du client",
    points: "Points",
    totalSpent: "Dépenses totales",
    lastVisit: "Dernière visite",
    nullLastVisitHelp:
      "Si le champ est laissé vide pendant une modification, null sera enregistré.",

    saving: "Enregistrement...",
    saveChanges: "Enregistrer les modifications",
    createRecord: "Créer l'enregistrement",

    recordsTitle: "Enregistrements de fidélisation",
    recordsSubtitle:
      "Chaque enregistrement est associé à une session précise.",

    noRecords: "Aucun enregistrement",
    noRecordsDescription:
      "Aucun enregistrement de fidélisation ne correspond au critère actuel.",

    customer: "Client",
    spent: "Dépenses",
    session: "Session",
    actions: "Actions",

    recordNumber: (id) => `Enregistrement #${id}`,

    edit: "Modifier",
    delete: "Supprimer",

    loadError:
      "Impossible de charger les enregistrements de fidélisation.",
    createError:
      "Impossible de créer l'enregistrement de fidélisation.",
    updateError:
      "Impossible de mettre à jour l'enregistrement de fidélisation.",
    deleteError:
      "Impossible de supprimer l'enregistrement de fidélisation.",

    createSuccess:
      "Enregistrement de fidélisation créé avec succès.",
    updateSuccess:
      "Enregistrement de fidélisation mis à jour avec succès.",
    deleteSuccess:
      "Enregistrement de fidélisation supprimé avec succès.",

    invalidSessionId:
      "L'ID de session doit être un UUID valide.",
    invalidCustomerEmail:
      "L'e-mail du client n'est pas valide.",
    invalidPoints:
      "Les points doivent être un nombre entier supérieur ou égal à zéro.",
    invalidTotalSpent:
      "Les dépenses totales doivent avoir un format valide.",
    invalidLastVisit:
      "La date de dernière visite n'est pas valide.",

    missingFilterValue:
      "Saisissez une valeur pour effectuer la recherche.",
    invalidFilterEmail:
      "Saisissez une adresse e-mail valide.",
    invalidFilterSession:
      "Saisissez un UUID de session valide.",

    deleteConfirm: (email) =>
      `Supprimer l'enregistrement de fidélisation de ${email} ? Cette action est irréversible.`,
  },

  it: {
    loading: "Caricamento fidelizzazione...",

    title: "Fidelizzazione",
    subtitle:
      "Gestisci punti, spesa accumulata e ultima visita dei clienti.",

    refresh: "Aggiorna",
    refreshing: "Aggiornamento...",

    shownRecords: "Record mostrati",
    shownCustomers: "Clienti mostrati",
    shownPoints: "Punti mostrati",
    shownSpent: "Spesa mostrata",

    searchRecords: "Cerca record",
    filterAll: "Tutti",
    filterEmail: "Email del cliente",
    filterSession: "ID sessione",

    emailPlaceholder: "cliente@esempio.it",
    sessionPlaceholder: "UUID della sessione",
    selectFilterPlaceholder: "Seleziona un filtro",

    search: "Cerca",
    clear: "Cancella",
    activeFilter: "Filtro attivo",
    activeFilterEmail: "email",
    activeFilterSession: "sessione",

    editRecord: "Modifica record",
    newRecord: "Nuovo record",
    sessionHelp:
      "L'ID della sessione deve corrispondere a una sessione reale della struttura.",
    cancel: "Annulla",

    sessionId: "ID sessione",
    customerEmail: "Email del cliente",
    points: "Punti",
    totalSpent: "Spesa totale",
    lastVisit: "Ultima visita",
    nullLastVisitHelp:
      "Se lasciato vuoto durante la modifica, verrà salvato come null.",

    saving: "Salvataggio...",
    saveChanges: "Salva modifiche",
    createRecord: "Crea record",

    recordsTitle: "Record di fidelizzazione",
    recordsSubtitle:
      "Ogni record è associato a una sessione specifica.",

    noRecords: "Nessun record",
    noRecordsDescription:
      "Non sono stati trovati record di fidelizzazione per il criterio attuale.",

    customer: "Cliente",
    spent: "Spesa",
    session: "Sessione",
    actions: "Azioni",

    recordNumber: (id) => `Record #${id}`,

    edit: "Modifica",
    delete: "Elimina",

    loadError:
      "Impossibile caricare i record di fidelizzazione.",
    createError:
      "Impossibile creare il record di fidelizzazione.",
    updateError:
      "Impossibile aggiornare il record di fidelizzazione.",
    deleteError:
      "Impossibile eliminare il record di fidelizzazione.",

    createSuccess:
      "Record di fidelizzazione creato correttamente.",
    updateSuccess:
      "Record di fidelizzazione aggiornato correttamente.",
    deleteSuccess:
      "Record di fidelizzazione eliminato correttamente.",

    invalidSessionId:
      "L'ID della sessione deve essere un UUID valido.",
    invalidCustomerEmail:
      "L'email del cliente non è valida.",
    invalidPoints:
      "I punti devono essere un numero intero maggiore o uguale a zero.",
    invalidTotalSpent:
      "La spesa totale deve avere un formato valido.",
    invalidLastVisit:
      "La data dell'ultima visita non è valida.",

    missingFilterValue:
      "Inserisci un valore per eseguire la ricerca.",
    invalidFilterEmail:
      "Inserisci un indirizzo email valido.",
    invalidFilterSession:
      "Inserisci un UUID di sessione valido.",

    deleteConfirm: (email) =>
      `Eliminare il record di fidelizzazione di ${email}? Questa azione non può essere annullata.`,
  },

  pt: {
    loading: "A carregar fidelização...",

    title: "Fidelização",
    subtitle:
      "Gira os pontos, os gastos acumulados e a última visita dos clientes.",

    refresh: "Atualizar",
    refreshing: "A atualizar...",

    shownRecords: "Registos apresentados",
    shownCustomers: "Clientes apresentados",
    shownPoints: "Pontos apresentados",
    shownSpent: "Gastos apresentados",

    searchRecords: "Pesquisar registos",
    filterAll: "Todos",
    filterEmail: "E-mail do cliente",
    filterSession: "ID da sessão",

    emailPlaceholder: "cliente@exemplo.pt",
    sessionPlaceholder: "UUID da sessão",
    selectFilterPlaceholder: "Selecione um filtro",

    search: "Pesquisar",
    clear: "Limpar",
    activeFilter: "Filtro ativo",
    activeFilterEmail: "e-mail",
    activeFilterSession: "sessão",

    editRecord: "Editar registo",
    newRecord: "Novo registo",
    sessionHelp:
      "O ID da sessão deve corresponder a uma sessão real do estabelecimento.",
    cancel: "Cancelar",

    sessionId: "ID da sessão",
    customerEmail: "E-mail do cliente",
    points: "Pontos",
    totalSpent: "Gasto total",
    lastVisit: "Última visita",
    nullLastVisitHelp:
      "Se deixar vazio durante uma edição, será guardado como null.",

    saving: "A guardar...",
    saveChanges: "Guardar alterações",
    createRecord: "Criar registo",

    recordsTitle: "Registos de fidelização",
    recordsSubtitle:
      "Cada registo está associado a uma sessão específica.",

    noRecords: "Não há registos",
    noRecordsDescription:
      "Não foram encontrados registos de fidelização para o critério atual.",

    customer: "Cliente",
    spent: "Gasto",
    session: "Sessão",
    actions: "Ações",

    recordNumber: (id) => `Registo #${id}`,

    edit: "Editar",
    delete: "Eliminar",

    loadError:
      "Não foi possível carregar os registos de fidelização.",
    createError:
      "Não foi possível criar o registo de fidelização.",
    updateError:
      "Não foi possível atualizar o registo de fidelização.",
    deleteError:
      "Não foi possível eliminar o registo de fidelização.",

    createSuccess:
      "Registo de fidelização criado com sucesso.",
    updateSuccess:
      "Registo de fidelização atualizado com sucesso.",
    deleteSuccess:
      "Registo de fidelização eliminado com sucesso.",

    invalidSessionId:
      "O ID da sessão deve ser um UUID válido.",
    invalidCustomerEmail:
      "O e-mail do cliente não é válido.",
    invalidPoints:
      "Os pontos devem ser um número inteiro igual ou superior a zero.",
    invalidTotalSpent:
      "O gasto total deve ter um formato válido.",
    invalidLastVisit:
      "A data da última visita não é válida.",

    missingFilterValue:
      "Introduza um valor para realizar a pesquisa.",
    invalidFilterEmail:
      "Introduza um endereço de e-mail válido.",
    invalidFilterSession:
      "Introduza um UUID de sessão válido.",

    deleteConfirm: (email) =>
      `Eliminar o registo de fidelização de ${email}? Esta ação não pode ser anulada.`,
  },
};