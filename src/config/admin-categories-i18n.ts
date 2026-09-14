import type {
  Language,
} from "@/types";

export interface AdminCategoriesMessages {
  title: string;
  subtitle: string;
  newCategory: string;
  loading: string;

  totalCategories: string;
  activeCategories: string;
  inactiveCategories: string;
  menus: string;

  order: string;
  noDescription: string;
  edit: string;
  delete: string;
  activate: string;
  deactivate: string;

  loadError: string;
  deleteError: string;
  deleteSuccess: string;
  updateError: string;
  updateSuccess: string;
  deleteConfirmPrefix: string;

  createTitle: string;
  editTitle: string;

  menu: string;
  selectMenu: string;

  name: string;
  namePlaceholder: string;

  description: string;
  descriptionPlaceholder: string;

  displayOrder: string;
  activeLabel: string;

  requiredFields: string;
  menusLoadError: string;

  createError: string;
  createSuccess: string;
  editError: string;
  editSuccess: string;

  cancel: string;
  save: string;
  saveChanges: string;
  saving: string;

  unnamedCategory: string;
  unnamedMenu: string;
}

export const ADMIN_CATEGORIES_MESSAGES: Record<
  Language,
  AdminCategoriesMessages
> = {
  es: {
    title: "Categorías",
    subtitle:
      "Gestiona las categorías de los menús.",
    newCategory:
      "Nueva categoría",
    loading:
      "Cargando categorías...",

    totalCategories:
      "Categorías",
    activeCategories:
      "Activas",
    inactiveCategories:
      "Inactivas",
    menus:
      "Menús",

    order:
      "Orden",
    noDescription:
      "Sin descripción",
    edit:
      "Editar",
    delete:
      "Eliminar",
    activate:
      "Activar",
    deactivate:
      "Desactivar",

    loadError:
      "No se pudieron cargar las categorías.",
    deleteError:
      "No se pudo eliminar la categoría.",
    deleteSuccess:
      "Categoría eliminada.",
    updateError:
      "No se pudo actualizar la categoría.",
    updateSuccess:
      "Estado actualizado.",
    deleteConfirmPrefix:
      "¿Eliminar",

    createTitle:
      "Nueva categoría",
    editTitle:
      "Editar categoría",

    menu:
      "Menú",
    selectMenu:
      "Selecciona un menú",

    name:
      "Nombre",
    namePlaceholder:
      "Ej.: Entrantes",

    description:
      "Descripción",
    descriptionPlaceholder:
      "Descripción de la categoría",

    displayOrder:
      "Orden",
    activeLabel:
      "Activa",

    requiredFields:
      "Completa todos los campos obligatorios.",
    menusLoadError:
      "No se pudieron cargar los menús.",

    createError:
      "No se pudo crear la categoría.",
    createSuccess:
      "Categoría creada.",
    editError:
      "No se pudo actualizar la categoría.",
    editSuccess:
      "Categoría actualizada.",

    cancel:
      "Cancelar",
    save:
      "Guardar",
    saveChanges:
      "Guardar cambios",
    saving:
      "Guardando...",

    unnamedCategory:
      "Sin nombre",
    unnamedMenu:
      "Menú sin nombre",
  },

  en: {
    title: "Categories",
    subtitle:
      "Manage menu categories.",
    newCategory:
      "New category",
    loading:
      "Loading categories...",

    totalCategories:
      "Categories",
    activeCategories:
      "Active",
    inactiveCategories:
      "Inactive",
    menus:
      "Menus",

    order:
      "Order",
    noDescription:
      "No description",
    edit:
      "Edit",
    delete:
      "Delete",
    activate:
      "Activate",
    deactivate:
      "Deactivate",

    loadError:
      "Categories could not be loaded.",
    deleteError:
      "The category could not be deleted.",
    deleteSuccess:
      "Category deleted.",
    updateError:
      "The category could not be updated.",
    updateSuccess:
      "Status updated.",
    deleteConfirmPrefix:
      "Delete",

    createTitle:
      "New category",
    editTitle:
      "Edit category",

    menu:
      "Menu",
    selectMenu:
      "Select a menu",

    name:
      "Name",
    namePlaceholder:
      "Example: Starters",

    description:
      "Description",
    descriptionPlaceholder:
      "Category description",

    displayOrder:
      "Order",
    activeLabel:
      "Active",

    requiredFields:
      "Complete all required fields.",
    menusLoadError:
      "Menus could not be loaded.",

    createError:
      "The category could not be created.",
    createSuccess:
      "Category created.",
    editError:
      "The category could not be updated.",
    editSuccess:
      "Category updated.",

    cancel:
      "Cancel",
    save:
      "Save",
    saveChanges:
      "Save changes",
    saving:
      "Saving...",

    unnamedCategory:
      "Unnamed",
    unnamedMenu:
      "Unnamed menu",
  },

  de: {
    title: "Kategorien",
    subtitle:
      "Verwalte die Kategorien der Menüs.",
    newCategory:
      "Neue Kategorie",
    loading:
      "Kategorien werden geladen...",

    totalCategories:
      "Kategorien",
    activeCategories:
      "Aktiv",
    inactiveCategories:
      "Inaktiv",
    menus:
      "Menüs",

    order:
      "Reihenfolge",
    noDescription:
      "Keine Beschreibung",
    edit:
      "Bearbeiten",
    delete:
      "Löschen",
    activate:
      "Aktivieren",
    deactivate:
      "Deaktivieren",

    loadError:
      "Die Kategorien konnten nicht geladen werden.",
    deleteError:
      "Die Kategorie konnte nicht gelöscht werden.",
    deleteSuccess:
      "Kategorie gelöscht.",
    updateError:
      "Die Kategorie konnte nicht aktualisiert werden.",
    updateSuccess:
      "Status aktualisiert.",
    deleteConfirmPrefix:
      "Löschen",

    createTitle:
      "Neue Kategorie",
    editTitle:
      "Kategorie bearbeiten",

    menu:
      "Menü",
    selectMenu:
      "Menü auswählen",

    name:
      "Name",
    namePlaceholder:
      "Beispiel: Vorspeisen",

    description:
      "Beschreibung",
    descriptionPlaceholder:
      "Beschreibung der Kategorie",

    displayOrder:
      "Reihenfolge",
    activeLabel:
      "Aktiv",

    requiredFields:
      "Fülle alle Pflichtfelder aus.",
    menusLoadError:
      "Die Menüs konnten nicht geladen werden.",

    createError:
      "Die Kategorie konnte nicht erstellt werden.",
    createSuccess:
      "Kategorie erstellt.",
    editError:
      "Die Kategorie konnte nicht aktualisiert werden.",
    editSuccess:
      "Kategorie aktualisiert.",

    cancel:
      "Abbrechen",
    save:
      "Speichern",
    saveChanges:
      "Änderungen speichern",
    saving:
      "Wird gespeichert...",

    unnamedCategory:
      "Ohne Namen",
    unnamedMenu:
      "Menü ohne Namen",
  },

  fr: {
    title: "Catégories",
    subtitle:
      "Gérez les catégories des menus.",
    newCategory:
      "Nouvelle catégorie",
    loading:
      "Chargement des catégories...",

    totalCategories:
      "Catégories",
    activeCategories:
      "Actives",
    inactiveCategories:
      "Inactives",
    menus:
      "Menus",

    order:
      "Ordre",
    noDescription:
      "Sans description",
    edit:
      "Modifier",
    delete:
      "Supprimer",
    activate:
      "Activer",
    deactivate:
      "Désactiver",

    loadError:
      "Impossible de charger les catégories.",
    deleteError:
      "Impossible de supprimer la catégorie.",
    deleteSuccess:
      "Catégorie supprimée.",
    updateError:
      "Impossible de mettre à jour la catégorie.",
    updateSuccess:
      "Statut mis à jour.",
    deleteConfirmPrefix:
      "Supprimer",

    createTitle:
      "Nouvelle catégorie",
    editTitle:
      "Modifier la catégorie",

    menu:
      "Menu",
    selectMenu:
      "Sélectionnez un menu",

    name:
      "Nom",
    namePlaceholder:
      "Ex. : Entrées",

    description:
      "Description",
    descriptionPlaceholder:
      "Description de la catégorie",

    displayOrder:
      "Ordre",
    activeLabel:
      "Active",

    requiredFields:
      "Complétez tous les champs obligatoires.",
    menusLoadError:
      "Impossible de charger les menus.",

    createError:
      "Impossible de créer la catégorie.",
    createSuccess:
      "Catégorie créée.",
    editError:
      "Impossible de mettre à jour la catégorie.",
    editSuccess:
      "Catégorie mise à jour.",

    cancel:
      "Annuler",
    save:
      "Enregistrer",
    saveChanges:
      "Enregistrer les modifications",
    saving:
      "Enregistrement...",

    unnamedCategory:
      "Sans nom",
    unnamedMenu:
      "Menu sans nom",
  },

  it: {
    title: "Categorie",
    subtitle:
      "Gestisci le categorie dei menu.",
    newCategory:
      "Nuova categoria",
    loading:
      "Caricamento categorie...",

    totalCategories:
      "Categorie",
    activeCategories:
      "Attive",
    inactiveCategories:
      "Inattive",
    menus:
      "Menu",

    order:
      "Ordine",
    noDescription:
      "Senza descrizione",
    edit:
      "Modifica",
    delete:
      "Elimina",
    activate:
      "Attiva",
    deactivate:
      "Disattiva",

    loadError:
      "Impossibile caricare le categorie.",
    deleteError:
      "Impossibile eliminare la categoria.",
    deleteSuccess:
      "Categoria eliminata.",
    updateError:
      "Impossibile aggiornare la categoria.",
    updateSuccess:
      "Stato aggiornato.",
    deleteConfirmPrefix:
      "Eliminare",

    createTitle:
      "Nuova categoria",
    editTitle:
      "Modifica categoria",

    menu:
      "Menu",
    selectMenu:
      "Seleziona un menu",

    name:
      "Nome",
    namePlaceholder:
      "Es.: Antipasti",

    description:
      "Descrizione",
    descriptionPlaceholder:
      "Descrizione della categoria",

    displayOrder:
      "Ordine",
    activeLabel:
      "Attiva",

    requiredFields:
      "Completa tutti i campi obbligatori.",
    menusLoadError:
      "Impossibile caricare i menu.",

    createError:
      "Impossibile creare la categoria.",
    createSuccess:
      "Categoria creata.",
    editError:
      "Impossibile aggiornare la categoria.",
    editSuccess:
      "Categoria aggiornata.",

    cancel:
      "Annulla",
    save:
      "Salva",
    saveChanges:
      "Salva modifiche",
    saving:
      "Salvataggio...",

    unnamedCategory:
      "Senza nome",
    unnamedMenu:
      "Menu senza nome",
  },

  pt: {
    title: "Categorias",
    subtitle:
      "Faça a gestão das categorias dos menus.",
    newCategory:
      "Nova categoria",
    loading:
      "A carregar categorias...",

    totalCategories:
      "Categorias",
    activeCategories:
      "Ativas",
    inactiveCategories:
      "Inativas",
    menus:
      "Menus",

    order:
      "Ordem",
    noDescription:
      "Sem descrição",
    edit:
      "Editar",
    delete:
      "Eliminar",
    activate:
      "Ativar",
    deactivate:
      "Desativar",

    loadError:
      "Não foi possível carregar as categorias.",
    deleteError:
      "Não foi possível eliminar a categoria.",
    deleteSuccess:
      "Categoria eliminada.",
    updateError:
      "Não foi possível atualizar a categoria.",
    updateSuccess:
      "Estado atualizado.",
    deleteConfirmPrefix:
      "Eliminar",

    createTitle:
      "Nova categoria",
    editTitle:
      "Editar categoria",

    menu:
      "Menu",
    selectMenu:
      "Selecione um menu",

    name:
      "Nome",
    namePlaceholder:
      "Ex.: Entradas",

    description:
      "Descrição",
    descriptionPlaceholder:
      "Descrição da categoria",

    displayOrder:
      "Ordem",
    activeLabel:
      "Ativa",

    requiredFields:
      "Preencha todos os campos obrigatórios.",
    menusLoadError:
      "Não foi possível carregar os menus.",

    createError:
      "Não foi possível criar a categoria.",
    createSuccess:
      "Categoria criada.",
    editError:
      "Não foi possível atualizar a categoria.",
    editSuccess:
      "Categoria atualizada.",

    cancel:
      "Cancelar",
    save:
      "Guardar",
    saveChanges:
      "Guardar alterações",
    saving:
      "A guardar...",

    unnamedCategory:
      "Sem nome",
    unnamedMenu:
      "Menu sem nome",
  },
};

export function getAdminCategoryText(
  value:
    | Record<string, string>
    | null
    | undefined,
  language: Language,
  fallback: string
) {
  if (!value) {
    return fallback;
  }

  const localized =
    value[language]?.trim();

  if (localized) {
    return localized;
  }

  const spanish =
    value.es?.trim();

  if (spanish) {
    return spanish;
  }

  const english =
    value.en?.trim();

  if (english) {
    return english;
  }

  const first =
    Object.values(value).find(
      (text) =>
        typeof text === "string" &&
        text.trim().length > 0
    );

  return first?.trim() || fallback;
}

export function getAdminMenuText(
  value:
    | Record<string, string>
    | string
    | null
    | undefined,
  language: Language,
  fallback: string
) {
  if (
    typeof value === "string"
  ) {
    return (
      value.trim() ||
      fallback
    );
  }

  return getAdminCategoryText(
    value,
    language,
    fallback
  );
}