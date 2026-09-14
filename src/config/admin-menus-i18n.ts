import type {
  Language,
} from "@/types";

export interface AdminMenusMessages {
  totalMenus: string;
  activeMenus: string;
  scheduledMenus: string;
  inactiveMenus: string;

  searchPlaceholder: string;
  newMenu: string;
  loadingMenus: string;
  noMenus: string;

  name: string;
  type: string;
  order: string;
  status: string;
  schedule: string;
  actions: string;

  active: string;
  inactive: string;
  scheduled: string;
  noSchedule: string;

  schedules: string;
  edit: string;
  delete: string;

  restaurant: string;
  snacks: string;
  coffee: string;
  cocktails: string;
  breakfast: string;
  desserts: string;
  custom: string;

  unnamed: string;
  displayOrder: string;

  loadError: string;
  deleteError: string;
  deleteUnexpectedError: string;
  deleteSuccess: string;
  deleteConfirmPrefix: string;
  updateError: string;
  updateUnexpectedError: string;
  updateSuccess: string;

  createTitle: string;
  editTitle: string;
  menuNameRequired: string;
  menuName: string;
  menuNamePlaceholder: string;
  menuType: string;
  icon: string;
  iconPlaceholder: string;
  activeMenu: string;

  cancel: string;
  save: string;
  saveChanges: string;
  saving: string;

  createError: string;
  createSuccess: string;
  editError: string;
  editSuccess: string;

  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;

  scheduleTitle: string;
  addSchedule: string;
  day: string;
  opening: string;
  closing: string;
  add: string;
  overnightHint: string;

  applyMultipleTitle: string;
  applyMultipleDescription: string;
  selectAllDays: string;
  deselectAllDays: string;
  applying: string;
  applySchedule: string;

  scheduleManagementTitle: string;
  scheduleManagementDescription: string;
  deleting: string;
  deleteAllSchedules: string;

  loadingSchedules: string;
  slot: string;
  slots: string;
  noScheduleConfigured: string;

  editSchedule: string;
  activate: string;
  deactivate: string;
  deleteSchedule: string;

  schedulesLoadError: string;
  equalTimesError: string;
  scheduleCreateError: string;
  scheduleCreateSuccess: string;

  selectDayError: string;
  scheduleApplyError: string;
  scheduleApplySuccess: string;

  scheduleUpdateError: string;
  scheduleUpdateSuccess: string;

  scheduleDeleteError: string;
  scheduleDeleteSuccess: string;
  scheduleDeleteConfirm: string;

  noSchedulesToDelete: string;
  deleteAllConfirmPrefix: string;
  deleteAllConfirmSuffix: string;
  deleteAllError: string;
  deleteAllSuccess: string;
}

export const ADMIN_MENUS_MESSAGES: Record<
  Language,
  AdminMenusMessages
