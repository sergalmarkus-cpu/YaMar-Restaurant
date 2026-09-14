import type {
  Language,
} from "@/types";

export type AdminStaffLanguage =
  Language;

export type AdminStaffRole =
  | "admin"
  | "manager"
  | "waiter"
  | "kitchen"
  | "bar"
  | "cashier";

interface AdminStaffMessages {
  page: {
    title: string;
    subtitle: string;
    refresh: string;
    create: string;
  };

  loading: string;

  stats: {
    total: string;
    active: string;
    management: string;
    operational: string;
  };

  empty: {
    title: string;
    description: string;
  };

  table: {
    employee: string;
    role: string;
    status: string;
    lastLogin: string;
    actions: string;
  };

  status: {
    active: string;
    inactive: string;
  };

  roles: Record<
    AdminStaffRole,
    string
  >;

  actions: {
    edit: string;
    activate: string;
    deactivate: string;
    delete: string;
  };

  dates: {
    never: string;
    invalid: string;
  };

  modal: {
    createTitle: string;
    editTitle: string;
    createDescription: string;
    editDescription: string;
    close: string;

    fields: {
      name: string;
      email: string;
      password: string;
      newPassword: string;
      role: string;
      phone: string;
      avatar: string;
    };

    hints: {
      passwordCreate: string;
      passwordEdit: string;
      avatar: string;
    };

    placeholders: {
      name: string;
      email: string;
      password: string;
      passwordUnchanged: string;
      phone: string;
      avatar: string;
    };

    activeTitle: string;
    activeDescription: string;

    cancel: string;
    saving: string;
    saveChanges: string;
    createEmployee: string;
  };

  validation: {
    nameRequired: string;
    emailRequired: string;
    passwordMin: string;
    newPasswordMin: string;
  };

  confirmations: {
    deleteUser: (
      name: string
    ) => string;
  };

  success: {
    created: string;
    updated: string;
    activated: string;
    deactivated: string;
    deleted: string;
  };

  errors: {
    load: string;
    create: string;
    update: string;
    toggle: string;
    delete: string;
  };
}

export const ADMIN_STAFF_MESSAGES: Record<
  AdminStaffLanguage,
  AdminStaffMessages
