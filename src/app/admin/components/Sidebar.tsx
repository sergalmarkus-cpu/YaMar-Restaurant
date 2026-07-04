'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  UtensilsCrossed,
  Menu,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  CreditCard,
  ShoppingBag,
  MessageSquare,
  UserCog,
  Calendar,
  Languages,
  Grid3X3,
  ChefHat,
  Wine,
  CheckCircle,
  History,
  Star,
  Gift,
  Layers,
} from 'lucide-react';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    href: '/admin',
  },
  {
    label: 'Restaurante',
    icon: <Building2 size={20} />,
    children: [
      { label: 'Establecimientos', icon: <Building2 size={18} />, href: '/admin/establishments' },
      { label: 'Áreas', icon: <MapPin size={18} />, href: '/admin/areas' },
      { label: 'Mesas', icon: <Grid3X3 size={18} />, href: '/admin/tables' },
      { label: 'Códigos QR', icon: <Layers size={18} />, href: '/admin/qr' },
    ],
  },
  {
    label: 'Carta',
    icon: <UtensilsCrossed size={20} />,
    children: [
      { label: 'Cartas', icon: <Menu size={18} />, href: '/admin/menus' },
      { label: 'Categorías', icon: <Layers size={18} />, href: '/admin/categories' },
      { label: 'Productos', icon: <ShoppingBag size={18} />, href: '/admin/products' },
      { label: 'Modificadores', icon: <Settings size={18} />, href: '/admin/modifiers' },
      { label: 'Promociones', icon: <Gift size={18} />, href: '/admin/promotions' },
    ],
  },
  {
    label: 'Pedidos',
    icon: <ShoppingCart size={20} />,
    children: [
      { label: 'Pedidos', icon: <ShoppingCart size={18} />, href: '/admin/orders' },
      { label: 'Cocina', icon: <ChefHat size={18} />, href: '/admin/kitchen-orders' },
      { label: 'Historial', icon: <History size={18} />, href: '/admin/order-history' },
    ],
  },
  {
    label: 'Clientes',
    icon: <Users size={20} />,
    children: [
      { label: 'Valoraciones', icon: <Star size={18} />, href: '/admin/ratings' },
      { label: 'Fidelización', icon: <Gift size={18} />, href: '/admin/loyalty' },
    ],
  },
  {
    label: 'Personal',
    icon: <UserCog size={20} />,
    children: [
      { label: 'Usuarios', icon: <Users size={18} />, href: '/admin/staff' },
      { label: 'Roles', icon: <UserCog size={18} />, href: '/admin/roles' },
      { label: 'Turnos', icon: <Calendar size={18} />, href: '/admin/shifts' },
    ],
  },
  {
    label: 'Pagos',
    icon: <CreditCard size={20} />,
    children: [
      { label: 'Cobros', icon: <CreditCard size={18} />, href: '/admin/payments' },
      { label: 'Facturas', icon: <CreditCard size={18} />, href: '/admin/invoices' },
      { label: 'Métodos de pago', icon: <CreditCard size={18} />, href: '/admin/payment-methods' },
    ],
  },
  {
    label: 'Analíticas',
    icon: <BarChart3 size={20} />,
    children: [
      { label: 'Ventas', icon: <BarChart3 size={18} />, href: '/admin/analytics-sales' },
      { label: 'Productos', icon: <ShoppingBag size={18} />, href: '/admin/analytics-products' },
      { label: 'Clientes', icon: <Users size={18} />, href: '/admin/analytics-clients' },
    ],
  },
  {
    label: 'Configuración',
    icon: <Settings size={20} />,
    children: [
      { label: 'General', icon: <Settings size={18} />, href: '/admin/settings' },
      { label: 'Idiomas', icon: <Languages size={18} />, href: '/admin/languages' },
      { label: 'Integraciones', icon: <Settings size={18} />, href: '/admin/integrations' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const active = isActive(item.href);

    return (
      <div key={item.label}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpand(item.label)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                ${level > 0 ? 'pl-10' : ''}
                ${active ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              )}
            </button>
            {!collapsed && isExpanded && (
              <div className="bg-gray-50">
                {item.children!.map((child) => renderMenuItem(child, level + 1))}
              </div>
            )}
          </>
        ) : (
          <Link
            href={item.href || '#'}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
              ${level > 0 ? 'pl-10' : ''}
              ${active ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="font-bold text-gray-900">YaMar</span>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-4 overflow-y-auto h-[calc(100%-4rem)]">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </aside>
    </>
  );
}

// Icon helper
function ChevronDown({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}