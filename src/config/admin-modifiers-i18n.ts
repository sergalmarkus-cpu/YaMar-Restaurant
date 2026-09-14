export type AdminModifierLanguage =
  | "es"
  | "en"
  | "de"
  | "fr"
  | "it"
  | "pt";

export type AdminModifierType =
  | "add"
  | "remove"
  | "replace";

interface AdminModifierTypeMessages {
  add: string;
  remove: string;
  replace: string;
}

export interface AdminModifiersMessages {
  title: string;
  subtitle: string;

  refresh: string;
  refreshing: string;
  loading: string;

  statModifiers: string;
  statActive: string;
  statProducts: string;

  newModifier: string;
  editModifier: string;
  editingModifier: (
    id: number
  ) => string;

  createDescription: string;
  cancel: string;

  noProductsWarning: string;

  product: string;
  selectProduct: string;
  type: string;
  additionalPrice: string;

  modifierName: string;
  translationsHelp: string;
  namePlaceholder: (
    language: string
  ) => string;

  active: string;
  inactive: string;

  saving: string;
  saveChanges: string;
  createModifier: string;

  configuredModifiers: string;
  filterDescription: string;
  allProducts: string;

  emptyTitle: string;
  emptyAll: string;
  emptyFiltered: string;

  price: string;
  free: string;

  activate: string;
  deactivate: string;
  edit: string;
  delete: string;

  fallbackModifier: (
    id: number
  ) => string;

  fallbackProduct: (
    id: number
  ) => string;

  invalidProduct: string;
  nameRequired: string;
  invalidPrice: string;

  loadModifiersError: string;
  loadProductsError: string;

  createError: string;
  updateError: string;
  toggleError: string;
  deleteError: string;

  createSuccess: string;
  updateSuccess: string;
  activatedSuccess: string;
  deactivatedSuccess: string;
  deleteSuccess: string;

  deleteConfirm: (
    name: string
  ) => string;

  types: AdminModifierTypeMessages;
}

export const ADMIN_MODIFIERS_MESSAGES: Record<
  AdminModifierLanguage,
  AdminModifiersMessages
