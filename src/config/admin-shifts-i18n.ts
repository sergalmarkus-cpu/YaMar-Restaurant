import type {
  Language,
} from "@/types";

export type AdminShiftRole =
  | "admin"
  | "manager"
  | "waiter"
  | "kitchen"
  | "bar"
  | "cashier";

export type AdminShiftStatus =
  | "scheduled"
  | "completed"
  | "cancelled";

interface AdminShiftsMessages {
  loading: string;

  page: {
    title: string;
    subtitle: string;
    refresh: string;
    refreshing: string;
    create: string;
    noActiveUsers: string;
  };

  stats: {
    total: string;
    scheduled: string;
    completed: string;
    cancelled: string;
  };

  filters: {
    search: string;
    allStatuses: string;
  };

  empty: {
    title: string;
    first: string;
    filtered: string;
  };

  table: {
    employee: string;
    start: string;
    end: string;
    duration: string;
    status: string;
    notes: string;
    actions: string;
  };

  roles: Record<
    AdminShiftRole,
    string
  >;

  statuses: Record<
    AdminShiftStatus,
    string
  >;

  actions: {
    edit: string;
    delete: string;
    editShift: (
      name: string
    ) => string;
    deleteShift: (
      name: string
    ) => string;
  };

  fallbackUser: (
    id: number
  ) => string;

  modal: {
    createTitle: string;
    editTitle: string;
    createDescription: string;
    editDescription: string;
    close: string;

    fields: {
      employee: string;
      start: string;
      end: string;
      status: string;
      notes: string;
    };

    selectEmployee: string;
    inactive: string;

    notesHint: (
      current: number
    ) => string;

    notesPlaceholder: string;

    infoTitle: string;
    infoDescription: string;

    cancel: string;
    saving: string;
    saveChanges: string;
    createShift: string;
  };

  validation: {
    employeeRequired: string;
    datesRequired: string;
    invalidSchedule: string;
    endAfterStart: string;
    notesMax: string;
  };

  confirmations: {
    delete: (
      name: string
    ) => string;
  };

  success: {
    created: string;
    updated: string;
    deleted: string;
  };

  errors: {
    loadShifts: string;
    loadStaff: string;
    create: string;
    update: string;
    delete: string;
  };
}

export const ADMIN_SHIFTS_MESSAGES: Record<
  Language,
  AdminShiftsMessages
