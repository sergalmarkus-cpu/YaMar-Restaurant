'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  User,
} from 'lucide-react';

import {
  useAdminAuthStore,
} from '@/auth/admin-auth.store';

import {
  adminFetch,
} from '@/lib/api/admin-fetch';

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
  data: Record<
    string,
    unknown
  > | null;
  read: boolean | null;
  createdAt: string;
}

function formatRelativeTime(
  value: string
) {
  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '';
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
    return 'Ahora';
  }

  const minutes =
    Math.floor(
      seconds /
        60
    );

  if (
    minutes <
    60
  ) {
    return `Hace ${minutes} min`;
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
    return `Hace ${hours} h`;
  }

  const days =
    Math.floor(
      hours /
        24
    );

  if (
    days ===
    1
  ) {
    return 'Hace 1 día';
  }

  if (
    days <
    7
  ) {
    return `Hace ${days} días`;
  }

  return new Intl.DateTimeFormat(
    'es-ES',
    {
      dateStyle:
        'short',

      timeStyle:
        'short',
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

  const user =
    useAdminAuthStore(
      (
        state
      ) =>
        state.user
    );

  const clearSession =
    useAdminAuthStore(
      (
        state
      ) =>
        state.clearSession
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
    searchQuery,
    setSearchQuery,
  ] =
    useState(
      ''
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
      ''
    );

  const loadNotifications =
    useCallback(
      async () => {
        try {
          const response =
            await adminFetch(
              '/api/notifications'
            );

          const json =
            await response.json();

          if (
            !response.ok ||
            !json.success
          ) {
            setNotificationsError(
              json.error ||
                'No se pudieron cargar las notificaciones.'
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
            ''
          );
        } catch (
          error
        ) {
          console.error(
            'Error loading notifications:',
            error
          );

          setNotificationsError(
            'No se pudieron cargar las notificaciones.'
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
      (
        notification
      ) =>
        notification.read !==
        true
    ).length;

  const visibleNotifications =
    notifications.slice(
      0,
      5
    );

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
                'PUT',

              headers: {
                'Content-Type':
                  'application/json',
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
            (
              current
            ) =>
              current.map(
                (
                  item
                ) =>
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
          'Error marking notification as read:',
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
      '/admin/notifications'
    );
  }

  function goToProfile() {
    setShowProfile(
      false
    );

    router.push(
      '/admin/profile'
    );
  }

  function goToSettings() {
    setShowProfile(
      false
    );

    router.push(
      '/admin/settings'
    );
  }

  function handleLogout() {
    setShowProfile(
      false
    );

    clearSession();

    if (
      typeof window !==
      'undefined'
    ) {
      window.localStorage.removeItem(
        'yamar-admin-auth'
      );
    }

    router.replace(
      '/admin'
    );

    router.refresh();
  }

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-30 transition-all duration-300
        ${
          sidebarCollapsed
            ? 'left-16'
            : 'left-64'
        }
      `}
    >
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search
              size={
                18
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Buscar pedidos, productos, mesas..."
              value={
                searchQuery
              }
              onChange={(
                event
              ) =>
                setSearchQuery(
                  event
                    .target
                    .value
                )
              }
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          <div className="relative">
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

                if (
                  next
                ) {
                  void loadNotifications();
                }
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notificaciones"
              aria-expanded={
                showNotifications
              }
            >
              <Bell
                size={
                  20
                }
                className="text-gray-600"
              />

              {unreadCount >
                0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  aria-label={`${unreadCount} notificaciones sin leer`}
                />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">
                    Notificaciones
                  </h3>

                  {unreadCount >
                    0 && (
                    <span className="text-xs font-medium text-indigo-600">
                      {
                        unreadCount
                      }{' '}
                      sin leer
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationsLoading && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      Cargando notificaciones...
                    </div>
                  )}

                  {!notificationsLoading &&
                    notificationsError && (
                    <div className="px-4 py-6 text-center text-sm text-red-600">
                      {
                        notificationsError
                      }
                    </div>
                  )}

                  {!notificationsLoading &&
                    !notificationsError &&
                    visibleNotifications.length ===
                      0 && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      No tienes notificaciones.
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
                              ? 'bg-white'
                              : 'bg-indigo-50/50'
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
                                  notification.createdAt
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
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfile(
                  !showProfile
                );

                setShowNotifications(
                  false
                );
              }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menú de usuario"
              aria-expanded={
                showProfile
              }
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User
                  size={
                    16
                  }
                  className="text-indigo-600"
                />
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name ??
                    'Usuario'}
                </p>

                <p className="text-xs text-gray-500">
                  {user?.email ??
                    ''}
                </p>
              </div>

              <ChevronDown
                size={
                  16
                }
                className={`text-gray-400 transition-transform ${
                  showProfile
                    ? 'rotate-180'
                    : ''
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
                      size={
                        16
                      }
                    />

                    <span className="text-sm">
                      Mi perfil
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
                      size={
                        16
                      }
                    />

                    <span className="text-sm">
                      Configuración
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
                      size={
                        16
                      }
                    />

                    <span className="text-sm">
                      Cerrar sesión
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