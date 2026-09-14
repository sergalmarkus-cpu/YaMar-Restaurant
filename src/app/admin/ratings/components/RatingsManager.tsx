"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  ImageIcon,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Star,
  XCircle,
} from "lucide-react";

import {
  ADMIN_LANGUAGE_LOCALES,
} from "@/config/admin-languages";

import {
  ADMIN_RATINGS_MESSAGES,
  type AdminRatingLanguage,
} from "@/config/admin-ratings-i18n";

import {
  adminFetch,
} from "@/lib/api/admin-fetch";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

type RatingFilter =
  | "all"
  | "pending"
  | "approved";

interface RatingRow {
  id: number;
  sessionId: string;
  establishmentId: number;

  foodRating: number;
  serviceRating: number;
  attentionRating: number;

  comment:
    | string
    | null;

  photos:
    | string[]
    | null;

  approved:
    boolean;

  moderatedBy:
    | number
    | null;

  moderatedAt:
    | string
    | null;

  response:
    | string
    | null;

  respondedBy:
    | number
    | null;

  respondedAt:
    | string
    | null;

  createdAt:
    string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

function getAverageScore(
  rating:
    RatingRow
) {
  return (
    (
      rating.foodRating +
      rating.serviceRating +
      rating.attentionRating
    ) /
    3
  );
}

function formatDate(
  value:
    | string
    | null
    | undefined,
  language:
    AdminRatingLanguage
) {
  if (
    !value
  ) {
    return "—";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleString(
    ADMIN_LANGUAGE_LOCALES[
      language
    ],
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    }
  );
}

function ScoreStars({
  value,
  ariaLabel,
}: {
  value: number;
  ariaLabel: string;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={
        ariaLabel
      }
    >
      {[
        1,
        2,
        3,
        4,
        5,
      ].map(
        (
          star
        ) => (
          <Star
            key={
              star
            }
            size={
              15
            }
            className={
              star <=
              value
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        )
      )}
    </div>
  );
}

export default function RatingsManager() {
  const language =
    useAdminLanguageStore(
      (
        state
      ) =>
        state.language
    ) as AdminRatingLanguage;

  const messages =
    ADMIN_RATINGS_MESSAGES[
      language
    ];

  const [
    ratings,
    setRatings,
  ] =
    useState<
      RatingRow[]
    >([]);

  const [
    filter,
    setFilter,
  ] =
    useState<
      RatingFilter
    >(
      "all"
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(
      false
    );

  const [
    moderatingId,
    setModeratingId,
  ] =
    useState<
      number |
      null
    >(
      null
    );

  const [
    respondingId,
    setRespondingId,
  ] =
    useState<
      number |
      null
    >(
      null
    );

  const [
    responseDrafts,
    setResponseDrafts,
  ] =
    useState<
      Record<
        number,
        string
      >
    >({});

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const [
    success,
    setSuccess,
  ] =
    useState(
      ""
    );

  function currentLanguage():
    AdminRatingLanguage {
    return useAdminLanguageStore
      .getState()
      .language as
      AdminRatingLanguage;
  }

  function currentMessages() {
    return ADMIN_RATINGS_MESSAGES[
      currentLanguage()
    ];
  }

  const loadRatings =
    useCallback(
      async (
        currentFilter:
          RatingFilter,
        silent =
          false
      ) => {
        const activeMessages =
          currentMessages();

        if (
          silent
        ) {
          setRefreshing(
            true
          );
        } else {
          setLoading(
            true
          );
        }

        setError(
          ""
        );

        try {
          let url =
            "/api/ratings";

          if (
            currentFilter ===
            "pending"
          ) {
            url +=
              "?approved=false";
          }

          if (
            currentFilter ===
            "approved"
          ) {
            url +=
              "?approved=true";
          }

          const response =
            await adminFetch(
              url
            );

          const json =
            (await response.json()) as
              ApiResponse<
                RatingRow[]
              >;

          if (
            !response.ok ||
            !json.success
          ) {
            setError(
              activeMessages
                .loadError
            );

            return;
          }

          const data =
            Array.isArray(
              json.data
            )
              ? json.data
              : [];

          setRatings(
            data
          );

          setResponseDrafts(
            (
              current
            ) => {
              const next = {
                ...current,
              };

              for (
                const rating
                of data
              ) {
                if (
                  next[
                    rating.id
                  ] ===
                  undefined
                ) {
                  next[
                    rating.id
                  ] =
                    rating.response ??
                    "";
                }
              }

              return next;
            }
          );
        } catch (
          loadError
        ) {
          console.error(
            "Error loading ratings:",
            loadError
          );

          setError(
            activeMessages
              .loadError
          );
        } finally {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      },
      []
    );

  useEffect(
    () => {
      void loadRatings(
        filter
      );
    },
    [
      filter,
      loadRatings,
    ]
  );

  const approvedCount =
    useMemo(
      () =>
        ratings.filter(
          (
            rating
          ) =>
            rating.approved
        ).length,
      [
        ratings,
      ]
    );

  const pendingCount =
    useMemo(
      () =>
        ratings.filter(
          (
            rating
          ) =>
            !rating.approved
        ).length,
      [
        ratings,
      ]
    );

  const averageRating =
    useMemo(
      () => {
        if (
          ratings.length ===
          0
        ) {
          return 0;
        }

        const total =
          ratings.reduce(
            (
              sum,
              rating
            ) =>
              sum +
              getAverageScore(
                rating
              ),
            0
          );

        return (
          total /
          ratings.length
        );
      },
      [
        ratings,
      ]
    );

  async function moderateRating(
    rating:
      RatingRow,
    approved:
      boolean
  ) {
    const activeMessages =
      currentMessages();

    setModeratingId(
      rating.id
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );

    try {
      const response =
        await adminFetch(
          `/api/ratings/${rating.id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                approved,
              }),
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            RatingRow
          >;

      if (
        !response.ok ||
        !json.success ||
        !json.data
      ) {
        setError(
          activeMessages
            .moderationError
        );

        return;
      }

      const updatedRating =
        json.data;

      if (
        filter ===
          "pending" &&
        approved
      ) {
        setRatings(
          (
            current
          ) =>
            current.filter(
              (
                item
              ) =>
                item.id !==
                rating.id
            )
        );
      } else if (
        filter ===
          "approved" &&
        !approved
      ) {
        setRatings(
          (
            current
          ) =>
            current.filter(
              (
                item
              ) =>
                item.id !==
                rating.id
            )
        );
      } else {
        setRatings(
          (
            current
          ) =>
            current.map(
              (
                item
              ) =>
                item.id ===
                rating.id
                  ? updatedRating
                  : item
            )
        );
      }

      setSuccess(
        approved
          ? activeMessages
              .approveSuccess
          : activeMessages
              .withdrawSuccess
      );
    } catch (
      moderationError
    ) {
      console.error(
        "Error moderating rating:",
        moderationError
      );

      setError(
        activeMessages
          .moderationError
      );
    } finally {
      setModeratingId(
        null
      );
    }
  }

  async function sendResponse(
    rating:
      RatingRow
  ) {
    const activeMessages =
      currentMessages();

    const responseText =
      (
        responseDrafts[
          rating.id
        ] ??
        ""
      ).trim();

    if (
      !rating.approved
    ) {
      setError(
        activeMessages
          .approveBeforeResponding
      );

      return;
    }

    if (
      !responseText
    ) {
      setError(
        activeMessages
          .emptyResponse
      );

      return;
    }

    if (
      responseText.length >
      2000
    ) {
      setError(
        activeMessages
          .responseTooLong
      );

      return;
    }

    setRespondingId(
      rating.id
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );

    try {
      const response =
        await adminFetch(
          `/api/ratings/${rating.id}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                response:
                  responseText,
              }),
          }
        );

      const json =
        (await response.json()) as
          ApiResponse<
            RatingRow
          >;

      if (
        !response.ok ||
        !json.success ||
        !json.data
      ) {
        setError(
          activeMessages
            .responseError
        );

        return;
      }

      const updatedRating =
        json.data;

      setRatings(
        (
          current
        ) =>
          current.map(
            (
              item
            ) =>
              item.id ===
              rating.id
                ? updatedRating
                : item
          )
      );

      setResponseDrafts(
        (
          current
        ) => ({
          ...current,

          [rating.id]:
            updatedRating.response ??
            responseText,
        })
      );

      setSuccess(
        rating.response
          ? activeMessages
              .responseUpdatedSuccess
          : activeMessages
              .responseCreatedSuccess
      );
    } catch (
      responseError
    ) {
      console.error(
        "Error responding to rating:",
        responseError
      );

      setError(
        activeMessages
          .responseError
      );
    } finally {
      setRespondingId(
        null
      );
    }
  }

  function updateResponseDraft(
    ratingId:
      number,
    value:
      string
  ) {
    setResponseDrafts(
      (
        current
      ) => ({
        ...current,

        [ratingId]:
          value,
      })
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );
  }

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={
              22
            }
            className="animate-spin"
          />

          <span>
            {
              messages.loading
            }
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Star
              size={
                22
              }
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {
                messages.title
              }
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {
                messages.subtitle
              }
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadRatings(
              filter,
              true
            )
          }
          disabled={
            refreshing
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={
              17
            }
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? messages.refreshing
            : messages.refresh}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle
            size={
              19
            }
            className="mt-0.5 shrink-0"
          />

