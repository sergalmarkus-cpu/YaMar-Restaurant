import type {
  Language,
} from "@/types";

export interface AdminProductsMessages {
  title: string;
  subtitle: string;
  newProduct: string;

  totalProducts: string;
  availableProducts: string;
  unavailableProducts: string;
  featuredProducts: string;

  available: string;
  unavailable: string;
  featured: string;
  dailySpecial: string;

  edit: string;
  delete: string;
  deleteProduct: string;
  deleteConfirmPrefix: string;

  loadCategoriesError: string;
  loadProductsError: string;
  loadError: string;

  deleteError: string;
  deleteSuccess: string;

  updateError: string;
  availableSuccess: string;
  unavailableSuccess: string;

  createTitle: string;
  editTitle: string;

  name: string;
  category: string;
  selectCategory: string;
  price: string;
  description: string;

  nameRequired: string;
  categoryRequired: string;
  priceRequired: string;
  priceInvalid: string;

  createError: string;
  createUnexpectedError: string;
  createSuccess: string;

  editError: string;
  editUnexpectedError: string;
  editSuccess: string;

  cancel: string;
  save: string;
  update: string;
  saving: string;

  activeAvailable: string;
  activeFeatured: string;
  activeDailySpecial: string;

  unnamedProduct: string;
  unnamedCategory: string;
}

export const ADMIN_PRODUCTS_MESSAGES: Record<
  Language,
  AdminProductsMessages
