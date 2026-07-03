# Sistema Integral de Gestión del Servicio de Sala

Una aplicación web progresiva (PWA) completa para restaurantes y establecimientos de hostelería, que permite a los clientes realizar pedidos, pagos y valoraciones de forma autónoma mediante códigos QR.

## 🚀 Características Principales

### Front Office (Cliente)
- ✅ **Acceso mediante QR** - Sin descargas, escanea y pide
- 🌍 **Multiidioma** - 6 idiomas soportados (ES, EN, DE, FR, IT, PT)
- 📍 **Geolocalización** - Seguimiento de pedidos en grandes espacios
- 🛒 **Carrito Inteligente** - Gestión de pedidos en tiempo real
- 💰 **División de Cuenta** - Por partes iguales, artículos, porcentajes o personalizada
- 💳 **Pagos Online** - Stripe, PayPal, Apple/Google Pay
- ⭐ **Valoraciones** - Califica comida, servicio y atención
- 📱 **PWA** - Funciona offline, instalable en móvil
- 🔔 **Notificaciones en Tiempo Real** - Estado de pedidos actualizado

### Back Office (Administración)
- 📊 **Panel de Control** - Vista general del negocio
- 📋 **Gestión de Menús** - Cartas con horarios configurables
- 🍽️ **Gestión de Productos** - Precios, stock, alergenos, modificadores
- 🪑 **Gestión de Mesas** - QR codes, áreas, estado
- 👥 **Gestión de Personal** - Roles, permisos, turnos
- 📈 **Analytics** - Productos más vendidos, ingresos, tiempos
- 🎯 **Promociones** - Descuentos, cupones, fidelización
- 🏷️ **Puntos de Venta** - Multi-ubicación con geolocalización

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **State Management**: Zustand
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Drizzle ORM
- **Payments**: Stripe
- **Real-time**: WebSockets (future)
- **PWA**: next-pwa

## 📦 Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd restaurant-management

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Crear esquema de base de datos
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

## 🗄️ Base de Datos

El proyecto usa PostgreSQL con Drizzle ORM. La estructura incluye:

- **establishments** - Restaurantes/hoteles
- **users** - Personal (admin, manager, waiter, kitchen, bar, cashier)
- **areas** - Zonas del establecimiento (piscina, terraza, etc.)
- **tables** - Mesas con códigos QR
- **menus** - Cartas con horarios
- **categories** - Categorías de productos
- **products** - Productos con precios, alergenos, stock
- **modifiers** - Extras y opciones
- **sessions** - Sesiones de clientes
- **orders** - Pedidos
- **payments** - Pagos y división de cuenta
- **ratings** - Valoraciones de clientes
- **waiterCalls** - Llamadas al camarero
- **pointsOfSale** - Puntos de venta con geolocalización

### Aplicar cambios al schema

```bash
npm run db:push
```

### Poblar base de datos

```bash
npm run db:seed
```

## 🎯 Uso

### Cliente (Front Office)

1. Escanear código QR de la mesa
2. Introducir datos básicos (nombre, email opcional)
3. Navegar por las cartas disponibles
4. Añadir productos al carrito
5. Realizar pedido
6. Seguir estado del pedido en tiempo real
7. Solicitar cuenta cuando desee
8. Pagar online o dividir cuenta
9. Valorar experiencia

### Administrador (Back Office)

1. Acceder a `/admin`
2. Login con credenciales
3. Gestionar menús, productos, horarios
4. Ver pedidos en tiempo real
5. Gestionar mesas y QR codes
6. Ver analytics y reportes
7. Moderar valoraciones
8. Configurar promociones

## 🌍 Multiidioma

El sistema soporta traducciones completas en:
- 🇪🇸 Español
- 🇬🇧 English
- 🇩🇪 Deutsch
- 🇫🇷 Français
- 🇮🇹 Italiano
- 🇵🇹 Português

Todos los menús, productos y categorías se almacenan con traducciones en formato JSON:

```json
{
  "es": "Hamburguesa",
  "en": "Burger",
  "de": "Burger",
  "fr": "Hamburger"
}
```

## 📱 Progressive Web App (PWA)

La aplicación es una PWA completa:
- ✅ Instalable en iOS y Android
- ✅ Funciona offline (pedidos se guardan y sincronizan)
- ✅ Notificaciones push
- ✅ Actualizaciones automáticas
- ✅ Icono en pantalla de inicio

## 🔒 Seguridad

- **HTTPS obligatorio** en producción
- **Tokens JWT** para autenticación
- **CSRF protection** en formularios
- **Rate limiting** para prevenir abusos
- **SQL injection protection** vía ORM
- **XSS protection** vía React
- **RGPD compliant** - Consentimiento explícito
- **PCI-DSS compliant** - Pagos seguros vía Stripe

## 📊 Analytics

El sistema registra:
- Productos más vendidos
- Ingresos por día/semana/mes
- Tiempos de preparación promedio
- Valoraciones promedio
- Horarios pico
- Pedidos por mesa/área
- Customer Lifetime Value

## 🎨 Personalización

Cada establecimiento puede personalizar:
- Logo y colores corporativos
- Horarios de cartas
- Métodos de pago aceptados
- Características activadas/desactivadas
- Idiomas disponibles
- Distancia máxima de geolocalización
- Mensajes personalizados

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build
docker build -t restaurant-app .

# Run
docker run -p 3000:3000 restaurant-app
```

## 📄 Documentación Adicional

- **[ANALISIS_COMPLETO.md](ANALISIS_COMPLETO.md)** - Análisis exhaustivo de riesgos, soluciones y recomendaciones
- **[API.md](docs/API.md)** - Documentación de API endpoints (TODO)
- **[ARQUITECTURA.md](docs/ARQUITECTURA.md)** - Arquitectura del sistema (TODO)

## 🛣️ Roadmap

### Q1 2026
- [ ] Panel de administración completo
- [ ] Sistema de reservas
- [ ] Integración con TPV
- [ ] Programa de fidelización
- [ ] Voice ordering

### Q2 2026
- [ ] AR menu (ver platos en 3D)
- [ ] IA para recomendaciones personalizadas
- [ ] WhatsApp Business integration
- [ ] Multi-tenant SaaS

### Q3 2026
- [ ] Blockchain para trazabilidad
- [ ] Sustainability score
- [ ] Carbon footprint tracking

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Propietario - Todos los derechos reservados

## 👥 Autores

- Arquitecto de Software - *Desarrollo inicial*

## 🙏 Agradecimientos

- Hoteles y restaurantes beta testers
- Comunidad de Next.js
- Contribuidores de Drizzle ORM

## 📞 Soporte

Para soporte o consultas:
- Email: support@restaurant-system.com
- Documentación: [docs.restaurant-system.com](https://docs.restaurant-system.com)
- Comunidad: [community.restaurant-system.com](https://community.restaurant-system.com)

---

**Construido con ❤️ para la industria de la hostelería**
