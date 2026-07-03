# Guía de Despliegue

## 🚀 Opciones de Deployment

### 1. Vercel (Recomendado - Más Fácil)

Vercel es la plataforma creada por el equipo de Next.js y ofrece la mejor integración.

#### Pasos:

1. **Crear cuenta en Vercel**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   ```

2. **Configurar PostgreSQL**
   - Opción A: Usar Vercel Postgres (recomendado)
   - Opción B: Usar Supabase (gratis)
   - Opción C: Usar Railway
   - Opción D: Usar Neon

3. **Deploy**
   ```bash
   vercel
   ```

4. **Configurar Variables de Entorno**
   - Ir a Vercel Dashboard → Settings → Environment Variables
   - Añadir todas las variables de `.env.example`

5. **Aplicar Schema**
   ```bash
   # Desde local con DATABASE_URL de producción
   npm run db:push
   ```

6. **Poblar datos iniciales**
   ```bash
   npm run db:seed
   ```

#### Costes Estimados:
- Vercel: Gratis hasta 100GB bandwidth
- Vercel Postgres: $20/mes (100GB storage)
- **Total: ~$20/mes**

---

### 2. AWS (Escalable - Producción)

Para proyectos grandes que necesitan control total.

#### Arquitectura:

```
Internet
    ↓
CloudFront (CDN)
    ↓
ALB (Load Balancer)
    ↓
ECS Fargate (Next.js containers)
    ↓
RDS PostgreSQL (Database)
    ↓
S3 (Static files / Uploads)
```

#### Pasos:

1. **Crear RDS PostgreSQL**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier restaurant-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password YourPassword123 \
     --allocated-storage 20
   ```

2. **Crear ECR Repository**
   ```bash
   aws ecr create-repository --repository-name restaurant-app
   ```

3. **Build & Push Docker Image**
   ```bash
   # Build
   docker build -t restaurant-app .
   
   # Tag
   docker tag restaurant-app:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/restaurant-app:latest
   
   # Push
   docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/restaurant-app:latest
   ```

4. **Crear ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name restaurant-cluster
   ```

5. **Crear Task Definition & Service**
   (Ver `aws-ecs-task-definition.json`)

6. **Configurar ALB**
   - Target: ECS Service
   - Health Check: `/api/health`

7. **Configurar CloudFront**
   - Origin: ALB
   - Cache: Static assets
   - HTTPS: Certificado SSL

#### Costes Estimados:
- RDS t3.micro: $15/mes
- ECS Fargate: $30/mes
- ALB: $20/mes
- CloudFront: $10/mes
- **Total: ~$75/mes**

---

### 3. DigitalOcean (Simple - Coste Medio)

Buena opción intermedia entre facilidad y control.

#### Pasos:

1. **Crear Droplet**
   - Ubuntu 22.04 LTS
   - 2GB RAM / 1 vCPU ($12/mes)

2. **Configurar Droplet**
   ```bash
   # SSH al droplet
   ssh root@your-droplet-ip
   
   # Instalar Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get install -y nodejs
   
   # Instalar PM2
   npm install -g pm2
   
   # Instalar Nginx
   apt-get install nginx
   ```

3. **Crear PostgreSQL Database**
   - DigitalOcean Managed Database ($15/mes)
   - O instalar en el mismo droplet (menos recomendado)

4. **Deploy App**
   ```bash
   # Clonar repo
   git clone your-repo.git
   cd restaurant-app
   
   # Instalar dependencias
   npm install
   
   # Build
   npm run build
   
   # Iniciar con PM2
   pm2 start npm --name restaurant-app -- start
   pm2 save
   pm2 startup
   ```

5. **Configurar Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Configurar SSL (Let's Encrypt)**
   ```bash
   apt-get install certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com
   ```

#### Costes Estimados:
- Droplet 2GB: $12/mes
- Managed PostgreSQL: $15/mes
- **Total: ~$27/mes**

---

### 4. Railway (Súper Fácil - Hobby)

Perfecto para prototipos y MVP.

#### Pasos:

1. **Conectar GitHub**
   - Ir a railway.app
   - Conectar repositorio

2. **Añadir PostgreSQL**
   - Click en "New" → "Database" → "PostgreSQL"

3. **Deploy**
   - Railway detecta Next.js automáticamente
   - Deploy automático con cada push

4. **Configurar Variables**
   - Añadir variables de entorno en Railway Dashboard

#### Costes:
- Gratis: $5 de crédito/mes
- Pro: $20/mes (más créditos)

---

## 🔒 Seguridad en Producción

### 1. Variables de Entorno
```bash
# NUNCA commitear estas variables
DATABASE_URL=...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
```

### 2. HTTPS Obligatorio
```javascript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  }
}
```

### 3. Rate Limiting
```bash
# Nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

### 4. Backups Automáticos
```bash
# Cron job diario
0 2 * * * pg_dump $DATABASE_URL | gzip > backup-$(date +\%Y\%m\%d).sql.gz
```

---

## 📊 Monitoring

### Recomendaciones:

1. **Application Performance**
   - Sentry (errores)
   - Datadog / New Relic (APM)
   - LogRocket (session replay)

2. **Infrastructure**
   - UptimeRobot (uptime monitoring)
   - CloudWatch / Grafana (métricas)

3. **Database**
   - pg_stat_statements (query performance)
   - pgBadger (log analysis)

---

## 🚨 Troubleshooting

### Build Fails

```bash
# Limpiar cache
rm -rf .next
npm run build
```

### Database Connection Error

```bash
# Verificar conexión
psql $DATABASE_URL -c "SELECT 1"

# Ver logs
tail -f /var/log/postgresql/postgresql.log
```

### High Memory Usage

```bash
# Aumentar Node.js heap
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

---

## 📈 Scaling

### Horizontal Scaling
- Load Balancer (Nginx/ALB)
- Multiple app instances
- Redis para sessions
- CDN para assets

### Database Scaling
- Read replicas
- Connection pooling (PgBouncer)
- Partitioning de tablas grandes
- Índices optimizados

### Caching
- Redis para queries frecuentes
- CDN para imágenes
- Service Worker para assets

---

## ✅ Checklist Pre-Launch

- [ ] Variables de entorno configuradas
- [ ] Database migrated & seeded
- [ ] SSL configurado
- [ ] Backups automáticos activos
- [ ] Monitoring configurado
- [ ] Rate limiting activo
- [ ] CORS configurado
- [ ] Error tracking (Sentry)
- [ ] Analytics configurado
- [ ] Load testing realizado
- [ ] Security audit completado
- [ ] Documentation actualizada
- [ ] Equipo formado
- [ ] Plan de rollback preparado

---

## 🆘 Soporte

Si tienes problemas durante el deployment:

1. Revisar logs: `pm2 logs` o `vercel logs`
2. Verificar variables de entorno
3. Consultar documentación específica de la plataforma
4. Contactar soporte técnico

---

**¡Buena suerte con tu deployment! 🚀**