> = {
  es: {
    title: "Productos",
    subtitle:
      "Gestiona todos los productos del restaurante.",
    newProduct:
      "Nuevo producto",

    totalProducts:
      "Total productos",
    availableProducts:
      "Disponibles",
    unavailableProducts:
      "No disponibles",
    featuredProducts:
      "Destacados",

    available:
      "Disponible",
    unavailable:
      "No disponible",
    featured:
      "Destacado",
    dailySpecial:
      "Especial",

    edit:
      "Editar",
    delete:
      "Eliminar",
    deleteProduct:
      "Eliminar producto",
    deleteConfirmPrefix:
      "¿Eliminar",

    loadCategoriesError:
      "No se pudieron cargar las categorías.",
    loadProductsError:
      "No se pudieron cargar los productos.",
    loadError:
      "Error cargando productos.",

    deleteError:
      "No se pudo eliminar el producto.",
    deleteSuccess:
      "Producto eliminado.",

    updateError:
      "No se pudo actualizar el producto.",
    availableSuccess:
      "Producto marcado como disponible.",
    unavailableSuccess:
      "Producto marcado como no disponible.",

    createTitle:
      "Nuevo producto",
    editTitle:
      "Editar producto",

    name:
      "Nombre",
    category:
      "Categoría",
    selectCategory:
      "Seleccionar...",
    price:
      "Precio",
    description:
      "Descripción",

    nameRequired:
      "Introduce un nombre.",
    categoryRequired:
      "Selecciona una categoría.",
    priceRequired:
      "Introduce un precio.",
    priceInvalid:
      "Introduce un precio válido.",

    createError:
      "No se pudo crear el producto.",
    createUnexpectedError:
      "Se produjo un error al crear el producto.",
    createSuccess:
      "Producto creado correctamente.",

    editError:
      "No se pudo actualizar el producto.",
    editUnexpectedError:
      "Se produjo un error al actualizar el producto.",
    editSuccess:
      "Producto actualizado correctamente.",

    cancel:
      "Cancelar",
    save:
      "Guardar",
    update:
      "Actualizar",
    saving:
      "Guardando...",

    activeAvailable:
      "Disponible",
    activeFeatured:
      "Destacado",
    activeDailySpecial:
      "Especial del día",

    unnamedProduct:
      "Producto sin nombre",
    unnamedCategory:
      "Sin categoría",
  },

  en: {
    title: "Products",
    subtitle:
      "Manage all restaurant products.",
    newProduct:
      "New product",

    totalProducts:
      "Total products",
    availableProducts:
      "Available",
    unavailableProducts:
      "Unavailable",
    featuredProducts:
      "Featured",

    available:
      "Available",
    unavailable:
      "Unavailable",
    featured:
      "Featured",
    dailySpecial:
      "Special",

    edit:
      "Edit",
    delete:
      "Delete",
    deleteProduct:
      "Delete product",
    deleteConfirmPrefix:
      "Delete",

    loadCategoriesError:
      "Categories could not be loaded.",
    loadProductsError:
      "Products could not be loaded.",
    loadError:
      "Error loading products.",

    deleteError:
      "The product could not be deleted.",
    deleteSuccess:
      "Product deleted.",

    updateError:
      "The product could not be updated.",
    availableSuccess:
      "Product marked as available.",
    unavailableSuccess:
      "Product marked as unavailable.",

    createTitle:
      "New product",
    editTitle:
      "Edit product",

    name:
      "Name",
    category:
      "Category",
    selectCategory:
      "Select...",
    price:
      "Price",
    description:
      "Description",

    nameRequired:
      "Enter a name.",
    categoryRequired:
      "Select a category.",
    priceRequired:
      "Enter a price.",
    priceInvalid:
      "Enter a valid price.",

    createError:
      "The product could not be created.",
    createUnexpectedError:
      "An error occurred while creating the product.",
    createSuccess:
      "Product created successfully.",

    editError:
      "The product could not be updated.",
    editUnexpectedError:
      "An error occurred while updating the product.",
    editSuccess:
      "Product updated successfully.",

    cancel:
      "Cancel",
    save:
      "Save",
    update:
      "Update",
    saving:
      "Saving...",

    activeAvailable:
      "Available",
    activeFeatured:
      "Featured",
    activeDailySpecial:
      "Daily special",

    unnamedProduct:
      "Unnamed product",
    unnamedCategory:
      "No category",
  },

  de: {
    title: "Produkte",
    subtitle:
      "Verwalte alle Produkte des Restaurants.",
    newProduct:
      "Neues Produkt",

    totalProducts:
      "Produkte insgesamt",
    availableProducts:
      "Verfügbar",
    unavailableProducts:
      "Nicht verfügbar",
    featuredProducts:
      "Hervorgehoben",

    available:
      "Verfügbar",
    unavailable:
      "Nicht verfügbar",
    featured:
      "Hervorgehoben",
    dailySpecial:
      "Tagesangebot",

    edit:
      "Bearbeiten",
    delete:
      "Löschen",
    deleteProduct:
      "Produkt löschen",
    deleteConfirmPrefix:
      "Löschen",

    loadCategoriesError:
      "Die Kategorien konnten nicht geladen werden.",
    loadProductsError:
      "Die Produkte konnten nicht geladen werden.",
    loadError:
      "Fehler beim Laden der Produkte.",

    deleteError:
      "Das Produkt konnte nicht gelöscht werden.",
    deleteSuccess:
      "Produkt gelöscht.",

    updateError:
      "Das Produkt konnte nicht aktualisiert werden.",
    availableSuccess:
      "Produkt als verfügbar markiert.",
    unavailableSuccess:
      "Produkt als nicht verfügbar markiert.",

    createTitle:
      "Neues Produkt",
    editTitle:
      "Produkt bearbeiten",

    name:
      "Name",
    category:
      "Kategorie",
    selectCategory:
      "Auswählen...",
    price:
      "Preis",
    description:
      "Beschreibung",

    nameRequired:
      "Gib einen Namen ein.",
    categoryRequired:
      "Wähle eine Kategorie.",
    priceRequired:
      "Gib einen Preis ein.",
    priceInvalid:
      "Gib einen gültigen Preis ein.",

    createError:
      "Das Produkt konnte nicht erstellt werden.",
    createUnexpectedError:
      "Beim Erstellen des Produkts ist ein Fehler aufgetreten.",
    createSuccess:
      "Produkt erfolgreich erstellt.",

    editError:
      "Das Produkt konnte nicht aktualisiert werden.",
    editUnexpectedError:
      "Beim Aktualisieren des Produkts ist ein Fehler aufgetreten.",
    editSuccess:
      "Produkt erfolgreich aktualisiert.",

    cancel:
      "Abbrechen",
    save:
      "Speichern",
    update:
      "Aktualisieren",
    saving:
      "Wird gespeichert...",

    activeAvailable:
      "Verfügbar",
    activeFeatured:
      "Hervorgehoben",
    activeDailySpecial:
      "Tagesangebot",

    unnamedProduct:
      "Produkt ohne Namen",
    unnamedCategory:
      "Keine Kategorie",
  },

  fr: {
    title: "Produits",
    subtitle:
      "Gérez tous les produits du restaurant.",
    newProduct:
      "Nouveau produit",

    totalProducts:
      "Total produits",
    availableProducts:
      "Disponibles",
    unavailableProducts:
      "Indisponibles",
    featuredProducts:
      "Mis en avant",

    available:
      "Disponible",
    unavailable:
      "Indisponible",
    featured:
      "Mis en avant",
    dailySpecial:
      "Spécial",

    edit:
      "Modifier",
    delete:
      "Supprimer",
    deleteProduct:
      "Supprimer le produit",
    deleteConfirmPrefix:
      "Supprimer",

    loadCategoriesError:
      "Impossible de charger les catégories.",
    loadProductsError:
      "Impossible de charger les produits.",
    loadError:
      "Erreur lors du chargement des produits.",

    deleteError:
      "Impossible de supprimer le produit.",
    deleteSuccess:
      "Produit supprimé.",

    updateError:
      "Impossible de mettre à jour le produit.",
    availableSuccess:
      "Produit marqué comme disponible.",
    unavailableSuccess:
      "Produit marqué comme indisponible.",

    createTitle:
      "Nouveau produit",
    editTitle:
      "Modifier le produit",

    name:
      "Nom",
    category:
      "Catégorie",
    selectCategory:
      "Sélectionner...",
    price:
      "Prix",
    description:
      "Description",

    nameRequired:
      "Saisissez un nom.",
    categoryRequired:
      "Sélectionnez une catégorie.",
    priceRequired:
      "Saisissez un prix.",
    priceInvalid:
      "Saisissez un prix valide.",

    createError:
      "Impossible de créer le produit.",
    createUnexpectedError:
      "Une erreur s'est produite lors de la création du produit.",
    createSuccess:
      "Produit créé avec succès.",

    editError:
      "Impossible de mettre à jour le produit.",
    editUnexpectedError:
      "Une erreur s'est produite lors de la mise à jour du produit.",
    editSuccess:
      "Produit mis à jour avec succès.",

    cancel:
      "Annuler",
    save:
      "Enregistrer",
    update:
      "Mettre à jour",
    saving:
      "Enregistrement...",

    activeAvailable:
      "Disponible",
    activeFeatured:
      "Mis en avant",
    activeDailySpecial:
      "Spécial du jour",

    unnamedProduct:
      "Produit sans nom",
    unnamedCategory:
      "Sans catégorie",
  },

  it: {
    title: "Prodotti",
    subtitle:
      "Gestisci tutti i prodotti del ristorante.",
    newProduct:
      "Nuovo prodotto",

    totalProducts:
      "Prodotti totali",
    availableProducts:
      "Disponibili",
    unavailableProducts:
      "Non disponibili",
    featuredProducts:
      "In evidenza",

    available:
      "Disponibile",
    unavailable:
      "Non disponibile",
    featured:
      "In evidenza",
    dailySpecial:
      "Speciale",

    edit:
      "Modifica",
    delete:
      "Elimina",
    deleteProduct:
      "Elimina prodotto",
    deleteConfirmPrefix:
      "Eliminare",

    loadCategoriesError:
      "Impossibile caricare le categorie.",
    loadProductsError:
      "Impossibile caricare i prodotti.",
    loadError:
      "Errore durante il caricamento dei prodotti.",

    deleteError:
      "Impossibile eliminare il prodotto.",
    deleteSuccess:
      "Prodotto eliminato.",

    updateError:
      "Impossibile aggiornare il prodotto.",
    availableSuccess:
      "Prodotto contrassegnato come disponibile.",
    unavailableSuccess:
      "Prodotto contrassegnato come non disponibile.",

    createTitle:
      "Nuovo prodotto",
    editTitle:
      "Modifica prodotto",

    name:
      "Nome",
    category:
      "Categoria",
    selectCategory:
      "Seleziona...",
    price:
      "Prezzo",
    description:
      "Descrizione",

    nameRequired:
      "Inserisci un nome.",
    categoryRequired:
      "Seleziona una categoria.",
    priceRequired:
      "Inserisci un prezzo.",
    priceInvalid:
      "Inserisci un prezzo valido.",

    createError:
      "Impossibile creare il prodotto.",
    createUnexpectedError:
      "Si è verificato un errore durante la creazione del prodotto.",
    createSuccess:
      "Prodotto creato correttamente.",

    editError:
      "Impossibile aggiornare il prodotto.",
    editUnexpectedError:
      "Si è verificato un errore durante l'aggiornamento del prodotto.",
    editSuccess:
      "Prodotto aggiornato correttamente.",

    cancel:
      "Annulla",
    save:
      "Salva",
    update:
      "Aggiorna",
    saving:
      "Salvataggio...",

    activeAvailable:
      "Disponibile",
    activeFeatured:
      "In evidenza",
    activeDailySpecial:
      "Speciale del giorno",

    unnamedProduct:
      "Prodotto senza nome",
    unnamedCategory:
      "Senza categoria",
  },

  pt: {
    title: "Produtos",
    subtitle:
      "Faça a gestão de todos os produtos do restaurante.",
    newProduct:
      "Novo produto",

    totalProducts:
      "Total de produtos",
    availableProducts:
      "Disponíveis",
    unavailableProducts:
      "Indisponíveis",
    featuredProducts:
      "Destaques",

    available:
      "Disponível",
    unavailable:
      "Indisponível",
    featured:
      "Destaque",
    dailySpecial:
      "Especial",

    edit:
      "Editar",
    delete:
      "Eliminar",
    deleteProduct:
      "Eliminar produto",
    deleteConfirmPrefix:
      "Eliminar",

    loadCategoriesError:
      "Não foi possível carregar as categorias.",
    loadProductsError:
      "Não foi possível carregar os produtos.",
    loadError:
      "Erro ao carregar os produtos.",

    deleteError:
      "Não foi possível eliminar o produto.",
    deleteSuccess:
      "Produto eliminado.",

    updateError:
      "Não foi possível atualizar o produto.",
    availableSuccess:
      "Produto marcado como disponível.",
    unavailableSuccess:
      "Produto marcado como indisponível.",

    createTitle:
      "Novo produto",
    editTitle:
      "Editar produto",

    name:
      "Nome",
    category:
      "Categoria",
    selectCategory:
      "Selecionar...",
    price:
      "Preço",
    description:
      "Descrição",

    nameRequired:
      "Introduza um nome.",
    categoryRequired:
      "Selecione uma categoria.",
    priceRequired:
      "Introduza um preço.",
    priceInvalid:
      "Introduza um preço válido.",

    createError:
      "Não foi possível criar o produto.",
    createUnexpectedError:
      "Ocorreu um erro ao criar o produto.",
    createSuccess:
      "Produto criado com sucesso.",

    editError:
      "Não foi possível atualizar o produto.",
    editUnexpectedError:
      "Ocorreu um erro ao atualizar o produto.",
    editSuccess:
      "Produto atualizado com sucesso.",

    cancel:
      "Cancelar",
    save:
      "Guardar",
    update:
      "Atualizar",
    saving:
      "A guardar...",

    activeAvailable:
      "Disponível",
    activeFeatured:
      "Destaque",
    activeDailySpecial:
      "Especial do dia",

    unnamedProduct:
      "Produto sem nome",
    unnamedCategory:
      "Sem categoria",
  },
};

export function getAdminProductText(
  value:
    | string
    | Record<string, string>
    | null
    | undefined,
  language: Language,
  fallback = ""
) {
  if (
    typeof value ===
    "string"
  ) {
    return (
      value.trim() ||
      fallback
    );
  }

  if (!value) {
    return fallback;
  }

  const current =
    value[language]?.trim();

  if (current) {
    return current;
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
    Object.values(
      value
    ).find(
      (text) =>
        typeof text ===
          "string" &&
        text.trim().length >
          0
    );

  return (
    first?.trim() ||
    fallback
  );
}

export function toAdminProductTranslations(
  value:
    | string
    | Record<string, string>
    | null
    | undefined,
  language: Language
): Record<string, string> {
  if (!value) {
    return {};
  }

  if (
    typeof value ===
    "string"
  ) {
    const normalized =
      value.trim();

    return normalized
      ? {
          [language]:
            normalized,
        }
      : {};
  }

  return {
    ...value,
  };
}