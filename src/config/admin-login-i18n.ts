import type {
  Language,
} from "@/types";

export interface AdminLoginMessages {
  subtitle: string;

  language: string;
  selectLanguage: string;

  emailLabel: string;
  emailPlaceholder: string;

  passwordLabel: string;
  passwordPlaceholder: string;

  submit: string;
  submitting: string;

  validation: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
  };

  errors: {
    invalidCredentials: string;
    inactiveUser: string;
    invalidResponse: string;
    connection: string;
    server: string;
    generic: string;
  };
}

export const ADMIN_LOGIN_MESSAGES: Record<
  Language,
  AdminLoginMessages
> = {
  es: {
    subtitle:
      "Panel de administración",

    language:
      "Idioma",

    selectLanguage:
      "Seleccionar idioma",

    emailLabel:
      "Correo electrónico",

    emailPlaceholder:
      "admin@ejemplo.com",

    passwordLabel:
      "Contraseña",

    passwordPlaceholder:
      "••••••••",

    submit:
      "Iniciar sesión",

    submitting:
      "Iniciando sesión...",

    validation: {
      emailRequired:
        "Introduce tu correo electrónico.",

      emailInvalid:
        "Introduce un correo electrónico válido.",

      passwordRequired:
        "Introduce tu contraseña.",
    },

    errors: {
      invalidCredentials:
        "El correo electrónico o la contraseña no son correctos.",

      inactiveUser:
        "Esta cuenta de usuario está inactiva.",

      invalidResponse:
        "La respuesta de autenticación no es válida.",

      connection:
        "No se pudo conectar con el servidor.",

      server:
        "Se produjo un error interno del servidor.",

      generic:
        "No se pudo iniciar sesión.",
    },
  },

  en: {
    subtitle:
      "Administration panel",

    language:
      "Language",

    selectLanguage:
      "Select language",

    emailLabel:
      "Email address",

    emailPlaceholder:
      "admin@example.com",

    passwordLabel:
      "Password",

    passwordPlaceholder:
      "••••••••",

    submit:
      "Sign in",

    submitting:
      "Signing in...",

    validation: {
      emailRequired:
        "Enter your email address.",

      emailInvalid:
        "Enter a valid email address.",

      passwordRequired:
        "Enter your password.",
    },

    errors: {
      invalidCredentials:
        "The email address or password is incorrect.",

      inactiveUser:
        "This user account is inactive.",

      invalidResponse:
        "The authentication response is invalid.",

      connection:
        "Could not connect to the server.",

      server:
        "An internal server error occurred.",

      generic:
        "Could not sign in.",
    },
  },

  de: {
    subtitle:
      "Administrationsbereich",

    language:
      "Sprache",

    selectLanguage:
      "Sprache auswählen",

    emailLabel:
      "E-Mail-Adresse",

    emailPlaceholder:
      "admin@beispiel.de",

    passwordLabel:
      "Passwort",

    passwordPlaceholder:
      "••••••••",

    submit:
      "Anmelden",

    submitting:
      "Anmeldung läuft...",

    validation: {
      emailRequired:
        "Gib deine E-Mail-Adresse ein.",

      emailInvalid:
        "Gib eine gültige E-Mail-Adresse ein.",

      passwordRequired:
        "Gib dein Passwort ein.",
    },

    errors: {
      invalidCredentials:
        "Die E-Mail-Adresse oder das Passwort ist falsch.",

      inactiveUser:
        "Dieses Benutzerkonto ist inaktiv.",

      invalidResponse:
        "Die Authentifizierungsantwort ist ungültig.",

      connection:
        "Die Verbindung zum Server konnte nicht hergestellt werden.",

      server:
        "Ein interner Serverfehler ist aufgetreten.",

      generic:
        "Die Anmeldung war nicht möglich.",
    },
  },

  fr: {
    subtitle:
      "Panneau d’administration",

    language:
      "Langue",

    selectLanguage:
      "Sélectionner la langue",

    emailLabel:
      "Adresse e-mail",

    emailPlaceholder:
      "admin@exemple.com",

    passwordLabel:
      "Mot de passe",

    passwordPlaceholder:
      "••••••••",

    submit:
      "Se connecter",

    submitting:
      "Connexion en cours...",

    validation: {
      emailRequired:
        "Saisissez votre adresse e-mail.",

      emailInvalid:
        "Saisissez une adresse e-mail valide.",

      passwordRequired:
        "Saisissez votre mot de passe.",
    },

    errors: {
      invalidCredentials:
        "L’adresse e-mail ou le mot de passe est incorrect.",

      inactiveUser:
        "Ce compte utilisateur est inactif.",

      invalidResponse:
        "La réponse d’authentification n’est pas valide.",

      connection:
        "Impossible de se connecter au serveur.",

      server:
        "Une erreur interne du serveur s’est produite.",

      generic:
        "Impossible de se connecter.",
    },
  },

  it: {
    subtitle:
      "Pannello di amministrazione",

    language:
      "Lingua",

    selectLanguage:
      "Seleziona lingua",

    emailLabel:
      "Indirizzo e-mail",

    emailPlaceholder:
      "admin@esempio.it",

    passwordLabel:
      "Password",

    passwordPlaceholder:
      "••••••••",

    submit:
      "Accedi",

    submitting:
      "Accesso in corso...",

    validation: {
      emailRequired:
        "Inserisci il tuo indirizzo e-mail.",

      emailInvalid:
        "Inserisci un indirizzo e-mail valido.",

      passwordRequired:
        "Inserisci la password.",
    },

    errors: {
      invalidCredentials:
        "L’indirizzo e-mail o la password non sono corretti.",

      inactiveUser:
        "Questo account utente non è attivo.",

      invalidResponse:
        "La risposta di autenticazione non è valida.",

      connection:
        "Impossibile connettersi al server.",

      server:
        "Si è verificato un errore interno del server.",

      generic:
        "Impossibile effettuare l’accesso.",
    },
  },

  pt: {
    subtitle:
      "Painel de administração",

    language:
      "Idioma",

    selectLanguage:
      "Selecionar idioma",

    emailLabel:
      "Endereço de e-mail",

    emailPlaceholder:
      "admin@exemplo.pt",

    passwordLabel:
      "Palavra-passe",

    passwordPlaceholder:
      "••••••••",

    submit:
      "Iniciar sessão",

    submitting:
      "A iniciar sessão...",

    validation: {
      emailRequired:
        "Introduza o seu endereço de e-mail.",

      emailInvalid:
        "Introduza um endereço de e-mail válido.",

      passwordRequired:
        "Introduza a sua palavra-passe.",
    },

    errors: {
      invalidCredentials:
        "O endereço de e-mail ou a palavra-passe estão incorretos.",

      inactiveUser:
        "Esta conta de utilizador está inativa.",

      invalidResponse:
        "A resposta de autenticação não é válida.",

      connection:
        "Não foi possível estabelecer ligação ao servidor.",

      server:
        "Ocorreu um erro interno do servidor.",

      generic:
        "Não foi possível iniciar sessão.",
    },
  },
};