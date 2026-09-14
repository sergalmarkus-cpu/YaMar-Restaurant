import type {
  Language,
} from "@/types";

export type AdminRole =
  | "admin"
  | "manager"
  | "waiter"
  | "kitchen"
  | "bar"
  | "cashier";

interface RoleTranslation {
  label: string;
  description: string;
  access: string;
}

export interface AdminRolesMessages {
  loading: string;

  page: {
    title: string;
    subtitle: string;
    refresh: string;
  };

  stats: {
    available: string;
    staff: string;
    activeUsers: string;
    management: string;
  };

  permissions: {
    title: string;
    description: string;
  };

  roleCard: {
    users: string;
    active: string;
  };

  assignments: {
    title: string;
    description: string;
    goToStaff: string;
  };

  roles: Record<
    AdminRole,
    RoleTranslation
  >;

  errors: {
    load: string;
  };
}

export const ADMIN_ROLES_MESSAGES: Record<
  Language,
  AdminRolesMessages
> = {
  es: {
    loading:
      "Cargando roles...",

    page: {
      title: "Roles",
      subtitle:
        "Consulta los roles disponibles y su distribución entre el personal.",
      refresh: "Actualizar",
    },

    stats: {
      available:
        "Roles disponibles",
      staff: "Personal",
      activeUsers:
        "Usuarios activos",
      management:
        "Gestión",
    },

    permissions: {
      title:
        "Modelo de permisos",
      description:
        "Los roles forman parte del modelo de seguridad de YaMar. El administrador puede gestionar todos los roles. El manager puede gestionar los perfiles operativos: camarero, cocina, bar y caja.",
    },

    roleCard: {
      users: "Usuarios",
      active: "Activos",
    },

    assignments: {
      title:
        "Gestión de asignaciones",
      description:
        "La asignación y modificación de roles se realiza desde Personal. Esta pantalla muestra la estructura de roles y su utilización sin duplicar la gestión de empleados.",
      goToStaff:
        "Ir a Personal",
    },

    roles: {
      admin: {
        label:
          "Administrador",
        description:
          "Administración completa del establecimiento y gestión de todo el personal.",
        access:
          "Acceso de gestión completo",
      },

      manager: {
        label: "Manager",
        description:
          "Gestión operativa del establecimiento y del personal no administrativo.",
        access:
          "Acceso de gestión",
      },

      waiter: {
        label: "Camarero",
        description:
          "Atención de mesas, pedidos y operaciones propias del servicio de sala.",
        access:
          "Acceso operativo",
      },

      kitchen: {
        label: "Cocina",
        description:
          "Acceso a las funciones relacionadas con la preparación y gestión de cocina.",
        access:
          "Acceso operativo",
      },

      bar: {
        label: "Bar",
        description:
          "Acceso a las operaciones correspondientes al servicio y preparación de bar.",
        access:
          "Acceso operativo",
      },

      cashier: {
        label: "Caja",
        description:
          "Acceso a las funciones operativas relacionadas con cobros y caja.",
        access:
          "Acceso operativo",
      },
    },

    errors: {
      load:
        "No se pudo cargar la información de roles.",
    },
  },

  en: {
    loading:
      "Loading roles...",

    page: {
      title: "Roles",
      subtitle:
        "View the available roles and their distribution among staff.",
      refresh: "Refresh",
    },

    stats: {
      available:
        "Available roles",
      staff: "Staff",
      activeUsers:
        "Active users",
      management:
        "Management",
    },

    permissions: {
      title:
        "Permission model",
      description:
        "Roles are part of YaMar's security model. Administrators can manage all roles. Managers can manage operational profiles: waiter, kitchen, bar and cashier.",
    },

    roleCard: {
      users: "Users",
      active: "Active",
    },

    assignments: {
      title:
        "Role assignments",
      description:
        "Role assignment and modification are managed from Staff. This screen shows the role structure and its usage without duplicating employee management.",
      goToStaff:
        "Go to Staff",
    },

    roles: {
      admin: {
        label:
          "Administrator",
        description:
          "Full administration of the establishment and management of all staff.",
        access:
          "Full management access",
      },

      manager: {
        label: "Manager",
        description:
          "Operational management of the establishment and non-administrative staff.",
        access:
          "Management access",
      },

      waiter: {
        label: "Waiter",
        description:
          "Table service, order management and dining-room operations.",
        access:
          "Operational access",
      },

      kitchen: {
        label: "Kitchen",
        description:
          "Access to food preparation and kitchen management functions.",
        access:
          "Operational access",
      },

      bar: {
        label: "Bar",
        description:
          "Access to bar service and preparation operations.",
        access:
          "Operational access",
      },

      cashier: {
        label: "Cashier",
        description:
          "Access to operational payment and cashier functions.",
        access:
          "Operational access",
      },
    },

    errors: {
      load:
        "Role information could not be loaded.",
    },
  },

  de: {
    loading:
      "Rollen werden geladen...",

    page: {
      title: "Rollen",
      subtitle:
        "Verfügbare Rollen und ihre Verteilung im Personal anzeigen.",
      refresh:
        "Aktualisieren",
    },

    stats: {
      available:
        "Verfügbare Rollen",
      staff: "Personal",
      activeUsers:
        "Aktive Benutzer",
      management:
        "Leitung",
    },

    permissions: {
      title:
        "Berechtigungsmodell",
      description:
        "Die Rollen sind Teil des Sicherheitsmodells von YaMar. Administratoren können alle Rollen verwalten. Manager können operative Profile verwalten: Kellner, Küche, Bar und Kasse.",
    },

    roleCard: {
      users: "Benutzer",
      active: "Aktiv",
    },

    assignments: {
      title:
        "Rollenzuweisungen",
      description:
        "Die Zuweisung und Änderung von Rollen erfolgt unter Personal. Diese Seite zeigt die Rollenstruktur und ihre Nutzung, ohne die Mitarbeiterverwaltung zu duplizieren.",
      goToStaff:
        "Zum Personal",
    },

    roles: {
      admin: {
        label:
          "Administrator",
        description:
          "Vollständige Verwaltung des Betriebs und des gesamten Personals.",
        access:
          "Vollständiger Verwaltungszugriff",
      },

      manager: {
        label: "Manager",
        description:
          "Operative Verwaltung des Betriebs und des nicht administrativen Personals.",
        access:
          "Verwaltungszugriff",
      },

      waiter: {
        label: "Kellner",
        description:
          "Tischservice, Bestellungen und operative Aufgaben im Servicebereich.",
        access:
          "Operativer Zugriff",
      },

      kitchen: {
        label: "Küche",
        description:
          "Zugriff auf Funktionen für Zubereitung und Küchenverwaltung.",
        access:
          "Operativer Zugriff",
      },

      bar: {
        label: "Bar",
        description:
          "Zugriff auf Aufgaben des Barservices und der Getränkezubereitung.",
        access:
          "Operativer Zugriff",
      },

      cashier: {
        label: "Kasse",
        description:
          "Zugriff auf operative Funktionen für Zahlungen und Kasse.",
        access:
          "Operativer Zugriff",
      },
    },

    errors: {
      load:
        "Die Rolleninformationen konnten nicht geladen werden.",
    },
  },

  fr: {
    loading:
      "Chargement des rôles...",

    page: {
      title: "Rôles",
      subtitle:
        "Consultez les rôles disponibles et leur répartition au sein du personnel.",
      refresh:
        "Actualiser",
    },

    stats: {
      available:
        "Rôles disponibles",
      staff: "Personnel",
      activeUsers:
        "Utilisateurs actifs",
      management:
        "Gestion",
    },

    permissions: {
      title:
        "Modèle d’autorisations",
      description:
        "Les rôles font partie du modèle de sécurité de YaMar. L’administrateur peut gérer tous les rôles. Le manager peut gérer les profils opérationnels : serveur, cuisine, bar et caisse.",
    },

    roleCard: {
      users:
        "Utilisateurs",
      active: "Actifs",
    },

    assignments: {
      title:
        "Gestion des affectations",
      description:
        "L’attribution et la modification des rôles s’effectuent depuis Personnel. Cet écran présente la structure des rôles et leur utilisation sans dupliquer la gestion des employés.",
      goToStaff:
        "Aller au Personnel",
    },

    roles: {
      admin: {
        label:
          "Administrateur",
        description:
          "Administration complète de l’établissement et gestion de l’ensemble du personnel.",
        access:
          "Accès complet à la gestion",
      },

      manager: {
        label: "Manager",
        description:
          "Gestion opérationnelle de l’établissement et du personnel non administratif.",
        access:
          "Accès à la gestion",
      },

      waiter: {
        label: "Serveur",
        description:
          "Service des tables, gestion des commandes et opérations de salle.",
        access:
          "Accès opérationnel",
      },

      kitchen: {
        label: "Cuisine",
        description:
          "Accès aux fonctions liées à la préparation et à la gestion de la cuisine.",
        access:
          "Accès opérationnel",
      },

      bar: {
        label: "Bar",
        description:
          "Accès aux opérations liées au service et à la préparation au bar.",
        access:
          "Accès opérationnel",
      },

      cashier: {
        label: "Caisse",
        description:
          "Accès aux fonctions opérationnelles liées aux paiements et à la caisse.",
        access:
          "Accès opérationnel",
      },
    },

    errors: {
      load:
        "Impossible de charger les informations sur les rôles.",
    },
  },

  it: {
    loading:
      "Caricamento dei ruoli...",

    page: {
      title: "Ruoli",
      subtitle:
        "Consulta i ruoli disponibili e la loro distribuzione tra il personale.",
      refresh:
        "Aggiorna",
    },

    stats: {
      available:
        "Ruoli disponibili",
      staff: "Personale",
      activeUsers:
        "Utenti attivi",
      management:
        "Gestione",
    },

    permissions: {
      title:
        "Modello dei permessi",
      description:
        "I ruoli fanno parte del modello di sicurezza di YaMar. L’amministratore può gestire tutti i ruoli. Il manager può gestire i profili operativi: cameriere, cucina, bar e cassa.",
    },

    roleCard: {
      users: "Utenti",
      active: "Attivi",
    },

    assignments: {
      title:
        "Gestione delle assegnazioni",
      description:
        "L’assegnazione e la modifica dei ruoli vengono gestite da Personale. Questa schermata mostra la struttura dei ruoli e il loro utilizzo senza duplicare la gestione dei dipendenti.",
      goToStaff:
        "Vai al Personale",
    },

    roles: {
      admin: {
        label:
          "Amministratore",
        description:
          "Amministrazione completa della struttura e gestione di tutto il personale.",
        access:
          "Accesso completo alla gestione",
      },

      manager: {
        label: "Manager",
        description:
          "Gestione operativa della struttura e del personale non amministrativo.",
        access:
          "Accesso alla gestione",
      },

      waiter: {
        label: "Cameriere",
        description:
          "Servizio ai tavoli, gestione degli ordini e operazioni di sala.",
        access:
          "Accesso operativo",
      },

      kitchen: {
        label: "Cucina",
        description:
          "Accesso alle funzioni relative alla preparazione e alla gestione della cucina.",
        access:
          "Accesso operativo",
      },

      bar: {
        label: "Bar",
        description:
          "Accesso alle operazioni relative al servizio e alla preparazione al bar.",
        access:
          "Accesso operativo",
      },

      cashier: {
        label: "Cassa",
        description:
          "Accesso alle funzioni operative relative ai pagamenti e alla cassa.",
        access:
          "Accesso operativo",
      },
    },

    errors: {
      load:
        "Impossibile caricare le informazioni sui ruoli.",
    },
  },

  pt: {
    loading:
      "A carregar funções...",

    page: {
      title: "Funções",
      subtitle:
        "Consulte as funções disponíveis e a sua distribuição pelo pessoal.",
      refresh:
        "Atualizar",
    },

    stats: {
      available:
        "Funções disponíveis",
      staff: "Pessoal",
      activeUsers:
        "Utilizadores ativos",
      management:
        "Gestão",
    },

    permissions: {
      title:
        "Modelo de permissões",
      description:
        "As funções fazem parte do modelo de segurança do YaMar. O administrador pode gerir todas as funções. O manager pode gerir os perfis operacionais: empregado de mesa, cozinha, bar e caixa.",
    },

    roleCard: {
      users:
        "Utilizadores",
      active: "Ativos",
    },

    assignments: {
      title:
        "Gestão de atribuições",
      description:
        "A atribuição e alteração de funções é realizada em Pessoal. Este ecrã apresenta a estrutura das funções e a sua utilização sem duplicar a gestão dos funcionários.",
      goToStaff:
        "Ir para Pessoal",
    },

    roles: {
      admin: {
        label:
          "Administrador",
        description:
          "Administração completa do estabelecimento e gestão de todo o pessoal.",
        access:
          "Acesso completo à gestão",
      },

      manager: {
        label: "Manager",
        description:
          "Gestão operacional do estabelecimento e do pessoal não administrativo.",
        access:
          "Acesso à gestão",
      },

      waiter: {
        label:
          "Empregado de mesa",
        description:
          "Atendimento às mesas, gestão de pedidos e operações de sala.",
        access:
          "Acesso operacional",
      },

      kitchen: {
        label: "Cozinha",
        description:
          "Acesso às funções relacionadas com a preparação e gestão da cozinha.",
        access:
          "Acesso operacional",
      },

      bar: {
        label: "Bar",
        description:
          "Acesso às operações relacionadas com o serviço e preparação do bar.",
        access:
          "Acesso operacional",
      },

      cashier: {
        label: "Caixa",
        description:
          "Acesso às funções operacionais relacionadas com pagamentos e caixa.",
        access:
          "Acesso operacional",
      },
    },

    errors: {
      load:
        "Não foi possível carregar as informações das funções.",
    },
  },
};