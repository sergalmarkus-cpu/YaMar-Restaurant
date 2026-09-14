import type {
  Language,
} from "@/types";

export interface AdminSettingsMessages {
  loading: string;
  title: string;
  subtitlePrefix: string;
  establishmentActive: string;
  establishmentInactive: string;
  saving: string;
  saveChanges: string;
  readOnlyNotice: string;

  loadError: string;
  noEstablishment: string;
  saveError: string;
  saveSuccess: string;
  invalidMaxDistance: string;

  generalTitle: string;
  generalDescription: string;
  name: string;
  slug: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string;

  locationTitle: string;
  locationDescription: string;
  latitude: string;
  longitude: string;
  maxDistance: string;
  geofenceTitle: string;
  geofenceDescription: string;

  localizationTitle: string;
  localizationDescription: string;
  currency: string;
  timezone: string;

  visualTitle: string;
  visualDescription: string;
  primaryColor: string;
  secondaryColor: string;

  featuresTitle: string;
  featuresDescription: string;

  geolocationTitle: string;
  geolocationDescription: string;

  onlinePaymentTitle: string;
  onlinePaymentDescription: string;

  splitBillTitle: string;
  splitBillDescription: string;

  ratingsTitle: string;
  ratingsDescription: string;

  loyaltyTitle: string;
  loyaltyDescription: string;

  reservationsTitle: string;
  reservationsDescription: string;

  callWaiterTitle: string;
  callWaiterDescription: string;

  tenant: string;
  enabled: string;
  disabled: string;
}

export const ADMIN_SETTINGS_MESSAGES: Record<
  Language,
  AdminSettingsMessages