> = {
  es: {
    totalMenus: "Total menús",
    activeMenus: "Activos",
    scheduledMenus: "Programados",
    inactiveMenus: "Inactivos",

    searchPlaceholder: "Buscar menú...",
    newMenu: "Nuevo menú",
    loadingMenus: "Cargando menús...",
    noMenus: "No hay menús registrados.",

    name: "Nombre",
    type: "Tipo",
    order: "Orden",
    status: "Estado",
    schedule: "Horario",
    actions: "Acciones",

    active: "Activo",
    inactive: "Inactivo",
    scheduled: "Programado",
    noSchedule: "Sin horario",

    schedules: "Horarios",
    edit: "Editar",
    delete: "Eliminar",

    restaurant: "Restaurante",
    snacks: "Snacks",
    coffee: "Cafetería",
    cocktails: "Cócteles",
    breakfast: "Desayunos",
    desserts: "Postres",
    custom: "Personalizado",

    unnamed: "Sin nombre",
    displayOrder: "Orden",

    loadError: "No se pudieron cargar los menús.",
    deleteError: "No se pudo eliminar el menú.",
    deleteUnexpectedError: "Error al eliminar el menú.",
    deleteSuccess: "Menú eliminado.",
    deleteConfirmPrefix: "¿Eliminar",
    updateError: "No se pudo actualizar el menú.",
    updateUnexpectedError: "No se pudo actualizar.",
    updateSuccess: "Estado actualizado.",

    createTitle: "Nuevo menú",
    editTitle: "Editar menú",
    menuNameRequired: "Introduce un nombre para el menú.",
    menuName: "Nombre",
    menuNamePlaceholder: "Ej: Carta Restaurante",
    menuType: "Tipo",
    icon: "Icono",
    iconPlaceholder: "🍽️ ☕ 🍷 🥗",
    activeMenu: "Menú activo",

    cancel: "Cancelar",
    save: "Guardar",
    saveChanges: "Guardar cambios",
    saving: "Guardando...",

    createError: "No se pudo crear el menú.",
    createSuccess: "Menú creado.",
    editError: "No se pudo actualizar el menú.",
    editSuccess: "Menú actualizado.",

    sunday: "Domingo",
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",

    scheduleTitle: "Horarios",
    addSchedule: "Añadir horario",
    day: "Día",
    opening: "Apertura",
    closing: "Cierre",
    add: "Añadir",
    overnightHint:
      "Los horarios pueden atravesar medianoche, por ejemplo 20:00 → 02:00.",

    applyMultipleTitle:
      "Aplicar horario a varios días",
    applyMultipleDescription:
      "Configura la misma franja para varios días de la semana.",
    selectAllDays: "Todos los días",
    deselectAllDays: "Quitar todos",
    applying: "Aplicando...",
    applySchedule: "Aplicar horario",

    scheduleManagementTitle:
      "Gestión de horarios",
    scheduleManagementDescription:
      "Elimina todas las franjas horarias configuradas para este menú.",
    deleting: "Eliminando...",
    deleteAllSchedules:
      "Eliminar todos los horarios",

    loadingSchedules:
      "Cargando horarios...",
    slot: "franja",
    slots: "franjas",
    noScheduleConfigured:
      "Sin horario configurado.",

    editSchedule:
      "Editar horario",
    activate:
      "Activar",
    deactivate:
      "Desactivar",
    deleteSchedule:
      "Eliminar horario",

    schedulesLoadError:
      "No se pudieron cargar los horarios.",
    equalTimesError:
      "La hora de apertura y cierre no pueden ser iguales.",
    scheduleCreateError:
      "No se pudo crear el horario.",
    scheduleCreateSuccess:
      "Horario añadido.",

    selectDayError:
      "Selecciona al menos un día.",
    scheduleApplyError:
      "No se pudo aplicar el horario.",
    scheduleApplySuccess:
      "Horario aplicado a los días seleccionados.",

    scheduleUpdateError:
      "No se pudo actualizar el horario.",
    scheduleUpdateSuccess:
      "Horario actualizado correctamente.",

    scheduleDeleteError:
      "No se pudo eliminar el horario.",
    scheduleDeleteSuccess:
      "Horario eliminado.",
    scheduleDeleteConfirm:
      "¿Eliminar el horario",

    noSchedulesToDelete:
      "No hay franjas horarias que eliminar.",
    deleteAllConfirmPrefix:
      "¿Eliminar todas las franjas horarias de",
    deleteAllConfirmSuffix:
      "Esta acción no se puede deshacer.",
    deleteAllError:
      "No se pudieron eliminar las franjas horarias.",
    deleteAllSuccess:
      "Todas las franjas horarias han sido eliminadas.",
  },

  en: {
    totalMenus: "Total menus",
    activeMenus: "Active",
    scheduledMenus: "Scheduled",
    inactiveMenus: "Inactive",

    searchPlaceholder: "Search menu...",
    newMenu: "New menu",
    loadingMenus: "Loading menus...",
    noMenus: "No menus registered.",

    name: "Name",
    type: "Type",
    order: "Order",
    status: "Status",
    schedule: "Schedule",
    actions: "Actions",

    active: "Active",
    inactive: "Inactive",
    scheduled: "Scheduled",
    noSchedule: "No schedule",

    schedules: "Schedules",
    edit: "Edit",
    delete: "Delete",

    restaurant: "Restaurant",
    snacks: "Snacks",
    coffee: "Coffee",
    cocktails: "Cocktails",
    breakfast: "Breakfast",
    desserts: "Desserts",
    custom: "Custom",

    unnamed: "Unnamed",
    displayOrder: "Order",

    loadError: "Menus could not be loaded.",
    deleteError: "The menu could not be deleted.",
    deleteUnexpectedError:
      "An error occurred while deleting the menu.",
    deleteSuccess: "Menu deleted.",
    deleteConfirmPrefix: "Delete",
    updateError: "The menu could not be updated.",
    updateUnexpectedError:
      "The menu could not be updated.",
    updateSuccess: "Status updated.",

    createTitle: "New menu",
    editTitle: "Edit menu",
    menuNameRequired:
      "Enter a name for the menu.",
    menuName: "Name",
    menuNamePlaceholder:
      "Example: Restaurant Menu",
    menuType: "Type",
    icon: "Icon",
    iconPlaceholder: "🍽️ ☕ 🍷 🥗",
    activeMenu: "Active menu",

    cancel: "Cancel",
    save: "Save",
    saveChanges: "Save changes",
    saving: "Saving...",

    createError:
      "The menu could not be created.",
    createSuccess: "Menu created.",
    editError:
      "The menu could not be updated.",
    editSuccess: "Menu updated.",

    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",

    scheduleTitle: "Schedules",
    addSchedule: "Add schedule",
    day: "Day",
    opening: "Opening",
    closing: "Closing",
    add: "Add",
    overnightHint:
      "Schedules can cross midnight, for example 20:00 → 02:00.",

    applyMultipleTitle:
      "Apply schedule to multiple days",
    applyMultipleDescription:
      "Configure the same time slot for several days of the week.",
    selectAllDays: "All days",
    deselectAllDays: "Clear all",
    applying: "Applying...",
    applySchedule: "Apply schedule",

    scheduleManagementTitle:
      "Schedule management",
    scheduleManagementDescription:
      "Delete all configured time slots for this menu.",
    deleting: "Deleting...",
    deleteAllSchedules:
      "Delete all schedules",

    loadingSchedules:
      "Loading schedules...",
    slot: "slot",
    slots: "slots",
    noScheduleConfigured:
      "No schedule configured.",

    editSchedule:
      "Edit schedule",
    activate:
      "Activate",
    deactivate:
      "Deactivate",
    deleteSchedule:
      "Delete schedule",

    schedulesLoadError:
      "Schedules could not be loaded.",
    equalTimesError:
      "Opening and closing times cannot be the same.",
    scheduleCreateError:
      "The schedule could not be created.",
    scheduleCreateSuccess:
      "Schedule added.",

    selectDayError:
      "Select at least one day.",
    scheduleApplyError:
      "The schedule could not be applied.",
    scheduleApplySuccess:
      "Schedule applied to the selected days.",

    scheduleUpdateError:
      "The schedule could not be updated.",
    scheduleUpdateSuccess:
      "Schedule updated successfully.",

    scheduleDeleteError:
      "The schedule could not be deleted.",
    scheduleDeleteSuccess:
      "Schedule deleted.",
    scheduleDeleteConfirm:
      "Delete schedule",

    noSchedulesToDelete:
      "There are no time slots to delete.",
    deleteAllConfirmPrefix:
      "Delete all time slots for",
    deleteAllConfirmSuffix:
      "This action cannot be undone.",
    deleteAllError:
      "The time slots could not be deleted.",
    deleteAllSuccess:
      "All time slots have been deleted.",
  },

  de: {
    totalMenus: "Menüs gesamt",
    activeMenus: "Aktiv",
    scheduledMenus: "Geplant",
    inactiveMenus: "Inaktiv",

    searchPlaceholder: "Menü suchen...",
    newMenu: "Neues Menü",
    loadingMenus: "Menüs werden geladen...",
    noMenus: "Keine Menüs vorhanden.",

    name: "Name",
    type: "Typ",
    order: "Reihenfolge",
    status: "Status",
    schedule: "Zeitplan",
    actions: "Aktionen",

    active: "Aktiv",
    inactive: "Inaktiv",
    scheduled: "Geplant",
    noSchedule: "Kein Zeitplan",

    schedules: "Zeitpläne",
    edit: "Bearbeiten",
    delete: "Löschen",

    restaurant: "Restaurant",
    snacks: "Snacks",
    coffee: "Café",
    cocktails: "Cocktails",
    breakfast: "Frühstück",
    desserts: "Desserts",
    custom: "Benutzerdefiniert",

    unnamed: "Ohne Namen",
    displayOrder: "Reihenfolge",

    loadError:
      "Die Menüs konnten nicht geladen werden.",
    deleteError:
      "Das Menü konnte nicht gelöscht werden.",
    deleteUnexpectedError:
      "Beim Löschen des Menüs ist ein Fehler aufgetreten.",
    deleteSuccess: "Menü gelöscht.",
    deleteConfirmPrefix: "Löschen",
    updateError:
      "Das Menü konnte nicht aktualisiert werden.",
    updateUnexpectedError:
      "Das Menü konnte nicht aktualisiert werden.",
    updateSuccess:
      "Status aktualisiert.",

    createTitle: "Neues Menü",
    editTitle: "Menü bearbeiten",
    menuNameRequired:
      "Gib einen Namen für das Menü ein.",
    menuName: "Name",
    menuNamePlaceholder:
      "Beispiel: Restaurantkarte",
    menuType: "Typ",
    icon: "Symbol",
    iconPlaceholder: "🍽️ ☕ 🍷 🥗",
    activeMenu: "Menü aktiv",

    cancel: "Abbrechen",
    save: "Speichern",
    saveChanges: "Änderungen speichern",
    saving: "Wird gespeichert...",

    createError:
      "Das Menü konnte nicht erstellt werden.",
    createSuccess: "Menü erstellt.",
    editError:
      "Das Menü konnte nicht aktualisiert werden.",
    editSuccess: "Menü aktualisiert.",

    sunday: "Sonntag",
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",

    scheduleTitle: "Zeitpläne",
    addSchedule: "Zeitplan hinzufügen",
    day: "Tag",
    opening: "Öffnung",
    closing: "Schließung",
    add: "Hinzufügen",
    overnightHint:
      "Zeitpläne können über Mitternacht hinausgehen, zum Beispiel 20:00 → 02:00.",

    applyMultipleTitle:
      "Zeitplan auf mehrere Tage anwenden",
    applyMultipleDescription:
      "Konfiguriere dasselbe Zeitfenster für mehrere Wochentage.",
    selectAllDays: "Alle Tage",
    deselectAllDays: "Alle abwählen",
    applying: "Wird angewendet...",
    applySchedule: "Zeitplan anwenden",

    scheduleManagementTitle:
      "Zeitplanverwaltung",
    scheduleManagementDescription:
      "Lösche alle für dieses Menü konfigurierten Zeitfenster.",
    deleting: "Wird gelöscht...",
    deleteAllSchedules:
      "Alle Zeitpläne löschen",

    loadingSchedules:
      "Zeitpläne werden geladen...",
    slot: "Zeitfenster",
    slots: "Zeitfenster",
    noScheduleConfigured:
      "Kein Zeitplan konfiguriert.",

    editSchedule:
      "Zeitplan bearbeiten",
    activate:
      "Aktivieren",
    deactivate:
      "Deaktivieren",
    deleteSchedule:
      "Zeitplan löschen",

    schedulesLoadError:
      "Die Zeitpläne konnten nicht geladen werden.",
    equalTimesError:
      "Öffnungs- und Schließzeit dürfen nicht gleich sein.",
    scheduleCreateError:
      "Der Zeitplan konnte nicht erstellt werden.",
    scheduleCreateSuccess:
      "Zeitplan hinzugefügt.",

    selectDayError:
      "Wähle mindestens einen Tag aus.",
    scheduleApplyError:
      "Der Zeitplan konnte nicht angewendet werden.",
    scheduleApplySuccess:
      "Zeitplan auf die ausgewählten Tage angewendet.",

    scheduleUpdateError:
      "Der Zeitplan konnte nicht aktualisiert werden.",
    scheduleUpdateSuccess:
      "Zeitplan erfolgreich aktualisiert.",

    scheduleDeleteError:
      "Der Zeitplan konnte nicht gelöscht werden.",
    scheduleDeleteSuccess:
      "Zeitplan gelöscht.",
    scheduleDeleteConfirm:
      "Zeitplan löschen",

    noSchedulesToDelete:
      "Es gibt keine Zeitfenster zum Löschen.",
    deleteAllConfirmPrefix:
      "Alle Zeitfenster löschen für",
    deleteAllConfirmSuffix:
      "Diese Aktion kann nicht rückgängig gemacht werden.",
    deleteAllError:
      "Die Zeitfenster konnten nicht gelöscht werden.",
    deleteAllSuccess:
      "Alle Zeitfenster wurden gelöscht.",
  },

  fr: {
    totalMenus: "Total des menus",
    activeMenus: "Actifs",
    scheduledMenus: "Programmés",
    inactiveMenus: "Inactifs",

    searchPlaceholder:
      "Rechercher un menu...",
    newMenu: "Nouveau menu",
    loadingMenus:
      "Chargement des menus...",
    noMenus:
      "Aucun menu enregistré.",

    name: "Nom",
    type: "Type",
    order: "Ordre",
    status: "Statut",
    schedule: "Horaires",
    actions: "Actions",

    active: "Actif",
    inactive: "Inactif",
    scheduled: "Programmé",
    noSchedule: "Sans horaires",

    schedules: "Horaires",
    edit: "Modifier",
    delete: "Supprimer",

    restaurant: "Restaurant",
    snacks: "Snacks",
    coffee: "Cafétéria",
    cocktails: "Cocktails",
    breakfast: "Petits-déjeuners",
    desserts: "Desserts",
    custom: "Personnalisé",

    unnamed: "Sans nom",
    displayOrder: "Ordre",

    loadError:
      "Impossible de charger les menus.",
    deleteError:
      "Impossible de supprimer le menu.",
    deleteUnexpectedError:
      "Une erreur s’est produite lors de la suppression du menu.",
    deleteSuccess: "Menu supprimé.",
    deleteConfirmPrefix: "Supprimer",
    updateError:
      "Impossible de mettre à jour le menu.",
    updateUnexpectedError:
      "Impossible d’effectuer la mise à jour.",
    updateSuccess:
      "Statut mis à jour.",

    createTitle: "Nouveau menu",
    editTitle: "Modifier le menu",
    menuNameRequired:
      "Saisissez un nom pour le menu.",
    menuName: "Nom",
    menuNamePlaceholder:
      "Ex. : Carte Restaurant",
    menuType: "Type",
    icon: "Icône",
    iconPlaceholder: "🍽️ ☕ 🍷 🥗",
    activeMenu: "Menu actif",

    cancel: "Annuler",
    save: "Enregistrer",
    saveChanges:
      "Enregistrer les modifications",
    saving: "Enregistrement...",

    createError:
      "Impossible de créer le menu.",
    createSuccess: "Menu créé.",
    editError:
      "Impossible de mettre à jour le menu.",
    editSuccess: "Menu mis à jour.",

    sunday: "Dimanche",
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",

    scheduleTitle: "Horaires",
    addSchedule: "Ajouter un horaire",
    day: "Jour",
    opening: "Ouverture",
    closing: "Fermeture",
    add: "Ajouter",
    overnightHint:
      "Les horaires peuvent dépasser minuit, par exemple 20:00 → 02:00.",

    applyMultipleTitle:
      "Appliquer l’horaire à plusieurs jours",
    applyMultipleDescription:
      "Configurez la même plage horaire pour plusieurs jours de la semaine.",
    selectAllDays: "Tous les jours",
    deselectAllDays:
      "Tout désélectionner",
    applying: "Application...",
    applySchedule:
      "Appliquer l’horaire",

    scheduleManagementTitle:
      "Gestion des horaires",
    scheduleManagementDescription:
      "Supprimez toutes les plages horaires configurées pour ce menu.",
    deleting: "Suppression...",
    deleteAllSchedules:
      "Supprimer tous les horaires",

    loadingSchedules:
      "Chargement des horaires...",
    slot: "plage",
    slots: "plages",
    noScheduleConfigured:
      "Aucun horaire configuré.",

    editSchedule:
      "Modifier l’horaire",
    activate: "Activer",
    deactivate: "Désactiver",
    deleteSchedule:
      "Supprimer l’horaire",

    schedulesLoadError:
      "Impossible de charger les horaires.",
    equalTimesError:
      "Les heures d’ouverture et de fermeture ne peuvent pas être identiques.",
    scheduleCreateError:
      "Impossible de créer l’horaire.",
    scheduleCreateSuccess:
      "Horaire ajouté.",

    selectDayError:
      "Sélectionnez au moins un jour.",
    scheduleApplyError:
      "Impossible d’appliquer l’horaire.",
    scheduleApplySuccess:
      "Horaire appliqué aux jours sélectionnés.",

    scheduleUpdateError:
      "Impossible de mettre à jour l’horaire.",
    scheduleUpdateSuccess:
      "Horaire mis à jour avec succès.",

    scheduleDeleteError:
      "Impossible de supprimer l’horaire.",
    scheduleDeleteSuccess:
      "Horaire supprimé.",
    scheduleDeleteConfirm:
      "Supprimer l’horaire",

    noSchedulesToDelete:
      "Aucune plage horaire à supprimer.",
    deleteAllConfirmPrefix:
      "Supprimer toutes les plages horaires de",
    deleteAllConfirmSuffix:
      "Cette action est irréversible.",
    deleteAllError:
      "Impossible de supprimer les plages horaires.",
    deleteAllSuccess:
      "Toutes les plages horaires ont été supprimées.",
  },

  it: {
    totalMenus: "Menu totali",
    activeMenus: "Attivi",
    scheduledMenus: "Programmabili",
    inactiveMenus: "Inattivi",

    searchPlaceholder: "Cerca menu...",
    newMenu: "Nuovo menu",
    loadingMenus: "Caricamento menu...",
    noMenus: "Nessun menu registrato.",

    name: "Nome",
    type: "Tipo",
    order: "Ordine",
    status: "Stato",
    schedule: "Orario",
    actions: "Azioni",

    active: "Attivo",
    inactive: "Inattivo",
    scheduled: "Programmato",
    noSchedule: "Senza orario",

    schedules: "Orari",
    edit: "Modifica",
    delete: "Elimina",

    restaurant: "Ristorante",
    snacks: "Snack",
    coffee: "Caffetteria",
    cocktails: "Cocktail",
    breakfast: "Colazioni",
    desserts: "Dessert",
    custom: "Personalizzato",

    unnamed: "Senza nome",
    displayOrder: "Ordine",

    loadError:
      "Impossibile caricare i menu.",
    deleteError:
      "Impossibile eliminare il menu.",
    deleteUnexpectedError:
      "Si è verificato un errore durante l’eliminazione del menu.",
    deleteSuccess: "Menu eliminato.",
    deleteConfirmPrefix: "Eliminare",
    updateError:
      "Impossibile aggiornare il menu.",
    updateUnexpectedError:
      "Impossibile effettuare l’aggiornamento.",
    updateSuccess:
      "Stato aggiornato.",

    createTitle: "Nuovo menu",
    editTitle: "Modifica menu",
    menuNameRequired:
      "Inserisci un nome per il menu.",
    menuName: "Nome",
    menuNamePlaceholder:
      "Es.: Menu Ristorante",
    menuType: "Tipo",
    icon: "Icona",
    iconPlaceholder: "🍽️ ☕ 🍷 🥗",
    activeMenu: "Menu attivo",

    cancel: "Annulla",
    save: "Salva",
    saveChanges: "Salva modifiche",
    saving: "Salvataggio...",

    createError:
      "Impossibile creare il menu.",
    createSuccess: "Menu creato.",
    editError:
      "Impossibile aggiornare il menu.",
    editSuccess: "Menu aggiornato.",

    sunday: "Domenica",
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",

    scheduleTitle: "Orari",
    addSchedule: "Aggiungi orario",
    day: "Giorno",
    opening: "Apertura",
    closing: "Chiusura",
    add: "Aggiungi",
    overnightHint:
      "Gli orari possono superare la mezzanotte, ad esempio 20:00 → 02:00.",

    applyMultipleTitle:
      "Applica l’orario a più giorni",
    applyMultipleDescription:
      "Configura la stessa fascia oraria per più giorni della settimana.",
    selectAllDays:
      "Tutti i giorni",
    deselectAllDays:
      "Deseleziona tutti",
    applying:
      "Applicazione...",
    applySchedule:
      "Applica orario",

    scheduleManagementTitle:
      "Gestione orari",
    scheduleManagementDescription:
      "Elimina tutte le fasce orarie configurate per questo menu.",
    deleting: "Eliminazione...",
    deleteAllSchedules:
      "Elimina tutti gli orari",

    loadingSchedules:
      "Caricamento orari...",
    slot: "fascia",
    slots: "fasce",
    noScheduleConfigured:
      "Nessun orario configurato.",

    editSchedule:
      "Modifica orario",
    activate: "Attiva",
    deactivate: "Disattiva",
    deleteSchedule:
      "Elimina orario",

    schedulesLoadError:
      "Impossibile caricare gli orari.",
    equalTimesError:
      "Gli orari di apertura e chiusura non possono coincidere.",
    scheduleCreateError:
      "Impossibile creare l’orario.",
    scheduleCreateSuccess:
      "Orario aggiunto.",

    selectDayError:
      "Seleziona almeno un giorno.",
    scheduleApplyError:
      "Impossibile applicare l’orario.",
    scheduleApplySuccess:
      "Orario applicato ai giorni selezionati.",

    scheduleUpdateError:
      "Impossibile aggiornare l’orario.",
    scheduleUpdateSuccess:
      "Orario aggiornato correttamente.",

    scheduleDeleteError:
      "Impossibile eliminare l’orario.",
    scheduleDeleteSuccess:
      "Orario eliminato.",
    scheduleDeleteConfirm:
      "Eliminare l’orario",

    noSchedulesToDelete:
      "Non ci sono fasce orarie da eliminare.",
    deleteAllConfirmPrefix:
      "Eliminare tutte le fasce orarie di",
    deleteAllConfirmSuffix:
      "Questa azione non può essere annullata.",
    deleteAllError:
      "Impossibile eliminare le fasce orarie.",
    deleteAllSuccess:
      "Tutte le fasce orarie sono state eliminate.",
  },

  pt: {
    totalMenus: "Total de menus",
    activeMenus: "Ativos",
    scheduledMenus: "Programados",
    inactiveMenus: "Inativos",

    searchPlaceholder: "Pesquisar menu...",
    newMenu: "Novo menu",
    loadingMenus:
      "A carregar menus...",
    noMenus:
      "Não existem menus registados.",

    name: "Nome",
    type: "Tipo",
    order: "Ordem",
    status: "Estado",
    schedule: "Horário",
    actions: "Ações",

    active: "Ativo",
    inactive: "Inativo",
    scheduled: "Programado",
    noSchedule: "Sem horário",

    schedules: "Horários",
    edit: "Editar",
    delete: "Eliminar",

    restaurant: "Restaurante",
    snacks: "Snacks",
    coffee: "Cafetaria",
    cocktails: "Cocktails",
    breakfast: "Pequenos-almoços",
    desserts: "Sobremesas",
    custom: "Personalizado",

    unnamed: "Sem nome",
    displayOrder: "Ordem",

    loadError:
      "Não foi possível carregar os menus.",
    deleteError:
      "Não foi possível eliminar o menu.",
    deleteUnexpectedError:
      "Ocorreu um erro ao eliminar o menu.",
    deleteSuccess: "Menu eliminado.",
    deleteConfirmPrefix: "Eliminar",
    updateError:
      "Não foi possível atualizar o menu.",
    updateUnexpectedError:
      "Não foi possível efetuar a atualização.",
    updateSuccess:
      "Estado atualizado.",

    createTitle: "Novo menu",
    editTitle: "Editar menu",
    menuNameRequired:
      "Introduza um nome para o menu.",
    menuName: "Nome",
    menuNamePlaceholder:
      "Ex.: Menu Restaurante",
    menuType: "Tipo",
    icon: "Ícone",
    iconPlaceholder: "🍽️ ☕ 🍷 🥗",
    activeMenu: "Menu ativo",

    cancel: "Cancelar",
    save: "Guardar",
    saveChanges:
      "Guardar alterações",
    saving: "A guardar...",

    createError:
      "Não foi possível criar o menu.",
    createSuccess:
      "Menu criado.",
    editError:
      "Não foi possível atualizar o menu.",
    editSuccess:
      "Menu atualizado.",

    sunday: "Domingo",
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",

    scheduleTitle: "Horários",
    addSchedule:
      "Adicionar horário",
    day: "Dia",
    opening: "Abertura",
    closing: "Fecho",
    add: "Adicionar",
    overnightHint:
      "Os horários podem atravessar a meia-noite, por exemplo 20:00 → 02:00.",

    applyMultipleTitle:
      "Aplicar horário a vários dias",
    applyMultipleDescription:
      "Configure o mesmo intervalo para vários dias da semana.",
    selectAllDays:
      "Todos os dias",
    deselectAllDays:
      "Desmarcar todos",
    applying:
      "A aplicar...",
    applySchedule:
      "Aplicar horário",

    scheduleManagementTitle:
      "Gestão de horários",
    scheduleManagementDescription:
      "Elimine todos os intervalos configurados para este menu.",
    deleting:
      "A eliminar...",
    deleteAllSchedules:
      "Eliminar todos os horários",

    loadingSchedules:
      "A carregar horários...",
    slot: "intervalo",
    slots: "intervalos",
    noScheduleConfigured:
      "Sem horário configurado.",

    editSchedule:
      "Editar horário",
    activate: "Ativar",
    deactivate: "Desativar",
    deleteSchedule:
      "Eliminar horário",

    schedulesLoadError:
      "Não foi possível carregar os horários.",
    equalTimesError:
      "As horas de abertura e fecho não podem ser iguais.",
    scheduleCreateError:
      "Não foi possível criar o horário.",
    scheduleCreateSuccess:
      "Horário adicionado.",

    selectDayError:
      "Selecione pelo menos um dia.",
    scheduleApplyError:
      "Não foi possível aplicar o horário.",
    scheduleApplySuccess:
      "Horário aplicado aos dias selecionados.",

    scheduleUpdateError:
      "Não foi possível atualizar o horário.",
    scheduleUpdateSuccess:
      "Horário atualizado com sucesso.",

    scheduleDeleteError:
      "Não foi possível eliminar o horário.",
    scheduleDeleteSuccess:
      "Horário eliminado.",
    scheduleDeleteConfirm:
      "Eliminar o horário",

    noSchedulesToDelete:
      "Não existem intervalos para eliminar.",
    deleteAllConfirmPrefix:
      "Eliminar todos os intervalos de",
    deleteAllConfirmSuffix:
      "Esta ação não pode ser anulada.",
    deleteAllError:
      "Não foi possível eliminar os intervalos.",
    deleteAllSuccess:
      "Todos os intervalos foram eliminados.",
  },
};

export function getAdminMenuTypeLabel(
  type: string,
  messages: AdminMenusMessages
) {
  switch (type) {
    case "restaurant":
      return messages.restaurant;

    case "snacks":
      return messages.snacks;

    case "coffee":
      return messages.coffee;

    case "cocktails":
      return messages.cocktails;

    case "breakfast":
      return messages.breakfast;

    case "desserts":
      return messages.desserts;

    case "custom":
      return messages.custom;

    default:
      return type;
  }
}

export function getAdminMenuDays(
  messages: AdminMenusMessages
) {
  return [
    messages.sunday,
    messages.monday,
    messages.tuesday,
    messages.wednesday,
    messages.thursday,
    messages.friday,
    messages.saturday,
  ];
}