          <span>
            {
              error
            }
          </span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check
            size={
              19
            }
            className="mt-0.5 shrink-0"
          />

          <span>
            {
              success
            }
          </span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages.shown
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {
              ratings.length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages.approved
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {
              approvedCount
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages.pending
            }
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {
              pendingCount
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {
              messages
                .displayedAverage
            }
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {
                averageRating.toFixed(
                  1
                )
              }
            </span>

            <Star
              size={
                21
              }
              className="fill-amber-400 text-amber-400"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setFilter(
                "all"
              )
            }
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              filter ===
              "all"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {
              messages.filterAll
            }
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter(
                "pending"
              )
            }
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              filter ===
              "pending"
                ? "bg-amber-500 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {
              messages
                .filterPending
            }
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter(
                "approved"
              )
            }
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              filter ===
              "approved"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {
              messages
                .filterApproved
            }
          </button>
        </div>
      </div>

      {ratings.length ===
      0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
          <MessageSquare
            size={
              34
            }
            className="text-slate-400"
          />

          <h2 className="mt-4 font-semibold text-slate-900">
            {
              messages.noRatings
            }
          </h2>

          <p className="mt-1 max-w-md text-sm text-slate-500">
            {filter ===
            "pending"
              ? messages
                  .noPendingRatings
              : filter ===
                  "approved"
                ? messages
                    .noApprovedRatings
                : messages
                    .noRatingsReceived}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {ratings.map(
            (
              rating
            ) => {
              const average =
                getAverageScore(
                  rating
                );

              const photos =
                Array.isArray(
                  rating.photos
                )
                  ? rating.photos
                  : [];

              const draft =
                responseDrafts[
                  rating.id
                ] ??
                "";

              return (
                <article
                  key={
                    rating.id
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Star
                            size={
                              19
                            }
                            className="fill-amber-400 text-amber-400"
                          />

                          <span className="text-lg font-bold text-slate-900">
                            {
                              average.toFixed(
                                1
                              )
                            }
                          </span>

                          <span className="text-sm text-slate-500">
                            / 5
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            rating.approved
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {rating.approved
                            ? messages
                                .approvedStatus
                            : messages
                                .pendingStatus}
                        </span>

                        {rating.response && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {
                              messages
                                .respondedStatus
                            }
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                        <span>
                          {
                            messages
                              .ratingNumber
                          }{" "}
                          #
                          {
                            rating.id
                          }
                        </span>

                        <span>
                          {
                            formatDate(
                              rating.createdAt,
                              language
                            )
                          }
                        </span>

                        <span className="max-w-[260px] truncate">
                          {
                            messages.session
                          }
                          :{" "}
                          {
                            rating.sessionId
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!rating.approved && (
                        <button
                          type="button"
                          onClick={() =>
                            void moderateRating(
                              rating,
                              true
                            )
                          }
                          disabled={
                            moderatingId ===
                            rating.id
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {moderatingId ===
                          rating.id ? (
                            <Loader2
                              size={
                                16
                              }
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle2
                              size={
                                16
                              }
                            />
                          )}

                          {
                            messages.approve
                          }
                        </button>
                      )}

                      {rating.approved && (
                        <button
                          type="button"
                          onClick={() =>
                            void moderateRating(
                              rating,
                              false
                            )
                          }
                          disabled={
                            moderatingId ===
                            rating.id
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {moderatingId ===
                          rating.id ? (
                            <Loader2
                              size={
                                16
                              }
                              className="animate-spin"
                            />
                          ) : (
                            <XCircle
                              size={
                                16
                              }
                            />
                          )}

                          {
                            messages
                              .withdrawApproval
                          }
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {
                          messages.food
                        }
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <ScoreStars
                          value={
                            rating.foodRating
                          }
                          ariaLabel={
                            messages.scoreAria(
                              rating.foodRating
                            )
                          }
                        />

                        <strong className="text-sm text-slate-800">
                          {
                            rating.foodRating
                          }
                          /5
                        </strong>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {
                          messages.service
                        }
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <ScoreStars
                          value={
                            rating.serviceRating
                          }
                          ariaLabel={
                            messages.scoreAria(
                              rating.serviceRating
                            )
                          }
                        />

                        <strong className="text-sm text-slate-800">
                          {
                            rating.serviceRating
                          }
                          /5
                        </strong>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {
                          messages.attention
                        }
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <ScoreStars
                          value={
                            rating.attentionRating
                          }
                          ariaLabel={
                            messages.scoreAria(
                              rating.attentionRating
                            )
                          }
                        />

                        <strong className="text-sm text-slate-800">
                          {
                            rating.attentionRating
                          }
                          /5
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {
                        messages
                          .customerComment
                      }
                    </h3>

                    {rating.comment ? (
                      <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                        {
                          rating.comment
                        }
                      </p>
                    ) : (
                      <p className="mt-2 text-sm italic text-slate-500">
                        {
                          messages
                            .noCustomerComment
                        }
                      </p>
                    )}
                  </div>

                  {photos.length >
                    0 && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2">
                        <ImageIcon
                          size={
                            17
                          }
                          className="text-slate-500"
                        />

                        <h3 className="text-sm font-semibold text-slate-900">
                          {
                            messages.photos
                          }{" "}
                          (
                          {
                            photos.length
                          }
                          )
                        </h3>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {photos.map(
                          (
                            photo,
                            index
                          ) => (
                            <a
                              key={`${rating.id}-${index}`}
                              href={
                                photo
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                            >
                              {
                                messages.viewPhoto(
                                  index +
                                    1
                                )
                              }
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 border-t border-slate-200 pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {
                            messages
                              .establishmentResponse
                          }
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            messages
                              .responseHelp
                          }
                        </p>
                      </div>

                      {rating.respondedAt && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock3
                            size={
                              14
                            }
                          />

                          {
                            formatDate(
                              rating.respondedAt,
                              language
                            )
                          }
                        </div>
                      )}
                    </div>

                    <textarea
                      rows={
                        4
                      }
                      maxLength={
                        2000
                      }
                      disabled={
                        !rating.approved
                      }
                      value={
                        draft
                      }
                      onChange={(
                        event
                      ) =>
                        updateResponseDraft(
                          rating.id,
                          event.target
                            .value
                        )
                      }
                      placeholder={
                        rating.approved
                          ? messages
                              .responsePlaceholder
                          : messages
                              .responseDisabledPlaceholder
                      }
                      className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    />

                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <span
                        className={`text-xs ${
                          draft.length >
                          2000
                            ? "text-red-600"
                            : "text-slate-400"
                        }`}
                      >
                        {
                          draft.length
                        }
                        /2000
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          void sendResponse(
                            rating
                          )
                        }
                        disabled={
                          !rating.approved ||
                          !draft.trim() ||
                          draft.trim().length >
                            2000 ||
                          respondingId ===
                            rating.id
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {respondingId ===
                        rating.id ? (
                          <Loader2
                            size={
                              16
                            }
                            className="animate-spin"
                          />
                        ) : (
                          <Send
                            size={
                              16
                            }
                          />
                        )}

                        {rating.response
                          ? messages
                              .updateResponse
                          : messages
                              .sendResponse}
                      </button>
                    </div>
                  </div>

                  {(rating.moderatedAt ||
                    rating.respondedAt) && (
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-400">
                      {rating.moderatedAt && (
                        <span>
                          {
                            messages.moderated
                          }
                          :{" "}
                          {
                            formatDate(
                              rating.moderatedAt,
                              language
                            )
                          }

                          {rating.moderatedBy
                            ? ` · ${messages.userNumber(
                                rating.moderatedBy
                              )}`
                            : ""}
                        </span>
                      )}

                      {rating.respondedAt && (
                        <span>
                          {
                            messages.responded
                          }
                          :{" "}
                          {
                            formatDate(
                              rating.respondedAt,
                              language
                            )
                          }

                          {rating.respondedBy
                            ? ` · ${messages.userNumber(
                                rating.respondedBy
                              )}`
                            : ""}
                        </span>
                      )}
                    </div>
                  )}
                </article>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}