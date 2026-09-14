"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  BarChart3,
  Building2,
  Calendar,
  ChefHat,
  CreditCard,
  Gift,
  Grid3X3,
  History,
  Languages,
  Layers,
  LayoutDashboard,
  MapPin,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  UserCog,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import {
  useAdminLanguageStore,
} from "@/store/admin-language.store";

import type {
  Language,
} from "@/types";

type MenuKey =
  | "dashboard"
  | "restaurant"
  | "establishments"
  | "areas"
  | "tables"
  | "qrCodes"
  | "menuSection"
  | "menus"
  | "categories"
  | "products"
  | "modifiers"
  | "promotions"
  | "ordersSection"
  | "orders"
  | "kitchen"
  | "history"
  | "customers"
  | "ratings"
  | "loyalty"
  | "staffSection"
  | "users"
  | "roles"
  | "shifts"
  | "paymentsSection"
  | "payments"
  | "invoices"
  | "paymentMethods"
  | "analyticsSection"
  | "sales"
  | "analyticsProducts"
  | "analyticsClients"
  | "configuration"
  | "general"
  | "languages"
  | "integrations";

interface MenuItem {
  key: MenuKey;
  icon: ReactNode;
  href?: string;
  children?: MenuItem[];
}

const LABELS: Record<
  Language,
  Record<MenuKey, string>
