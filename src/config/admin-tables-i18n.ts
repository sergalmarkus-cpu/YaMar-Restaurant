import type {
  Language,
} from "@/types";

export interface AdminTablesMessages {
  loading: string;
  title: string;
  subtitle: string;
  newTable: string;
  searchPlaceholder: string;
  allAreas: string;

  totalTables: string;
  availablePlural: string;
  occupiedPlural: string;
  reservedPlural: string;

  table: string;
  person: string;
  people: string;

  statusAvailable: string;
  statusOccupied: string;
  statusReserved: string;
  statusCleaning: string;

  activateTable: string;
  deactivateTable: string;
  showQr: string;
  editTableAction: string;
  deleteTableAction: string;

  tableActivated: string;
  tableDeactivated: string;
  updateError: string;
  updateGenericError: string;

  deleteConfirm: (
    code: string
  ) => string;

  deletedSuccessfully: string;
  deleteError: string;
  deleteGenericError: string;

  qrGenerationError: string;
  qrGenerationGenericError: string;

  createTitle: string;
  editTitle: string;
  code: string;
  area: string;
  noArea: string;
  capacity: string;
  codePlaceholder: string;
  cancel: string;
  save: string;
  saving: string;
  saveChanges: string;

  enterTableCode: string;
  minimumCapacity: string;
  createError: string;
  createGenericError: string;
  areasLoadError: string;

  qrCode: string;
  download: string;
  close: string;
  qrAlt: string;
}

export const ADMIN_TABLES_MESSAGES: Record<
  Language,
  AdminTablesMessages