> = {
  es: {
    loading:
      "Cargando turnos...",

    page: {
      title: "Turnos",
      subtitle:
        "Planifica y gestiona los turnos del personal del establecimiento.",
      refresh: "Actualizar",
      refreshing:
        "Actualizando...",
      create:
        "Nuevo turno",
      noActiveUsers:
        "No hay usuarios activos disponibles para asignar nuevos turnos.",
    },

    stats: {
      total: "Total",
      scheduled:
        "Programados",
      completed:
        "Completados",
      cancelled:
        "Cancelados",
    },

    filters: {
      search:
        "Buscar por empleado, email, rol o notas...",
      allStatuses:
        "Todos los estados",
    },

    empty: {
      title:
        "No hay turnos",
      first:
        "Crea el primer turno del personal.",
      filtered:
        "No hay turnos que coincidan con los filtros actuales.",
    },

    table: {
      employee:
        "Empleado",
      start: "Inicio",
      end: "Fin",
      duration:
        "Duración",
      status: "Estado",
      notes: "Notas",
      actions:
        "Acciones",
    },

    roles: {
      admin:
        "Administrador",
      manager:
        "Manager",
      waiter:
        "Camarero",
      kitchen:
        "Cocina",
      bar: "Bar",
      cashier:
        "Caja",
    },

    statuses: {
      scheduled:
        "Programado",
      completed:
        "Completado",
      cancelled:
        "Cancelado",
    },

    actions: {
      edit: "Editar",
      delete:
        "Eliminar",
      editShift: (
        name
      ) =>
        `Editar turno de ${name}`,
      deleteShift: (
        name
      ) =>
        `Eliminar turno de ${name}`,
    },

    fallbackUser: (
      id
    ) =>
      `Usuario #${id}`,

    modal: {
      createTitle:
        "Nuevo turno",
      editTitle:
        "Editar turno",
      createDescription:
        "Asigna un horario a un miembro del personal.",
      editDescription:
        "Actualiza la planificación del turno.",
      close: "Cerrar",

      fields: {
        employee:
          "Empleado",
        start:
          "Inicio",
        end: "Fin",
        status:
          "Estado",
        notes:
          "Notas",
      },

      selectEmployee:
        "Selecciona un empleado",
      inactive:
        "Inactivo",

      notesHint: (
        current
      ) =>
        `${current}/2000 caracteres`,

      notesPlaceholder:
        "Observaciones opcionales sobre el turno...",

      infoTitle:
        "Planificación de personal",
      infoDescription:
        "Los turnos cancelados no bloquean ese intervalo. Los turnos activos del mismo empleado no pueden solaparse.",

      cancel:
        "Cancelar",
      saving:
        "Guardando...",
      saveChanges:
        "Guardar cambios",
      createShift:
        "Crear turno",
    },

    validation: {
      employeeRequired:
        "Selecciona un empleado válido.",
      datesRequired:
        "La fecha de inicio y la fecha de fin son obligatorias.",
      invalidSchedule:
        "El horario del turno no es válido.",
      endAfterStart:
        "La fecha de fin debe ser posterior a la fecha de inicio.",
      notesMax:
        "Las notas no pueden superar los 2000 caracteres.",
    },

    confirmations: {
      delete: (
        name
      ) =>
        `¿Eliminar definitivamente el turno de "${name}"?`,
    },

    success: {
      created:
        "Turno creado correctamente.",
      updated:
        "Turno actualizado correctamente.",
      deleted:
        "Turno eliminado correctamente.",
    },

    errors: {
      loadShifts:
        "No se pudieron cargar los turnos.",
      loadStaff:
        "No se pudo cargar el personal.",
      create:
        "No se pudo crear el turno.",
      update:
        "No se pudo actualizar el turno.",
      delete:
        "No se pudo eliminar el turno.",
    },
  },

  en: {
    loading:
      "Loading shifts...",

    page: {
      title: "Shifts",
      subtitle:
        "Plan and manage staff shifts for the establishment.",
      refresh: "Refresh",
      refreshing:
        "Refreshing...",
      create:
        "New shift",
      noActiveUsers:
        "There are no active users available to assign new shifts.",
    },

    stats: {
      total: "Total",
      scheduled:
        "Scheduled",
      completed:
        "Completed",
      cancelled:
        "Cancelled",
    },

    filters: {
      search:
        "Search by employee, email, role or notes...",
      allStatuses:
        "All statuses",
    },

    empty: {
      title:
        "No shifts",
      first:
        "Create the first staff shift.",
      filtered:
        "No shifts match the current filters.",
    },

    table: {
      employee:
        "Employee",
      start: "Start",
      end: "End",
      duration:
        "Duration",
      status: "Status",
      notes: "Notes",
      actions:
        "Actions",
    },

    roles: {
      admin:
        "Administrator",
      manager:
        "Manager",
      waiter:
        "Waiter",
      kitchen:
        "Kitchen",
      bar: "Bar",
      cashier:
        "Cashier",
    },

    statuses: {
      scheduled:
        "Scheduled",
      completed:
        "Completed",
      cancelled:
        "Cancelled",
    },

    actions: {
      edit: "Edit",
      delete: "Delete",
      editShift: (
        name
      ) =>
        `Edit shift for ${name}`,
      deleteShift: (
        name
      ) =>
        `Delete shift for ${name}`,
    },

    fallbackUser: (
      id
    ) =>
      `User #${id}`,

    modal: {
      createTitle:
        "New shift",
      editTitle:
        "Edit shift",
      createDescription:
        "Assign a schedule to a staff member.",
      editDescription:
        "Update the shift schedule.",
      close: "Close",

      fields: {
        employee:
          "Employee",
        start: "Start",
        end: "End",
        status:
          "Status",
        notes: "Notes",
      },

      selectEmployee:
        "Select an employee",
      inactive:
        "Inactive",

      notesHint: (
        current
      ) =>
        `${current}/2000 characters`,

      notesPlaceholder:
        "Optional notes about the shift...",

      infoTitle:
        "Staff scheduling",
      infoDescription:
        "Cancelled shifts do not block that time interval. Active shifts for the same employee cannot overlap.",

      cancel: "Cancel",
      saving:
        "Saving...",
      saveChanges:
        "Save changes",
      createShift:
        "Create shift",
    },

    validation: {
      employeeRequired:
        "Select a valid employee.",
      datesRequired:
        "The start and end dates are required.",
      invalidSchedule:
        "The shift schedule is invalid.",
      endAfterStart:
        "The end date must be after the start date.",
      notesMax:
        "Notes cannot exceed 2000 characters.",
    },

    confirmations: {
      delete: (
        name
      ) =>
        `Permanently delete the shift for "${name}"?`,
    },

    success: {
      created:
        "Shift created successfully.",
      updated:
        "Shift updated successfully.",
      deleted:
        "Shift deleted successfully.",
    },

    errors: {
      loadShifts:
        "Shifts could not be loaded.",
      loadStaff:
        "Staff could not be loaded.",
      create:
        "The shift could not be created.",
      update:
        "The shift could not be updated.",
      delete:
        "The shift could not be deleted.",
    },
  },

  de: {
    loading:
      "Schichten werden geladen...",

    page: {
      title: "Schichten",
      subtitle:
        "Planen und verwalten Sie die Schichten des Personals.",
      refresh:
        "Aktualisieren",
      refreshing:
        "Wird aktualisiert...",
      create:
        "Neue Schicht",
      noActiveUsers:
        "Es sind keine aktiven Benutzer verfügbar, denen neue Schichten zugewiesen werden können.",
    },

    stats: {
      total: "Gesamt",
      scheduled:
        "Geplant",
      completed:
        "Abgeschlossen",
      cancelled:
        "Storniert",
    },

    filters: {
      search:
        "Nach Mitarbeiter, E-Mail, Rolle oder Notizen suchen...",
      allStatuses:
        "Alle Status",
    },

    empty: {
      title:
        "Keine Schichten",
      first:
        "Erstellen Sie die erste Personalschicht.",
      filtered:
        "Keine Schichten entsprechen den aktuellen Filtern.",
    },

    table: {
      employee:
        "Mitarbeiter",
      start: "Beginn",
      end: "Ende",
      duration:
        "Dauer",
      status: "Status",
      notes: "Notizen",
      actions:
        "Aktionen",
    },

    roles: {
      admin:
        "Administrator",
      manager:
        "Manager",
      waiter:
        "Kellner",
      kitchen:
        "Küche",
      bar: "Bar",
      cashier:
        "Kasse",
    },

    statuses: {
      scheduled:
        "Geplant",
      completed:
        "Abgeschlossen",
      cancelled:
        "Storniert",
    },

    actions: {
      edit:
        "Bearbeiten",
      delete:
        "Löschen",
      editShift: (
        name
      ) =>
        `Schicht von ${name} bearbeiten`,
      deleteShift: (
        name
      ) =>
        `Schicht von ${name} löschen`,
    },

    fallbackUser: (
      id
    ) =>
      `Benutzer #${id}`,

    modal: {
      createTitle:
        "Neue Schicht",
      editTitle:
        "Schicht bearbeiten",
      createDescription:
        "Weisen Sie einem Mitarbeiter einen Zeitplan zu.",
      editDescription:
        "Aktualisieren Sie die Schichtplanung.",
      close:
        "Schließen",

      fields: {
        employee:
          "Mitarbeiter",
        start:
          "Beginn",
        end: "Ende",
        status:
          "Status",
        notes:
          "Notizen",
      },

      selectEmployee:
        "Mitarbeiter auswählen",
      inactive:
        "Inaktiv",

      notesHint: (
        current
      ) =>
        `${current}/2000 Zeichen`,

      notesPlaceholder:
        "Optionale Anmerkungen zur Schicht...",

      infoTitle:
        "Personalplanung",
      infoDescription:
        "Stornierte Schichten blockieren diesen Zeitraum nicht. Aktive Schichten desselben Mitarbeiters dürfen sich nicht überschneiden.",

      cancel:
        "Abbrechen",
      saving:
        "Wird gespeichert...",
      saveChanges:
        "Änderungen speichern",
      createShift:
        "Schicht erstellen",
    },

    validation: {
      employeeRequired:
        "Wählen Sie einen gültigen Mitarbeiter aus.",
      datesRequired:
        "Beginn und Ende sind erforderlich.",
      invalidSchedule:
        "Der Schichtzeitraum ist ungültig.",
      endAfterStart:
        "Das Ende muss nach dem Beginn liegen.",
      notesMax:
        "Notizen dürfen höchstens 2000 Zeichen enthalten.",
    },

    confirmations: {
      delete: (
        name
      ) =>
        `Die Schicht von "${name}" endgültig löschen?`,
    },

    success: {
      created:
        "Schicht erfolgreich erstellt.",
      updated:
        "Schicht erfolgreich aktualisiert.",
      deleted:
        "Schicht erfolgreich gelöscht.",
    },

    errors: {
      loadShifts:
        "Die Schichten konnten nicht geladen werden.",
      loadStaff:
        "Das Personal konnte nicht geladen werden.",
      create:
        "Die Schicht konnte nicht erstellt werden.",
      update:
        "Die Schicht konnte nicht aktualisiert werden.",
      delete:
        "Die Schicht konnte nicht gelöscht werden.",
    },
  },

  fr: {
    loading:
      "Chargement des horaires...",

    page: {
      title: "Horaires",
      subtitle:
        "Planifiez et gérez les horaires du personnel de l’établissement.",
      refresh:
        "Actualiser",
      refreshing:
        "Actualisation...",
      create:
        "Nouvel horaire",
      noActiveUsers:
        "Aucun utilisateur actif n’est disponible pour l’attribution de nouveaux horaires.",
    },

    stats: {
      total: "Total",
      scheduled:
        "Planifiés",
      completed:
        "Terminés",
      cancelled:
        "Annulés",
    },

    filters: {
      search:
        "Rechercher par employé, e-mail, rôle ou notes...",
      allStatuses:
        "Tous les statuts",
    },

    empty: {
      title:
        "Aucun horaire",
      first:
        "Créez le premier horaire du personnel.",
      filtered:
        "Aucun horaire ne correspond aux filtres actuels.",
    },

    table: {
      employee:
        "Employé",
      start: "Début",
      end: "Fin",
      duration:
        "Durée",
      status: "Statut",
      notes: "Notes",
      actions:
        "Actions",
    },

    roles: {
      admin:
        "Administrateur",
      manager:
        "Manager",
      waiter:
        "Serveur",
      kitchen:
        "Cuisine",
      bar: "Bar",
      cashier:
        "Caisse",
    },

    statuses: {
      scheduled:
        "Planifié",
      completed:
        "Terminé",
      cancelled:
        "Annulé",
    },

    actions: {
      edit:
        "Modifier",
      delete:
        "Supprimer",
      editShift: (
        name
      ) =>
        `Modifier l’horaire de ${name}`,
      deleteShift: (
        name
      ) =>
        `Supprimer l’horaire de ${name}`,
    },

    fallbackUser: (
      id
    ) =>
      `Utilisateur #${id}`,

    modal: {
      createTitle:
        "Nouvel horaire",
      editTitle:
        "Modifier l’horaire",
      createDescription:
        "Attribuez un horaire à un membre du personnel.",
      editDescription:
        "Mettez à jour la planification de l’horaire.",
      close: "Fermer",

      fields: {
        employee:
          "Employé",
        start:
          "Début",
        end: "Fin",
        status:
          "Statut",
        notes:
          "Notes",
      },

      selectEmployee:
        "Sélectionnez un employé",
      inactive:
        "Inactif",

      notesHint: (
        current
      ) =>
        `${current}/2000 caractères`,

      notesPlaceholder:
        "Observations facultatives sur l’horaire...",

      infoTitle:
        "Planification du personnel",
      infoDescription:
        "Les horaires annulés ne bloquent pas cet intervalle. Les horaires actifs d’un même employé ne peuvent pas se chevaucher.",

      cancel: "Annuler",
      saving:
        "Enregistrement...",
      saveChanges:
        "Enregistrer les modifications",
      createShift:
        "Créer l’horaire",
    },

    validation: {
      employeeRequired:
        "Sélectionnez un employé valide.",
      datesRequired:
        "Les dates de début et de fin sont obligatoires.",
      invalidSchedule:
        "L’horaire indiqué n’est pas valide.",
      endAfterStart:
        "La date de fin doit être postérieure à la date de début.",
      notesMax:
        "Les notes ne peuvent pas dépasser 2000 caractères.",
    },

    confirmations: {
      delete: (
        name
      ) =>
        `Supprimer définitivement l’horaire de « ${name} » ?`,
    },

    success: {
      created:
        "Horaire créé avec succès.",
      updated:
        "Horaire mis à jour avec succès.",
      deleted:
        "Horaire supprimé avec succès.",
    },

    errors: {
      loadShifts:
        "Impossible de charger les horaires.",
      loadStaff:
        "Impossible de charger le personnel.",
      create:
        "Impossible de créer l’horaire.",
      update:
        "Impossible de mettre à jour l’horaire.",
      delete:
        "Impossible de supprimer l’horaire.",
    },
  },

  it: {
    loading:
      "Caricamento dei turni...",

    page: {
      title: "Turni",
      subtitle:
        "Pianifica e gestisci i turni del personale della struttura.",
      refresh:
        "Aggiorna",
      refreshing:
        "Aggiornamento...",
      create:
        "Nuovo turno",
      noActiveUsers:
        "Non sono disponibili utenti attivi a cui assegnare nuovi turni.",
    },

    stats: {
      total: "Totale",
      scheduled:
        "Programmati",
      completed:
        "Completati",
      cancelled:
        "Annullati",
    },

    filters: {
      search:
        "Cerca per dipendente, email, ruolo o note...",
      allStatuses:
        "Tutti gli stati",
    },

    empty: {
      title:
        "Nessun turno",
      first:
        "Crea il primo turno del personale.",
      filtered:
        "Nessun turno corrisponde ai filtri attuali.",
    },

    table: {
      employee:
        "Dipendente",
      start: "Inizio",
      end: "Fine",
      duration:
        "Durata",
      status: "Stato",
      notes: "Note",
      actions:
        "Azioni",
    },

    roles: {
      admin:
        "Amministratore",
      manager:
        "Manager",
      waiter:
        "Cameriere",
      kitchen:
        "Cucina",
      bar: "Bar",
      cashier:
        "Cassa",
    },

    statuses: {
      scheduled:
        "Programmato",
      completed:
        "Completato",
      cancelled:
        "Annullato",
    },

    actions: {
      edit:
        "Modifica",
      delete:
        "Elimina",
      editShift: (
        name
      ) =>
        `Modifica il turno di ${name}`,
      deleteShift: (
        name
      ) =>
        `Elimina il turno di ${name}`,
    },

    fallbackUser: (
      id
    ) =>
      `Utente #${id}`,

    modal: {
      createTitle:
        "Nuovo turno",
      editTitle:
        "Modifica turno",
      createDescription:
        "Assegna un orario a un membro del personale.",
      editDescription:
        "Aggiorna la pianificazione del turno.",
      close: "Chiudi",

      fields: {
        employee:
          "Dipendente",
        start:
          "Inizio",
        end: "Fine",
        status:
          "Stato",
        notes: "Note",
      },

      selectEmployee:
        "Seleziona un dipendente",
      inactive:
        "Inattivo",

      notesHint: (
        current
      ) =>
        `${current}/2000 caratteri`,

      notesPlaceholder:
        "Osservazioni facoltative sul turno...",

      infoTitle:
        "Pianificazione del personale",
      infoDescription:
        "I turni annullati non bloccano quell’intervallo. I turni attivi dello stesso dipendente non possono sovrapporsi.",

      cancel: "Annulla",
      saving:
        "Salvataggio...",
      saveChanges:
        "Salva modifiche",
      createShift:
        "Crea turno",
    },

    validation: {
      employeeRequired:
        "Seleziona un dipendente valido.",
      datesRequired:
        "La data di inizio e la data di fine sono obbligatorie.",
      invalidSchedule:
        "L’orario del turno non è valido.",
      endAfterStart:
        "La data di fine deve essere successiva alla data di inizio.",
      notesMax:
        "Le note non possono superare i 2000 caratteri.",
    },

    confirmations: {
      delete: (
        name
      ) =>
        `Eliminare definitivamente il turno di "${name}"?`,
    },

    success: {
      created:
        "Turno creato correttamente.",
      updated:
        "Turno aggiornato correttamente.",
      deleted:
        "Turno eliminato correttamente.",
    },

    errors: {
      loadShifts:
        "Impossibile caricare i turni.",
      loadStaff:
        "Impossibile caricare il personale.",
      create:
        "Impossibile creare il turno.",
      update:
        "Impossibile aggiornare il turno.",
      delete:
        "Impossibile eliminare il turno.",
    },
  },

  pt: {
    loading:
      "A carregar turnos...",

    page: {
      title: "Turnos",
      subtitle:
        "Planeie e faça a gestão dos turnos do pessoal do estabelecimento.",
      refresh:
        "Atualizar",
      refreshing:
        "A atualizar...",
      create:
        "Novo turno",
      noActiveUsers:
        "Não existem utilizadores ativos disponíveis para atribuir novos turnos.",
    },

    stats: {
      total: "Total",
      scheduled:
        "Programados",
      completed:
        "Concluídos",
      cancelled:
        "Cancelados",
    },

    filters: {
      search:
        "Pesquisar por funcionário, email, função ou notas...",
      allStatuses:
        "Todos os estados",
    },

    empty: {
      title:
        "Sem turnos",
      first:
        "Crie o primeiro turno do pessoal.",
      filtered:
        "Nenhum turno corresponde aos filtros atuais.",
    },

    table: {
      employee:
        "Funcionário",
      start: "Início",
      end: "Fim",
      duration:
        "Duração",
      status: "Estado",
      notes: "Notas",
      actions:
        "Ações",
    },

    roles: {
      admin:
        "Administrador",
      manager:
        "Manager",
      waiter:
        "Empregado de mesa",
      kitchen:
        "Cozinha",
      bar: "Bar",
      cashier:
        "Caixa",
    },

    statuses: {
      scheduled:
        "Programado",
      completed:
        "Concluído",
      cancelled:
        "Cancelado",
    },

    actions: {
      edit: "Editar",
      delete:
        "Eliminar",
      editShift: (
        name
      ) =>
        `Editar turno de ${name}`,
      deleteShift: (
        name
      ) =>
        `Eliminar turno de ${name}`,
    },

    fallbackUser: (
      id
    ) =>
      `Utilizador #${id}`,

    modal: {
      createTitle:
        "Novo turno",
      editTitle:
        "Editar turno",
      createDescription:
        "Atribua um horário a um membro do pessoal.",
      editDescription:
        "Atualize o planeamento do turno.",
      close: "Fechar",

      fields: {
        employee:
          "Funcionário",
        start:
          "Início",
        end: "Fim",
        status:
          "Estado",
        notes:
          "Notas",
      },

      selectEmployee:
        "Selecione um funcionário",
      inactive:
        "Inativo",

      notesHint: (
        current
      ) =>
        `${current}/2000 caracteres`,

      notesPlaceholder:
        "Observações opcionais sobre o turno...",

      infoTitle:
        "Planeamento de pessoal",
      infoDescription:
        "Os turnos cancelados não bloqueiam esse intervalo. Os turnos ativos do mesmo funcionário não podem sobrepor-se.",

      cancel:
        "Cancelar",
      saving:
        "A guardar...",
      saveChanges:
        "Guardar alterações",
      createShift:
        "Criar turno",
    },

    validation: {
      employeeRequired:
        "Selecione um funcionário válido.",
      datesRequired:
        "As datas de início e fim são obrigatórias.",
      invalidSchedule:
        "O horário do turno não é válido.",
      endAfterStart:
        "A data de fim deve ser posterior à data de início.",
      notesMax:
        "As notas não podem exceder 2000 caracteres.",
    },

    confirmations: {
      delete: (
        name
      ) =>
        `Eliminar definitivamente o turno de "${name}"?`,
    },

    success: {
      created:
        "Turno criado com sucesso.",
      updated:
        "Turno atualizado com sucesso.",
      deleted:
        "Turno eliminado com sucesso.",
    },

    errors: {
      loadShifts:
        "Não foi possível carregar os turnos.",
      loadStaff:
        "Não foi possível carregar o pessoal.",
      create:
        "Não foi possível criar o turno.",
      update:
        "Não foi possível atualizar o turno.",
      delete:
        "Não foi possível eliminar o turno.",
    },
  },
};