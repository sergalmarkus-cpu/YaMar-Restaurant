import type {
  Language,
} from "@/types";

export interface AdminAreasMessages {
  loading: string;

  title: string;
  subtitle: string;
  addArea: string;

  newArea: string;
  newAreaDescription: string;
  closeForm: string;

  name: string;
  namePlaceholder: string;

  description: string;
  descriptionPlaceholder: string;

  latitude: string;
  latitudePlaceholder: string;

  longitude: string;
  longitudePlaceholder: string;

  radius: string;
  radiusPlaceholder: string;
  radiusHint: string;

  cancel: string;
  creating: string;
  createArea: string;

  noDescription: string;
  activateArea: string;
  deactivateArea: string;
  deleteArea: string;

  noAreas: string;

  loadError: string;
  nameRequired: string;
  invalidRadius: string;
  invalidLatitude: string;
  invalidLongitude: string;

  createError: string;
  updateError: string;
  deleteError: string;

  areaHasTables: string;

  deleteConfirm: string;
}

export const ADMIN_AREAS_MESSAGES: Record<
  Language,
  AdminAreasMessages
> = {
  es: {
    loading:
      "Cargando áreas...",

    title:
      "Áreas",
    subtitle:
      "Gestión de zonas del establecimiento",
    addArea:
      "Añadir área",

    newArea:
      "Nueva área",
    newAreaDescription:
      "Crea una zona para organizar las mesas del establecimiento.",
    closeForm:
      "Cerrar formulario",

    name:
      "Nombre",
    namePlaceholder:
      "Ej. Sala principal",

    description:
      "Descripción",
    descriptionPlaceholder:
      "Ej. Zona interior del restaurante",

    latitude:
      "Latitud",
    latitudePlaceholder:
      "Ej. 36.5297",

    longitude:
      "Longitud",
    longitudePlaceholder:
      "Ej. -6.2924",

    radius:
      "Radio de geolocalización (m)",
    radiusPlaceholder:
      "Ej. 50",
    radiusHint:
      "Opcional. Entre 1 y 10000 metros.",

    cancel:
      "Cancelar",
    creating:
      "Creando...",
    createArea:
      "Crear área",

    noDescription:
      "Sin descripción",
    activateArea:
      "Activar área",
    deactivateArea:
      "Desactivar área",
    deleteArea:
      "Eliminar área",

    noAreas:
      "No hay áreas configuradas.",

    loadError:
      "No se pudieron cargar las áreas.",
    nameRequired:
      "El nombre del área es obligatorio.",
    invalidRadius:
      "El radio debe ser un número entero entre 1 y 10000 metros.",
    invalidLatitude:
      "La latitud no es válida.",
    invalidLongitude:
      "La longitud no es válida.",

    createError:
      "No se pudo crear el área.",
    updateError:
      "No se pudo actualizar el área.",
    deleteError:
      "No se pudo eliminar el área.",

    areaHasTables:
      "No se puede eliminar el área porque tiene mesas asociadas. Mueve o elimina primero esas mesas.",

    deleteConfirm:
      "¿Eliminar esta área definitivamente?",
  },

  en: {
    loading:
      "Loading areas...",

    title:
      "Areas",
    subtitle:
      "Manage the establishment areas",
    addArea:
      "Add area",

    newArea:
      "New area",
    newAreaDescription:
      "Create an area to organize the establishment tables.",
    closeForm:
      "Close form",

    name:
      "Name",
    namePlaceholder:
      "E.g. Main dining room",

    description:
      "Description",
    descriptionPlaceholder:
      "E.g. Indoor restaurant area",

    latitude:
      "Latitude",
    latitudePlaceholder:
      "E.g. 36.5297",

    longitude:
      "Longitude",
    longitudePlaceholder:
      "E.g. -6.2924",

    radius:
      "Geolocation radius (m)",
    radiusPlaceholder:
      "E.g. 50",
    radiusHint:
      "Optional. Between 1 and 10000 meters.",

    cancel:
      "Cancel",
    creating:
      "Creating...",
    createArea:
      "Create area",

    noDescription:
      "No description",
    activateArea:
      "Activate area",
    deactivateArea:
      "Deactivate area",
    deleteArea:
      "Delete area",

    noAreas:
      "No areas configured.",

    loadError:
      "Areas could not be loaded.",
    nameRequired:
      "The area name is required.",
    invalidRadius:
      "The radius must be an integer between 1 and 10000 meters.",
    invalidLatitude:
      "The latitude is invalid.",
    invalidLongitude:
      "The longitude is invalid.",

    createError:
      "The area could not be created.",
    updateError:
      "The area could not be updated.",
    deleteError:
      "The area could not be deleted.",

    areaHasTables:
      "The area cannot be deleted because it has associated tables. Move or delete those tables first.",

    deleteConfirm:
      "Permanently delete this area?",
  },

  de: {
    loading:
      "Bereiche werden geladen...",

    title:
      "Bereiche",
    subtitle:
      "Verwaltung der Bereiche des Betriebs",
    addArea:
      "Bereich hinzufügen",

    newArea:
      "Neuer Bereich",
    newAreaDescription:
      "Erstellen Sie einen Bereich, um die Tische des Betriebs zu organisieren.",
    closeForm:
      "Formular schließen",

    name:
      "Name",
    namePlaceholder:
      "Z. B. Hauptsaal",

    description:
      "Beschreibung",
    descriptionPlaceholder:
      "Z. B. Innenbereich des Restaurants",

    latitude:
      "Breitengrad",
    latitudePlaceholder:
      "Z. B. 36.5297",

    longitude:
      "Längengrad",
    longitudePlaceholder:
      "Z. B. -6.2924",

    radius:
      "Geolokalisierungsradius (m)",
    radiusPlaceholder:
      "Z. B. 50",
    radiusHint:
      "Optional. Zwischen 1 und 10000 Metern.",

    cancel:
      "Abbrechen",
    creating:
      "Wird erstellt...",
    createArea:
      "Bereich erstellen",

    noDescription:
      "Keine Beschreibung",
    activateArea:
      "Bereich aktivieren",
    deactivateArea:
      "Bereich deaktivieren",
    deleteArea:
      "Bereich löschen",

    noAreas:
      "Keine Bereiche konfiguriert.",

    loadError:
      "Die Bereiche konnten nicht geladen werden.",
    nameRequired:
      "Der Name des Bereichs ist erforderlich.",
    invalidRadius:
      "Der Radius muss eine ganze Zahl zwischen 1 und 10000 Metern sein.",
    invalidLatitude:
      "Der Breitengrad ist ungültig.",
    invalidLongitude:
      "Der Längengrad ist ungültig.",

    createError:
      "Der Bereich konnte nicht erstellt werden.",
    updateError:
      "Der Bereich konnte nicht aktualisiert werden.",
    deleteError:
      "Der Bereich konnte nicht gelöscht werden.",

    areaHasTables:
      "Der Bereich kann nicht gelöscht werden, da ihm Tische zugeordnet sind. Verschieben oder löschen Sie zuerst diese Tische.",

    deleteConfirm:
      "Diesen Bereich endgültig löschen?",
  },

  fr: {
    loading:
      "Chargement des zones...",

    title:
      "Zones",
    subtitle:
      "Gestion des zones de l’établissement",
    addArea:
      "Ajouter une zone",

    newArea:
      "Nouvelle zone",
    newAreaDescription:
      "Créez une zone pour organiser les tables de l’établissement.",
    closeForm:
      "Fermer le formulaire",

    name:
      "Nom",
    namePlaceholder:
      "Ex. Salle principale",

    description:
      "Description",
    descriptionPlaceholder:
      "Ex. Zone intérieure du restaurant",

    latitude:
      "Latitude",
    latitudePlaceholder:
      "Ex. 36.5297",

    longitude:
      "Longitude",
    longitudePlaceholder:
      "Ex. -6.2924",

    radius:
      "Rayon de géolocalisation (m)",
    radiusPlaceholder:
      "Ex. 50",
    radiusHint:
      "Facultatif. Entre 1 et 10000 mètres.",

    cancel:
      "Annuler",
    creating:
      "Création...",
    createArea:
      "Créer la zone",

    noDescription:
      "Aucune description",
    activateArea:
      "Activer la zone",
    deactivateArea:
      "Désactiver la zone",
    deleteArea:
      "Supprimer la zone",

    noAreas:
      "Aucune zone configurée.",

    loadError:
      "Impossible de charger les zones.",
    nameRequired:
      "Le nom de la zone est obligatoire.",
    invalidRadius:
      "Le rayon doit être un nombre entier compris entre 1 et 10000 mètres.",
    invalidLatitude:
      "La latitude n’est pas valide.",
    invalidLongitude:
      "La longitude n’est pas valide.",

    createError:
      "Impossible de créer la zone.",
    updateError:
      "Impossible de mettre à jour la zone.",
    deleteError:
      "Impossible de supprimer la zone.",

    areaHasTables:
      "Impossible de supprimer cette zone car des tables lui sont associées. Déplacez ou supprimez d’abord ces tables.",

    deleteConfirm:
      "Supprimer définitivement cette zone ?",
  },

  it: {
    loading:
      "Caricamento aree...",

    title:
      "Aree",
    subtitle:
      "Gestione delle aree della struttura",
    addArea:
      "Aggiungi area",

    newArea:
      "Nuova area",
    newAreaDescription:
      "Crea un’area per organizzare i tavoli della struttura.",
    closeForm:
      "Chiudi modulo",

    name:
      "Nome",
    namePlaceholder:
      "Es. Sala principale",

    description:
      "Descrizione",
    descriptionPlaceholder:
      "Es. Area interna del ristorante",

    latitude:
      "Latitudine",
    latitudePlaceholder:
      "Es. 36.5297",

    longitude:
      "Longitudine",
    longitudePlaceholder:
      "Es. -6.2924",

    radius:
      "Raggio di geolocalizzazione (m)",
    radiusPlaceholder:
      "Es. 50",
    radiusHint:
      "Facoltativo. Tra 1 e 10000 metri.",

    cancel:
      "Annulla",
    creating:
      "Creazione...",
    createArea:
      "Crea area",

    noDescription:
      "Nessuna descrizione",
    activateArea:
      "Attiva area",
    deactivateArea:
      "Disattiva area",
    deleteArea:
      "Elimina area",

    noAreas:
      "Nessuna area configurata.",

    loadError:
      "Impossibile caricare le aree.",
    nameRequired:
      "Il nome dell’area è obbligatorio.",
    invalidRadius:
      "Il raggio deve essere un numero intero compreso tra 1 e 10000 metri.",
    invalidLatitude:
      "La latitudine non è valida.",
    invalidLongitude:
      "La longitudine non è valida.",

    createError:
      "Impossibile creare l’area.",
    updateError:
      "Impossibile aggiornare l’area.",
    deleteError:
      "Impossibile eliminare l’area.",

    areaHasTables:
      "L’area non può essere eliminata perché contiene tavoli associati. Sposta o elimina prima quei tavoli.",

    deleteConfirm:
      "Eliminare definitivamente questa area?",
  },

  pt: {
    loading:
      "A carregar áreas...",

    title:
      "Áreas",
    subtitle:
      "Gestão das áreas do estabelecimento",
    addArea:
      "Adicionar área",

    newArea:
      "Nova área",
    newAreaDescription:
      "Crie uma área para organizar as mesas do estabelecimento.",
    closeForm:
      "Fechar formulário",

    name:
      "Nome",
    namePlaceholder:
      "Ex. Sala principal",

    description:
      "Descrição",
    descriptionPlaceholder:
      "Ex. Área interior do restaurante",

    latitude:
      "Latitude",
    latitudePlaceholder:
      "Ex. 36.5297",

    longitude:
      "Longitude",
    longitudePlaceholder:
      "Ex. -6.2924",

    radius:
      "Raio de geolocalização (m)",
    radiusPlaceholder:
      "Ex. 50",
    radiusHint:
      "Opcional. Entre 1 e 10000 metros.",

    cancel:
      "Cancelar",
    creating:
      "A criar...",
    createArea:
      "Criar área",

    noDescription:
      "Sem descrição",
    activateArea:
      "Ativar área",
    deactivateArea:
      "Desativar área",
    deleteArea:
      "Eliminar área",

    noAreas:
      "Não existem áreas configuradas.",

    loadError:
      "Não foi possível carregar as áreas.",
    nameRequired:
      "O nome da área é obrigatório.",
    invalidRadius:
      "O raio deve ser um número inteiro entre 1 e 10000 metros.",
    invalidLatitude:
      "A latitude não é válida.",
    invalidLongitude:
      "A longitude não é válida.",

    createError:
      "Não foi possível criar a área.",
    updateError:
      "Não foi possível atualizar a área.",
    deleteError:
      "Não foi possível eliminar a área.",

    areaHasTables:
      "Não é possível eliminar a área porque tem mesas associadas. Mova ou elimine primeiro essas mesas.",

    deleteConfirm:
      "Eliminar definitivamente esta área?",
  },
};