> = {
  es: {
    dashboard: "Dashboard",
    restaurant: "Restaurante",
    establishments: "Establecimientos",
    areas: "Áreas",
    tables: "Mesas",
    qrCodes: "Códigos QR",
    menuSection: "Carta",
    menus: "Cartas",
    categories: "Categorías",
    products: "Productos",
    modifiers: "Modificadores",
    promotions: "Promociones",
    ordersSection: "Pedidos",
    orders: "Pedidos",
    kitchen: "Cocina",
    history: "Historial",
    customers: "Clientes",
    ratings: "Valoraciones",
    loyalty: "Fidelización",
    staffSection: "Personal",
    users: "Usuarios",
    roles: "Roles",
    shifts: "Turnos",
    paymentsSection: "Pagos",
    payments: "Cobros",
    invoices: "Facturas",
    paymentMethods: "Métodos de pago",
    analyticsSection: "Analíticas",
    sales: "Ventas",
    analyticsProducts: "Productos",
    analyticsClients: "Clientes",
    configuration: "Configuración",
    general: "General",
    languages: "Idiomas",
    integrations: "Integraciones",
  },

  en: {
    dashboard: "Dashboard",
    restaurant: "Restaurant",
    establishments: "Establishments",
    areas: "Areas",
    tables: "Tables",
    qrCodes: "QR codes",
    menuSection: "Menu",
    menus: "Menus",
    categories: "Categories",
    products: "Products",
    modifiers: "Modifiers",
    promotions: "Promotions",
    ordersSection: "Orders",
    orders: "Orders",
    kitchen: "Kitchen",
    history: "History",
    customers: "Customers",
    ratings: "Ratings",
    loyalty: "Loyalty",
    staffSection: "Staff",
    users: "Users",
    roles: "Roles",
    shifts: "Shifts",
    paymentsSection: "Payments",
    payments: "Payments",
    invoices: "Invoices",
    paymentMethods: "Payment methods",
    analyticsSection: "Analytics",
    sales: "Sales",
    analyticsProducts: "Products",
    analyticsClients: "Customers",
    configuration: "Settings",
    general: "General",
    languages: "Languages",
    integrations: "Integrations",
  },

  de: {
    dashboard: "Dashboard",
    restaurant: "Restaurant",
    establishments: "Betriebe",
    areas: "Bereiche",
    tables: "Tische",
    qrCodes: "QR-Codes",
    menuSection: "Speisekarte",
    menus: "Speisekarten",
    categories: "Kategorien",
    products: "Produkte",
    modifiers: "Optionen",
    promotions: "Aktionen",
    ordersSection: "Bestellungen",
    orders: "Bestellungen",
    kitchen: "Küche",
    history: "Verlauf",
    customers: "Kunden",
    ratings: "Bewertungen",
    loyalty: "Treueprogramm",
    staffSection: "Personal",
    users: "Benutzer",
    roles: "Rollen",
    shifts: "Schichten",
    paymentsSection: "Zahlungen",
    payments: "Zahlungen",
    invoices: "Rechnungen",
    paymentMethods: "Zahlungsmethoden",
    analyticsSection: "Analysen",
    sales: "Verkäufe",
    analyticsProducts: "Produkte",
    analyticsClients: "Kunden",
    configuration: "Einstellungen",
    general: "Allgemein",
    languages: "Sprachen",
    integrations: "Integrationen",
  },

  fr: {
    dashboard: "Tableau de bord",
    restaurant: "Restaurant",
    establishments: "Établissements",
    areas: "Zones",
    tables: "Tables",
    qrCodes: "Codes QR",
    menuSection: "Carte",
    menus: "Cartes",
    categories: "Catégories",
    products: "Produits",
    modifiers: "Modificateurs",
    promotions: "Promotions",
    ordersSection: "Commandes",
    orders: "Commandes",
    kitchen: "Cuisine",
    history: "Historique",
    customers: "Clients",
    ratings: "Évaluations",
    loyalty: "Fidélisation",
    staffSection: "Personnel",
    users: "Utilisateurs",
    roles: "Rôles",
    shifts: "Services",
    paymentsSection: "Paiements",
    payments: "Encaissements",
    invoices: "Factures",
    paymentMethods: "Modes de paiement",
    analyticsSection: "Analyses",
    sales: "Ventes",
    analyticsProducts: "Produits",
    analyticsClients: "Clients",
    configuration: "Configuration",
    general: "Général",
    languages: "Langues",
    integrations: "Intégrations",
  },

  it: {
    dashboard: "Dashboard",
    restaurant: "Ristorante",
    establishments: "Strutture",
    areas: "Aree",
    tables: "Tavoli",
    qrCodes: "Codici QR",
    menuSection: "Menu",
    menus: "Menu",
    categories: "Categorie",
    products: "Prodotti",
    modifiers: "Modificatori",
    promotions: "Promozioni",
    ordersSection: "Ordini",
    orders: "Ordini",
    kitchen: "Cucina",
    history: "Cronologia",
    customers: "Clienti",
    ratings: "Valutazioni",
    loyalty: "Fidelizzazione",
    staffSection: "Personale",
    users: "Utenti",
    roles: "Ruoli",
    shifts: "Turni",
    paymentsSection: "Pagamenti",
    payments: "Incassi",
    invoices: "Fatture",
    paymentMethods: "Metodi di pagamento",
    analyticsSection: "Analisi",
    sales: "Vendite",
    analyticsProducts: "Prodotti",
    analyticsClients: "Clienti",
    configuration: "Impostazioni",
    general: "Generale",
    languages: "Lingue",
    integrations: "Integrazioni",
  },

  pt: {
    dashboard: "Painel",
    restaurant: "Restaurante",
    establishments: "Estabelecimentos",
    areas: "Áreas",
    tables: "Mesas",
    qrCodes: "Códigos QR",
    menuSection: "Menu",
    menus: "Menus",
    categories: "Categorias",
    products: "Produtos",
    modifiers: "Modificadores",
    promotions: "Promoções",
    ordersSection: "Pedidos",
    orders: "Pedidos",
    kitchen: "Cozinha",
    history: "Histórico",
    customers: "Clientes",
    ratings: "Avaliações",
    loyalty: "Fidelização",
    staffSection: "Pessoal",
    users: "Utilizadores",
    roles: "Funções",
    shifts: "Turnos",
    paymentsSection: "Pagamentos",
    payments: "Cobranças",
    invoices: "Faturas",
    paymentMethods: "Métodos de pagamento",
    analyticsSection: "Análises",
    sales: "Vendas",
    analyticsProducts: "Produtos",
    analyticsClients: "Clientes",
    configuration: "Definições",
    general: "Geral",
    languages: "Idiomas",
    integrations: "Integrações",
  },
};

