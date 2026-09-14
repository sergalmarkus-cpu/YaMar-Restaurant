export const ADMIN_PROFILE_MESSAGES = {
  es: {
    loadError:
      "No se ha podido cargar la información del usuario.",

    title:
      "Mi perfil",

    subtitle:
      "Información de tu cuenta administrativa.",

    email:
      "Correo electrónico",

    role:
      "Rol",

    establishment:
      "Establecimiento",

    roles: {
      admin:
        "Administrador",
      manager:
        "Gerente",
      waiter:
        "Camarero",
      kitchen:
        "Cocina",
      bar:
        "Bar",
      cashier:
        "Caja",
      unknown:
        "Usuario",
    },
  },

  en: {
    loadError:
      "The user information could not be loaded.",

    title:
      "My profile",

    subtitle:
      "Information about your administrative account.",

    email:
      "Email address",

    role:
      "Role",

    establishment:
      "Establishment",

    roles: {
      admin:
        "Administrator",
      manager:
        "Manager",
      waiter:
        "Waiter",
      kitchen:
        "Kitchen",
      bar:
        "Bar",
      cashier:
        "Cashier",
      unknown:
        "User",
    },
  },

  de: {
    loadError:
      "Die Benutzerinformationen konnten nicht geladen werden.",

    title:
      "Mein Profil",

    subtitle:
      "Informationen zu Ihrem Administratorkonto.",

    email:
      "E-Mail-Adresse",

    role:
      "Rolle",

    establishment:
      "Betrieb",

    roles: {
      admin:
        "Administrator",
      manager:
        "Manager",
      waiter:
        "Servicekraft",
      kitchen:
        "Küche",
      bar:
        "Bar",
      cashier:
        "Kasse",
      unknown:
        "Benutzer",
    },
  },

  fr: {
    loadError:
      "Impossible de charger les informations de l’utilisateur.",

    title:
      "Mon profil",

    subtitle:
      "Informations relatives à votre compte administrateur.",

    email:
      "Adresse e-mail",

    role:
      "Rôle",

    establishment:
      "Établissement",

    roles: {
      admin:
        "Administrateur",
      manager:
        "Responsable",
      waiter:
        "Serveur",
      kitchen:
        "Cuisine",
      bar:
        "Bar",
      cashier:
        "Caissier",
      unknown:
        "Utilisateur",
    },
  },

  it: {
    loadError:
      "Impossibile caricare le informazioni dell’utente.",

    title:
      "Il mio profilo",

    subtitle:
      "Informazioni sul tuo account amministrativo.",

    email:
      "Indirizzo e-mail",

    role:
      "Ruolo",

    establishment:
      "Struttura",

    roles: {
      admin:
        "Amministratore",
      manager:
        "Responsabile",
      waiter:
        "Cameriere",
      kitchen:
        "Cucina",
      bar:
        "Bar",
      cashier:
        "Cassiere",
      unknown:
        "Utente",
    },
  },

  pt: {
    loadError:
      "Não foi possível carregar as informações do utilizador.",

    title:
      "O meu perfil",

    subtitle:
      "Informações da sua conta administrativa.",

    email:
      "Endereço de e-mail",

    role:
      "Função",

    establishment:
      "Estabelecimento",

    roles: {
      admin:
        "Administrador",
      manager:
        "Gerente",
      waiter:
        "Empregado de mesa",
      kitchen:
        "Cozinha",
      bar:
        "Bar",
      cashier:
        "Caixa",
      unknown:
        "Utilizador",
    },
  },
} as const;

export type AdminProfileLanguage =
  keyof typeof ADMIN_PROFILE_MESSAGES;