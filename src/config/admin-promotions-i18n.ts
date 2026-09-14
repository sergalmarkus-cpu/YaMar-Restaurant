export type AdminPromotionLanguage =
  | "es"
  | "en"
  | "de"
  | "fr"
  | "it"
  | "pt";

export type AdminPromotionDiscountType =
  | "percentage"
  | "fixed"
  | "free_item";

interface DiscountTypeMessages {
  percentage: string;
  fixed: string;
  free_item: string;
}

interface StatusMessages {
  inactive: string;
  scheduled: string;
  finished: string;
  running: string;
}

export interface AdminPromotionsMessages {
  title: string;
  subtitle: string;

  loading: string;
  refresh: string;
  refreshing: string;

  statPromotions: string;
  statActive: string;
  statRunning: string;

  newPromotion: string;
  editPromotion: string;
  editingPromotion: (id: number) => string;
  createDescription: string;
  cancel: string;

  name: string;
  description: string;
  optionalDescription: string;

  code: string;
  codePlaceholder: string;

  discountType: string;
  discountValue: string;
  usageLimit: string;
  noUsageLimit: string;

  start: string;
  end: string;
  minAmount: string;
  noMinimum: string;

  scope: string;
  scopeHelp: string;
  menus: string;
  categories: string;
  products: string;
  noItems: string;

  active: string;
  inactive: string;

  saving: string;
  saveChanges: string;
  createPromotion: string;

  configuredPromotions: string;
  configuredHelp: string;
  noPromotions: string;
  createFirstPromotion: string;

  codeLabel: string;
  uses: string;

  activate: string;
  deactivate: string;
  edit: string;
  delete: string;

  fallbackPromotion: (id: number) => string;

  invalidName: string;
  codeTooLong: string;
  invalidDiscount: string;
  invalidPercentage: string;
  invalidFixed: string;
  invalidMinimum: string;
  datesRequired: string;
  datesInvalid: string;
  invalidDateRange: string;
  invalidUsageLimit: string;

  loadPromotionsError: string;
  loadProductsError: string;
  loadCategoriesError: string;
  loadMenusError: string;
  loadDataError: string;

  createError: string;
  updateError: string;
  toggleError: string;
  deleteError: string;

  createSuccess: string;
  updateSuccess: string;
  activatedSuccess: string;
  deactivatedSuccess: string;
  deleteSuccess: string;

  deleteConfirm: (name: string) => string;

  fixedDiscountSuffix: string;

  discounts: DiscountTypeMessages;
  statuses: StatusMessages;
}

export const ADMIN_PROMOTIONS_MESSAGES: Record<
  AdminPromotionLanguage,
  AdminPromotionsMessages
