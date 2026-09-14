"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Bell,
  Check,
  ChevronDown,
  Globe2,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useAdminAuthStore,
} from "@/auth/admin-auth.store";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  ADMIN_LANGUAGES,
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import type {
  Language,
} from "@/types";

interface TopbarProps {
  sidebarCollapsed: boolean;
}

interface AdminNotification {
  id: number;
  establishmentId: number;
  userId: number | null;
  type: string;
  title: string;
  message: string;

  data:
    | Record<string, unknown>
    | null;

  read:
    | boolean
    | null;

  createdAt: string;
}

interface TopbarMessages {
  searchPlaceholder: string;
  notifications: string;
  unread: string;
  loadingNotifications: string;
  notificationsError: string;
  noNotifications: string;
  viewAllNotifications: string;
  userMenu: string;
  user: string;
  profile: string;
  settings: string;
  logout: string;
  language: string;
  languageMenu: string;
  now: string;
  languageChanged: string;
}

const MESSAGES: Record<
  Language,
  TopbarMessages
> = {
  es: {
    searchPlaceholder:
      "Buscar pedidos, productos, mesas...",
    notifications:
      "Notificaciones",
    unread:
      "sin leer",
    loadingNotifications:
      "Cargando notificaciones...",
    notificationsError:
      "No se pudieron cargar las notificaciones.",
    noNotifications:
      "No tienes notificaciones.",
    viewAllNotifications:
      "Ver todas las notificaciones",
    userMenu:
      "Menú de usuario",
    user:
      "Usuario",
    profile:
      "Mi perfil",
    settings:
      "Configuración",
    logout:
      "Cerrar sesión",
    language:
      "Idioma",
    languageMenu:
      "Seleccionar idioma",
    now:
      "Ahora",
    languageChanged:
      "Idioma cambiado con éxito.",
  },

  en: {
    searchPlaceholder:
      "Search orders, products, tables...",
    notifications:
      "Notifications",
    unread:
      "unread",
    loadingNotifications:
      "Loading notifications...",
    notificationsError:
      "Notifications could not be loaded.",
    noNotifications:
      "You have no notifications.",
    viewAllNotifications:
      "View all notifications",
    userMenu:
      "User menu",
    user:
      "User",
    profile:
      "My profile",
    settings:
      "Settings",
    logout:
      "Sign out",
    language:
      "Language",
    languageMenu:
      "Select language",
    now:
      "Now",
    languageChanged:
      "Language changed successfully.",
  },

  de: {
    searchPlaceholder:
      "Bestellungen, Produkte, Tische suchen...",
    notifications:
      "Benachrichtigungen",
    unread:
      "ungelesen",
    loadingNotifications:
      "Benachrichtigungen werden geladen...",
    notificationsError:
      "Benachrichtigungen konnten nicht geladen werden.",
    noNotifications:
      "Du hast keine Benachrichtigungen.",
    viewAllNotifications:
      "Alle Benachrichtigungen anzeigen",
    userMenu:
      "Benutzermenü",
    user:
      "Benutzer",
    profile:
      "Mein Profil",
    settings:
      "Einstellungen",
    logout:
      "Abmelden",
    language:
      "Sprache",
    languageMenu:
      "Sprache auswählen",
    now:
      "Jetzt",
    languageChanged:
      "Sprache erfolgreich geändert.",
  },

  fr: {
    searchPlaceholder:
      "Rechercher des commandes, produits, tables...",
    notifications:
      "Notifications",
    unread:
      "non lues",
    loadingNotifications:
      "Chargement des notifications...",
    notificationsError:
      "Impossible de charger les notifications.",
    noNotifications:
      "Vous n'avez aucune notification.",
    viewAllNotifications:
      "Voir toutes les notifications",
    userMenu:
      "Menu utilisateur",
    user:
      "Utilisateur",
    profile:
      "Mon profil",
    settings:
      "Paramètres",
    logout:
      "Se déconnecter",
    language:
      "Langue",
    languageMenu:
      "Sélectionner la langue",
    now:
      "Maintenant",
    languageChanged:
      "Langue modifiée avec succès.",
  },

  it: {
    searchPlaceholder:
      "Cerca ordini, prodotti, tavoli...",
    notifications:
      "Notifiche",
    unread:
      "non lette",
    loadingNotifications:
      "Caricamento notifiche...",
    notificationsError:
      "Impossibile caricare le notifiche.",
    noNotifications:
      "Non hai notifiche.",
    viewAllNotifications:
      "Visualizza tutte le notifiche",
    userMenu:
      "Menu utente",
    user:
      "Utente",
    profile:
      "Il mio profilo",
    settings:
      "Impostazioni",
    logout:
      "Disconnetti",
    language:
      "Lingua",
    languageMenu:
      "Seleziona lingua",
    now:
      "Adesso",
    languageChanged:
      "Lingua modificata con successo.",
  },

  pt: {
    searchPlaceholder:
      "Pesquisar pedidos, produtos, mesas...",
    notifications:
      "Notificações",
    unread:
      "não lidas",
    loadingNotifications:
      "A carregar notificações...",
    notificationsError:
      "Não foi possível carregar as notificações.",
    noNotifications:
      "Não tem notificações.",
    viewAllNotifications:
      "Ver todas as notificações",
    userMenu:
      "Menu do utilizador",
    user:
      "Utilizador",
    profile:
      "O meu perfil",
    settings:
      "Definições",
    logout:
      "Terminar sessão",
    language:
      "Idioma",
    languageMenu:
      "Selecionar idioma",
    now:
      "Agora",
    languageChanged:
      "Idioma alterado com sucesso.",
  },
};