> = {
  es: {
    loading: "Cargando configuración...",
    title: "Configuración",
    subtitlePrefix: "Configuración general de",
    establishmentActive: "Establecimiento activo",
    establishmentInactive: "Establecimiento inactivo",
    saving: "Guardando...",
    saveChanges: "Guardar cambios",
    readOnlyNotice:
      "Puedes consultar la configuración, pero solo un administrador puede modificarla.",

    loadError:
      "No se pudo cargar la configuración.",
    noEstablishment:
      "No se encontró el establecimiento asociado a tu cuenta.",
    saveError:
      "No se pudo guardar la configuración.",
    saveSuccess:
      "Configuración guardada correctamente.",
    invalidMaxDistance:
      "La distancia máxima debe ser un número entero mayor que cero.",

    generalTitle: "Información general",
    generalDescription:
      "Datos públicos e identificativos del establecimiento.",
    name: "Nombre",
    slug: "Slug",
    description: "Descripción",
    phone: "Teléfono",
    email: "Email",
    address: "Dirección",
    logoUrl: "URL del logotipo",

    locationTitle: "Ubicación y geovalla",
    locationDescription:
      "Coordenadas y distancia máxima permitida alrededor del establecimiento.",
    latitude: "Latitud",
    longitude: "Longitud",
    maxDistance: "Distancia máxima (m)",
    geofenceTitle: "Activar geovalla",
    geofenceDescription:
      "Limita determinadas operaciones a clientes situados dentro del radio configurado.",

    localizationTitle: "Localización",
    localizationDescription:
      "Moneda y zona horaria utilizadas por el establecimiento.",
    currency: "Moneda",
    timezone: "Zona horaria",

    visualTitle: "Identidad visual",
    visualDescription:
      "Colores principales utilizados por la experiencia del cliente.",
    primaryColor: "Color primario",
    secondaryColor: "Color secundario",

    featuresTitle: "Funciones del establecimiento",
    featuresDescription:
      "Activa o desactiva módulos disponibles para clientes y personal.",

    geolocationTitle: "Geolocalización",
    geolocationDescription:
      "Permite usar la posición del cliente.",

    onlinePaymentTitle: "Pago online",
    onlinePaymentDescription:
      "Permite pagos digitales desde la aplicación.",

    splitBillTitle: "División de cuenta",
    splitBillDescription:
      "Permite dividir una cuenta entre varios clientes.",

    ratingsTitle: "Valoraciones",
    ratingsDescription:
      "Permite registrar puntuaciones y comentarios.",

    loyaltyTitle: "Fidelización",
    loyaltyDescription:
      "Activa el sistema de puntos para clientes.",

    reservationsTitle: "Reservas",
    reservationsDescription:
      "Habilita funciones relacionadas con reservas.",

    callWaiterTitle: "Llamar al camarero",
    callWaiterDescription:
      "Permite solicitar asistencia desde la mesa.",

    tenant: "Tenant",
    enabled: "Activa",
    disabled: "Desactivada",
  },

  en: {
    loading: "Loading settings...",
    title: "Settings",
    subtitlePrefix: "General settings for",
    establishmentActive: "Establishment active",
    establishmentInactive: "Establishment inactive",
    saving: "Saving...",
    saveChanges: "Save changes",
    readOnlyNotice:
      "You can view the settings, but only an administrator can modify them.",

    loadError:
      "The settings could not be loaded.",
    noEstablishment:
      "No establishment associated with your account was found.",
    saveError:
      "The settings could not be saved.",
    saveSuccess:
      "Settings saved successfully.",
    invalidMaxDistance:
      "The maximum distance must be an integer greater than zero.",

    generalTitle: "General information",
    generalDescription:
      "Public and identifying information for the establishment.",
    name: "Name",
    slug: "Slug",
    description: "Description",
    phone: "Phone",
    email: "Email",
    address: "Address",
    logoUrl: "Logo URL",

    locationTitle: "Location and geofence",
    locationDescription:
      "Coordinates and maximum permitted distance around the establishment.",
    latitude: "Latitude",
    longitude: "Longitude",
    maxDistance: "Maximum distance (m)",
    geofenceTitle: "Enable geofence",
    geofenceDescription:
      "Restricts certain operations to customers located within the configured radius.",

    localizationTitle: "Localization",
    localizationDescription:
      "Currency and time zone used by the establishment.",
    currency: "Currency",
    timezone: "Time zone",

    visualTitle: "Visual identity",
    visualDescription:
      "Main colors used in the customer experience.",
    primaryColor: "Primary color",
    secondaryColor: "Secondary color",

    featuresTitle: "Establishment features",
    featuresDescription:
      "Enable or disable modules available to customers and staff.",

    geolocationTitle: "Geolocation",
    geolocationDescription:
      "Allows the customer's location to be used.",

    onlinePaymentTitle: "Online payment",
    onlinePaymentDescription:
      "Allows digital payments from the application.",

    splitBillTitle: "Split bill",
    splitBillDescription:
      "Allows a bill to be split between several customers.",

    ratingsTitle: "Ratings",
    ratingsDescription:
      "Allows scores and comments to be submitted.",

    loyaltyTitle: "Loyalty",
    loyaltyDescription:
      "Enables the customer points system.",

    reservationsTitle: "Reservations",
    reservationsDescription:
      "Enables reservation-related features.",

    callWaiterTitle: "Call waiter",
    callWaiterDescription:
      "Allows customers to request assistance from the table.",

    tenant: "Tenant",
    enabled: "Enabled",
    disabled: "Disabled",
  },

  de: {
    loading: "Einstellungen werden geladen...",
    title: "Einstellungen",
    subtitlePrefix: "Allgemeine Einstellungen für",
    establishmentActive: "Betrieb aktiv",
    establishmentInactive: "Betrieb inaktiv",
    saving: "Wird gespeichert...",
    saveChanges: "Änderungen speichern",
    readOnlyNotice:
      "Du kannst die Einstellungen einsehen, aber nur ein Administrator kann sie ändern.",

    loadError:
      "Die Einstellungen konnten nicht geladen werden.",
    noEstablishment:
      "Es wurde kein mit deinem Konto verknüpfter Betrieb gefunden.",
    saveError:
      "Die Einstellungen konnten nicht gespeichert werden.",
    saveSuccess:
      "Einstellungen erfolgreich gespeichert.",
    invalidMaxDistance:
      "Die maximale Entfernung muss eine ganze Zahl größer als null sein.",

    generalTitle: "Allgemeine Informationen",
    generalDescription:
      "Öffentliche und identifizierende Daten des Betriebs.",
    name: "Name",
    slug: "Slug",
    description: "Beschreibung",
    phone: "Telefon",
    email: "E-Mail",
    address: "Adresse",
    logoUrl: "Logo-URL",

    locationTitle: "Standort und Geofence",
    locationDescription:
      "Koordinaten und maximal zulässige Entfernung rund um den Betrieb.",
    latitude: "Breitengrad",
    longitude: "Längengrad",
    maxDistance: "Maximale Entfernung (m)",
    geofenceTitle: "Geofence aktivieren",
    geofenceDescription:
      "Beschränkt bestimmte Vorgänge auf Kunden innerhalb des konfigurierten Radius.",

    localizationTitle: "Lokalisierung",
    localizationDescription:
      "Währung und Zeitzone des Betriebs.",
    currency: "Währung",
    timezone: "Zeitzone",

    visualTitle: "Visuelle Identität",
    visualDescription:
      "Hauptfarben der Kundenerfahrung.",
    primaryColor: "Primärfarbe",
    secondaryColor: "Sekundärfarbe",

    featuresTitle: "Funktionen des Betriebs",
    featuresDescription:
      "Module für Kunden und Personal aktivieren oder deaktivieren.",

    geolocationTitle: "Geolokalisierung",
    geolocationDescription:
      "Ermöglicht die Nutzung des Kundenstandorts.",

    onlinePaymentTitle: "Online-Zahlung",
    onlinePaymentDescription:
      "Ermöglicht digitale Zahlungen über die Anwendung.",

    splitBillTitle: "Rechnung teilen",
    splitBillDescription:
      "Ermöglicht das Aufteilen einer Rechnung auf mehrere Kunden.",

    ratingsTitle: "Bewertungen",
    ratingsDescription:
      "Ermöglicht Bewertungen und Kommentare.",

    loyaltyTitle: "Treueprogramm",
    loyaltyDescription:
      "Aktiviert das Punktesystem für Kunden.",

    reservationsTitle: "Reservierungen",
    reservationsDescription:
      "Aktiviert Funktionen für Reservierungen.",

    callWaiterTitle: "Kellner rufen",
    callWaiterDescription:
      "Ermöglicht das Anfordern von Hilfe direkt vom Tisch.",

    tenant: "Tenant",
    enabled: "Aktiv",
    disabled: "Deaktiviert",
  },

  fr: {
    loading: "Chargement de la configuration...",
    title: "Configuration",
    subtitlePrefix: "Configuration générale de",
    establishmentActive: "Établissement actif",
    establishmentInactive: "Établissement inactif",
    saving: "Enregistrement...",
    saveChanges: "Enregistrer les modifications",
    readOnlyNotice:
      "Vous pouvez consulter la configuration, mais seul un administrateur peut la modifier.",

    loadError:
      "Impossible de charger la configuration.",
    noEstablishment:
      "Aucun établissement associé à votre compte n’a été trouvé.",
    saveError:
      "Impossible d’enregistrer la configuration.",
    saveSuccess:
      "Configuration enregistrée avec succès.",
    invalidMaxDistance:
      "La distance maximale doit être un nombre entier supérieur à zéro.",

    generalTitle: "Informations générales",
    generalDescription:
      "Informations publiques et d’identification de l’établissement.",
    name: "Nom",
    slug: "Slug",
    description: "Description",
    phone: "Téléphone",
    email: "E-mail",
    address: "Adresse",
    logoUrl: "URL du logo",

    locationTitle: "Localisation et géorepérage",
    locationDescription:
      "Coordonnées et distance maximale autorisée autour de l’établissement.",
    latitude: "Latitude",
    longitude: "Longitude",
    maxDistance: "Distance maximale (m)",
    geofenceTitle: "Activer le géorepérage",
    geofenceDescription:
      "Limite certaines opérations aux clients situés dans le rayon configuré.",

    localizationTitle: "Paramètres régionaux",
    localizationDescription:
      "Devise et fuseau horaire utilisés par l’établissement.",
    currency: "Devise",
    timezone: "Fuseau horaire",

    visualTitle: "Identité visuelle",
    visualDescription:
      "Couleurs principales utilisées dans l’expérience client.",
    primaryColor: "Couleur principale",
    secondaryColor: "Couleur secondaire",

    featuresTitle: "Fonctions de l’établissement",
    featuresDescription:
      "Activez ou désactivez les modules disponibles pour les clients et le personnel.",

    geolocationTitle: "Géolocalisation",
    geolocationDescription:
      "Permet d’utiliser la position du client.",

    onlinePaymentTitle: "Paiement en ligne",
    onlinePaymentDescription:
      "Permet les paiements numériques depuis l’application.",

    splitBillTitle: "Partage de l’addition",
    splitBillDescription:
      "Permet de partager une addition entre plusieurs clients.",

    ratingsTitle: "Évaluations",
    ratingsDescription:
      "Permet d’enregistrer des notes et des commentaires.",

    loyaltyTitle: "Fidélisation",
    loyaltyDescription:
      "Active le système de points pour les clients.",

    reservationsTitle: "Réservations",
    reservationsDescription:
      "Active les fonctions liées aux réservations.",

    callWaiterTitle: "Appeler le serveur",
    callWaiterDescription:
      "Permet de demander de l’aide directement depuis la table.",

    tenant: "Tenant",
    enabled: "Active",
    disabled: "Désactivée",
  },

  it: {
    loading: "Caricamento configurazione...",
    title: "Configurazione",
    subtitlePrefix: "Configurazione generale di",
    establishmentActive: "Struttura attiva",
    establishmentInactive: "Struttura inattiva",
    saving: "Salvataggio...",
    saveChanges: "Salva modifiche",
    readOnlyNotice:
      "Puoi consultare la configurazione, ma solo un amministratore può modificarla.",

    loadError:
      "Impossibile caricare la configurazione.",
    noEstablishment:
      "Non è stata trovata alcuna struttura associata al tuo account.",
    saveError:
      "Impossibile salvare la configurazione.",
    saveSuccess:
      "Configurazione salvata correttamente.",
    invalidMaxDistance:
      "La distanza massima deve essere un numero intero maggiore di zero.",

    generalTitle: "Informazioni generali",
    generalDescription:
      "Dati pubblici e identificativi della struttura.",
    name: "Nome",
    slug: "Slug",
    description: "Descrizione",
    phone: "Telefono",
    email: "Email",
    address: "Indirizzo",
    logoUrl: "URL del logo",

    locationTitle: "Posizione e geofence",
    locationDescription:
      "Coordinate e distanza massima consentita intorno alla struttura.",
    latitude: "Latitudine",
    longitude: "Longitudine",
    maxDistance: "Distanza massima (m)",
    geofenceTitle: "Attiva geofence",
    geofenceDescription:
      "Limita determinate operazioni ai clienti situati entro il raggio configurato.",

    localizationTitle: "Localizzazione",
    localizationDescription:
      "Valuta e fuso orario utilizzati dalla struttura.",
    currency: "Valuta",
    timezone: "Fuso orario",

    visualTitle: "Identità visiva",
    visualDescription:
      "Colori principali utilizzati nell’esperienza cliente.",
    primaryColor: "Colore primario",
    secondaryColor: "Colore secondario",

    featuresTitle: "Funzioni della struttura",
    featuresDescription:
      "Attiva o disattiva i moduli disponibili per clienti e personale.",

    geolocationTitle: "Geolocalizzazione",
    geolocationDescription:
      "Consente di utilizzare la posizione del cliente.",

    onlinePaymentTitle: "Pagamento online",
    onlinePaymentDescription:
      "Consente pagamenti digitali dall’applicazione.",

    splitBillTitle: "Divisione del conto",
    splitBillDescription:
      "Consente di dividere il conto tra più clienti.",

    ratingsTitle: "Valutazioni",
    ratingsDescription:
      "Consente di registrare punteggi e commenti.",

    loyaltyTitle: "Fidelizzazione",
    loyaltyDescription:
      "Attiva il sistema di punti per i clienti.",

    reservationsTitle: "Prenotazioni",
    reservationsDescription:
      "Attiva le funzioni relative alle prenotazioni.",

    callWaiterTitle: "Chiama cameriere",
    callWaiterDescription:
      "Consente di richiedere assistenza direttamente dal tavolo.",

    tenant: "Tenant",
    enabled: "Attiva",
    disabled: "Disattivata",
  },

  pt: {
    loading: "A carregar configuração...",
    title: "Configuração",
    subtitlePrefix: "Configuração geral de",
    establishmentActive: "Estabelecimento ativo",
    establishmentInactive: "Estabelecimento inativo",
    saving: "A guardar...",
    saveChanges: "Guardar alterações",
    readOnlyNotice:
      "Pode consultar a configuração, mas apenas um administrador pode modificá-la.",

    loadError:
      "Não foi possível carregar a configuração.",
    noEstablishment:
      "Não foi encontrado nenhum estabelecimento associado à sua conta.",
    saveError:
      "Não foi possível guardar a configuração.",
    saveSuccess:
      "Configuração guardada com sucesso.",
    invalidMaxDistance:
      "A distância máxima deve ser um número inteiro superior a zero.",

    generalTitle: "Informações gerais",
    generalDescription:
      "Dados públicos e identificativos do estabelecimento.",
    name: "Nome",
    slug: "Slug",
    description: "Descrição",
    phone: "Telefone",
    email: "Email",
    address: "Morada",
    logoUrl: "URL do logótipo",

    locationTitle: "Localização e geovalla",
    locationDescription:
      "Coordenadas e distância máxima permitida em redor do estabelecimento.",
    latitude: "Latitude",
    longitude: "Longitude",
    maxDistance: "Distância máxima (m)",
    geofenceTitle: "Ativar geovalla",
    geofenceDescription:
      "Limita determinadas operações aos clientes dentro do raio configurado.",

    localizationTitle: "Regionalização",
    localizationDescription:
      "Moeda e fuso horário utilizados pelo estabelecimento.",
    currency: "Moeda",
    timezone: "Fuso horário",

    visualTitle: "Identidade visual",
    visualDescription:
      "Cores principais utilizadas na experiência do cliente.",
    primaryColor: "Cor primária",
    secondaryColor: "Cor secundária",

    featuresTitle: "Funções do estabelecimento",
    featuresDescription:
      "Ative ou desative módulos disponíveis para clientes e funcionários.",

    geolocationTitle: "Geolocalização",
    geolocationDescription:
      "Permite utilizar a localização do cliente.",

    onlinePaymentTitle: "Pagamento online",
    onlinePaymentDescription:
      "Permite pagamentos digitais através da aplicação.",

    splitBillTitle: "Divisão da conta",
    splitBillDescription:
      "Permite dividir uma conta entre vários clientes.",

    ratingsTitle: "Avaliações",
    ratingsDescription:
      "Permite registar pontuações e comentários.",

    loyaltyTitle: "Fidelização",
    loyaltyDescription:
      "Ativa o sistema de pontos para clientes.",

    reservationsTitle: "Reservas",
    reservationsDescription:
      "Ativa funções relacionadas com reservas.",

    callWaiterTitle: "Chamar empregado",
    callWaiterDescription:
      "Permite solicitar assistência diretamente da mesa.",

    tenant: "Tenant",
    enabled: "Ativa",
    disabled: "Desativada",
  },
};