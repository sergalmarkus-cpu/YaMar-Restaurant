import type {
  Language,
} from "@/types";

export interface AdminIntegrationsMessages {
  loading: string;
  loadError: string;

  page: {
    title: string;
    subtitle: string;
    refresh: string;
    refreshing: string;
    securityNotice: string;
  };

  stats: {
    integrations: string;
    ready: string;
    pending: string;
    tenant: string;
  };

  common: {
    ready: string;
    requiresConfiguration: string;

    configuration: string;
    complete: string;
    incomplete: string;

    enabled: string;
    yes: string;
    no: string;

    status: string;
    operational: string;
    notOperational: string;

    requirements: string;
    configured: string;
    pending: string;
  };

  stripe: {
    title: string;
    description: string;
    enabled: string;
    disabled: string;
    requirements: {
      publishableKey: string;
      secretKey: string;
      webhook: string;
    };
  };

  email: {
    title: string;
    description: string;
    requirements: {
      apiKey: string;
      sender: string;
    };
  };

  sms: {
    title: string;
    description: string;
    requirements: {
      accountSid: string;
      authToken: string;
      phoneNumber: string;
    };
  };

  analytics: {
    title: string;
    description: string;
    requirements: {
      measurementId: string;
    };
  };
}

export const ADMIN_INTEGRATIONS_MESSAGES: Record<
  Language,
  AdminIntegrationsMessages