> = {
  es: {
    title:
      "Modificadores",

    subtitle:
      "Gestiona extras, sustituciones y opciones disponibles para cada producto.",

    refresh:
      "Actualizar",

    refreshing:
      "Actualizando...",

    loading:
      "Cargando modificadores...",

    statModifiers:
      "Modificadores",

    statActive:
      "Activos",

    statProducts:
      "Productos",

    newModifier:
      "Nuevo modificador",

    editModifier:
      "Editar modificador",

    editingModifier:
      (id) =>
        `Editando el modificador #${id}.`,

    createDescription:
      "Asocia una opción directamente a uno de los productos del establecimiento.",

    cancel:
      "Cancelar",

    noProductsWarning:
      "Debes crear al menos un producto antes de poder crear modificadores.",

    product:
      "Producto",

    selectProduct:
      "Selecciona un producto",

    type:
      "Tipo",

    additionalPrice:
      "Precio adicional",

    modifierName:
      "Nombre del modificador",

    translationsHelp:
      "Puedes definir la traducción en cualquiera de los idiomas disponibles.",

    namePlaceholder:
      (language) =>
        `Nombre en ${language}`,

    active:
      "Activo",

    inactive:
      "Inactivo",

    saving:
      "Guardando...",

    saveChanges:
      "Guardar cambios",

    createModifier:
      "Crear modificador",

    configuredModifiers:
      "Modificadores configurados",

    filterDescription:
      "Filtra el listado por producto cuando sea necesario.",

    allProducts:
      "Todos los productos",

    emptyTitle:
      "No hay modificadores",

    emptyAll:
      "Todavía no se han creado modificadores.",

    emptyFiltered:
      "No hay modificadores asociados al producto seleccionado.",

    price:
      "Precio",

    free:
      "sin coste",

    activate:
      "Activar",

    deactivate:
      "Desactivar",

    edit:
      "Editar",

    delete:
      "Eliminar",

    fallbackModifier:
      (id) =>
        `Modificador #${id}`,

    fallbackProduct:
      (id) =>
        `Producto #${id}`,

    invalidProduct:
      "Selecciona un producto válido.",

    nameRequired:
      "Indica al menos un nombre para el modificador.",

    invalidPrice:
      "El precio debe usar un formato válido, por ejemplo 0, 1 o 1.50.",

    loadModifiersError:
      "No se pudieron cargar los modificadores.",

    loadProductsError:
      "No se pudieron cargar los productos.",

    createError:
      "No se pudo crear el modificador.",

    updateError:
      "No se pudo actualizar el modificador.",

    toggleError:
      "No se pudo cambiar el estado del modificador.",

    deleteError:
      "No se pudo eliminar el modificador.",

    createSuccess:
      "Modificador creado correctamente.",

    updateSuccess:
      "Modificador actualizado correctamente.",

    activatedSuccess:
      "Modificador activado correctamente.",

    deactivatedSuccess:
      "Modificador desactivado correctamente.",

    deleteSuccess:
      "Modificador eliminado correctamente.",

    deleteConfirm:
      (name) =>
        `¿Eliminar "${name}"? Esta acción no se puede deshacer.`,

    types: {
      add:
        "Añadir",

      remove:
        "Quitar",

      replace:
        "Sustituir",
    },
  },

  en: {
    title:
      "Modifiers",

    subtitle:
      "Manage extras, substitutions and options available for each product.",

    refresh:
      "Refresh",

    refreshing:
      "Refreshing...",

    loading:
      "Loading modifiers...",

    statModifiers:
      "Modifiers",

    statActive:
      "Active",

    statProducts:
      "Products",

    newModifier:
      "New modifier",

    editModifier:
      "Edit modifier",

    editingModifier:
      (id) =>
        `Editing modifier #${id}.`,

    createDescription:
      "Link an option directly to one of the establishment's products.",

    cancel:
      "Cancel",

    noProductsWarning:
      "You must create at least one product before creating modifiers.",

    product:
      "Product",

    selectProduct:
      "Select a product",

    type:
      "Type",

    additionalPrice:
      "Additional price",

    modifierName:
      "Modifier name",

    translationsHelp:
      "You can define a translation in any of the available languages.",

    namePlaceholder:
      (language) =>
        `Name in ${language}`,

    active:
      "Active",

    inactive:
      "Inactive",

    saving:
      "Saving...",

    saveChanges:
      "Save changes",

    createModifier:
      "Create modifier",

    configuredModifiers:
      "Configured modifiers",

    filterDescription:
      "Filter the list by product when necessary.",

    allProducts:
      "All products",

    emptyTitle:
      "No modifiers",

    emptyAll:
      "No modifiers have been created yet.",

    emptyFiltered:
      "There are no modifiers associated with the selected product.",

    price:
      "Price",

    free:
      "free",

    activate:
      "Activate",

    deactivate:
      "Deactivate",

    edit:
      "Edit",

    delete:
      "Delete",

    fallbackModifier:
      (id) =>
        `Modifier #${id}`,

    fallbackProduct:
      (id) =>
        `Product #${id}`,

    invalidProduct:
      "Select a valid product.",

    nameRequired:
      "Enter at least one name for the modifier.",

    invalidPrice:
      "The price must use a valid format, for example 0, 1 or 1.50.",

    loadModifiersError:
      "Modifiers could not be loaded.",

    loadProductsError:
      "Products could not be loaded.",

    createError:
      "The modifier could not be created.",

    updateError:
      "The modifier could not be updated.",

    toggleError:
      "The modifier status could not be changed.",

    deleteError:
      "The modifier could not be deleted.",

    createSuccess:
      "Modifier created successfully.",

    updateSuccess:
      "Modifier updated successfully.",

    activatedSuccess:
      "Modifier activated successfully.",

    deactivatedSuccess:
      "Modifier deactivated successfully.",

    deleteSuccess:
      "Modifier deleted successfully.",

    deleteConfirm:
      (name) =>
        `Delete "${name}"? This action cannot be undone.`,

    types: {
      add:
        "Add",

      remove:
        "Remove",

      replace:
        "Replace",
    },
  },

  de: {
    title:
      "Modifikatoren",

    subtitle:
      "Verwalte Extras, Ersetzungen und Optionen für jedes Produkt.",

    refresh:
      "Aktualisieren",

    refreshing:
      "Wird aktualisiert...",

    loading:
      "Modifikatoren werden geladen...",

    statModifiers:
      "Modifikatoren",

    statActive:
      "Aktiv",

    statProducts:
      "Produkte",

    newModifier:
      "Neuer Modifikator",

    editModifier:
      "Modifikator bearbeiten",

    editingModifier:
      (id) =>
        `Modifikator #${id} wird bearbeitet.`,

    createDescription:
      "Ordne eine Option direkt einem Produkt des Betriebs zu.",

    cancel:
      "Abbrechen",

    noProductsWarning:
      "Du musst mindestens ein Produkt erstellen, bevor du Modifikatoren erstellen kannst.",

    product:
      "Produkt",

    selectProduct:
      "Produkt auswählen",

    type:
      "Typ",

    additionalPrice:
      "Zusatzpreis",

    modifierName:
      "Name des Modifikators",

    translationsHelp:
      "Du kannst eine Übersetzung in jeder verfügbaren Sprache definieren.",

    namePlaceholder:
      (language) =>
        `Name auf ${language}`,

    active:
      "Aktiv",

    inactive:
      "Inaktiv",

    saving:
      "Wird gespeichert...",

    saveChanges:
      "Änderungen speichern",

    createModifier:
      "Modifikator erstellen",

    configuredModifiers:
      "Konfigurierte Modifikatoren",

    filterDescription:
      "Filtere die Liste bei Bedarf nach Produkt.",

    allProducts:
      "Alle Produkte",

    emptyTitle:
      "Keine Modifikatoren",

    emptyAll:
      "Es wurden noch keine Modifikatoren erstellt.",

    emptyFiltered:
      "Dem ausgewählten Produkt sind keine Modifikatoren zugeordnet.",

    price:
      "Preis",

    free:
      "kostenlos",

    activate:
      "Aktivieren",

    deactivate:
      "Deaktivieren",

    edit:
      "Bearbeiten",

    delete:
      "Löschen",

    fallbackModifier:
      (id) =>
        `Modifikator #${id}`,

    fallbackProduct:
      (id) =>
        `Produkt #${id}`,

    invalidProduct:
      "Wähle ein gültiges Produkt aus.",

    nameRequired:
      "Gib mindestens einen Namen für den Modifikator ein.",

    invalidPrice:
      "Der Preis muss ein gültiges Format haben, zum Beispiel 0, 1 oder 1.50.",

    loadModifiersError:
      "Die Modifikatoren konnten nicht geladen werden.",

    loadProductsError:
      "Die Produkte konnten nicht geladen werden.",

    createError:
      "Der Modifikator konnte nicht erstellt werden.",

    updateError:
      "Der Modifikator konnte nicht aktualisiert werden.",

    toggleError:
      "Der Status des Modifikators konnte nicht geändert werden.",

    deleteError:
      "Der Modifikator konnte nicht gelöscht werden.",

    createSuccess:
      "Modifikator erfolgreich erstellt.",

    updateSuccess:
      "Modifikator erfolgreich aktualisiert.",

    activatedSuccess:
      "Modifikator erfolgreich aktiviert.",

    deactivatedSuccess:
      "Modifikator erfolgreich deaktiviert.",

    deleteSuccess:
      "Modifikator erfolgreich gelöscht.",

    deleteConfirm:
      (name) =>
        `"${name}" löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,

    types: {
      add:
        "Hinzufügen",

      remove:
        "Entfernen",

      replace:
        "Ersetzen",
    },
  },

  fr: {
    title:
      "Modificateurs",

    subtitle:
      "Gérez les extras, substitutions et options disponibles pour chaque produit.",

    refresh:
      "Actualiser",

    refreshing:
      "Actualisation...",

    loading:
      "Chargement des modificateurs...",

    statModifiers:
      "Modificateurs",

    statActive:
      "Actifs",

    statProducts:
      "Produits",

    newModifier:
      "Nouveau modificateur",

    editModifier:
      "Modifier le modificateur",

    editingModifier:
      (id) =>
        `Modification du modificateur #${id}.`,

    createDescription:
      "Associez directement une option à l'un des produits de l'établissement.",

    cancel:
      "Annuler",

    noProductsWarning:
      "Vous devez créer au moins un produit avant de pouvoir créer des modificateurs.",

    product:
      "Produit",

    selectProduct:
      "Sélectionnez un produit",

    type:
      "Type",

    additionalPrice:
      "Prix supplémentaire",

    modifierName:
      "Nom du modificateur",

    translationsHelp:
      "Vous pouvez définir une traduction dans chacune des langues disponibles.",

    namePlaceholder:
      (language) =>
        `Nom en ${language}`,

    active:
      "Actif",

    inactive:
      "Inactif",

    saving:
      "Enregistrement...",

    saveChanges:
      "Enregistrer les modifications",

    createModifier:
      "Créer le modificateur",

    configuredModifiers:
      "Modificateurs configurés",

    filterDescription:
      "Filtrez la liste par produit lorsque cela est nécessaire.",

    allProducts:
      "Tous les produits",

    emptyTitle:
      "Aucun modificateur",

    emptyAll:
      "Aucun modificateur n'a encore été créé.",

    emptyFiltered:
      "Aucun modificateur n'est associé au produit sélectionné.",

    price:
      "Prix",

    free:
      "sans supplément",

    activate:
      "Activer",

    deactivate:
      "Désactiver",

    edit:
      "Modifier",

    delete:
      "Supprimer",

    fallbackModifier:
      (id) =>
        `Modificateur #${id}`,

    fallbackProduct:
      (id) =>
        `Produit #${id}`,

    invalidProduct:
      "Sélectionnez un produit valide.",

    nameRequired:
      "Indiquez au moins un nom pour le modificateur.",

    invalidPrice:
      "Le prix doit utiliser un format valide, par exemple 0, 1 ou 1.50.",

    loadModifiersError:
      "Impossible de charger les modificateurs.",

    loadProductsError:
      "Impossible de charger les produits.",

    createError:
      "Impossible de créer le modificateur.",

    updateError:
      "Impossible de mettre à jour le modificateur.",

    toggleError:
      "Impossible de modifier l'état du modificateur.",

    deleteError:
      "Impossible de supprimer le modificateur.",

    createSuccess:
      "Modificateur créé avec succès.",

    updateSuccess:
      "Modificateur mis à jour avec succès.",

    activatedSuccess:
      "Modificateur activé avec succès.",

    deactivatedSuccess:
      "Modificateur désactivé avec succès.",

    deleteSuccess:
      "Modificateur supprimé avec succès.",

    deleteConfirm:
      (name) =>
        `Supprimer "${name}" ? Cette action est irréversible.`,

    types: {
      add:
        "Ajouter",

      remove:
        "Retirer",

      replace:
        "Remplacer",
    },
  },

  it: {
    title:
      "Modificatori",

    subtitle:
      "Gestisci extra, sostituzioni e opzioni disponibili per ogni prodotto.",

    refresh:
      "Aggiorna",

    refreshing:
      "Aggiornamento...",

    loading:
      "Caricamento modificatori...",

    statModifiers:
      "Modificatori",

    statActive:
      "Attivi",

    statProducts:
      "Prodotti",

    newModifier:
      "Nuovo modificatore",

    editModifier:
      "Modifica modificatore",

    editingModifier:
      (id) =>
        `Modifica del modificatore #${id}.`,

    createDescription:
      "Associa un'opzione direttamente a uno dei prodotti dell'attività.",

    cancel:
      "Annulla",

    noProductsWarning:
      "Devi creare almeno un prodotto prima di poter creare modificatori.",

    product:
      "Prodotto",

    selectProduct:
      "Seleziona un prodotto",

    type:
      "Tipo",

    additionalPrice:
      "Prezzo aggiuntivo",

    modifierName:
      "Nome del modificatore",

    translationsHelp:
      "Puoi definire una traduzione in una qualsiasi delle lingue disponibili.",

    namePlaceholder:
      (language) =>
        `Nome in ${language}`,

    active:
      "Attivo",

    inactive:
      "Inattivo",

    saving:
      "Salvataggio...",

    saveChanges:
      "Salva modifiche",

    createModifier:
      "Crea modificatore",

    configuredModifiers:
      "Modificatori configurati",

    filterDescription:
      "Filtra l'elenco per prodotto quando necessario.",

    allProducts:
      "Tutti i prodotti",

    emptyTitle:
      "Nessun modificatore",

    emptyAll:
      "Non sono ancora stati creati modificatori.",

    emptyFiltered:
      "Nessun modificatore è associato al prodotto selezionato.",

    price:
      "Prezzo",

    free:
      "senza costo",

    activate:
      "Attiva",

    deactivate:
      "Disattiva",

    edit:
      "Modifica",

    delete:
      "Elimina",

    fallbackModifier:
      (id) =>
        `Modificatore #${id}`,

    fallbackProduct:
      (id) =>
        `Prodotto #${id}`,

    invalidProduct:
      "Seleziona un prodotto valido.",

    nameRequired:
      "Inserisci almeno un nome per il modificatore.",

    invalidPrice:
      "Il prezzo deve avere un formato valido, ad esempio 0, 1 o 1.50.",

    loadModifiersError:
      "Impossibile caricare i modificatori.",

    loadProductsError:
      "Impossibile caricare i prodotti.",

    createError:
      "Impossibile creare il modificatore.",

    updateError:
      "Impossibile aggiornare il modificatore.",

    toggleError:
      "Impossibile modificare lo stato del modificatore.",

    deleteError:
      "Impossibile eliminare il modificatore.",

    createSuccess:
      "Modificatore creato correttamente.",

    updateSuccess:
      "Modificatore aggiornato correttamente.",

    activatedSuccess:
      "Modificatore attivato correttamente.",

    deactivatedSuccess:
      "Modificatore disattivato correttamente.",

    deleteSuccess:
      "Modificatore eliminato correttamente.",

    deleteConfirm:
      (name) =>
        `Eliminare "${name}"? Questa azione non può essere annullata.`,

    types: {
      add:
        "Aggiungi",

      remove:
        "Rimuovi",

      replace:
        "Sostituisci",
    },
  },

  pt: {
    title:
      "Modificadores",

    subtitle:
      "Faça a gestão de extras, substituições e opções disponíveis para cada produto.",

    refresh:
      "Atualizar",

    refreshing:
      "A atualizar...",

    loading:
      "A carregar modificadores...",

    statModifiers:
      "Modificadores",

    statActive:
      "Ativos",

    statProducts:
      "Produtos",

    newModifier:
      "Novo modificador",

    editModifier:
      "Editar modificador",

    editingModifier:
      (id) =>
        `A editar o modificador #${id}.`,

    createDescription:
      "Associe uma opção diretamente a um dos produtos do estabelecimento.",

    cancel:
      "Cancelar",

    noProductsWarning:
      "Tem de criar pelo menos um produto antes de poder criar modificadores.",

    product:
      "Produto",

    selectProduct:
      "Selecione um produto",

    type:
      "Tipo",

    additionalPrice:
      "Preço adicional",

    modifierName:
      "Nome do modificador",

    translationsHelp:
      "Pode definir uma tradução em qualquer um dos idiomas disponíveis.",

    namePlaceholder:
      (language) =>
        `Nome em ${language}`,

    active:
      "Ativo",

    inactive:
      "Inativo",

    saving:
      "A guardar...",

    saveChanges:
      "Guardar alterações",

    createModifier:
      "Criar modificador",

    configuredModifiers:
      "Modificadores configurados",

    filterDescription:
      "Filtre a lista por produto quando necessário.",

    allProducts:
      "Todos os produtos",

    emptyTitle:
      "Não há modificadores",

    emptyAll:
      "Ainda não foram criados modificadores.",

    emptyFiltered:
      "Não existem modificadores associados ao produto selecionado.",

    price:
      "Preço",

    free:
      "sem custo",

    activate:
      "Ativar",

    deactivate:
      "Desativar",

    edit:
      "Editar",

    delete:
      "Eliminar",

    fallbackModifier:
      (id) =>
        `Modificador #${id}`,

    fallbackProduct:
      (id) =>
        `Produto #${id}`,

    invalidProduct:
      "Selecione um produto válido.",

    nameRequired:
      "Indique pelo menos um nome para o modificador.",

    invalidPrice:
      "O preço deve usar um formato válido, por exemplo 0, 1 ou 1.50.",

    loadModifiersError:
      "Não foi possível carregar os modificadores.",

    loadProductsError:
      "Não foi possível carregar os produtos.",

    createError:
      "Não foi possível criar o modificador.",

    updateError:
      "Não foi possível atualizar o modificador.",

    toggleError:
      "Não foi possível alterar o estado do modificador.",

    deleteError:
      "Não foi possível eliminar o modificador.",

    createSuccess:
      "Modificador criado com sucesso.",

    updateSuccess:
      "Modificador atualizado com sucesso.",

    activatedSuccess:
      "Modificador ativado com sucesso.",

    deactivatedSuccess:
      "Modificador desativado com sucesso.",

    deleteSuccess:
      "Modificador eliminado com sucesso.",

    deleteConfirm:
      (name) =>
        `Eliminar "${name}"? Esta ação não pode ser anulada.`,

    types: {
      add:
        "Adicionar",

      remove:
        "Remover",

      replace:
        "Substituir",
    },
  },
};