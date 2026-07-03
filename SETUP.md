# Guía de Configuración Inicial

Esta guía te ayudará a configurar el sistema por primera vez.

## 📋 Prerequisitos

- Node.js 20+ instalado
- PostgreSQL 15+ instalado (local o remoto)
- Git instalado
- Editor de código (VS Code recomendado)

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd restaurant-management
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Crear base de datos
createdb restaurant_db

# O con psql
psql -U postgres
CREATE DATABASE restaurant_db;
\q
```

#### Opción B: PostgreSQL en Docker

```bash
docker run --name restaurant-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=restaurant_db \
  -p 5432:5432 \
  -d postgres:15
```

#### Opción C: Supabase (Cloud - Gratis)

1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar connection string

### 4. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
nano .env
```

Configuración mínima necesaria:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/restaurant_db
JWT_SECRET=tu-secreto-jwt-muy-seguro
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Aplicar Schema a la Base de Datos

```bash
npm run db:push
```

Esto creará todas las tablas necesarias.

### 6. Poblar con Datos de Ejemplo

```bash
npm run db:seed
```

Esto creará:
- 1 establecimiento de demostración
- 7 mesas con códigos QR
- 3 menús (Snacks, Restaurante, Cócteles)
- Horarios configurados
- Productos de ejemplo
- Puntos de venta

### 7. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## 🎨 Configuración del Establecimiento

### 1. Acceder a los Datos Seed

Los datos de ejemplo incluyen:

**Establecimiento**: Demo Restaurant & Hotel
- Ubicación: Barcelona, España
- Coordenadas: 41.3851, 2.1734
- Geofence: 100 metros

**Mesas**:
- A1, A2, A3 (Pool Area)
- T1, T2 (Terrace)
- INDOOR-1, INDOOR-2

**Menús**:
- Snacks: 11:30-13:00 y 16:00-19:30
- Restaurante: 14:00-16:00 y 20:30-23:00
- Cócteles: 11:30-23:45

### 2. Obtener Códigos QR

```bash
# Conectar a la base de datos
psql $DATABASE_URL

# Ver códigos QR generados
SELECT code, qr_code FROM tables;
```

### 3. Generar QR Codes Visuales

Los códigos QR se pueden generar con:

```javascript
// En el navegador o con Node.js
const QRCode = require('qrcode');

async function generateQR(qrCode) {
  const url = `http://localhost:3000/client/${qrCode}`;
  const qrImage = await QRCode.toDataURL(url);
  console.log(qrImage); // Base64 image
}
```

O usar una herramienta online:
- [QR Code Generator](https://www.qr-code-generator.com/)
- Introducir la URL: `http://localhost:3000/client/[QR_CODE]`

---

## 🧪 Probar la Aplicación

### 1. Como Cliente (Front Office)

1. Abrir navegador en móvil o usar Chrome DevTools (modo responsive)
2. Ir a `http://localhost:3000/client/[QR_CODE]`
   - Reemplazar `[QR_CODE]` con uno de los códigos de la tabla
3. Completar onboarding:
   - Nombre: "Test User"
   - Email: test@example.com (opcional)
4. Explorar menús
5. Añadir productos al carrito
6. Realizar pedido

### 2. Verificar Pedidos en Base de Datos

```bash
psql $DATABASE_URL

# Ver pedidos
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

# Ver items de pedido
SELECT oi.*, p.name 
FROM order_items oi 
JOIN products p ON oi.product_id = p.id 
ORDER BY oi.created_at DESC;
```

---

## 🔧 Configuración Avanzada

### Stripe (Pagos Online)

1. Crear cuenta en [stripe.com](https://stripe.com)
2. Obtener claves de test
3. Añadir a `.env`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Email (Recibos por Email)

#### Opción A: Resend (Recomendado)

```env
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@turestaurante.com
```

#### Opción B: SendGrid

```env
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@turestaurante.com
```

### SMS (Notificaciones)

```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

### Google Analytics

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-...
```

---

## 📱 PWA Configuration

### 1. Generar Iconos

Necesitas iconos de diferentes tamaños:
- 192x192 (manifest)
- 512x512 (manifest)
- 180x180 (Apple)

Usa [RealFaviconGenerator](https://realfavicongenerator.net/) para generarlos.

### 2. Configurar Manifest

Editar `public/manifest.json`:

```json
{
  "name": "Tu Restaurante",
  "short_name": "Restaurante",
  "description": "Pide desde tu mesa",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🎨 Personalización Visual

### Colores del Establecimiento

Editar en base de datos:

```sql
UPDATE establishments 
SET 
  primary_color = '#FF6B6B',
  secondary_color = '#4ECDC4'
WHERE id = 1;
```

### Logo

1. Subir logo a `/public/logos/`
2. Actualizar en base de datos:

```sql
UPDATE establishments 
SET logo = '/logos/mi-restaurante.png'
WHERE id = 1;
```

---

## 🗄️ Gestión de Datos

### Backup Manual

```bash
# Exportar base de datos
pg_dump $DATABASE_URL > backup.sql

# Restaurar
psql $DATABASE_URL < backup.sql
```

### Reset Completo

```bash
# CUIDADO: Esto borrará TODOS los datos
npm run db:reset
npm run db:seed
```

### Añadir Productos Manualmente

```sql
INSERT INTO products (
  establishment_id,
  category_id,
  name,
  description,
  price,
  available,
  active
) VALUES (
  1,
  1,
  '{"es": "Pizza Margherita", "en": "Margherita Pizza"}',
  '{"es": "Tomate, mozzarella y albahaca", "en": "Tomato, mozzarella and basil"}',
  '12.50',
  true,
  true
);
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL está corriendo
pg_isready

# Verificar connection string
echo $DATABASE_URL

# Test de conexión
psql $DATABASE_URL -c "SELECT 1"
```

### Error: "Module not found"

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"

```bash
# Encontrar proceso
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O usar otro puerto
PORT=3001 npm run dev
```

### Schema no se aplica

```bash
# Forzar push
npm run db:push -- --force

# O usar migraciones
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Stripe Testing](https://stripe.com/docs/testing)

---

## ✅ Checklist de Setup

- [ ] Node.js instalado
- [ ] PostgreSQL configurado
- [ ] Dependencias instaladas
- [ ] Variables de entorno configuradas
- [ ] Schema aplicado (`db:push`)
- [ ] Datos seed cargados (`db:seed`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Página principal accesible
- [ ] QR codes generados
- [ ] Cliente funciona escaneando QR
- [ ] Pedidos se crean correctamente
- [ ] (Opcional) Stripe configurado
- [ ] (Opcional) Email configurado
- [ ] (Opcional) PWA configurado

---

## 🆘 Soporte

Si tienes problemas:

1. Revisar esta guía completamente
2. Buscar en GitHub Issues
3. Crear nueva issue con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs de error
   - Versiones (Node, PostgreSQL, etc.)

---

**¡Feliz desarrollo! 🚀**
