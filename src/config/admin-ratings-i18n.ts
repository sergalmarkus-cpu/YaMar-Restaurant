export type AdminRatingLanguage =
  | "es"
  | "en"
  | "de"
  | "fr"
  | "it"
  | "pt";

export interface AdminRatingsMessages {
  title: string;
  subtitle: string;

  loading: string;
  refresh: string;
  refreshing: string;

  shown: string;
  approved: string;
  pending: string;
  displayedAverage: string;

  filterAll: string;
  filterPending: string;
  filterApproved: string;

  noRatings: string;
  noPendingRatings: string;
  noApprovedRatings: string;
  noRatingsReceived: string;

  approvedStatus: string;
  pendingStatus: string;
  respondedStatus: string;

  ratingNumber: string;
  session: string;

  approve: string;
  withdrawApproval: string;

  food: string;
  service: string;
  attention: string;

  customerComment: string;
  noCustomerComment: string;

  photos: string;
  viewPhoto: (index: number) => string;

  establishmentResponse: string;
  responseHelp: string;

  responsePlaceholder: string;
  responseDisabledPlaceholder: string;

  sendResponse: string;
  updateResponse: string;

  moderated: string;
  responded: string;
  userNumber: (id: number) => string;

  scoreAria: (value: number) => string;

  loadError: string;
  moderationError: string;
  responseError: string;

  approveSuccess: string;
  withdrawSuccess: string;

  responseCreatedSuccess: string;
  responseUpdatedSuccess: string;

  approveBeforeResponding: string;
  emptyResponse: string;
  responseTooLong: string;
}

export const ADMIN_RATINGS_MESSAGES: Record<
  AdminRatingLanguage,
  AdminRatingsMessages