function formatRelativeTime(
  value: string,
  language: Language,
  nowLabel: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const seconds =
    Math.floor(
      (
        Date.now() -
        date.getTime()
      ) /
        1000
    );

  if (
    seconds <
    60
  ) {
    return nowLabel;
  }

  const locale =
    ADMIN_LANGUAGE_LOCALES[
      language
    ];

  const relativeFormatter =
    new Intl.RelativeTimeFormat(
      locale,
      {
        numeric:
          "always",
      }
    );

  const minutes =
    Math.floor(
      seconds /
        60
    );

  if (
    minutes <
    60
  ) {
    return relativeFormatter.format(
      -minutes,
      "minute"
    );
  }

  const hours =
    Math.floor(
      minutes /
        60
    );

  if (
    hours <
    24
  ) {
    return relativeFormatter.format(
      -hours,
      "hour"
    );
  }

  const days =
    Math.floor(
      hours /
        24
    );

  if (
    days <
    7
  ) {
    return relativeFormatter.format(
      -days,
      "day"
    );
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      dateStyle:
        "short",
      timeStyle:
        "short",
    }
  ).format(
    date
  );
}

export default function Topbar({
  sidebarCollapsed,
}: TopbarProps) {
  const router =
    useRouter();

  const languageRef =
    useRef<HTMLDivElement>(
      null
    );

  const notificationsRef =
    useRef<HTMLDivElement>(
      null
    );

  const profileRef =
    useRef<HTMLDivElement>(
      null
    );

  const reloadTimerRef =
  useRef<number | null>(
    null
  );

  const user =
    useAdminAuthStore(
      (state) =>
        state.user
    );

  const clearSession =
    useAdminAuthStore(
      (state) =>
        state.clearSession
    );

  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const setLanguage =
    useAdminLanguageStore(
      (state) =>
        state.setLanguage
    );

  const messages =
    MESSAGES[
      language
    ];

  const currentLanguage =
    useMemo(
      () =>
        ADMIN_LANGUAGES.find(
          (option) =>
            option.code ===
            language
        ) ??
        ADMIN_LANGUAGES[0],
      [
        language,
      ]
    );

  const [
    showNotifications,
    setShowNotifications,
  ] =
    useState(
      false
    );

  const [
    showProfile,
    setShowProfile,
  ] =
    useState(
      false
    );

  const [
    showLanguages,
    setShowLanguages,
  ] =
    useState(
      false
    );

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState(
      ""
    );

  const [
    notifications,
    setNotifications,
  ] =
    useState<
      AdminNotification[]
    >(
      []
    );

  const [
    notificationsLoading,
    setNotificationsLoading,
  ] =
    useState(
      true
    );

  const [
    notificationsError,
    setNotificationsError,
  ] =
    useState(
      ""
    );

  useEffect(
    () => {
      document.documentElement.lang =
        language;
    },
    [
      language,
    ]
  );

  useEffect(
    () => {
      function handlePointerDown(
        event: PointerEvent
      ) {
        const target =
          event.target;

        if (
          !(
            target instanceof
            Node
          )
        ) {
          return;
        }

        if (
          showLanguages &&
          !languageRef.current?.contains(
            target
          )
        ) {
          setShowLanguages(
            false
          );
        }

        if (
          showNotifications &&
          !notificationsRef.current?.contains(
            target
          )
        ) {
          setShowNotifications(
            false
          );
        }

        if (
          showProfile &&
          !profileRef.current?.contains(
            target
          )
        ) {
          setShowProfile(
            false
          );
        }
      }

      document.addEventListener(
        "pointerdown",
        handlePointerDown
      );

      return () => {
        document.removeEventListener(
          "pointerdown",
          handlePointerDown
        );
      };
    },
    [
      showLanguages,
      showNotifications,
      showProfile,
    ]
  );

  useEffect(
    () => {
      return () => {
        if (
          reloadTimerRef.current
        ) {
          clearTimeout(
            reloadTimerRef.current
          );
        }
      };
    },
    []
  );

  const loadNotifications =
    useCallback(
      async () => {
        try {
          const response =
            await adminFetch(
              "/api/notifications"
            );

          const json =
            await response.json();

          if (
            !response.ok ||
            !json.success
          ) {
            setNotificationsError(
              MESSAGES[
                useAdminLanguageStore
                  .getState()
                  .language
              ].notificationsError
            );

            return;
          }

          const data =
            Array.isArray(
              json.data
            )
              ? json.data
              : [];

          setNotifications(
            data
          );

          setNotificationsError(
            ""
          );
        } catch (
          error
        ) {
          console.error(
            "Error loading notifications:",
            error
          );

          setNotificationsError(
            MESSAGES[
              useAdminLanguageStore
                .getState()
                .language
            ].notificationsError
          );
        } finally {
          setNotificationsLoading(
            false
          );
        }
      },
      []
    );

  useEffect(
    () => {
      void loadNotifications();

      const interval =
        window.setInterval(
          () => {
            void loadNotifications();
          },
          60000
        );

      return () => {
        window.clearInterval(
          interval
        );
      };
    },
    [
      loadNotifications,
    ]
  );

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.read !==
        true
    ).length;

  const visibleNotifications =
    notifications.slice(
      0,
      5
    );

  function changeLanguage(
    nextLanguage: Language
  ) {
    if (
      nextLanguage ===
      language
    ) {
      setShowLanguages(
        false
      );

      return;
    }

    setLanguage(
      nextLanguage
    );

    document.documentElement.lang =
      nextLanguage;

    setShowLanguages(
      false
    );

    setShowNotifications(
      false
    );

    setShowProfile(
      false
    );

    toast.success(
      MESSAGES[
        nextLanguage
      ].languageChanged,
      {
        duration:
          1200,
      }
    );

    reloadTimerRef.current =
      window.setTimeout(
        () => {
          window.location.reload();
        },
        650
      );
  }

  async function openNotification(
    notification: AdminNotification
  ) {
    setShowNotifications(
      false
    );

    if (
      notification.read !==
      true
    ) {
      try {
        const response =
          await adminFetch(
            `/api/notifications/${notification.id}`,
            {
              method:
                "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  read:
                    true,
                }),
            }
          );

        const json =
          await response.json();

        if (
          response.ok &&
          json.success
        ) {
          setNotifications(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  notification.id
                    ? {
                        ...item,
                        read:
                          true,
                      }
                    : item
              )
          );
        }
      } catch (
        error
      ) {
        console.error(
          "Error marking notification as read:",
          error
        );
      }
    }

    router.push(
      `/admin/notifications?notification=${notification.id}`
    );
  }

  function goToNotifications() {
    setShowNotifications(
      false
    );

    router.push(
      "/admin/notifications"
    );
  }

  function goToProfile() {
    setShowProfile(
      false
    );

    router.push(
      "/admin/profile"
    );
  }

  function goToSettings() {
    setShowProfile(
      false
    );

    router.push(
      "/admin/settings"
    );
  }

  function handleLogout() {
    setShowProfile(
      false
    );

    clearSession();

    if (
      typeof window !==
      "undefined"
    ) {
      window.localStorage.removeItem(
        "yamar-admin-auth"
      );
    }

    router.replace(
      "/admin"
    );

    router.refresh();
  }

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-30 transition-all duration-300 ${
        sidebarCollapsed
          ? "left-16"
          : "left-64"
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder={
                messages.searchPlaceholder
              }
              value={
                searchQuery
              }
              onChange={(
                event
              ) =>
                setSearchQuery(
                  event.target.value
                )
              }
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-6">
          <div
            ref={
              languageRef
            }
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                setShowLanguages(
                  !showLanguages
                );

                setShowNotifications(
                  false
                );

                setShowProfile(
                  false
                );
              }}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              aria-label={
                messages.languageMenu
              }
              aria-expanded={
                showLanguages
              }
            >
              <Globe2
                size={19}
                className="text-gray-600"
              />

              <span className="hidden sm:inline">
                {
                  currentLanguage.shortLabel
                }
              </span>

              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${
                  showLanguages
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {showLanguages && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {
                      messages.language
                    }
                  </p>
                </div>

                <div className="py-1">
                  {ADMIN_LANGUAGES.map(
                    (option) => {
                      const selected =
                        option.code ===
                        language;

                      return (
                        <button
                          key={
                            option.code
                          }
                          type="button"
                          onClick={() =>
                            changeLanguage(
                              option.code
                            )
                          }
                          className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                            selected
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 font-mono text-xs font-semibold uppercase text-gray-400">
                              {
                                option.shortLabel
                              }
                            </span>

                            <span>
                              {
                                option.label
                              }
                            </span>
                          </div>

                          {selected && (
                            <Check
                              size={16}
                              className="text-indigo-600"
                            />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            ref={
              notificationsRef
            }
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                const next =
                  !showNotifications;

                setShowNotifications(
                  next
                );

                setShowProfile(
                  false
                );

                setShowLanguages(
                  false
                );

                if (
                  next
                ) {
                  void loadNotifications();
                }
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={
                messages.notifications
              }
              aria-expanded={
                showNotifications
              }
            >
              <Bell
                size={20}
                className="text-gray-600"
              />

              {unreadCount >
                0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  aria-label={`${unreadCount} ${messages.unread}`}
                />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">
                    {
                      messages.notifications
                    }
                  </h3>

                  {unreadCount >
                    0 && (
                    <span className="text-xs font-medium text-indigo-600">
                      {
                        unreadCount
                      }{" "}
                      {
                        messages.unread
                      }
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationsLoading && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      {
                        messages.loadingNotifications
                      }
                    </div>
                  )}

                  {!notificationsLoading &&
                    notificationsError && (
                    <div className="px-4 py-6 text-center text-sm text-red-600">
                      {
                        messages.notificationsError
                      }
                    </div>
                  )}

                  {!notificationsLoading &&
                    !notificationsError &&
                    visibleNotifications.length ===
                      0 && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      {
                        messages.noNotifications
                      }
                    </div>
                  )}

                  {!notificationsLoading &&
                    !notificationsError &&
                    visibleNotifications.map(
                      (
                        notification
                      ) => (
                        <button
                          key={
                            notification.id
                          }
                          type="button"
                          onClick={() =>
                            void openNotification(
                              notification
                            )
                          }
                          className={`w-full px-4 py-3 text-left border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 ${
                            notification.read ===
                            true
                              ? "bg-white"
                              : "bg-indigo-50/50"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {notification.read !==
                              true && (
                              <span
                                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600"
                                aria-hidden="true"
                              />
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {
                                  notification.title
                                }
                              </p>

                              <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                {
                                  notification.message
                                }
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {formatRelativeTime(
                                  notification.createdAt,
                                  language,
                                  messages.now
                                )}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    )}
                </div>

                <div className="px-4 py-3 bg-gray-50 text-center">
                  <button
                    type="button"
                    onClick={
                      goToNotifications
                    }
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {
                      messages.viewAllNotifications
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            ref={
              profileRef
            }
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                setShowProfile(
                  !showProfile
                );

                setShowNotifications(
                  false
                );

                setShowLanguages(
                  false
                );
              }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={
                messages.userMenu
              }
              aria-expanded={
                showProfile
              }
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User
                  size={16}
                  className="text-indigo-600"
                />
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name ??
                    messages.user}
                </p>

                <p className="text-xs text-gray-500">
                  {user?.email ??
                    ""}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${
                  showProfile
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={
                      goToProfile
                    }
                    className="w-full px-4 py-2 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50"
                  >
                    <User
                      size={16}
                    />

                    <span className="text-sm">
                      {
                        messages.profile
                      }
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={
                      goToSettings
                    }
                    className="w-full px-4 py-2 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50"
                  >
                    <Settings
                      size={16}
                    />

                    <span className="text-sm">
                      {
                        messages.settings
                      }
                    </span>
                  </button>

                  <hr className="my-1 border-gray-100" />

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="w-full px-4 py-2 flex items-center gap-3 text-left text-red-600 hover:bg-red-50"
                  >
                    <LogOut
                      size={16}
                    />

                    <span className="text-sm">
                      {
                        messages.logout
                      }
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}