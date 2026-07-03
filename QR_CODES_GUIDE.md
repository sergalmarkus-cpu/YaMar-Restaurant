# Guía Completa de Códigos QR

Esta guía explica cómo generar, imprimir y desplegar los códigos QR en tu establecimiento.

---

## 📋 Índice
1. [Obtener Códigos QR de la Base de Datos](#1-obtener-códigos-qr)
2. [Generar Imágenes QR](#2-generar-imágenes-qr)
3. [Diseñar QR Profesionales](#3-diseñar-qr-profesionales)
4. [Imprimir y Producir](#4-imprimir-y-producir)
5. [Colocación Estratégica](#5-colocación-estratégica)
6. [Mantenimiento](#6-mantenimiento)

---

## 1. Obtener Códigos QR

### Desde la Base de Datos

```bash
# Conectar a PostgreSQL
psql $DATABASE_URL

# Ver todas las mesas y sus códigos QR
SELECT 
  id,
  code AS "Mesa",
  qr_code AS "Código QR",
  status AS "Estado"
FROM tables
WHERE active = true
ORDER BY code;
```

### Exportar a CSV

```sql
\copy (SELECT code, qr_code, 'https://turestaurante.com/client/' || qr_code AS url FROM tables WHERE active = true) TO 'qr_codes.csv' CSV HEADER;
```

Esto creará un archivo `qr_codes.csv` con:
```csv
code,qr_code,url
A1,abc123-def456-ghi789,https://turestaurante.com/client/abc123-def456-ghi789
A2,xyz789-uvw456-rst123,https://turestaurante.com/client/xyz789-uvw456-rst123
...
```

---

## 2. Generar Imágenes QR

### Opción A: Script Node.js (Recomendado)

Crear archivo `scripts/generate-qr-images.js`:

```javascript
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { db } = require('../src/db');
const { tables } = require('../src/db/schema');

async function generateQRImages() {
  // Crear directorio para QR codes
  const qrDir = path.join(__dirname, '../public/qr-codes');
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  // Obtener todas las mesas
  const allTables = await db.select().from(tables);

  for (const table of allTables) {
    const url = `https://turestaurante.com/client/${table.qrCode}`;
    const filename = `mesa-${table.code}.png`;
    const filepath = path.join(qrDir, filename);

    // Generar QR code
    await QRCode.toFile(filepath, url, {
      errorCorrectionLevel: 'H', // Máxima corrección de errores
      type: 'png',
      width: 1000, // 1000x1000 pixels (alta calidad)
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    console.log(`✅ Generated: ${filename}`);
  }

  console.log(`\n🎉 Generated ${allTables.length} QR codes in ${qrDir}`);
}

generateQRImages().catch(console.error);
```

Ejecutar:
```bash
node scripts/generate-qr-images.js
```

### Opción B: Online (Más Rápido)

Usar [QR Code Generator](https://www.qr-code-generator.com/):

1. Ir a https://www.qr-code-generator.com/
2. Tipo: URL
3. Introducir: `https://turestaurante.com/client/[QR_CODE]`
4. Personalizar:
   - Error correction: 30% (High)
   - Size: 1000x1000 px
   - Formato: PNG
5. Descargar

Repetir para cada mesa.

### Opción C: Servicio API

Usar API de Google Charts (gratis):

```bash
# Para cada mesa
curl "https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=https://turestaurante.com/client/abc123" -o mesa-A1.png
```

---

## 3. Diseñar QR Profesionales

### Template Recomendado

```
┌─────────────────────────────┐
│                             │
│     [LOGO RESTAURANTE]      │
│                             │
│    ┌─────────────────┐     │
│    │                 │     │
│    │   [QR CODE]     │     │
│    │                 │     │
│    └─────────────────┘     │
│                             │
│      MESA A1               │
│                             │
│   Escanea para pedir       │
│   Scan to order            │
│   Scannen zum Bestellen    │
│                             │
└─────────────────────────────┘
```

### Herramientas de Diseño

#### Canva (Más Fácil)
1. Ir a [Canva.com](https://www.canva.com)
2. Crear diseño personalizado 10x10cm
3. Añadir logo del restaurante
4. Añadir QR code (subir imagen)
5. Añadir texto "MESA A1"
6. Añadir instrucciones multi-idioma
7. Exportar como PDF (alta calidad)

#### Figma (Profesional)
1. Crear artboard 100x100mm
2. Importar QR code
3. Añadir branding
4. Exportar como PDF vectorial

#### Adobe Illustrator (Avanzado)
- Vectorizar QR codes
- Diseño totalmente personalizado
- Exportar para impresión profesional

### Elementos Esenciales

✅ **Obligatorio**:
- Logo del establecimiento
- Código QR (mínimo 3x3cm)
- Número de mesa visible
- Instrucción básica ("Escanea para pedir")

⭐ **Recomendado**:
- Instrucciones en varios idiomas
- Colores corporativos
- Icono de cámara/QR
- URL alternativa (si QR no funciona)

❌ **Evitar**:
- QR muy pequeño (< 2cm)
- Colores con poco contraste
- Texto sobre el QR
- Diseño muy recargado

---

## 4. Imprimir y Producir

### Opción A: Impresión Casera (Budget)

**Materiales**:
- Impresora láser color o B/N
- Papel adhesivo resistente al agua
- Plastificadora
- Láminas de plastificado

**Proceso**:
1. Imprimir QR codes en papel adhesivo
2. Plastificar
3. Recortar
4. Pegar en soporte rígido (cartón pluma)

**Coste**: ~€0.50-1 por QR

### Opción B: Imprenta Online (Profesional)

**Servicios Recomendados**:
- [Vistaprint](https://www.vistaprint.es)
- [Printful](https://www.printful.com)
- [Pixartprinting](https://www.pixartprinting.es)

**Opciones de Producto**:

1. **Stickers Vinilo**
   - Material: Vinilo resistente al agua
   - Tamaño: 10x10cm
   - Cantidad: 50 unidades
   - Coste: ~€30-50
   - Duración: 2-3 años exterior

2. **Placas Acrílicas**
   - Material: Acrílico transparente 3mm
   - Tamaño: 15x15cm
   - Impresión: UV directo sobre acrílico
   - Cantidad: 20 unidades
   - Coste: ~€150-200
   - Duración: 5+ años

3. **Señalética Metálica**
   - Material: Aluminio dibond
   - Tamaño: 20x20cm
   - Acabado: Mate
   - Cantidad: 10 unidades
   - Coste: ~€200-300
   - Duración: 10+ años

### Opción C: Producción Local (Mejor Calidad)

Buscar imprentas locales especializadas en:
- Señalética
- Rotulación
- Material POS (Point of Sale)

**Ventajas**:
- Asesoramiento personalizado
- Puedes ver muestras
- Soporte post-venta
- Instalación incluida (a veces)

---

## 5. Colocación Estratégica

### Ubicaciones Óptimas

#### En Mesas
- **Centro de mesa**: Más visible
- **Esquina**: Menos intrusivo
- **Stand vertical**: Profesional

#### En Zonas Comunes
- Entrada del área
- Junto a hamacas/tumbonas
- En barras/mostradores
- Paredes cercanas

### Consejos de Instalación

✅ **Hacer**:
- Altura entre 60-90cm (sentado)
- Proteger de líquidos
- Iluminación adecuada
- Fácil acceso con móvil
- Varios puntos en zonas grandes

❌ **Evitar**:
- Luz directa del sol (deslumbra)
- Superficies reflectantes
- Zonas con mucho movimiento
- Lugares húmedos sin protección
- Ángulos difíciles de escanear

### Señalización Adicional

Crear carteles explicativos:

```
┌────────────────────────────┐
│  ¿Cómo funciona?           │
│                            │
│  1️⃣ Escanea el QR          │
│  2️⃣ Elige tus platos       │
│  3️⃣ Realiza tu pedido      │
│  4️⃣ ¡Disfruta!             │
│                            │
│  ¿Necesitas ayuda?         │
│  Llama al camarero 👋      │
└────────────────────────────┘
```

---

## 6. Mantenimiento

### Revisión Regular

**Diaria**:
- [ ] QR codes limpios (sin manchas)
- [ ] Sin daños físicos
- [ ] Códigos funcionan al escanear

**Semanal**:
- [ ] Adherencia correcta (no despegados)
- [ ] Legibilidad perfecta
- [ ] Ubicación correcta

**Mensual**:
- [ ] Estado general
- [ ] Decoloración por sol
- [ ] Renovación si necesario

### Limpieza

**Materiales seguros**:
- Paño de microfibra húmedo
- Agua con jabón suave
- Alcohol isopropílico (si muy sucio)

**Evitar**:
- Productos abrasivos
- Disolventes químicos
- Esponjas rugosas
- Agua a presión directa

### Reemplazo

**Señales de que hay que cambiar**:
- ❌ QR no escanea correctamente
- ❌ Daño físico visible
- ❌ Decoloración significativa
- ❌ Despegándose del soporte
- ❌ Información desactualizada

**Proceso de reemplazo**:
1. Retirar QR antiguo
2. Limpiar superficie
3. Aplicar nuevo QR
4. Verificar funcionamiento
5. Actualizar registro

---

## 7. Troubleshooting

### QR No Escanea

**Posibles causas**:
1. **Demasiado pequeño** → Mínimo 3x3cm
2. **Poco contraste** → Usar negro sobre blanco
3. **Luz reflejada** → Cambiar ángulo o ubicación
4. **Dañado** → Reemplazar
5. **Cámara sucia** → Limpiar lente del móvil

### QR Escanea Pero No Funciona

**Verificar**:
```bash
# Comprobar que el QR code existe en la DB
psql $DATABASE_URL -c "SELECT * FROM tables WHERE qr_code = 'ABC123';"

# Verificar que la mesa está activa
psql $DATABASE_URL -c "SELECT active FROM tables WHERE qr_code = 'ABC123';"

# Comprobar que el establecimiento está activo
psql $DATABASE_URL -c "SELECT active FROM establishments WHERE id = 1;"
```

---

## 8. Casos de Uso Especiales

### Eventos Temporales

Para eventos (bodas, conferencias, etc.):
1. Crear mesas temporales en la DB
2. Generar QR codes
3. Imprimir en papel simple
4. Colocar en portapapeles o stands
5. Desactivar después del evento

### Multi-Zona (Hoteles Grandes)

```
ÁREA PISCINA          ÁREA RESTAURANTE      ÁREA TERRAZA
Mesa: POOL-A1         Mesa: REST-A1         Mesa: TERR-A1
QR: xyz123            QR: abc456            QR: def789
```

### QR Reutilizables

Si cambias de mesa:
1. NO generar nuevo QR
2. Actualizar en DB:
   ```sql
   UPDATE tables 
   SET code = 'NUEVA-A1' 
   WHERE qr_code = 'xyz123';
   ```
3. Actualizar etiqueta física

---

## 9. Best Practices

### Diseño
✅ Contraste alto (negro sobre blanco)  
✅ Tamaño mínimo 3x3cm  
✅ Error correction nivel H (30%)  
✅ Margen blanco alrededor  
✅ Información adicional clara  

### Ubicación
✅ Visible desde posición sentada  
✅ Protegido de elementos  
✅ Bien iluminado pero sin reflejos  
✅ Fácil de alcanzar con móvil  

### Mantenimiento
✅ Inspección visual diaria  
✅ Test de funcionamiento semanal  
✅ Limpieza regular  
✅ Stock de reemplazo disponible  

### Experiencia de Usuario
✅ Instrucciones en varios idiomas  
✅ Opción alternativa (llamar camarero)  
✅ Señalización clara  
✅ Staff preparado para ayudar  

---

## 10. Checklist de Implementación

### Pre-Lanzamiento
- [ ] Todos los QR codes generados
- [ ] Diseño aprobado
- [ ] Material producido
- [ ] Staff formado en uso
- [ ] Cartel de instrucciones listo
- [ ] Proceso de ayuda definido

### Día del Lanzamiento
- [ ] QR codes instalados
- [ ] Test de funcionamiento realizado
- [ ] Staff en posición
- [ ] Carteles informativos colocados
- [ ] Primeros clientes asistidos
- [ ] Feedback capturado

### Post-Lanzamiento
- [ ] Revisión diaria primera semana
- [ ] Ajustes basados en feedback
- [ ] Documentar problemas comunes
- [ ] Optimizar ubicaciones si necesario
- [ ] Evaluar necesidad de más QR codes

---

## 📞 Soporte

Para consultas sobre QR codes:
- **Email**: qr-support@turestaurante.com
- **Teléfono**: +34 XXX XXX XXX
- **Proveedor recomendado**: [Vistaprint](https://www.vistaprint.es)

---

**Última actualización**: Enero 2026  
**Versión**: 1.0