> = {
  es: {
    title: "Valoraciones",
    subtitle:
      "Modera las opiniones recibidas y responde a las valoraciones aprobadas.",

    loading: "Cargando valoraciones...",
    refresh: "Actualizar",
    refreshing: "Actualizando...",

    shown: "Mostradas",
    approved: "Aprobadas",
    pending: "Pendientes",
    displayedAverage: "Media mostrada",

    filterAll: "Todas",
    filterPending: "Pendientes",
    filterApproved: "Aprobadas",

    noRatings: "No hay valoraciones",
    noPendingRatings:
      "No hay valoraciones pendientes de aprobación.",
    noApprovedRatings:
      "No hay valoraciones aprobadas.",
    noRatingsReceived:
      "Todavía no se han recibido valoraciones.",

    approvedStatus: "Aprobada",
    pendingStatus: "Pendiente",
    respondedStatus: "Respondida",

    ratingNumber: "Valoración",
    session: "Sesión",

    approve: "Aprobar",
    withdrawApproval:
      "Retirar aprobación",

    food: "Comida",
    service: "Servicio",
    attention: "Atención",

    customerComment:
      "Comentario del cliente",
    noCustomerComment:
      "El cliente no dejó ningún comentario.",

    photos: "Fotos",
    viewPhoto: (index) =>
      `Ver foto ${index}`,

    establishmentResponse:
      "Respuesta del establecimiento",
    responseHelp:
      "Solo se puede responder cuando la valoración está aprobada.",

    responsePlaceholder:
      "Escribe una respuesta para el cliente...",
    responseDisabledPlaceholder:
      "Aprueba primero la valoración para poder responder.",

    sendResponse:
      "Enviar respuesta",
    updateResponse:
      "Actualizar respuesta",

    moderated: "Moderada",
    responded: "Respondida",
    userNumber: (id) =>
      `Usuario #${id}`,

    scoreAria: (value) =>
      `${value} de 5`,

    loadError:
      "No se pudieron cargar las valoraciones.",
    moderationError:
      "No se pudo moderar la valoración.",
    responseError:
      "No se pudo registrar la respuesta.",

    approveSuccess:
      "Valoración aprobada correctamente.",
    withdrawSuccess:
      "La aprobación de la valoración ha sido retirada.",

    responseCreatedSuccess:
      "Respuesta registrada correctamente.",
    responseUpdatedSuccess:
      "Respuesta actualizada correctamente.",

    approveBeforeResponding:
      "Primero debes aprobar la valoración antes de responder.",
    emptyResponse:
      "La respuesta no puede estar vacía.",
    responseTooLong:
      "La respuesta no puede superar los 2000 caracteres.",
  },

  en: {
    title: "Ratings",
    subtitle:
      "Moderate received reviews and respond to approved ratings.",

    loading: "Loading ratings...",
    refresh: "Refresh",
    refreshing: "Refreshing...",

    shown: "Shown",
    approved: "Approved",
    pending: "Pending",
    displayedAverage: "Displayed average",

    filterAll: "All",
    filterPending: "Pending",
    filterApproved: "Approved",

    noRatings: "No ratings",
    noPendingRatings:
      "There are no ratings awaiting approval.",
    noApprovedRatings:
      "There are no approved ratings.",
    noRatingsReceived:
      "No ratings have been received yet.",

    approvedStatus: "Approved",
    pendingStatus: "Pending",
    respondedStatus: "Responded",

    ratingNumber: "Rating",
    session: "Session",

    approve: "Approve",
    withdrawApproval:
      "Withdraw approval",

    food: "Food",
    service: "Service",
    attention: "Attention",

    customerComment:
      "Customer comment",
    noCustomerComment:
      "The customer did not leave a comment.",

    photos: "Photos",
    viewPhoto: (index) =>
      `View photo ${index}`,

    establishmentResponse:
      "Establishment response",
    responseHelp:
      "A response can only be sent after the rating has been approved.",

    responsePlaceholder:
      "Write a response to the customer...",
    responseDisabledPlaceholder:
      "Approve the rating first to respond.",

    sendResponse:
      "Send response",
    updateResponse:
      "Update response",

    moderated: "Moderated",
    responded: "Responded",
    userNumber: (id) =>
      `User #${id}`,

    scoreAria: (value) =>
      `${value} out of 5`,

    loadError:
      "Ratings could not be loaded.",
    moderationError:
      "The rating could not be moderated.",
    responseError:
      "The response could not be saved.",

    approveSuccess:
      "Rating approved successfully.",
    withdrawSuccess:
      "Rating approval withdrawn successfully.",

    responseCreatedSuccess:
      "Response saved successfully.",
    responseUpdatedSuccess:
      "Response updated successfully.",

    approveBeforeResponding:
      "You must approve the rating before responding.",
    emptyResponse:
      "The response cannot be empty.",
    responseTooLong:
      "The response cannot exceed 2000 characters.",
  },

  de: {
    title: "Bewertungen",
    subtitle:
      "Moderiere eingegangene Bewertungen und antworte auf freigegebene Bewertungen.",

    loading: "Bewertungen werden geladen...",
    refresh: "Aktualisieren",
    refreshing: "Wird aktualisiert...",

    shown: "Angezeigt",
    approved: "Freigegeben",
    pending: "Ausstehend",
    displayedAverage:
      "Angezeigter Durchschnitt",

    filterAll: "Alle",
    filterPending: "Ausstehend",
    filterApproved: "Freigegeben",

    noRatings: "Keine Bewertungen",
    noPendingRatings:
      "Es gibt keine Bewertungen, die auf Freigabe warten.",
    noApprovedRatings:
      "Es gibt keine freigegebenen Bewertungen.",
    noRatingsReceived:
      "Es wurden noch keine Bewertungen erhalten.",

    approvedStatus: "Freigegeben",
    pendingStatus: "Ausstehend",
    respondedStatus: "Beantwortet",

    ratingNumber: "Bewertung",
    session: "Sitzung",

    approve: "Freigeben",
    withdrawApproval:
      "Freigabe zurückziehen",

    food: "Essen",
    service: "Service",
    attention: "Betreuung",

    customerComment:
      "Kundenkommentar",
    noCustomerComment:
      "Der Kunde hat keinen Kommentar hinterlassen.",

    photos: "Fotos",
    viewPhoto: (index) =>
      `Foto ${index} ansehen`,

    establishmentResponse:
      "Antwort des Betriebs",
    responseHelp:
      "Eine Antwort ist erst möglich, wenn die Bewertung freigegeben wurde.",

    responsePlaceholder:
      "Antwort an den Kunden schreiben...",
    responseDisabledPlaceholder:
      "Bewertung zuerst freigeben, um antworten zu können.",

    sendResponse:
      "Antwort senden",
    updateResponse:
      "Antwort aktualisieren",

    moderated: "Moderiert",
    responded: "Beantwortet",
    userNumber: (id) =>
      `Benutzer #${id}`,

    scoreAria: (value) =>
      `${value} von 5`,

    loadError:
      "Die Bewertungen konnten nicht geladen werden.",
    moderationError:
      "Die Bewertung konnte nicht moderiert werden.",
    responseError:
      "Die Antwort konnte nicht gespeichert werden.",

    approveSuccess:
      "Bewertung erfolgreich freigegeben.",
    withdrawSuccess:
      "Freigabe der Bewertung erfolgreich zurückgezogen.",

    responseCreatedSuccess:
      "Antwort erfolgreich gespeichert.",
    responseUpdatedSuccess:
      "Antwort erfolgreich aktualisiert.",

    approveBeforeResponding:
      "Die Bewertung muss zuerst freigegeben werden.",
    emptyResponse:
      "Die Antwort darf nicht leer sein.",
    responseTooLong:
      "Die Antwort darf höchstens 2000 Zeichen lang sein.",
  },

  fr: {
    title: "Évaluations",
    subtitle:
      "Modérez les avis reçus et répondez aux évaluations approuvées.",

    loading: "Chargement des évaluations...",
    refresh: "Actualiser",
    refreshing: "Actualisation...",

    shown: "Affichées",
    approved: "Approuvées",
    pending: "En attente",
    displayedAverage:
      "Moyenne affichée",

    filterAll: "Toutes",
    filterPending: "En attente",
    filterApproved: "Approuvées",

    noRatings: "Aucune évaluation",
    noPendingRatings:
      "Aucune évaluation n'est en attente d'approbation.",
    noApprovedRatings:
      "Aucune évaluation approuvée.",
    noRatingsReceived:
      "Aucune évaluation n'a encore été reçue.",

    approvedStatus: "Approuvée",
    pendingStatus: "En attente",
    respondedStatus: "Répondue",

    ratingNumber: "Évaluation",
    session: "Session",

    approve: "Approuver",
    withdrawApproval:
      "Retirer l'approbation",

    food: "Cuisine",
    service: "Service",
    attention: "Accueil",

    customerComment:
      "Commentaire du client",
    noCustomerComment:
      "Le client n'a laissé aucun commentaire.",

    photos: "Photos",
    viewPhoto: (index) =>
      `Voir la photo ${index}`,

    establishmentResponse:
      "Réponse de l'établissement",
    responseHelp:
      "Une réponse ne peut être envoyée que lorsque l'évaluation est approuvée.",

    responsePlaceholder:
      "Écrivez une réponse au client...",
    responseDisabledPlaceholder:
      "Approuvez d'abord l'évaluation pour pouvoir répondre.",

    sendResponse:
      "Envoyer la réponse",
    updateResponse:
      "Mettre à jour la réponse",

    moderated: "Modérée",
    responded: "Répondue",
    userNumber: (id) =>
      `Utilisateur #${id}`,

    scoreAria: (value) =>
      `${value} sur 5`,

    loadError:
      "Impossible de charger les évaluations.",
    moderationError:
      "Impossible de modérer l'évaluation.",
    responseError:
      "Impossible d'enregistrer la réponse.",

    approveSuccess:
      "Évaluation approuvée avec succès.",
    withdrawSuccess:
      "L'approbation de l'évaluation a été retirée.",

    responseCreatedSuccess:
      "Réponse enregistrée avec succès.",
    responseUpdatedSuccess:
      "Réponse mise à jour avec succès.",

    approveBeforeResponding:
      "Vous devez d'abord approuver l'évaluation avant de répondre.",
    emptyResponse:
      "La réponse ne peut pas être vide.",
    responseTooLong:
      "La réponse ne peut pas dépasser 2000 caractères.",
  },

  it: {
    title: "Valutazioni",
    subtitle:
      "Modera le recensioni ricevute e rispondi alle valutazioni approvate.",

    loading: "Caricamento valutazioni...",
    refresh: "Aggiorna",
    refreshing: "Aggiornamento...",

    shown: "Mostrate",
    approved: "Approvate",
    pending: "In attesa",
    displayedAverage:
      "Media mostrata",

    filterAll: "Tutte",
    filterPending: "In attesa",
    filterApproved: "Approvate",

    noRatings: "Nessuna valutazione",
    noPendingRatings:
      "Non ci sono valutazioni in attesa di approvazione.",
    noApprovedRatings:
      "Non ci sono valutazioni approvate.",
    noRatingsReceived:
      "Non sono ancora state ricevute valutazioni.",

    approvedStatus: "Approvata",
    pendingStatus: "In attesa",
    respondedStatus: "Risposta inviata",

    ratingNumber: "Valutazione",
    session: "Sessione",

    approve: "Approva",
    withdrawApproval:
      "Revoca approvazione",

    food: "Cibo",
    service: "Servizio",
    attention: "Accoglienza",

    customerComment:
      "Commento del cliente",
    noCustomerComment:
      "Il cliente non ha lasciato alcun commento.",

    photos: "Foto",
    viewPhoto: (index) =>
      `Visualizza foto ${index}`,

    establishmentResponse:
      "Risposta della struttura",
    responseHelp:
      "È possibile rispondere solo dopo l'approvazione della valutazione.",

    responsePlaceholder:
      "Scrivi una risposta al cliente...",
    responseDisabledPlaceholder:
      "Approva prima la valutazione per poter rispondere.",

    sendResponse:
      "Invia risposta",
    updateResponse:
      "Aggiorna risposta",

    moderated: "Moderata",
    responded: "Risposta inviata",
    userNumber: (id) =>
      `Utente #${id}`,

    scoreAria: (value) =>
      `${value} su 5`,

    loadError:
      "Impossibile caricare le valutazioni.",
    moderationError:
      "Impossibile moderare la valutazione.",
    responseError:
      "Impossibile salvare la risposta.",

    approveSuccess:
      "Valutazione approvata correttamente.",
    withdrawSuccess:
      "Approvazione della valutazione revocata correttamente.",

    responseCreatedSuccess:
      "Risposta salvata correttamente.",
    responseUpdatedSuccess:
      "Risposta aggiornata correttamente.",

    approveBeforeResponding:
      "Devi prima approvare la valutazione prima di rispondere.",
    emptyResponse:
      "La risposta non può essere vuota.",
    responseTooLong:
      "La risposta non può superare i 2000 caratteri.",
  },

  pt: {
    title: "Avaliações",
    subtitle:
      "Modere as opiniões recebidas e responda às avaliações aprovadas.",

    loading: "A carregar avaliações...",
    refresh: "Atualizar",
    refreshing: "A atualizar...",

    shown: "Apresentadas",
    approved: "Aprovadas",
    pending: "Pendentes",
    displayedAverage:
      "Média apresentada",

    filterAll: "Todas",
    filterPending: "Pendentes",
    filterApproved: "Aprovadas",

    noRatings: "Não há avaliações",
    noPendingRatings:
      "Não há avaliações pendentes de aprovação.",
    noApprovedRatings:
      "Não há avaliações aprovadas.",
    noRatingsReceived:
      "Ainda não foram recebidas avaliações.",

    approvedStatus: "Aprovada",
    pendingStatus: "Pendente",
    respondedStatus: "Respondida",

    ratingNumber: "Avaliação",
    session: "Sessão",

    approve: "Aprovar",
    withdrawApproval:
      "Retirar aprovação",

    food: "Comida",
    service: "Serviço",
    attention: "Atendimento",

    customerComment:
      "Comentário do cliente",
    noCustomerComment:
      "O cliente não deixou nenhum comentário.",

    photos: "Fotos",
    viewPhoto: (index) =>
      `Ver foto ${index}`,

    establishmentResponse:
      "Resposta do estabelecimento",
    responseHelp:
      "Só é possível responder quando a avaliação está aprovada.",

    responsePlaceholder:
      "Escreva uma resposta para o cliente...",
    responseDisabledPlaceholder:
      "Aprove primeiro a avaliação para poder responder.",

    sendResponse:
      "Enviar resposta",
    updateResponse:
      "Atualizar resposta",

    moderated: "Moderada",
    responded: "Respondida",
    userNumber: (id) =>
      `Utilizador #${id}`,

    scoreAria: (value) =>
      `${value} de 5`,

    loadError:
      "Não foi possível carregar as avaliações.",
    moderationError:
      "Não foi possível moderar a avaliação.",
    responseError:
      "Não foi possível guardar a resposta.",

    approveSuccess:
      "Avaliação aprovada com sucesso.",
    withdrawSuccess:
      "A aprovação da avaliação foi retirada.",

    responseCreatedSuccess:
      "Resposta registada com sucesso.",
    responseUpdatedSuccess:
      "Resposta atualizada com sucesso.",

    approveBeforeResponding:
      "Primeiro deve aprovar a avaliação antes de responder.",
    emptyResponse:
      "A resposta não pode estar vazia.",
    responseTooLong:
      "A resposta não pode exceder 2000 caracteres.",
  },
};