> = {
  es: {
    loading: "Cargando mesas...",
    title: "Gestión de Mesas",
    subtitle:
      "Administra todas las mesas del establecimiento.",
    newTable: "Nueva mesa",
    searchPlaceholder:
      "Buscar mesa...",
    allAreas:
      "Todas las áreas",

    totalTables:
      "Total Mesas",
    availablePlural:
      "Disponibles",
    occupiedPlural:
      "Ocupadas",
    reservedPlural:
      "Reservadas",

    table: "Mesa",
    person: "persona",
    people: "personas",

    statusAvailable:
      "Disponible",
    statusOccupied:
      "Ocupada",
    statusReserved:
      "Reservada",
    statusCleaning:
      "Limpieza",

    activateTable:
      "Activar mesa",
    deactivateTable:
      "Desactivar mesa",
    showQr:
      "Ver código QR",
    editTableAction:
      "Editar mesa",
    deleteTableAction:
      "Eliminar mesa",

    tableActivated:
      "Mesa activada.",
    tableDeactivated:
      "Mesa desactivada.",
    updateError:
      "No se pudo actualizar la mesa.",
    updateGenericError:
      "Error al actualizar la mesa.",

    deleteConfirm:
      (code) =>
        `¿Eliminar definitivamente la mesa ${code}?`,

    deletedSuccessfully:
      "Mesa eliminada correctamente.",
    deleteError:
      "No se pudo eliminar la mesa.",
    deleteGenericError:
      "Error eliminando la mesa.",

    qrGenerationError:
      "No se pudo generar el código QR.",
    qrGenerationGenericError:
      "Error generando el código QR.",

    createTitle:
      "Nueva mesa",
    editTitle:
      "Editar Mesa",
    code:
      "Código",
    area:
      "Área",
    noArea:
      "Sin área",
    capacity:
      "Capacidad",
    codePlaceholder:
      "Ej.: A12",
    cancel:
      "Cancelar",
    save:
      "Guardar",
    saving:
      "Guardando...",
    saveChanges:
      "Guardar cambios",

    enterTableCode:
      "Introduce el código de la mesa.",
    minimumCapacity:
      "La capacidad debe ser de al menos 1 persona.",
    createError:
      "No se pudo crear la mesa.",
    createGenericError:
      "Se produjo un error al crear la mesa.",
    areasLoadError:
      "No se pudieron cargar las áreas.",

    qrCode:
      "Código QR",
    download:
      "Descargar",
    close:
      "Cerrar",
    qrAlt:
      "Código QR",
  },

  en: {
    loading:
      "Loading tables...",
    title:
      "Table Management",
    subtitle:
      "Manage all tables in the establishment.",
    newTable:
      "New table",
    searchPlaceholder:
      "Search table...",
    allAreas:
      "All areas",

    totalTables:
      "Total Tables",
    availablePlural:
      "Available",
    occupiedPlural:
      "Occupied",
    reservedPlural:
      "Reserved",

    table:
      "Table",
    person:
      "person",
    people:
      "people",

    statusAvailable:
      "Available",
    statusOccupied:
      "Occupied",
    statusReserved:
      "Reserved",
    statusCleaning:
      "Cleaning",

    activateTable:
      "Activate table",
    deactivateTable:
      "Deactivate table",
    showQr:
      "View QR code",
    editTableAction:
      "Edit table",
    deleteTableAction:
      "Delete table",

    tableActivated:
      "Table activated.",
    tableDeactivated:
      "Table deactivated.",
    updateError:
      "The table could not be updated.",
    updateGenericError:
      "Error updating the table.",

    deleteConfirm:
      (code) =>
        `Permanently delete table ${code}?`,

    deletedSuccessfully:
      "Table deleted successfully.",
    deleteError:
      "The table could not be deleted.",
    deleteGenericError:
      "Error deleting the table.",

    qrGenerationError:
      "The QR code could not be generated.",
    qrGenerationGenericError:
      "Error generating the QR code.",

    createTitle:
      "New table",
    editTitle:
      "Edit Table",
    code:
      "Code",
    area:
      "Area",
    noArea:
      "No area",
    capacity:
      "Capacity",
    codePlaceholder:
      "E.g.: A12",
    cancel:
      "Cancel",
    save:
      "Save",
    saving:
      "Saving...",
    saveChanges:
      "Save changes",

    enterTableCode:
      "Enter the table code.",
    minimumCapacity:
      "Capacity must be at least 1 person.",
    createError:
      "The table could not be created.",
    createGenericError:
      "An error occurred while creating the table.",
    areasLoadError:
      "Areas could not be loaded.",

    qrCode:
      "QR Code",
    download:
      "Download",
    close:
      "Close",
    qrAlt:
      "QR Code",
  },

  de: {
    loading:
      "Tische werden geladen...",
    title:
      "Tischverwaltung",
    subtitle:
      "Verwalten Sie alle Tische des Betriebs.",
    newTable:
      "Neuer Tisch",
    searchPlaceholder:
      "Tisch suchen...",
    allAreas:
      "Alle Bereiche",

    totalTables:
      "Tische insgesamt",
    availablePlural:
      "Verfügbar",
    occupiedPlural:
      "Belegt",
    reservedPlural:
      "Reserviert",

    table:
      "Tisch",
    person:
      "Person",
    people:
      "Personen",

    statusAvailable:
      "Verfügbar",
    statusOccupied:
      "Belegt",
    statusReserved:
      "Reserviert",
    statusCleaning:
      "Reinigung",

    activateTable:
      "Tisch aktivieren",
    deactivateTable:
      "Tisch deaktivieren",
    showQr:
      "QR-Code anzeigen",
    editTableAction:
      "Tisch bearbeiten",
    deleteTableAction:
      "Tisch löschen",

    tableActivated:
      "Tisch aktiviert.",
    tableDeactivated:
      "Tisch deaktiviert.",
    updateError:
      "Der Tisch konnte nicht aktualisiert werden.",
    updateGenericError:
      "Fehler beim Aktualisieren des Tisches.",

    deleteConfirm:
      (code) =>
        `Tisch ${code} endgültig löschen?`,

    deletedSuccessfully:
      "Tisch erfolgreich gelöscht.",
    deleteError:
      "Der Tisch konnte nicht gelöscht werden.",
    deleteGenericError:
      "Fehler beim Löschen des Tisches.",

    qrGenerationError:
      "Der QR-Code konnte nicht erstellt werden.",
    qrGenerationGenericError:
      "Fehler beim Erstellen des QR-Codes.",

    createTitle:
      "Neuer Tisch",
    editTitle:
      "Tisch bearbeiten",
    code:
      "Code",
    area:
      "Bereich",
    noArea:
      "Kein Bereich",
    capacity:
      "Kapazität",
    codePlaceholder:
      "Z. B.: A12",
    cancel:
      "Abbrechen",
    save:
      "Speichern",
    saving:
      "Wird gespeichert...",
    saveChanges:
      "Änderungen speichern",

    enterTableCode:
      "Geben Sie den Tischcode ein.",
    minimumCapacity:
      "Die Kapazität muss mindestens 1 Person betragen.",
    createError:
      "Der Tisch konnte nicht erstellt werden.",
    createGenericError:
      "Beim Erstellen des Tisches ist ein Fehler aufgetreten.",
    areasLoadError:
      "Die Bereiche konnten nicht geladen werden.",

    qrCode:
      "QR-Code",
    download:
      "Herunterladen",
    close:
      "Schließen",
    qrAlt:
      "QR-Code",
  },

  fr: {
    loading:
      "Chargement des tables...",
    title:
      "Gestion des Tables",
    subtitle:
      "Gérez toutes les tables de l’établissement.",
    newTable:
      "Nouvelle table",
    searchPlaceholder:
      "Rechercher une table...",
    allAreas:
      "Toutes les zones",

    totalTables:
      "Total des tables",
    availablePlural:
      "Disponibles",
    occupiedPlural:
      "Occupées",
    reservedPlural:
      "Réservées",

    table:
      "Table",
    person:
      "personne",
    people:
      "personnes",

    statusAvailable:
      "Disponible",
    statusOccupied:
      "Occupée",
    statusReserved:
      "Réservée",
    statusCleaning:
      "Nettoyage",

    activateTable:
      "Activer la table",
    deactivateTable:
      "Désactiver la table",
    showQr:
      "Voir le code QR",
    editTableAction:
      "Modifier la table",
    deleteTableAction:
      "Supprimer la table",

    tableActivated:
      "Table activée.",
    tableDeactivated:
      "Table désactivée.",
    updateError:
      "Impossible de mettre à jour la table.",
    updateGenericError:
      "Erreur lors de la mise à jour de la table.",

    deleteConfirm:
      (code) =>
        `Supprimer définitivement la table ${code} ?`,

    deletedSuccessfully:
      "Table supprimée avec succès.",
    deleteError:
      "Impossible de supprimer la table.",
    deleteGenericError:
      "Erreur lors de la suppression de la table.",

    qrGenerationError:
      "Impossible de générer le code QR.",
    qrGenerationGenericError:
      "Erreur lors de la génération du code QR.",

    createTitle:
      "Nouvelle table",
    editTitle:
      "Modifier la table",
    code:
      "Code",
    area:
      "Zone",
    noArea:
      "Aucune zone",
    capacity:
      "Capacité",
    codePlaceholder:
      "Ex. : A12",
    cancel:
      "Annuler",
    save:
      "Enregistrer",
    saving:
      "Enregistrement...",
    saveChanges:
      "Enregistrer les modifications",

    enterTableCode:
      "Saisissez le code de la table.",
    minimumCapacity:
      "La capacité doit être d’au moins 1 personne.",
    createError:
      "Impossible de créer la table.",
    createGenericError:
      "Une erreur s’est produite lors de la création de la table.",
    areasLoadError:
      "Impossible de charger les zones.",

    qrCode:
      "Code QR",
    download:
      "Télécharger",
    close:
      "Fermer",
    qrAlt:
      "Code QR",
  },

  it: {
    loading:
      "Caricamento tavoli...",
    title:
      "Gestione dei Tavoli",
    subtitle:
      "Gestisci tutti i tavoli della struttura.",
    newTable:
      "Nuovo tavolo",
    searchPlaceholder:
      "Cerca tavolo...",
    allAreas:
      "Tutte le aree",

    totalTables:
      "Totale tavoli",
    availablePlural:
      "Disponibili",
    occupiedPlural:
      "Occupati",
    reservedPlural:
      "Prenotati",

    table:
      "Tavolo",
    person:
      "persona",
    people:
      "persone",

    statusAvailable:
      "Disponibile",
    statusOccupied:
      "Occupato",
    statusReserved:
      "Prenotato",
    statusCleaning:
      "Pulizia",

    activateTable:
      "Attiva tavolo",
    deactivateTable:
      "Disattiva tavolo",
    showQr:
      "Visualizza codice QR",
    editTableAction:
      "Modifica tavolo",
    deleteTableAction:
      "Elimina tavolo",

    tableActivated:
      "Tavolo attivato.",
    tableDeactivated:
      "Tavolo disattivato.",
    updateError:
      "Impossibile aggiornare il tavolo.",
    updateGenericError:
      "Errore durante l’aggiornamento del tavolo.",

    deleteConfirm:
      (code) =>
        `Eliminare definitivamente il tavolo ${code}?`,

    deletedSuccessfully:
      "Tavolo eliminato correttamente.",
    deleteError:
      "Impossibile eliminare il tavolo.",
    deleteGenericError:
      "Errore durante l’eliminazione del tavolo.",

    qrGenerationError:
      "Impossibile generare il codice QR.",
    qrGenerationGenericError:
      "Errore durante la generazione del codice QR.",

    createTitle:
      "Nuovo tavolo",
    editTitle:
      "Modifica tavolo",
    code:
      "Codice",
    area:
      "Area",
    noArea:
      "Nessuna area",
    capacity:
      "Capacità",
    codePlaceholder:
      "Es.: A12",
    cancel:
      "Annulla",
    save:
      "Salva",
    saving:
      "Salvataggio...",
    saveChanges:
      "Salva modifiche",

    enterTableCode:
      "Inserisci il codice del tavolo.",
    minimumCapacity:
      "La capacità deve essere di almeno 1 persona.",
    createError:
      "Impossibile creare il tavolo.",
    createGenericError:
      "Si è verificato un errore durante la creazione del tavolo.",
    areasLoadError:
      "Impossibile caricare le aree.",

    qrCode:
      "Codice QR",
    download:
      "Scarica",
    close:
      "Chiudi",
    qrAlt:
      "Codice QR",
  },

  pt: {
    loading:
      "A carregar mesas...",
    title:
      "Gestão de Mesas",
    subtitle:
      "Gira todas as mesas do estabelecimento.",
    newTable:
      "Nova mesa",
    searchPlaceholder:
      "Pesquisar mesa...",
    allAreas:
      "Todas as áreas",

    totalTables:
      "Total de mesas",
    availablePlural:
      "Disponíveis",
    occupiedPlural:
      "Ocupadas",
    reservedPlural:
      "Reservadas",

    table:
      "Mesa",
    person:
      "pessoa",
    people:
      "pessoas",

    statusAvailable:
      "Disponível",
    statusOccupied:
      "Ocupada",
    statusReserved:
      "Reservada",
    statusCleaning:
      "Limpeza",

    activateTable:
      "Ativar mesa",
    deactivateTable:
      "Desativar mesa",
    showQr:
      "Ver código QR",
    editTableAction:
      "Editar mesa",
    deleteTableAction:
      "Eliminar mesa",

    tableActivated:
      "Mesa ativada.",
    tableDeactivated:
      "Mesa desativada.",
    updateError:
      "Não foi possível atualizar a mesa.",
    updateGenericError:
      "Erro ao atualizar a mesa.",

    deleteConfirm:
      (code) =>
        `Eliminar definitivamente a mesa ${code}?`,

    deletedSuccessfully:
      "Mesa eliminada com sucesso.",
    deleteError:
      "Não foi possível eliminar a mesa.",
    deleteGenericError:
      "Erro ao eliminar a mesa.",

    qrGenerationError:
      "Não foi possível gerar o código QR.",
    qrGenerationGenericError:
      "Erro ao gerar o código QR.",

    createTitle:
      "Nova mesa",
    editTitle:
      "Editar mesa",
    code:
      "Código",
    area:
      "Área",
    noArea:
      "Sem área",
    capacity:
      "Capacidade",
    codePlaceholder:
      "Ex.: A12",
    cancel:
      "Cancelar",
    save:
      "Guardar",
    saving:
      "A guardar...",
    saveChanges:
      "Guardar alterações",

    enterTableCode:
      "Introduza o código da mesa.",
    minimumCapacity:
      "A capacidade deve ser de pelo menos 1 pessoa.",
    createError:
      "Não foi possível criar a mesa.",
    createGenericError:
      "Ocorreu um erro ao criar a mesa.",
    areasLoadError:
      "Não foi possível carregar as áreas.",

    qrCode:
      "Código QR",
    download:
      "Transferir",
    close:
      "Fechar",
    qrAlt:
      "Código QR",
  },
};