> = {
  es: {
    loading:
      "Cargando integraciones...",
    loadError:
      "No se pudo cargar el estado de las integraciones.",

    page: {
      title:
        "Integraciones",
      subtitle:
        "Comprueba el estado de los servicios externos utilizados por YaMar.",
      refresh:
        "Actualizar estado",
      refreshing:
        "Actualizando...",
      securityNotice:
        "Las credenciales y secretos de las integraciones no se muestran en esta pantalla. El panel únicamente indica si cada requisito está configurado y si el servicio está listo para utilizarse.",
    },

    stats: {
      integrations:
        "Integraciones",
      ready:
        "Operativas",
      pending:
        "Pendientes",
      tenant:
        "Tenant",
    },

    common: {
      ready:
        "Lista",
      requiresConfiguration:
        "Requiere configuración",

      configuration:
        "Configuración",
      complete:
        "Completa",
      incomplete:
        "Incompleta",

      enabled:
        "Habilitada",
      yes:
        "Sí",
      no:
        "No",

      status:
        "Estado",
      operational:
        "Operativa",
      notOperational:
        "No operativa",

      requirements:
        "Requisitos",
      configured:
        "Configurado",
      pending:
        "Pendiente",
    },

    stripe: {
      title:
        "Pagos online",
      description:
        "Procesamiento seguro de pagos digitales realizados por los clientes desde YaMar.",
      enabled:
        "El pago online está habilitado para este establecimiento.",
      disabled:
        "Stripe puede estar configurado globalmente, pero el pago online está deshabilitado para este establecimiento.",
      requirements: {
        publishableKey:
          "Clave pública",
        secretKey:
          "Clave secreta",
        webhook:
          "Webhook",
      },
    },

    email: {
      title:
        "Correo electrónico",
      description:
        "Envío de recibos electrónicos y comunicaciones por correo desde la plataforma.",
      requirements: {
        apiKey:
          "API key",
        sender:
          "Remitente",
      },
    },

    sms: {
      title:
        "Mensajería SMS",
      description:
        "Infraestructura preparada para comunicaciones y notificaciones mediante SMS.",
      requirements: {
        accountSid:
          "Account SID",
        authToken:
          "Auth token",
        phoneNumber:
          "Número de teléfono",
      },
    },

    analytics: {
      title:
        "Analítica",
      description:
        "Medición del uso de la aplicación y análisis de la actividad digital del establecimiento.",
      requirements: {
        measurementId:
          "Measurement ID",
      },
    },
  },

  en: {
    loading:
      "Loading integrations...",
    loadError:
      "The integration status could not be loaded.",

    page: {
      title:
        "Integrations",
      subtitle:
        "Check the status of the external services used by YaMar.",
      refresh:
        "Refresh status",
      refreshing:
        "Refreshing...",
      securityNotice:
        "Integration credentials and secrets are not shown on this screen. The panel only indicates whether each requirement is configured and whether the service is ready to use.",
    },

    stats: {
      integrations:
        "Integrations",
      ready:
        "Operational",
      pending:
        "Pending",
      tenant:
        "Tenant",
    },

    common: {
      ready:
        "Ready",
      requiresConfiguration:
        "Requires configuration",

      configuration:
        "Configuration",
      complete:
        "Complete",
      incomplete:
        "Incomplete",

      enabled:
        "Enabled",
      yes:
        "Yes",
      no:
        "No",

      status:
        "Status",
      operational:
        "Operational",
      notOperational:
        "Not operational",

      requirements:
        "Requirements",
      configured:
        "Configured",
      pending:
        "Pending",
    },

    stripe: {
      title:
        "Online payments",
      description:
        "Secure processing of digital payments made by customers through YaMar.",
      enabled:
        "Online payments are enabled for this establishment.",
      disabled:
        "Stripe may be configured globally, but online payments are disabled for this establishment.",
      requirements: {
        publishableKey:
          "Publishable key",
        secretKey:
          "Secret key",
        webhook:
          "Webhook",
      },
    },

    email: {
      title:
        "Email",
      description:
        "Delivery of electronic receipts and email communications from the platform.",
      requirements: {
        apiKey:
          "API key",
        sender:
          "Sender",
      },
    },

    sms: {
      title:
        "SMS messaging",
      description:
        "Infrastructure for communications and notifications by SMS.",
      requirements: {
        accountSid:
          "Account SID",
        authToken:
          "Auth token",
        phoneNumber:
          "Phone number",
      },
    },

    analytics: {
      title:
        "Analytics",
      description:
        "Measurement of application usage and analysis of the establishment's digital activity.",
      requirements: {
        measurementId:
          "Measurement ID",
      },
    },
  },

  de: {
    loading:
      "Integrationen werden geladen...",
    loadError:
      "Der Status der Integrationen konnte nicht geladen werden.",

    page: {
      title:
        "Integrationen",
      subtitle:
        "Prüfen Sie den Status der von YaMar verwendeten externen Dienste.",
      refresh:
        "Status aktualisieren",
      refreshing:
        "Wird aktualisiert...",
      securityNotice:
        "Zugangsdaten und Geheimnisse der Integrationen werden auf dieser Seite nicht angezeigt. Das Panel zeigt lediglich, ob die jeweiligen Anforderungen konfiguriert sind und ob der Dienst einsatzbereit ist.",
    },

    stats: {
      integrations:
        "Integrationen",
      ready:
        "Betriebsbereit",
      pending:
        "Ausstehend",
      tenant:
        "Mandant",
    },

    common: {
      ready:
        "Bereit",
      requiresConfiguration:
        "Konfiguration erforderlich",

      configuration:
        "Konfiguration",
      complete:
        "Vollständig",
      incomplete:
        "Unvollständig",

      enabled:
        "Aktiviert",
      yes:
        "Ja",
      no:
        "Nein",

      status:
        "Status",
      operational:
        "Betriebsbereit",
      notOperational:
        "Nicht betriebsbereit",

      requirements:
        "Anforderungen",
      configured:
        "Konfiguriert",
      pending:
        "Ausstehend",
    },

    stripe: {
      title:
        "Online-Zahlungen",
      description:
        "Sichere Verarbeitung digitaler Zahlungen, die Kunden über YaMar durchführen.",
      enabled:
        "Online-Zahlungen sind für diesen Betrieb aktiviert.",
      disabled:
        "Stripe kann global konfiguriert sein, Online-Zahlungen sind für diesen Betrieb jedoch deaktiviert.",
      requirements: {
        publishableKey:
          "Öffentlicher Schlüssel",
        secretKey:
          "Geheimer Schlüssel",
        webhook:
          "Webhook",
      },
    },

    email: {
      title:
        "E-Mail",
      description:
        "Versand elektronischer Belege und E-Mail-Mitteilungen über die Plattform.",
      requirements: {
        apiKey:
          "API-Schlüssel",
        sender:
          "Absender",
      },
    },

    sms: {
      title:
        "SMS-Nachrichten",
      description:
        "Infrastruktur für Kommunikation und Benachrichtigungen per SMS.",
      requirements: {
        accountSid:
          "Account SID",
        authToken:
          "Auth-Token",
        phoneNumber:
          "Telefonnummer",
      },
    },

    analytics: {
      title:
        "Analytik",
      description:
        "Messung der App-Nutzung und Analyse der digitalen Aktivitäten des Betriebs.",
      requirements: {
        measurementId:
          "Measurement ID",
      },
    },
  },

  fr: {
    loading:
      "Chargement des intégrations...",
    loadError:
      "Impossible de charger l’état des intégrations.",

    page: {
      title:
        "Intégrations",
      subtitle:
        "Consultez l’état des services externes utilisés par YaMar.",
      refresh:
        "Actualiser l’état",
      refreshing:
        "Actualisation...",
      securityNotice:
        "Les identifiants et secrets des intégrations ne sont pas affichés sur cet écran. Le panneau indique uniquement si chaque exigence est configurée et si le service est prêt à être utilisé.",
    },

    stats: {
      integrations:
        "Intégrations",
      ready:
        "Opérationnelles",
      pending:
        "En attente",
      tenant:
        "Établissement",
    },

    common: {
      ready:
        "Prête",
      requiresConfiguration:
        "Configuration requise",

      configuration:
        "Configuration",
      complete:
        "Complète",
      incomplete:
        "Incomplète",

      enabled:
        "Activée",
      yes:
        "Oui",
      no:
        "Non",

      status:
        "Statut",
      operational:
        "Opérationnelle",
      notOperational:
        "Non opérationnelle",

      requirements:
        "Exigences",
      configured:
        "Configuré",
      pending:
        "En attente",
    },

    stripe: {
      title:
        "Paiements en ligne",
      description:
        "Traitement sécurisé des paiements numériques effectués par les clients depuis YaMar.",
      enabled:
        "Le paiement en ligne est activé pour cet établissement.",
      disabled:
        "Stripe peut être configuré globalement, mais le paiement en ligne est désactivé pour cet établissement.",
      requirements: {
        publishableKey:
          "Clé publique",
        secretKey:
          "Clé secrète",
        webhook:
          "Webhook",
      },
    },

    email: {
      title:
        "E-mail",
      description:
        "Envoi de reçus électroniques et de communications par e-mail depuis la plateforme.",
      requirements: {
        apiKey:
          "Clé API",
        sender:
          "Expéditeur",
      },
    },

    sms: {
      title:
        "Messagerie SMS",
      description:
        "Infrastructure destinée aux communications et notifications par SMS.",
      requirements: {
        accountSid:
          "Account SID",
        authToken:
          "Jeton d’authentification",
        phoneNumber:
          "Numéro de téléphone",
      },
    },

    analytics: {
      title:
        "Analytique",
      description:
        "Mesure de l’utilisation de l’application et analyse de l’activité numérique de l’établissement.",
      requirements: {
        measurementId:
          "Measurement ID",
      },
    },
  },

  it: {
    loading:
      "Caricamento delle integrazioni...",
    loadError:
      "Impossibile caricare lo stato delle integrazioni.",

    page: {
      title:
        "Integrazioni",
      subtitle:
        "Controlla lo stato dei servizi esterni utilizzati da YaMar.",
      refresh:
        "Aggiorna stato",
      refreshing:
        "Aggiornamento...",
      securityNotice:
        "Le credenziali e i segreti delle integrazioni non vengono mostrati in questa schermata. Il pannello indica soltanto se ogni requisito è configurato e se il servizio è pronto all’uso.",
    },

    stats: {
      integrations:
        "Integrazioni",
      ready:
        "Operative",
      pending:
        "In sospeso",
      tenant:
        "Struttura",
    },

    common: {
      ready:
        "Pronta",
      requiresConfiguration:
        "Configurazione richiesta",

      configuration:
        "Configurazione",
      complete:
        "Completa",
      incomplete:
        "Incompleta",

      enabled:
        "Abilitata",
      yes:
        "Sì",
      no:
        "No",

      status:
        "Stato",
      operational:
        "Operativa",
      notOperational:
        "Non operativa",

      requirements:
        "Requisiti",
      configured:
        "Configurato",
      pending:
        "In sospeso",
    },

    stripe: {
      title:
        "Pagamenti online",
      description:
        "Elaborazione sicura dei pagamenti digitali effettuati dai clienti tramite YaMar.",
      enabled:
        "I pagamenti online sono abilitati per questa struttura.",
      disabled:
        "Stripe può essere configurato globalmente, ma i pagamenti online sono disabilitati per questa struttura.",
      requirements: {
        publishableKey:
          "Chiave pubblica",
        secretKey:
          "Chiave segreta",
        webhook:
          "Webhook",
      },
    },

    email: {
      title:
        "E-mail",
      description:
        "Invio di ricevute elettroniche e comunicazioni via e-mail dalla piattaforma.",
      requirements: {
        apiKey:
          "Chiave API",
        sender:
          "Mittente",
      },
    },

    sms: {
      title:
        "Messaggistica SMS",
      description:
        "Infrastruttura per comunicazioni e notifiche tramite SMS.",
      requirements: {
        accountSid:
          "Account SID",
        authToken:
          "Token di autenticazione",
        phoneNumber:
          "Numero di telefono",
      },
    },

    analytics: {
      title:
        "Analisi",
      description:
        "Misurazione dell’utilizzo dell’applicazione e analisi dell’attività digitale della struttura.",
      requirements: {
        measurementId:
          "Measurement ID",
      },
    },
  },

  pt: {
    loading:
      "A carregar integrações...",
    loadError:
      "Não foi possível carregar o estado das integrações.",

    page: {
      title:
        "Integrações",
      subtitle:
        "Consulte o estado dos serviços externos utilizados pelo YaMar.",
      refresh:
        "Atualizar estado",
      refreshing:
        "A atualizar...",
      securityNotice:
        "As credenciais e os segredos das integrações não são apresentados neste ecrã. O painel indica apenas se cada requisito está configurado e se o serviço está pronto a utilizar.",
    },

    stats: {
      integrations:
        "Integrações",
      ready:
        "Operacionais",
      pending:
        "Pendentes",
      tenant:
        "Estabelecimento",
    },

    common: {
      ready:
        "Pronta",
      requiresConfiguration:
        "Requer configuração",

      configuration:
        "Configuração",
      complete:
        "Completa",
      incomplete:
        "Incompleta",

      enabled:
        "Ativada",
      yes:
        "Sim",
      no:
        "Não",

      status:
        "Estado",
      operational:
        "Operacional",
      notOperational:
        "Não operacional",

      requirements:
        "Requisitos",
      configured:
        "Configurado",
      pending:
        "Pendente",
    },

    stripe: {
      title:
        "Pagamentos online",
      description:
        "Processamento seguro de pagamentos digitais realizados pelos clientes através do YaMar.",
      enabled:
        "Os pagamentos online estão ativados para este estabelecimento.",
      disabled:
        "O Stripe pode estar configurado globalmente, mas os pagamentos online estão desativados para este estabelecimento.",
      requirements: {
        publishableKey:
          "Chave pública",
        secretKey:
          "Chave secreta",
        webhook:
          "Webhook",
      },
    },

    email: {
      title:
        "E-mail",
      description:
        "Envio de recibos eletrónicos e comunicações por e-mail a partir da plataforma.",
      requirements: {
        apiKey:
          "Chave API",
        sender:
          "Remetente",
      },
    },

    sms: {
      title:
        "Mensagens SMS",
      description:
        "Infraestrutura para comunicações e notificações através de SMS.",
      requirements: {
        accountSid:
          "Account SID",
        authToken:
          "Token de autenticação",
        phoneNumber:
          "Número de telefone",
      },
    },

    analytics: {
      title:
        "Analítica",
      description:
        "Medição da utilização da aplicação e análise da atividade digital do estabelecimento.",
      requirements: {
        measurementId:
          "Measurement ID",
      },
    },
  },
};