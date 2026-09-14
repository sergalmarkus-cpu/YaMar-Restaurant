import type {
  Language,
} from "@/types";

interface AdminLanguagesSettingsTranslations {
  loading: string;
  loadError: string;
  saveError: string;
  saveSuccess: string;

  title: string;
  description: string;

  readOnlyNotice: string;

  availableTitle: string;
  availableDescription: string;

  defaultBadge: string;
  codeLabel: string;
  useAsDefault: string;
  active: string;

  summaryTitle: string;
  defaultLanguageLabel: string;
  activeLanguagesLabel: string;
  activeLanguagesValue: string;

  saving: string;
  saveChanges: string;
}

export const ADMIN_LANGUAGES_SETTINGS_I18N: Record<
  Language,
  AdminLanguagesSettingsTranslations
> = {
  es: {
    loading:
      "Cargando configuración de idiomas...",
    loadError:
      "No se pudo cargar la configuración de idiomas.",
    saveError:
      "No se pudo guardar la configuración de idiomas.",
    saveSuccess:
      "Configuración de idiomas guardada correctamente.",

    title:
      "Idiomas",
    description:
      "Los seis idiomas de YaMar están disponibles para los clientes. Selecciona el idioma predeterminado del establecimiento.",

    readOnlyNotice:
      "Puedes consultar la configuración de idiomas, pero solo un administrador puede modificar el idioma predeterminado.",

    availableTitle:
      "Idiomas disponibles",
    availableDescription:
      "Todos los idiomas compatibles permanecen activos. Puedes elegir cualquiera como idioma predeterminado.",

    defaultBadge:
      "Predeterminado",
    codeLabel:
      "Código",
    useAsDefault:
      "Usar como predeterminado",
    active:
      "Activo",

    summaryTitle:
      "Resumen",
    defaultLanguageLabel:
      "Idioma predeterminado",
    activeLanguagesLabel:
      "Idiomas activos",
    activeLanguagesValue:
      "6 de 6",

    saving:
      "Guardando...",
    saveChanges:
      "Guardar cambios",
  },

  en: {
    loading:
      "Loading language settings...",
    loadError:
      "The language settings could not be loaded.",
    saveError:
      "The language settings could not be saved.",
    saveSuccess:
      "Language settings saved successfully.",

    title:
      "Languages",
    description:
      "All six YaMar languages are available to customers. Select the establishment's default language.",

    readOnlyNotice:
      "You can view the language settings, but only an administrator can change the default language.",

    availableTitle:
      "Available languages",
    availableDescription:
      "All supported languages remain active. You can choose any of them as the default language.",

    defaultBadge:
      "Default",
    codeLabel:
      "Code",
    useAsDefault:
      "Set as default",
    active:
      "Active",

    summaryTitle:
      "Summary",
    defaultLanguageLabel:
      "Default language",
    activeLanguagesLabel:
      "Active languages",
    activeLanguagesValue:
      "6 of 6",

    saving:
      "Saving...",
    saveChanges:
      "Save changes",
  },

  de: {
    loading:
      "Spracheinstellungen werden geladen...",
    loadError:
      "Die Spracheinstellungen konnten nicht geladen werden.",
    saveError:
      "Die Spracheinstellungen konnten nicht gespeichert werden.",
    saveSuccess:
      "Spracheinstellungen erfolgreich gespeichert.",

    title:
      "Sprachen",
    description:
      "Alle sechs YaMar-Sprachen stehen den Kunden zur Verfügung. Wählen Sie die Standardsprache des Betriebs.",

    readOnlyNotice:
      "Sie können die Spracheinstellungen einsehen, aber nur ein Administrator kann die Standardsprache ändern.",

    availableTitle:
      "Verfügbare Sprachen",
    availableDescription:
      "Alle unterstützten Sprachen bleiben aktiv. Sie können jede davon als Standardsprache auswählen.",

    defaultBadge:
      "Standard",
    codeLabel:
      "Code",
    useAsDefault:
      "Als Standard verwenden",
    active:
      "Aktiv",

    summaryTitle:
      "Zusammenfassung",
    defaultLanguageLabel:
      "Standardsprache",
    activeLanguagesLabel:
      "Aktive Sprachen",
    activeLanguagesValue:
      "6 von 6",

    saving:
      "Wird gespeichert...",
    saveChanges:
      "Änderungen speichern",
  },

  fr: {
    loading:
      "Chargement des paramètres de langue...",
    loadError:
      "Impossible de charger les paramètres de langue.",
    saveError:
      "Impossible d’enregistrer les paramètres de langue.",
    saveSuccess:
      "Paramètres de langue enregistrés avec succès.",

    title:
      "Langues",
    description:
      "Les six langues de YaMar sont disponibles pour les clients. Sélectionnez la langue par défaut de l’établissement.",

    readOnlyNotice:
      "Vous pouvez consulter les paramètres de langue, mais seul un administrateur peut modifier la langue par défaut.",

    availableTitle:
      "Langues disponibles",
    availableDescription:
      "Toutes les langues prises en charge restent actives. Vous pouvez choisir n’importe laquelle comme langue par défaut.",

    defaultBadge:
      "Par défaut",
    codeLabel:
      "Code",
    useAsDefault:
      "Définir par défaut",
    active:
      "Active",

    summaryTitle:
      "Résumé",
    defaultLanguageLabel:
      "Langue par défaut",
    activeLanguagesLabel:
      "Langues actives",
    activeLanguagesValue:
      "6 sur 6",

    saving:
      "Enregistrement...",
    saveChanges:
      "Enregistrer les modifications",
  },

  it: {
    loading:
      "Caricamento delle impostazioni della lingua...",
    loadError:
      "Impossibile caricare le impostazioni della lingua.",
    saveError:
      "Impossibile salvare le impostazioni della lingua.",
    saveSuccess:
      "Impostazioni della lingua salvate correttamente.",

    title:
      "Lingue",
    description:
      "Tutte e sei le lingue di YaMar sono disponibili per i clienti. Seleziona la lingua predefinita della struttura.",

    readOnlyNotice:
      "Puoi consultare le impostazioni della lingua, ma solo un amministratore può modificare la lingua predefinita.",

    availableTitle:
      "Lingue disponibili",
    availableDescription:
      "Tutte le lingue supportate rimangono attive. Puoi scegliere una qualsiasi lingua come predefinita.",

    defaultBadge:
      "Predefinita",
    codeLabel:
      "Codice",
    useAsDefault:
      "Imposta come predefinita",
    active:
      "Attiva",

    summaryTitle:
      "Riepilogo",
    defaultLanguageLabel:
      "Lingua predefinita",
    activeLanguagesLabel:
      "Lingue attive",
    activeLanguagesValue:
      "6 su 6",

    saving:
      "Salvataggio...",
    saveChanges:
      "Salva modifiche",
  },

  pt: {
    loading:
      "A carregar as definições de idioma...",
    loadError:
      "Não foi possível carregar as definições de idioma.",
    saveError:
      "Não foi possível guardar as definições de idioma.",
    saveSuccess:
      "Definições de idioma guardadas com sucesso.",

    title:
      "Idiomas",
    description:
      "Os seis idiomas do YaMar estão disponíveis para os clientes. Selecione o idioma predefinido do estabelecimento.",

    readOnlyNotice:
      "Pode consultar as definições de idioma, mas apenas um administrador pode alterar o idioma predefinido.",

    availableTitle:
      "Idiomas disponíveis",
    availableDescription:
      "Todos os idiomas suportados permanecem ativos. Pode escolher qualquer um deles como idioma predefinido.",

    defaultBadge:
      "Predefinido",
    codeLabel:
      "Código",
    useAsDefault:
      "Definir como predefinido",
    active:
      "Ativo",

    summaryTitle:
      "Resumo",
    defaultLanguageLabel:
      "Idioma predefinido",
    activeLanguagesLabel:
      "Idiomas ativos",
    activeLanguagesValue:
      "6 de 6",

    saving:
      "A guardar...",
    saveChanges:
      "Guardar alterações",
  },
};