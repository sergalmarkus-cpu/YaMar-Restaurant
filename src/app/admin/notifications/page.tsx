'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useSearchParams,
} from 'next/navigation';

import {
  Bell,
  Check,
  Trash2,
} from 'lucide-react';

import {
  adminFetch,
} from '@/lib/api/admin-fetch';

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

function formatDate(
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

  return new Intl.DateTimeFormat(
    'es-ES',
    {
      dateStyle:
        'medium',

      timeStyle:
        'short',
    }
  ).format(
    date
  );
}

export default function NotificationsPage() {
  const searchParams =
    useSearchParams();

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
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState(
      ''
    );

  const [
    processingId,
    setProcessingId,
  ] =
    useState<
      number | null
    >(
      null
    );

  const selectedId =
    useMemo(
      () => {
        const value =
          searchParams.get(
            'notification'
          );

        if (
          value ===
          null
        ) {
          return null;
        }

        const parsed =
          Number(
            value
          );

        if (
          !Number.isInteger(
            parsed
          ) ||
          parsed <=
            0
        ) {
          return null;
        }

        return parsed;
      },
      [
        searchParams,
      ]
    );

  const loadNotifications =
    useCallback(
      async () => {
        setError(
          ''
        );

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
            setError(
              json.error ||
                'No se pudieron cargar las notificaciones.'
            );

            return;
          }

          setNotifications(
            Array.isArray(
              json.data
            )
              ? json.data
              : []
          );
        } catch (
          error
        ) {
          console.error(
            'Error loading notifications:',
            error
          );

          setError(
            'No se pudieron cargar las notificaciones.'
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(
    () => {
      void loadNotifications();
    },
    [
      loadNotifications,
    ]
  );

  async function markAsRead(
    id: number
  ) {
    setProcessingId(
      id
    );

    setError(
      ''
    );

    try {
      const response =
        await adminFetch(
          `/api/notifications/${id}`,
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
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            'No se pudo actualizar la notificación.'
        );

        return;
      }

      setNotifications(
        (
          current
        ) =>
          current.map(
            (
              notification
            ) =>
              notification.id ===
              id
                ? {
                    ...notification,
                    read:
                      true,
                  }
                : notification
          )
      );
    } catch (
      error
    ) {
      console.error(
        'Error marking notification as read:',
        error
      );

      setError(
        'No se pudo actualizar la notificación.'
      );
    } finally {
      setProcessingId(
        null
      );
    }
  }

  async function deleteNotification(
    id: number
  ) {
    if (
      !window.confirm(
        '¿Eliminar esta notificación definitivamente?'
      )
    ) {
      return;
    }

    setProcessingId(
      id
    );

    setError(
      ''
    );

    try {
      const response =
        await adminFetch(
          `/api/notifications/${id}`,
          {
            method:
              'DELETE',
          }
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        setError(
          json.error ||
            'No se pudo eliminar la notificación.'
        );

        return;
      }

      setNotifications(
        (
          current
        ) =>
          current.filter(
            (
              notification
            ) =>
              notification.id !==
              id
          )
      );
    } catch (
      error
    ) {
      console.error(
        'Error deleting notification:',
        error
      );

      setError(
        'No se pudo eliminar la notificación.'
      );
    } finally {
      setProcessingId(
        null
      );
    }
  }

  const unreadCount =
    notifications.filter(
      (
        notification
      ) =>
        notification.read !==
        true
    ).length;

  if (
    loading
  ) {
    return (
      <div className="p-6">
        Cargando notificaciones...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <Bell
            size={
              28
            }
            className="text-indigo-600"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Notificaciones
            </h1>

            <p className="text-sm text-gray-500">
              Historial real de notificaciones del establecimiento
            </p>
          </div>
        </div>

        {unreadCount >
          0 && (
          <p className="mt-3 text-sm font-medium text-indigo-600">
            {
              unreadCount
            }{' '}
            {unreadCount ===
            1
              ? 'notificación sin leer'
              : 'notificaciones sin leer'}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {
            error
          }
        </div>
      )}

      {notifications.length ===
        0 && (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <Bell
            size={
              36
            }
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-4 font-semibold text-gray-900">
            No tienes notificaciones
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Las notificaciones reales aparecerán aquí cuando sean generadas por el sistema.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map(
          (
            notification
          ) => {
            const selected =
              notification.id ===
              selectedId;

            const unread =
              notification.read !==
              true;

            const processing =
              processingId ===
              notification.id;

            return (
              <article
                key={
                  notification.id
                }
                className={`rounded-xl border bg-white p-5 shadow-sm transition ${
                  selected
                    ? 'border-indigo-400 ring-2 ring-indigo-100'
                    : unread
                      ? 'border-indigo-200'
                      : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {unread && (
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600"
                          aria-label="Sin leer"
                        />
                      )}

                      <h2 className="font-semibold text-gray-900">
                        {
                          notification.title
                        }
                      </h2>
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                      {
                        notification.message
                      }
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        {formatDate(
                          notification.createdAt
                        )}
                      </span>

                      <span>
                        Tipo:{' '}
                        {
                          notification.type
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {unread && (
                      <button
                        type="button"
                        disabled={
                          processing
                        }
                        onClick={() =>
                          void markAsRead(
                            notification.id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check
                          size={
                            16
                          }
                        />

                        Marcar como leída
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={
                        processing
                      }
                      onClick={() =>
                        void deleteNotification(
                          notification.id
                        )
                      }
                      aria-label="Eliminar notificación"
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2
                        size={
                          18
                        }
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          }
        )}
      </div>
    </div>
  );
}