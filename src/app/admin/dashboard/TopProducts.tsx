import Link from "next/link";

interface TranslatedText {
  es?: string;
  en?: string;
  de?: string;
  fr?: string;
  it?: string;
  pt?: string;
}

interface DashboardProduct {
  productId: number;
  name: unknown;
  quantity: number;
  revenue: number;
}

interface Props {
  products: DashboardProduct[];
  currency: string;
}

function getProductName(
  value: unknown
) {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    value &&
    typeof value ===
    "object"
  ) {
    const translated =
      value as
        TranslatedText;

    return (
      translated.es ||
      translated.en ||
      translated.fr ||
      translated.de ||
      translated.it ||
      translated.pt ||
      "Producto"
    );
  }

  return "Producto";
}

function formatMoney(
  value: number,
  currency: string
) {
  try {
    return new Intl.NumberFormat(
      "es-ES",
      {
        style:
          "currency",

        currency,
      }
    ).format(
      value
    );
  } catch {
    return `${value.toFixed(
      2
    )} ${currency}`;
  }
}

export default function TopProducts({
  products,
  currency,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Productos más vendidos
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Ranking de los últimos 7 días.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          Ver productos
        </Link>

      </div>

      {products.length ===
      0 ? (
        <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Todavía no hay ventas suficientes para generar el ranking.
        </div>
      ) : (
        <div className="space-y-3">

          {products.map(
            (
              product,
              index
            ) => (
              <div
                key={
                  product.productId
                }
                className="flex items-center justify-between rounded-xl p-3 transition hover:bg-slate-50"
              >

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                    {
                      index +
                      1
                    }
                  </div>

                  <div className="min-w-0">

                    <p className="truncate font-medium text-slate-900">
                      {
                        getProductName(
                          product.name
                        )
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {
                        product.quantity
                      }
                      {" "}
                      {
                        product.quantity ===
                        1
                          ? "unidad vendida"
                          : "unidades vendidas"
                      }
                    </p>

                  </div>

                </div>

                <div className="ml-4 shrink-0 text-right">

                  <p className="font-semibold text-slate-900">
                    {
                      formatMoney(
                        product.revenue,
                        currency
                      )
                    }
                  </p>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}