const menuItems: MenuItem[] = [
  {
    key:
      "dashboard",
    icon:
      <LayoutDashboard size={20} />,
    href:
      "/admin",
  },
  {
    key:
      "restaurant",
    icon:
      <Building2 size={20} />,
    children: [
      {
        key:
          "establishments",
        icon:
          <Building2 size={18} />,
        href:
          "/admin/establishments",
      },
      {
        key:
          "areas",
        icon:
          <MapPin size={18} />,
        href:
          "/admin/areas",
      },
      {
        key:
          "tables",
        icon:
          <Grid3X3 size={18} />,
        href:
          "/admin/tables",
      },
      {
        key:
          "qrCodes",
        icon:
          <Layers size={18} />,
        href:
          "/admin/qr",
      },
    ],
  },
  {
    key:
      "menuSection",
    icon:
      <UtensilsCrossed size={20} />,
    children: [
      {
        key:
          "menus",
        icon:
          <Menu size={18} />,
        href:
          "/admin/menus",
      },
      {
        key:
          "categories",
        icon:
          <Layers size={18} />,
        href:
          "/admin/categories",
      },
      {
        key:
          "products",
        icon:
          <ShoppingBag size={18} />,
        href:
          "/admin/products",
      },
      {
        key:
          "modifiers",
        icon:
          <Settings size={18} />,
        href:
          "/admin/modifiers",
      },
      {
        key:
          "promotions",
        icon:
          <Gift size={18} />,
        href:
          "/admin/promotions",
      },
    ],
  },
  {
    key:
      "ordersSection",
    icon:
      <ShoppingCart size={20} />,
    children: [
      {
        key:
          "orders",
        icon:
          <ShoppingCart size={18} />,
        href:
          "/admin/orders",
      },
      {
        key:
          "kitchen",
        icon:
          <ChefHat size={18} />,
        href:
          "/admin/kitchen",
      },
      {
        key:
          "history",
        icon:
          <History size={18} />,
        href:
          "/admin/order-history",
      },
    ],
  },
  {
    key:
      "customers",
    icon:
      <Users size={20} />,
    children: [
      {
        key:
          "ratings",
        icon:
          <Star size={18} />,
        href:
          "/admin/ratings",
      },
      {
        key:
          "loyalty",
        icon:
          <Gift size={18} />,
        href:
          "/admin/loyalty",
      },
    ],
  },
  {
    key:
      "staffSection",
    icon:
      <UserCog size={20} />,
    children: [
      {
        key:
          "users",
        icon:
          <Users size={18} />,
        href:
          "/admin/staff",
      },
      {
        key:
          "roles",
        icon:
          <UserCog size={18} />,
        href:
          "/admin/roles",
      },
      {
        key:
          "shifts",
        icon:
          <Calendar size={18} />,
        href:
          "/admin/shifts",
      },
    ],
  },
  {
    key:
      "paymentsSection",
    icon:
      <CreditCard size={20} />,
    children: [
      {
        key:
          "payments",
        icon:
          <CreditCard size={18} />,
        href:
          "/admin/payments",
      },
      {
        key:
          "invoices",
        icon:
          <CreditCard size={18} />,
        href:
          "/admin/invoices",
      },
      {
        key:
          "paymentMethods",
        icon:
          <CreditCard size={18} />,
        href:
          "/admin/payment-methods",
      },
    ],
  },
  {
    key:
      "analyticsSection",
    icon:
      <BarChart3 size={20} />,
    children: [
      {
        key:
          "sales",
        icon:
          <BarChart3 size={18} />,
        href:
          "/admin/analytics",
      },
      {
        key:
          "analyticsProducts",
        icon:
          <ShoppingBag size={18} />,
        href:
          "/admin/analytics-products",
      },
      {
        key:
          "analyticsClients",
        icon:
          <Users size={18} />,
        href:
          "/admin/analytics-clients",
      },
    ],
  },
  {
    key:
      "configuration",
    icon:
      <Settings size={20} />,
    children: [
      {
        key:
          "general",
        icon:
          <Settings size={18} />,
        href:
          "/admin/settings",
      },
      {
        key:
          "languages",
        icon:
          <Languages size={18} />,
        href:
          "/admin/languages",
      },
      {
        key:
          "integrations",
        icon:
          <Settings size={18} />,
        href:
          "/admin/integrations",
      },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface CollapsedMenuState {
  key: MenuKey;
  top: number;
}

export default function Sidebar({
  collapsed,
  onToggle,
}: SidebarProps) {
  const pathname =
    usePathname();

  const sidebarRef =
    useRef<HTMLElement>(
      null
    );

  const language =
    useAdminLanguageStore(
      (state) =>
        state.language
    );

  const labels =
    LABELS[
      language
    ];

  const [
    expandedItems,
    setExpandedItems,
  ] =
    useState<MenuKey[]>(
      []
    );

  const [
    collapsedMenu,
    setCollapsedMenu,
  ] =
    useState<
      CollapsedMenuState
      | null
    >(
      null
    );

  useEffect(
    () => {
      function handlePointerDown(
        event: PointerEvent
      ) {
        if (
          !collapsedMenu
        ) {
          return;
        }

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
          !sidebarRef.current?.contains(
            target
          )
        ) {
          setCollapsedMenu(
            null
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
      collapsedMenu,
    ]
  );

  useEffect(
    () => {
      if (
        !collapsed
      ) {
        setCollapsedMenu(
          null
        );
      }
    },
    [
      collapsed,
    ]
  );

  function toggleExpand(
    key: MenuKey
  ) {
    setExpandedItems(
      (previous) =>
        previous.includes(
          key
        )
          ? previous.filter(
              (item) =>
                item !==
                key
            )
          : [
              ...previous,
              key,
            ]
    );
  }

  function isActive(
    href?: string
  ) {
    if (
      !href
    ) {
      return false;
    }

    if (
      href ===
      "/admin"
    ) {
      return pathname ===
        "/admin";
    }

    return (
      pathname ===
        href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  }

  function hasActiveChild(
    item: MenuItem
  ) {
    return Boolean(
      item.children?.some(
        (child) =>
          isActive(
            child.href
          )
      )
    );
  }

  function openCollapsedGroup(
    item: MenuItem,
    button: HTMLButtonElement
  ) {
    const rect =
      button.getBoundingClientRect();

    setCollapsedMenu(
      (current) =>
        current?.key ===
        item.key
          ? null
          : {
              key:
                item.key,
              top:
                Math.max(
                  72,
                  Math.min(
                    rect.top,
                    window.innerHeight -
                      280
                  )
                ),
            }
    );
  }

  function renderMenuItem(
    item: MenuItem,
    level = 0
  ) {
    const hasChildren =
      Boolean(
        item.children?.length
      );

    const isExpanded =
      expandedItems.includes(
        item.key
      );

    const active =
      isActive(
        item.href
      ) ||
      hasActiveChild(
        item
      );

    const label =
      labels[
        item.key
      ];

    if (
      hasChildren
    ) {
      return (
        <div
          key={
            item.key
          }
        >
          <button
            type="button"
            title={
              collapsed
                ? label
                : undefined
            }
            aria-label={
              label
            }
            aria-expanded={
              collapsed
                ? collapsedMenu?.key ===
                    item.key
                : isExpanded
            }
            onClick={(
              event
            ) => {
              if (
                collapsed
              ) {
                openCollapsedGroup(
                  item,
                  event.currentTarget
                );

                return;
              }

              toggleExpand(
                item.key
              );
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
              level >
              0
                ? "pl-10"
                : ""
            } ${
              active
                ? "bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {
                item.icon
              }

              {!collapsed && (
                <span>
                  {
                    label
                  }
                </span>
              )}
            </div>

            {!collapsed && (
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isExpanded
                    ? "rotate-180"
                    : ""
                }`}
              />
            )}
          </button>

          {!collapsed &&
            isExpanded && (
            <div className="bg-gray-50">
              {item.children!.map(
                (child) =>
                  renderMenuItem(
                    child,
                    level +
                      1
                  )
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={
          item.key
        }
        href={
          item.href ??
          "#"
        }
        title={
          collapsed
            ? label
            : undefined
        }
        aria-label={
          label
        }
        onClick={() => {
          setCollapsedMenu(
            null
          );
        }}
        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
          level >
          0
            ? "pl-10"
            : ""
        } ${
          active
            ? "bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        {
          item.icon
        }

        {!collapsed && (
          <span>
            {
              label
            }
          </span>
        )}
      </Link>
    );
  }

  const openGroup =
    collapsedMenu
      ? menuItems.find(
          (item) =>
            item.key ===
            collapsedMenu.key
        )
      : null;

  return (
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={
            onToggle
          }
        />
      )}

      <aside
        ref={
          sidebarRef
        }
        className={`fixed left-0 top-0 z-50 h-full border-r border-gray-200 bg-white transition-all duration-300 ${
          collapsed
            ? "w-16"
            : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {!collapsed && (
            <Link
              href="/admin"
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <span className="text-sm font-bold text-white">
                  Y
                </span>
              </div>

              <span className="font-bold text-gray-900">
                YaMar
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={
              onToggle
            }
            title={
              collapsed
                ? "YaMar"
                : undefined
            }
            aria-label="Menu"
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <Menu
              size={20}
              className="text-gray-600"
            />
          </button>
        </div>

        <nav className="h-[calc(100%-4rem)] overflow-y-auto py-4">
          {menuItems.map(
            (item) =>
              renderMenuItem(
                item
              )
          )}
        </nav>

        {collapsed &&
          collapsedMenu &&
          openGroup?.children && (
          <div
            className="fixed left-16 z-[70] w-60 overflow-hidden rounded-r-xl border border-gray-200 bg-white shadow-xl"
            style={{
              top:
                collapsedMenu.top,
            }}
          >
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="font-semibold text-gray-900">
                {
                  labels[
                    openGroup.key
                  ]
                }
              </p>
            </div>

            <div className="py-1">
              {openGroup.children.map(
                (child) => {
                  const childLabel =
                    labels[
                      child.key
                    ];

                  const childActive =
                    isActive(
                      child.href
                    );

                  return (
                    <Link
                      key={
                        child.key
                      }
                      href={
                        child.href ??
                        "#"
                      }
                      onClick={() => {
                        setCollapsedMenu(
                          null
                        );
                      }}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        childActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {
                        child.icon
                      }

                      <span>
                        {
                          childLabel
                        }
                      </span>
                    </Link>
                  );
                }
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function ChevronDown({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      width={
        size
      }
      height={
        size
      }
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}