> = {
  es: {
    page: {
      title: "Personal",
      subtitle:
        "Gestiona los usuarios y roles del establecimiento.",
      refresh: "Actualizar",
      create:
        "Nuevo empleado",
    },

    loading:
      "Cargando personal...",

    stats: {
      total: "Total",
      active: "Activos",
      management:
        "Gestión",
      operational:
        "Operativos",
    },

    empty: {
      title:
        "No hay empleados",
      description:
        "Crea el primer usuario de personal del establecimiento.",
    },

    table: {
      employee:
        "Empleado",
      role: "Rol",
      status: "Estado",
      lastLogin:
        "Último acceso",
      actions:
        "Acciones",
    },

    status: {
      active: "Activo",
      inactive:
        "Inactivo",
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

    actions: {
      edit: "Editar",
      activate:
        "Activar",
      deactivate:
        "Desactivar",
      delete:
        "Eliminar",
    },

    dates: {
      never: "Nunca",
      invalid: "—",
    },

    modal: {
      createTitle:
        "Nuevo empleado",
      editTitle:
        "Editar empleado",
      createDescription:
        "Crea un nuevo usuario para este establecimiento.",
      editDescription:
        "Actualiza los datos y permisos del usuario.",
      close: "Cerrar",

      fields: {
        name: "Nombre",
        email: "Email",
        password:
          "Contraseña",
        newPassword:
          "Nueva contraseña",
        role: "Rol",
        phone:
          "Teléfono",
        avatar: "Avatar",
      },

      hints: {
        passwordCreate:
          "Mínimo 8 caracteres.",
        passwordEdit:
          "Déjala vacía para conservar la actual.",
        avatar:
          "URL opcional.",
      },

      placeholders: {
        name:
          "Nombre del empleado",
        email:
          "empleado@ejemplo.com",
        password:
          "Contraseña",
        passwordUnchanged:
          "Sin cambios",
        phone:
          "+34 600 000 000",
        avatar:
          "https://...",
      },

      activeTitle:
        "Usuario activo",
      activeDescription:
        "Los usuarios inactivos no pueden iniciar sesión.",

      cancel: "Cancelar",
      saving:
        "Guardando...",
      saveChanges:
        "Guardar cambios",
      createEmployee:
        "Crear empleado",
    },

    validation: {
      nameRequired:
        "El nombre es obligatorio.",
      emailRequired:
        "El email es obligatorio.",
      passwordMin:
        "La contraseña debe tener al menos 8 caracteres.",
      newPasswordMin:
        "La nueva contraseña debe tener al menos 8 caracteres.",
    },

    confirmations: {
      deleteUser: (
        name
      ) =>
        `¿Eliminar definitivamente a "${name}"?`,
    },

    success: {
      created:
        "Empleado creado correctamente.",
      updated:
        "Empleado actualizado correctamente.",
      activated:
        "Empleado activado correctamente.",
      deactivated:
        "Empleado desactivado correctamente.",
      deleted:
        "Empleado eliminado correctamente.",
    },

    errors: {
      load:
        "No se pudo cargar el personal.",
      create:
        "No se pudo crear el empleado.",
      update:
        "No se pudo actualizar el empleado.",
      toggle:
        "No se pudo cambiar el estado del empleado.",
      delete:
        "No se pudo eliminar el empleado.",
    },
  },

  en: {
    page: {
      title: "Staff",
      subtitle:
        "Manage the establishment's users and roles.",
      refresh: "Refresh",
      create:
        "New employee",
    },

    loading:
      "Loading staff...",

    stats: {
      total: "Total",
      active: "Active",
      management:
        "Management",
      operational:
        "Operational",
    },

    empty: {
      title:
        "No employees",
      description:
        "Create the establishment's first staff user.",
    },

    table: {
      employee:
        "Employee",
      role: "Role",
      status: "Status",
      lastLogin:
        "Last login",
      actions:
        "Actions",
    },

    status: {
      active: "Active",
      inactive:
        "Inactive",
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

    actions: {
      edit: "Edit",
      activate:
        "Activate",
      deactivate:
        "Deactivate",
      delete:
        "Delete",
    },

    dates: {
      never: "Never",
      invalid: "—",
    },

    modal: {
      createTitle:
        "New employee",
      editTitle:
        "Edit employee",
      createDescription:
        "Create a new user for this establishment.",
      editDescription:
        "Update the user's details and permissions.",
      close: "Close",

      fields: {
        name: "Name",
        email: "Email",
        password:
          "Password",
        newPassword:
          "New password",
        role: "Role",
        phone: "Phone",
        avatar: "Avatar",
      },

      hints: {
        passwordCreate:
          "Minimum 8 characters.",
        passwordEdit:
          "Leave blank to keep the current password.",
        avatar:
          "Optional URL.",
      },

      placeholders: {
        name:
          "Employee name",
        email:
          "employee@example.com",
        password:
          "Password",
        passwordUnchanged:
          "No changes",
        phone:
          "+44 7000 000000",
        avatar:
          "https://...",
      },

      activeTitle:
        "Active user",
      activeDescription:
        "Inactive users cannot sign in.",

      cancel: "Cancel",
      saving: "Saving...",
      saveChanges:
        "Save changes",
      createEmployee:
        "Create employee",
    },

    validation: {
      nameRequired:
        "Name is required.",
      emailRequired:
        "Email is required.",
      passwordMin:
        "The password must contain at least 8 characters.",
      newPasswordMin:
        "The new password must contain at least 8 characters.",
    },

    confirmations: {
      deleteUser: (
        name
      ) =>
        `Permanently delete "${name}"?`,
    },

    success: {
      created:
        "Employee created successfully.",
      updated:
        "Employee updated successfully.",
      activated:
        "Employee activated successfully.",
      deactivated:
        "Employee deactivated successfully.",
      deleted:
        "Employee deleted successfully.",
    },

    errors: {
      load:
        "Staff could not be loaded.",
      create:
        "The employee could not be created.",
      update:
        "The employee could not be updated.",
      toggle:
        "The employee status could not be changed.",
      delete:
        "The employee could not be deleted.",
    },
  },

  de: {
    page: {
      title: "Personal",
      subtitle:
        "Benutzer und Rollen des Betriebs verwalten.",
      refresh:
        "Aktualisieren",
      create:
        "Neuer Mitarbeiter",
    },

    loading:
      "Personal wird geladen...",

    stats: {
      total: "Gesamt",
      active: "Aktiv",
      management:
        "Leitung",
      operational:
        "Operativ",
    },

    empty: {
      title:
        "Keine Mitarbeiter",
      description:
        "Erstellen Sie den ersten Personalbenutzer des Betriebs.",
    },

    table: {
      employee:
        "Mitarbeiter",
      role: "Rolle",
      status: "Status",
      lastLogin:
        "Letzter Zugriff",
      actions:
        "Aktionen",
    },

    status: {
      active: "Aktiv",
      inactive:
        "Inaktiv",
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

    actions: {
      edit:
        "Bearbeiten",
      activate:
        "Aktivieren",
      deactivate:
        "Deaktivieren",
      delete:
        "Löschen",
    },

    dates: {
      never: "Nie",
      invalid: "—",
    },

    modal: {
      createTitle:
        "Neuer Mitarbeiter",
      editTitle:
        "Mitarbeiter bearbeiten",
      createDescription:
        "Erstellen Sie einen neuen Benutzer für diesen Betrieb.",
      editDescription:
        "Aktualisieren Sie die Daten und Berechtigungen des Benutzers.",
      close:
        "Schließen",

      fields: {
        name: "Name",
        email: "E-Mail",
        password:
          "Passwort",
        newPassword:
          "Neues Passwort",
        role: "Rolle",
        phone:
          "Telefon",
        avatar: "Avatar",
      },

      hints: {
        passwordCreate:
          "Mindestens 8 Zeichen.",
        passwordEdit:
          "Leer lassen, um das aktuelle Passwort beizubehalten.",
        avatar:
          "Optionale URL.",
      },

      placeholders: {
        name:
          "Name des Mitarbeiters",
        email:
          "mitarbeiter@beispiel.de",
        password:
          "Passwort",
        passwordUnchanged:
          "Keine Änderung",
        phone:
          "+49 170 0000000",
        avatar:
          "https://...",
      },

      activeTitle:
        "Aktiver Benutzer",
      activeDescription:
        "Inaktive Benutzer können sich nicht anmelden.",

      cancel:
        "Abbrechen",
      saving:
        "Speichern...",
      saveChanges:
        "Änderungen speichern",
      createEmployee:
        "Mitarbeiter erstellen",
    },

    validation: {
      nameRequired:
        "Der Name ist erforderlich.",
      emailRequired:
        "Die E-Mail-Adresse ist erforderlich.",
      passwordMin:
        "Das Passwort muss mindestens 8 Zeichen lang sein.",
      newPasswordMin:
        "Das neue Passwort muss mindestens 8 Zeichen lang sein.",
    },

    confirmations: {
      deleteUser: (
        name
      ) =>
        `"${name}" endgültig löschen?`,
    },

    success: {
      created:
        "Mitarbeiter erfolgreich erstellt.",
      updated:
        "Mitarbeiter erfolgreich aktualisiert.",
      activated:
        "Mitarbeiter erfolgreich aktiviert.",
      deactivated:
        "Mitarbeiter erfolgreich deaktiviert.",
      deleted:
        "Mitarbeiter erfolgreich gelöscht.",
    },

    errors: {
      load:
        "Das Personal konnte nicht geladen werden.",
      create:
        "Der Mitarbeiter konnte nicht erstellt werden.",
      update:
        "Der Mitarbeiter konnte nicht aktualisiert werden.",
      toggle:
        "Der Mitarbeiterstatus konnte nicht geändert werden.",
      delete:
        "Der Mitarbeiter konnte nicht gelöscht werden.",
    },
  },

  fr: {
    page: {
      title: "Personnel",
      subtitle:
        "Gérez les utilisateurs et les rôles de l’établissement.",
      refresh:
        "Actualiser",
      create:
        "Nouvel employé",
    },

    loading:
      "Chargement du personnel...",

    stats: {
      total: "Total",
      active: "Actifs",
      management:
        "Gestion",
      operational:
        "Opérationnels",
    },

    empty: {
      title:
        "Aucun employé",
      description:
        "Créez le premier utilisateur du personnel de l’établissement.",
    },

    table: {
      employee:
        "Employé",
      role: "Rôle",
      status: "Statut",
      lastLogin:
        "Dernière connexion",
      actions:
        "Actions",
    },

    status: {
      active: "Actif",
      inactive:
        "Inactif",
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

    actions: {
      edit: "Modifier",
      activate:
        "Activer",
      deactivate:
        "Désactiver",
      delete:
        "Supprimer",
    },

    dates: {
      never: "Jamais",
      invalid: "—",
    },

    modal: {
      createTitle:
        "Nouvel employé",
      editTitle:
        "Modifier l’employé",
      createDescription:
        "Créez un nouvel utilisateur pour cet établissement.",
      editDescription:
        "Mettez à jour les informations et les autorisations de l’utilisateur.",
      close: "Fermer",

      fields: {
        name: "Nom",
        email: "E-mail",
        password:
          "Mot de passe",
        newPassword:
          "Nouveau mot de passe",
        role: "Rôle",
        phone:
          "Téléphone",
        avatar: "Avatar",
      },

      hints: {
        passwordCreate:
          "8 caractères minimum.",
        passwordEdit:
          "Laissez ce champ vide pour conserver le mot de passe actuel.",
        avatar:
          "URL facultative.",
      },

      placeholders: {
        name:
          "Nom de l’employé",
        email:
          "employe@exemple.fr",
        password:
          "Mot de passe",
        passwordUnchanged:
          "Aucun changement",
        phone:
          "+33 6 00 00 00 00",
        avatar:
          "https://...",
      },

      activeTitle:
        "Utilisateur actif",
      activeDescription:
        "Les utilisateurs inactifs ne peuvent pas se connecter.",

      cancel: "Annuler",
      saving:
        "Enregistrement...",
      saveChanges:
        "Enregistrer les modifications",
      createEmployee:
        "Créer l’employé",
    },

    validation: {
      nameRequired:
        "Le nom est obligatoire.",
      emailRequired:
        "L’adresse e-mail est obligatoire.",
      passwordMin:
        "Le mot de passe doit contenir au moins 8 caractères.",
      newPasswordMin:
        "Le nouveau mot de passe doit contenir au moins 8 caractères.",
    },

    confirmations: {
      deleteUser: (
        name
      ) =>
        `Supprimer définitivement « ${name} » ?`,
    },

    success: {
      created:
        "Employé créé avec succès.",
      updated:
        "Employé mis à jour avec succès.",
      activated:
        "Employé activé avec succès.",
      deactivated:
        "Employé désactivé avec succès.",
      deleted:
        "Employé supprimé avec succès.",
    },

    errors: {
      load:
        "Impossible de charger le personnel.",
      create:
        "Impossible de créer l’employé.",
      update:
        "Impossible de mettre à jour l’employé.",
      toggle:
        "Impossible de modifier le statut de l’employé.",
      delete:
        "Impossible de supprimer l’employé.",
    },
  },

  it: {
    page: {
      title: "Personale",
      subtitle:
        "Gestisci gli utenti e i ruoli della struttura.",
      refresh:
        "Aggiorna",
      create:
        "Nuovo dipendente",
    },

    loading:
      "Caricamento del personale...",

    stats: {
      total: "Totale",
      active: "Attivi",
      management:
        "Gestione",
      operational:
        "Operativi",
    },

    empty: {
      title:
        "Nessun dipendente",
      description:
        "Crea il primo utente del personale della struttura.",
    },

    table: {
      employee:
        "Dipendente",
      role: "Ruolo",
      status: "Stato",
      lastLogin:
        "Ultimo accesso",
      actions:
        "Azioni",
    },

    status: {
      active: "Attivo",
      inactive:
        "Inattivo",
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

    actions: {
      edit:
        "Modifica",
      activate:
        "Attiva",
      deactivate:
        "Disattiva",
      delete:
        "Elimina",
    },

    dates: {
      never: "Mai",
      invalid: "—",
    },

    modal: {
      createTitle:
        "Nuovo dipendente",
      editTitle:
        "Modifica dipendente",
      createDescription:
        "Crea un nuovo utente per questa struttura.",
      editDescription:
        "Aggiorna i dati e le autorizzazioni dell’utente.",
      close: "Chiudi",

      fields: {
        name: "Nome",
        email: "Email",
        password:
          "Password",
        newPassword:
          "Nuova password",
        role: "Ruolo",
        phone:
          "Telefono",
        avatar: "Avatar",
      },

      hints: {
        passwordCreate:
          "Minimo 8 caratteri.",
        passwordEdit:
          "Lascia vuoto per mantenere la password attuale.",
        avatar:
          "URL facoltativo.",
      },

      placeholders: {
        name:
          "Nome del dipendente",
        email:
          "dipendente@esempio.it",
        password:
          "Password",
        passwordUnchanged:
          "Nessuna modifica",
        phone:
          "+39 320 0000000",
        avatar:
          "https://...",
      },

      activeTitle:
        "Utente attivo",
      activeDescription:
        "Gli utenti inattivi non possono accedere.",

      cancel: "Annulla",
      saving:
        "Salvataggio...",
      saveChanges:
        "Salva modifiche",
      createEmployee:
        "Crea dipendente",
    },

    validation: {
      nameRequired:
        "Il nome è obbligatorio.",
      emailRequired:
        "L’email è obbligatoria.",
      passwordMin:
        "La password deve contenere almeno 8 caratteri.",
      newPasswordMin:
        "La nuova password deve contenere almeno 8 caratteri.",
    },

    confirmations: {
      deleteUser: (
        name
      ) =>
        `Eliminare definitivamente "${name}"?`,
    },

    success: {
      created:
        "Dipendente creato correttamente.",
      updated:
        "Dipendente aggiornato correttamente.",
      activated:
        "Dipendente attivato correttamente.",
      deactivated:
        "Dipendente disattivato correttamente.",
      deleted:
        "Dipendente eliminato correttamente.",
    },

    errors: {
      load:
        "Impossibile caricare il personale.",
      create:
        "Impossibile creare il dipendente.",
      update:
        "Impossibile aggiornare il dipendente.",
      toggle:
        "Impossibile modificare lo stato del dipendente.",
      delete:
        "Impossibile eliminare il dipendente.",
    },
  },

  pt: {
    page: {
      title: "Pessoal",
      subtitle:
        "Gerencie os utilizadores e as funções do estabelecimento.",
      refresh:
        "Atualizar",
      create:
        "Novo funcionário",
    },

    loading:
      "A carregar o pessoal...",

    stats: {
      total: "Total",
      active: "Ativos",
      management:
        "Gestão",
      operational:
        "Operacionais",
    },

    empty: {
      title:
        "Sem funcionários",
      description:
        "Crie o primeiro utilizador do pessoal do estabelecimento.",
    },

    table: {
      employee:
        "Funcionário",
      role: "Função",
      status: "Estado",
      lastLogin:
        "Último acesso",
      actions:
        "Ações",
    },

    status: {
      active: "Ativo",
      inactive:
        "Inativo",
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

    actions: {
      edit: "Editar",
      activate:
        "Ativar",
      deactivate:
        "Desativar",
      delete:
        "Eliminar",
    },

    dates: {
      never: "Nunca",
      invalid: "—",
    },

    modal: {
      createTitle:
        "Novo funcionário",
      editTitle:
        "Editar funcionário",
      createDescription:
        "Crie um novo utilizador para este estabelecimento.",
      editDescription:
        "Atualize os dados e as permissões do utilizador.",
      close: "Fechar",

      fields: {
        name: "Nome",
        email: "Email",
        password:
          "Palavra-passe",
        newPassword:
          "Nova palavra-passe",
        role: "Função",
        phone:
          "Telefone",
        avatar: "Avatar",
      },

      hints: {
        passwordCreate:
          "Mínimo de 8 caracteres.",
        passwordEdit:
          "Deixe em branco para manter a palavra-passe atual.",
        avatar:
          "URL opcional.",
      },

      placeholders: {
        name:
          "Nome do funcionário",
        email:
          "funcionario@exemplo.pt",
        password:
          "Palavra-passe",
        passwordUnchanged:
          "Sem alterações",
        phone:
          "+351 900 000 000",
        avatar:
          "https://...",
      },

      activeTitle:
        "Utilizador ativo",
      activeDescription:
        "Os utilizadores inativos não podem iniciar sessão.",

      cancel: "Cancelar",
      saving:
        "A guardar...",
      saveChanges:
        "Guardar alterações",
      createEmployee:
        "Criar funcionário",
    },

    validation: {
      nameRequired:
        "O nome é obrigatório.",
      emailRequired:
        "O email é obrigatório.",
      passwordMin:
        "A palavra-passe deve ter pelo menos 8 caracteres.",
      newPasswordMin:
        "A nova palavra-passe deve ter pelo menos 8 caracteres.",
    },

    confirmations: {
      deleteUser: (
        name
      ) =>
        `Eliminar definitivamente "${name}"?`,
    },

    success: {
      created:
        "Funcionário criado com sucesso.",
      updated:
        "Funcionário atualizado com sucesso.",
      activated:
        "Funcionário ativado com sucesso.",
      deactivated:
        "Funcionário desativado com sucesso.",
      deleted:
        "Funcionário eliminado com sucesso.",
    },

    errors: {
      load:
        "Não foi possível carregar o pessoal.",
      create:
        "Não foi possível criar o funcionário.",
      update:
        "Não foi possível atualizar o funcionário.",
      toggle:
        "Não foi possível alterar o estado do funcionário.",
      delete:
        "Não foi possível eliminar o funcionário.",
    },
  },
};