> = {
  es: {
    title: "Promociones",
    subtitle:
      "Crea descuentos y promociones aplicables a productos, categorías o menús.",

    loading: "Cargando promociones...",
    refresh: "Actualizar",
    refreshing: "Actualizando...",

    statPromotions: "Promociones",
    statActive: "Activas",
    statRunning: "En curso ahora",

    newPromotion: "Nueva promoción",
    editPromotion: "Editar promoción",
    editingPromotion: (id) =>
      `Editando la promoción #${id}.`,
    createDescription:
      "Configura el descuento, periodo de validez y condiciones de aplicación.",
    cancel: "Cancelar",

    name: "Nombre",
    description: "Descripción",
    optionalDescription:
      "Opcional. Puedes dejar todos los idiomas vacíos.",

    code: "Código",
    codePlaceholder: "Ej. VERANO20",

    discountType: "Tipo de descuento",
    discountValue: "Valor",
    usageLimit: "Límite de usos",
    noUsageLimit: "Sin límite",

    start: "Inicio",
    end: "Fin",
    minAmount: "Importe mínimo",
    noMinimum: "Sin mínimo",

    scope: "Ámbito de aplicación",
    scopeHelp:
      "Si no seleccionas elementos, no se aplicará ninguna restricción de ese tipo.",
    menus: "Menús",
    categories: "Categorías",
    products: "Productos",
    noItems: "No hay elementos disponibles.",

    active: "Activa",
    inactive: "Inactiva",

    saving: "Guardando...",
    saveChanges: "Guardar cambios",
    createPromotion: "Crear promoción",

    configuredPromotions:
      "Promociones configuradas",
    configuredHelp:
      "Consulta el estado, uso y periodo de validez de cada promoción.",
    noPromotions: "No hay promociones",
    createFirstPromotion:
      "Crea la primera promoción del establecimiento.",

    codeLabel: "Código",
    uses: "Usos",

    activate: "Activar",
    deactivate: "Desactivar",
    edit: "Editar",
    delete: "Eliminar",

    fallbackPromotion: (id) =>
      `Promoción #${id}`,

    invalidName:
      "Indica al menos un nombre para la promoción.",
    codeTooLong:
      "El código no puede superar los 100 caracteres.",
    invalidDiscount:
      "El valor del descuento debe tener un formato válido.",
    invalidPercentage:
      "El porcentaje debe ser mayor que 0 y no superar el 100%.",
    invalidFixed:
      "El descuento fijo debe ser mayor que cero.",
    invalidMinimum:
      "El importe mínimo debe tener un formato válido.",
    datesRequired:
      "Debes indicar las fechas de inicio y fin.",
    datesInvalid:
      "Las fechas indicadas no son válidas.",
    invalidDateRange:
      "La fecha de fin debe ser posterior a la fecha de inicio.",
    invalidUsageLimit:
      "El límite de usos debe ser un número entero positivo.",

    loadPromotionsError:
      "No se pudieron cargar las promociones.",
    loadProductsError:
      "No se pudieron cargar los productos.",
    loadCategoriesError:
      "No se pudieron cargar las categorías.",
    loadMenusError:
      "No se pudieron cargar los menús.",
    loadDataError:
      "No se pudieron cargar los datos de promociones.",

    createError:
      "No se pudo crear la promoción.",
    updateError:
      "No se pudo actualizar la promoción.",
    toggleError:
      "No se pudo cambiar el estado de la promoción.",
    deleteError:
      "No se pudo eliminar la promoción.",

    createSuccess:
      "Promoción creada correctamente.",
    updateSuccess:
      "Promoción actualizada correctamente.",
    activatedSuccess:
      "Promoción activada correctamente.",
    deactivatedSuccess:
      "Promoción desactivada correctamente.",
    deleteSuccess:
      "Promoción eliminada correctamente.",

    deleteConfirm: (name) =>
      `¿Eliminar "${name}"? Esta acción no se puede deshacer.`,

    fixedDiscountSuffix:
      "de descuento",

    discounts: {
      percentage: "Porcentaje",
      fixed: "Importe fijo",
      free_item: "Artículo gratuito",
    },

    statuses: {
      inactive: "Inactiva",
      scheduled: "Programada",
      finished: "Finalizada",
      running: "En curso",
    },
  },

  en: {
    title: "Promotions",
    subtitle:
      "Create discounts and promotions applicable to products, categories or menus.",

    loading: "Loading promotions...",
    refresh: "Refresh",
    refreshing: "Refreshing...",

    statPromotions: "Promotions",
    statActive: "Active",
    statRunning: "Running now",

    newPromotion: "New promotion",
    editPromotion: "Edit promotion",
    editingPromotion: (id) =>
      `Editing promotion #${id}.`,
    createDescription:
      "Configure the discount, validity period and application conditions.",
    cancel: "Cancel",

    name: "Name",
    description: "Description",
    optionalDescription:
      "Optional. You can leave all languages empty.",

    code: "Code",
    codePlaceholder: "E.g. SUMMER20",

    discountType: "Discount type",
    discountValue: "Value",
    usageLimit: "Usage limit",
    noUsageLimit: "No limit",

    start: "Start",
    end: "End",
    minAmount: "Minimum amount",
    noMinimum: "No minimum",

    scope: "Application scope",
    scopeHelp:
      "If no items are selected, no restriction of that type will apply.",
    menus: "Menus",
    categories: "Categories",
    products: "Products",
    noItems: "No items available.",

    active: "Active",
    inactive: "Inactive",

    saving: "Saving...",
    saveChanges: "Save changes",
    createPromotion: "Create promotion",

    configuredPromotions:
      "Configured promotions",
    configuredHelp:
      "Review the status, usage and validity period of each promotion.",
    noPromotions: "No promotions",
    createFirstPromotion:
      "Create the establishment's first promotion.",

    codeLabel: "Code",
    uses: "Uses",

    activate: "Activate",
    deactivate: "Deactivate",
    edit: "Edit",
    delete: "Delete",

    fallbackPromotion: (id) =>
      `Promotion #${id}`,

    invalidName:
      "Enter at least one name for the promotion.",
    codeTooLong:
      "The code cannot exceed 100 characters.",
    invalidDiscount:
      "The discount value must use a valid format.",
    invalidPercentage:
      "The percentage must be greater than 0 and cannot exceed 100%.",
    invalidFixed:
      "The fixed discount must be greater than zero.",
    invalidMinimum:
      "The minimum amount must use a valid format.",
    datesRequired:
      "You must specify the start and end dates.",
    datesInvalid:
      "The specified dates are invalid.",
    invalidDateRange:
      "The end date must be later than the start date.",
    invalidUsageLimit:
      "The usage limit must be a positive integer.",

    loadPromotionsError:
      "Promotions could not be loaded.",
    loadProductsError:
      "Products could not be loaded.",
    loadCategoriesError:
      "Categories could not be loaded.",
    loadMenusError:
      "Menus could not be loaded.",
    loadDataError:
      "Promotion data could not be loaded.",

    createError:
      "The promotion could not be created.",
    updateError:
      "The promotion could not be updated.",
    toggleError:
      "The promotion status could not be changed.",
    deleteError:
      "The promotion could not be deleted.",

    createSuccess:
      "Promotion created successfully.",
    updateSuccess:
      "Promotion updated successfully.",
    activatedSuccess:
      "Promotion activated successfully.",
    deactivatedSuccess:
      "Promotion deactivated successfully.",
    deleteSuccess:
      "Promotion deleted successfully.",

    deleteConfirm: (name) =>
      `Delete "${name}"? This action cannot be undone.`,

    fixedDiscountSuffix:
      "discount",

    discounts: {
      percentage: "Percentage",
      fixed: "Fixed amount",
      free_item: "Free item",
    },

    statuses: {
      inactive: "Inactive",
      scheduled: "Scheduled",
      finished: "Finished",
      running: "Running",
    },
  },

  de: {
    title: "Aktionen",
    subtitle:
      "Erstelle Rabatte und Aktionen für Produkte, Kategorien oder Menüs.",

    loading: "Aktionen werden geladen...",
    refresh: "Aktualisieren",
    refreshing: "Wird aktualisiert...",

    statPromotions: "Aktionen",
    statActive: "Aktiv",
    statRunning: "Derzeit aktiv",

    newPromotion: "Neue Aktion",
    editPromotion: "Aktion bearbeiten",
    editingPromotion: (id) =>
      `Aktion #${id} wird bearbeitet.`,
    createDescription:
      "Konfiguriere Rabatt, Gültigkeitszeitraum und Anwendungsbedingungen.",
    cancel: "Abbrechen",

    name: "Name",
    description: "Beschreibung",
    optionalDescription:
      "Optional. Alle Sprachen können leer bleiben.",

    code: "Code",
    codePlaceholder: "Z. B. SOMMER20",

    discountType: "Rabattart",
    discountValue: "Wert",
    usageLimit: "Nutzungslimit",
    noUsageLimit: "Kein Limit",

    start: "Beginn",
    end: "Ende",
    minAmount: "Mindestbetrag",
    noMinimum: "Kein Mindestbetrag",

    scope: "Anwendungsbereich",
    scopeHelp:
      "Wenn keine Elemente ausgewählt werden, gilt keine Einschränkung dieses Typs.",
    menus: "Menüs",
    categories: "Kategorien",
    products: "Produkte",
    noItems: "Keine Elemente verfügbar.",

    active: "Aktiv",
    inactive: "Inaktiv",

    saving: "Wird gespeichert...",
    saveChanges: "Änderungen speichern",
    createPromotion: "Aktion erstellen",

    configuredPromotions:
      "Konfigurierte Aktionen",
    configuredHelp:
      "Prüfe Status, Nutzung und Gültigkeitszeitraum jeder Aktion.",
    noPromotions: "Keine Aktionen",
    createFirstPromotion:
      "Erstelle die erste Aktion des Betriebs.",

    codeLabel: "Code",
    uses: "Nutzungen",

    activate: "Aktivieren",
    deactivate: "Deaktivieren",
    edit: "Bearbeiten",
    delete: "Löschen",

    fallbackPromotion: (id) =>
      `Aktion #${id}`,

    invalidName:
      "Gib mindestens einen Namen für die Aktion ein.",
    codeTooLong:
      "Der Code darf höchstens 100 Zeichen lang sein.",
    invalidDiscount:
      "Der Rabattwert muss ein gültiges Format haben.",
    invalidPercentage:
      "Der Prozentsatz muss größer als 0 sein und darf 100 % nicht überschreiten.",
    invalidFixed:
      "Der feste Rabatt muss größer als null sein.",
    invalidMinimum:
      "Der Mindestbetrag muss ein gültiges Format haben.",
    datesRequired:
      "Start- und Enddatum müssen angegeben werden.",
    datesInvalid:
      "Die angegebenen Daten sind ungültig.",
    invalidDateRange:
      "Das Enddatum muss nach dem Startdatum liegen.",
    invalidUsageLimit:
      "Das Nutzungslimit muss eine positive ganze Zahl sein.",

    loadPromotionsError:
      "Die Aktionen konnten nicht geladen werden.",
    loadProductsError:
      "Die Produkte konnten nicht geladen werden.",
    loadCategoriesError:
      "Die Kategorien konnten nicht geladen werden.",
    loadMenusError:
      "Die Menüs konnten nicht geladen werden.",
    loadDataError:
      "Die Aktionsdaten konnten nicht geladen werden.",

    createError:
      "Die Aktion konnte nicht erstellt werden.",
    updateError:
      "Die Aktion konnte nicht aktualisiert werden.",
    toggleError:
      "Der Status der Aktion konnte nicht geändert werden.",
    deleteError:
      "Die Aktion konnte nicht gelöscht werden.",

    createSuccess:
      "Aktion erfolgreich erstellt.",
    updateSuccess:
      "Aktion erfolgreich aktualisiert.",
    activatedSuccess:
      "Aktion erfolgreich aktiviert.",
    deactivatedSuccess:
      "Aktion erfolgreich deaktiviert.",
    deleteSuccess:
      "Aktion erfolgreich gelöscht.",

    deleteConfirm: (name) =>
      `"${name}" löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,

    fixedDiscountSuffix:
      "Rabatt",

    discounts: {
      percentage: "Prozentsatz",
      fixed: "Fester Betrag",
      free_item: "Kostenloser Artikel",
    },

    statuses: {
      inactive: "Inaktiv",
      scheduled: "Geplant",
      finished: "Beendet",
      running: "Aktiv",
    },
  },

  fr: {
    title: "Promotions",
    subtitle:
      "Créez des remises et promotions applicables aux produits, catégories ou menus.",

    loading: "Chargement des promotions...",
    refresh: "Actualiser",
    refreshing: "Actualisation...",

    statPromotions: "Promotions",
    statActive: "Actives",
    statRunning: "En cours",

    newPromotion: "Nouvelle promotion",
    editPromotion: "Modifier la promotion",
    editingPromotion: (id) =>
      `Modification de la promotion #${id}.`,
    createDescription:
      "Configurez la remise, la période de validité et les conditions d'application.",
    cancel: "Annuler",

    name: "Nom",
    description: "Description",
    optionalDescription:
      "Facultatif. Vous pouvez laisser toutes les langues vides.",

    code: "Code",
    codePlaceholder: "Ex. ETE20",

    discountType: "Type de remise",
    discountValue: "Valeur",
    usageLimit: "Limite d'utilisation",
    noUsageLimit: "Sans limite",

    start: "Début",
    end: "Fin",
    minAmount: "Montant minimum",
    noMinimum: "Sans minimum",

    scope: "Champ d'application",
    scopeHelp:
      "Si aucun élément n'est sélectionné, aucune restriction de ce type ne sera appliquée.",
    menus: "Menus",
    categories: "Catégories",
    products: "Produits",
    noItems: "Aucun élément disponible.",

    active: "Active",
    inactive: "Inactive",

    saving: "Enregistrement...",
    saveChanges: "Enregistrer les modifications",
    createPromotion: "Créer la promotion",

    configuredPromotions:
      "Promotions configurées",
    configuredHelp:
      "Consultez l'état, l'utilisation et la période de validité de chaque promotion.",
    noPromotions: "Aucune promotion",
    createFirstPromotion:
      "Créez la première promotion de l'établissement.",

    codeLabel: "Code",
    uses: "Utilisations",

    activate: "Activer",
    deactivate: "Désactiver",
    edit: "Modifier",
    delete: "Supprimer",

    fallbackPromotion: (id) =>
      `Promotion #${id}`,

    invalidName:
      "Indiquez au moins un nom pour la promotion.",
    codeTooLong:
      "Le code ne peut pas dépasser 100 caractères.",
    invalidDiscount:
      "La valeur de la remise doit avoir un format valide.",
    invalidPercentage:
      "Le pourcentage doit être supérieur à 0 et ne peut pas dépasser 100 %.",
    invalidFixed:
      "La remise fixe doit être supérieure à zéro.",
    invalidMinimum:
      "Le montant minimum doit avoir un format valide.",
    datesRequired:
      "Vous devez indiquer les dates de début et de fin.",
    datesInvalid:
      "Les dates indiquées ne sont pas valides.",
    invalidDateRange:
      "La date de fin doit être postérieure à la date de début.",
    invalidUsageLimit:
      "La limite d'utilisation doit être un entier positif.",

    loadPromotionsError:
      "Impossible de charger les promotions.",
    loadProductsError:
      "Impossible de charger les produits.",
    loadCategoriesError:
      "Impossible de charger les catégories.",
    loadMenusError:
      "Impossible de charger les menus.",
    loadDataError:
      "Impossible de charger les données des promotions.",

    createError:
      "Impossible de créer la promotion.",
    updateError:
      "Impossible de mettre à jour la promotion.",
    toggleError:
      "Impossible de modifier l'état de la promotion.",
    deleteError:
      "Impossible de supprimer la promotion.",

    createSuccess:
      "Promotion créée avec succès.",
    updateSuccess:
      "Promotion mise à jour avec succès.",
    activatedSuccess:
      "Promotion activée avec succès.",
    deactivatedSuccess:
      "Promotion désactivée avec succès.",
    deleteSuccess:
      "Promotion supprimée avec succès.",

    deleteConfirm: (name) =>
      `Supprimer "${name}" ? Cette action est irréversible.`,

    fixedDiscountSuffix:
      "de remise",

    discounts: {
      percentage: "Pourcentage",
      fixed: "Montant fixe",
      free_item: "Article gratuit",
    },

    statuses: {
      inactive: "Inactive",
      scheduled: "Programmée",
      finished: "Terminée",
      running: "En cours",
    },
  },

  it: {
    title: "Promozioni",
    subtitle:
      "Crea sconti e promozioni applicabili a prodotti, categorie o menu.",

    loading: "Caricamento promozioni...",
    refresh: "Aggiorna",
    refreshing: "Aggiornamento...",

    statPromotions: "Promozioni",
    statActive: "Attive",
    statRunning: "In corso",

    newPromotion: "Nuova promozione",
    editPromotion: "Modifica promozione",
    editingPromotion: (id) =>
      `Modifica della promozione #${id}.`,
    createDescription:
      "Configura lo sconto, il periodo di validità e le condizioni di applicazione.",
    cancel: "Annulla",

    name: "Nome",
    description: "Descrizione",
    optionalDescription:
      "Facoltativo. Puoi lasciare vuote tutte le lingue.",

    code: "Codice",
    codePlaceholder: "Es. ESTATE20",

    discountType: "Tipo di sconto",
    discountValue: "Valore",
    usageLimit: "Limite di utilizzo",
    noUsageLimit: "Senza limite",

    start: "Inizio",
    end: "Fine",
    minAmount: "Importo minimo",
    noMinimum: "Senza minimo",

    scope: "Ambito di applicazione",
    scopeHelp:
      "Se non selezioni elementi, non verrà applicata alcuna restrizione di quel tipo.",
    menus: "Menu",
    categories: "Categorie",
    products: "Prodotti",
    noItems: "Nessun elemento disponibile.",

    active: "Attiva",
    inactive: "Inattiva",

    saving: "Salvataggio...",
    saveChanges: "Salva modifiche",
    createPromotion: "Crea promozione",

    configuredPromotions:
      "Promozioni configurate",
    configuredHelp:
      "Consulta stato, utilizzo e periodo di validità di ogni promozione.",
    noPromotions: "Nessuna promozione",
    createFirstPromotion:
      "Crea la prima promozione dell'attività.",

    codeLabel: "Codice",
    uses: "Utilizzi",

    activate: "Attiva",
    deactivate: "Disattiva",
    edit: "Modifica",
    delete: "Elimina",

    fallbackPromotion: (id) =>
      `Promozione #${id}`,

    invalidName:
      "Inserisci almeno un nome per la promozione.",
    codeTooLong:
      "Il codice non può superare i 100 caratteri.",
    invalidDiscount:
      "Il valore dello sconto deve avere un formato valido.",
    invalidPercentage:
      "La percentuale deve essere maggiore di 0 e non può superare il 100%.",
    invalidFixed:
      "Lo sconto fisso deve essere maggiore di zero.",
    invalidMinimum:
      "L'importo minimo deve avere un formato valido.",
    datesRequired:
      "Devi indicare le date di inizio e fine.",
    datesInvalid:
      "Le date indicate non sono valide.",
    invalidDateRange:
      "La data di fine deve essere successiva alla data di inizio.",
    invalidUsageLimit:
      "Il limite di utilizzo deve essere un numero intero positivo.",

    loadPromotionsError:
      "Impossibile caricare le promozioni.",
    loadProductsError:
      "Impossibile caricare i prodotti.",
    loadCategoriesError:
      "Impossibile caricare le categorie.",
    loadMenusError:
      "Impossibile caricare i menu.",
    loadDataError:
      "Impossibile caricare i dati delle promozioni.",

    createError:
      "Impossibile creare la promozione.",
    updateError:
      "Impossibile aggiornare la promozione.",
    toggleError:
      "Impossibile modificare lo stato della promozione.",
    deleteError:
      "Impossibile eliminare la promozione.",

    createSuccess:
      "Promozione creata correttamente.",
    updateSuccess:
      "Promozione aggiornata correttamente.",
    activatedSuccess:
      "Promozione attivata correttamente.",
    deactivatedSuccess:
      "Promozione disattivata correttamente.",
    deleteSuccess:
      "Promozione eliminata correttamente.",

    deleteConfirm: (name) =>
      `Eliminare "${name}"? Questa azione non può essere annullata.`,

    fixedDiscountSuffix:
      "di sconto",

    discounts: {
      percentage: "Percentuale",
      fixed: "Importo fisso",
      free_item: "Articolo gratuito",
    },

    statuses: {
      inactive: "Inattiva",
      scheduled: "Programmata",
      finished: "Terminata",
      running: "In corso",
    },
  },

  pt: {
    title: "Promoções",
    subtitle:
      "Crie descontos e promoções aplicáveis a produtos, categorias ou menus.",

    loading: "A carregar promoções...",
    refresh: "Atualizar",
    refreshing: "A atualizar...",

    statPromotions: "Promoções",
    statActive: "Ativas",
    statRunning: "Em curso",

    newPromotion: "Nova promoção",
    editPromotion: "Editar promoção",
    editingPromotion: (id) =>
      `A editar a promoção #${id}.`,
    createDescription:
      "Configure o desconto, período de validade e condições de aplicação.",
    cancel: "Cancelar",

    name: "Nome",
    description: "Descrição",
    optionalDescription:
      "Opcional. Pode deixar todos os idiomas vazios.",

    code: "Código",
    codePlaceholder: "Ex. VERAO20",

    discountType: "Tipo de desconto",
    discountValue: "Valor",
    usageLimit: "Limite de utilizações",
    noUsageLimit: "Sem limite",

    start: "Início",
    end: "Fim",
    minAmount: "Montante mínimo",
    noMinimum: "Sem mínimo",

    scope: "Âmbito de aplicação",
    scopeHelp:
      "Se não selecionar elementos, não será aplicada qualquer restrição desse tipo.",
    menus: "Menus",
    categories: "Categorias",
    products: "Produtos",
    noItems: "Não há elementos disponíveis.",

    active: "Ativa",
    inactive: "Inativa",

    saving: "A guardar...",
    saveChanges: "Guardar alterações",
    createPromotion: "Criar promoção",

    configuredPromotions:
      "Promoções configuradas",
    configuredHelp:
      "Consulte o estado, utilização e período de validade de cada promoção.",
    noPromotions: "Não há promoções",
    createFirstPromotion:
      "Crie a primeira promoção do estabelecimento.",

    codeLabel: "Código",
    uses: "Utilizações",

    activate: "Ativar",
    deactivate: "Desativar",
    edit: "Editar",
    delete: "Eliminar",

    fallbackPromotion: (id) =>
      `Promoção #${id}`,

    invalidName:
      "Indique pelo menos um nome para a promoção.",
    codeTooLong:
      "O código não pode exceder 100 caracteres.",
    invalidDiscount:
      "O valor do desconto deve ter um formato válido.",
    invalidPercentage:
      "A percentagem deve ser superior a 0 e não pode exceder 100%.",
    invalidFixed:
      "O desconto fixo deve ser superior a zero.",
    invalidMinimum:
      "O montante mínimo deve ter um formato válido.",
    datesRequired:
      "Deve indicar as datas de início e fim.",
    datesInvalid:
      "As datas indicadas não são válidas.",
    invalidDateRange:
      "A data de fim deve ser posterior à data de início.",
    invalidUsageLimit:
      "O limite de utilizações deve ser um número inteiro positivo.",

    loadPromotionsError:
      "Não foi possível carregar as promoções.",
    loadProductsError:
      "Não foi possível carregar os produtos.",
    loadCategoriesError:
      "Não foi possível carregar as categorias.",
    loadMenusError:
      "Não foi possível carregar os menus.",
    loadDataError:
      "Não foi possível carregar os dados das promoções.",

    createError:
      "Não foi possível criar a promoção.",
    updateError:
      "Não foi possível atualizar a promoção.",
    toggleError:
      "Não foi possível alterar o estado da promoção.",
    deleteError:
      "Não foi possível eliminar a promoção.",

    createSuccess:
      "Promoção criada com sucesso.",
    updateSuccess:
      "Promoção atualizada com sucesso.",
    activatedSuccess:
      "Promoção ativada com sucesso.",
    deactivatedSuccess:
      "Promoção desativada com sucesso.",
    deleteSuccess:
      "Promoção eliminada com sucesso.",

    deleteConfirm: (name) =>
      `Eliminar "${name}"? Esta ação não pode ser anulada.`,

    fixedDiscountSuffix:
      "de desconto",

    discounts: {
      percentage: "Percentagem",
      fixed: "Montante fixo",
      free_item: "Artigo gratuito",
    },

    statuses: {
      inactive: "Inativa",
      scheduled: "Programada",
      finished: "Terminada",
      running: "Em curso",
    },
  },
};