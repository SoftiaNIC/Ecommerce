# ??? Arquitectura del Sistema - API Solecito Crochet

## ?? Visi�n General

La API de Solecito Crochet est� construida siguiendo una arquitectura moderna y escalable, utilizando Next.js 15 con el patr�n App Router, Prisma ORM para la gesti�n de base de datos, y un sistema de jobs as�ncrono para procesamiento en segundo plano.

## ??? Arquitectura General

```mermaid
graph TB
    A[Cliente Web/M�vil] --> B[Next.js API Routes]
    B --> C[Middleware de Autenticaci�n]
    C --> D[Controladores de Ruta]
    D --> E[Casos de Uso]
    E --> F[Repositorios Prisma]
    F --> G[(PostgreSQL)]
    
    H[Sistema de Jobs] --> I[Colas en Memoria]
    I --> J[Procesamiento As�ncrono]
    J --> F
    
    K[Cron Jobs] --> L[C�lculos Diarios]
    L --> F
```

## ?? Estructura del Proyecto

```
src/
+-- app/                    # Next.js App Router
�   +-- api/               # API Routes
�   �   +-- auth/         # Autenticaci�n
�   �   +-- products/     # Productos
�   �   +-- categories/   # Categor�as
�   �   +-- images/       # Im�genes
�   �   +-- admin/        # Administraci�n
�   +-- dashboard/        # Panel administrativo
�   +-- login/           # P�ginas de login
+-- components/           # Componentes React
+-- lib/                 # Utilidades y configuraci�n
�   +-- auth.ts          # Configuraci�n NextAuth
�   +-- popularity.ts    # Sistema de popularidad
�   +-- simpleJobScheduler.ts # Jobs as�ncronos
+-- domain/              # L�gica de dominio
�   +-- entities/        # Entidades del negocio
�   +-- utils/           # Utilidades de dominio
+-- infrastructure/      # Capa de infraestructura
�   +-- prisma/          # Repositorios Prisma
+-- types/               # Definiciones TypeScript
```

## ?? Tecnolog�as Principales

### Framework y Runtime
- **Next.js 15**: Framework React full-stack con App Router
- **React 19**: Librer�a de UI con Server Components
- **TypeScript 5**: Tipado est�tico para mayor robustez

### Base de Datos
- **PostgreSQL 15+**: Base de datos relacional robusta
- **Prisma 6.10**: ORM moderno con migraciones autom�ticas

### Autenticaci�n y Seguridad
- **NextAuth.js 4.24**: Autenticaci�n completa con JWT
- **bcryptjs**: Encriptaci�n de contrase�as
- **Roles**: CLIENTE, ADMIN, SUPERADMIN

### Procesamiento As�ncrono
- **node-cron**: Jobs programados
- **Colas en memoria**: Procesamiento de jobs sin Redis
- **Sistema de m�tricas**: C�lculos autom�ticos de popularidad

## ??? Modelo de Datos

### Entidades Principales

#### Usuario (User)
```typescript
{
  id: string
  name?: string
  email: string (�nico)
  password: string (encriptada)
  role: UserRole (CLIENTE | ADMIN | SUPERADMIN)
  accounts: Account[]
  sessions: Session[]
  products: Product[]
}
```

#### Producto (Product)
```typescript
{
  id: string
  name: string
  description?: string
  price: number
  category: string
  categoryId?: string
  stock: number
  isActive: boolean
  featured: boolean
  materials?: string
  dimensions?: string
  weight?: string
  careInstructions?: string
  images: ProductImage[]
  creator: User
  popularity: PopularityMetric
}
```

#### Categor�a (Category)
```typescript
{
  id: string
  name: string (�nico)
  slug: string (�nico)
  icon: string
  description?: string
  isActive: boolean
  isCustom: boolean
  products: Product[]
}
```

## ?? Sistema de Popularidad

### Algoritmos de Scoring

#### Popularidad General
```typescript
popularityScore = 
  (weeklyClicks � 0.4) + 
  (monthlyClicks � 0.3) + 
  (whatsappClicks � 2.0) + 
  (favoriteClicks � 1.5) + 
  (totalClicks � 0.1)
```

#### Productos Destacados
```typescript
featuredScore = 
  (whatsappClicks � 3.0) + 
  (favoriteClicks � 1.0) + 
  (weeklyClicks � 0.5) + 
  (monthlyClicks � 0.3)
```

### Clasificaci�n Autom�tica
- **Top 20%** ? Productos Populares
- **Top 15%** ? Productos Destacados
- **Reset peri�dico**: Semanal, mensual, anual

## ?? Sistema de Jobs As�ncronos

### Tipos de Jobs
1. **Popularity**: C�lculo de m�tricas de popularidad
2. **Featured**: Evaluaci�n para productos destacados
3. **Classification**: Clasificaci�n autom�tica

### Programaci�n
- **Diaria**: 6:00 AM (hora Nicaragua)
- **Manual**: Desde panel administrativo
- **Por producto**: Triggers autom�ticos

## ?? Seguridad

### Autenticaci�n
- JWT con NextAuth.js
- Sesiones seguras
- Protecci�n CSRF

### Autorizaci�n
- Middleware de validaci�n de roles
- Verificaci�n en cada endpoint protegido
- Logs de acceso

### Validaci�n
- Validaci�n de entrada en controladores
- Sanitizaci�n de datos
- L�mites de rate limiting

## ?? Rendimiento

### Optimizaciones
- **Paginaci�n**: skip/take eficiente
- **Cache**: Headers HTTP apropiados
- **Queries**: Optimizadas con select
- **Im�genes**: Compresi�n autom�tica

### M�tricas de Performance
- Tiempo de respuesta < 200ms
- Throughput de 1000+ req/min
- Cache hit rate > 80%

## ?? Escalabilidad

### Estrategias
- **Horizontal**: M�ltiples instancias
- **Vertical**: Optimizaci�n de recursos
- **Cache**: Redis para sesiones
- **CDN**: Para im�genes est�ticas

### L�mites Actuales
- **Jobs**: Procesamiento en memoria
- **Im�genes**: Almacenamiento en DB
- **Sesiones**: Sin Redis clustering

## ?? Ciclo de Vida de una Solicitud

```mermaid
sequenceDiagram
    participant C as Cliente
    participant M as Middleware
    participant R as Route Handler
    participant U as Use Case
    participant P as Prisma Repo
    participant DB as PostgreSQL

    C->>M: HTTP Request
    M->>M: Validar autenticaci�n
    M->>R: Request v�lido
    R->>U: Ejecutar l�gica
    U->>P: Consultar datos
    P->>DB: Query SQL
    DB->>P: Resultados
    P->>U: Datos procesados
    U->>R: Respuesta
    R->>C: HTTP Response
```

## ?? Testing

### Estrategias
- **Unit Tests**: Funciones utilitarias
- **Integration Tests**: API endpoints
- **E2E Tests**: Flujos completos

### Herramientas
- **Jest**: Framework de testing
- **Supertest**: Testing de API
- **Prisma Test**: Base de datos de test

## ?? Checklist de Arquitectura

### ? Principios Seguidos
- [x] Separaci�n de responsabilidades
- [x] Inyecci�n de dependencias
- [x] Principio de responsabilidad �nica
- [x] Abierto/cerrado principle

### ? Patrones Implementados
- [x] Repository Pattern
- [x] Strategy Pattern (jobs)
- [x] Observer Pattern (cron jobs)
- [x] Factory Pattern (productos)

### ? Mejores Pr�cticas
- [x] Error handling consistente
- [x] Logging estructurado
- [x] Validaci�n de entrada
- [x] Documentaci�n completa

---

## ?? Conclusiones

Esta arquitectura proporciona:

1. **Escalabilidad**: F�cil de escalar horizontalmente
2. **Mantenibilidad**: C�digo organizado y documentado
3. **Performance**: Optimizaciones en todos los niveles
4. **Seguridad**: M�ltiples capas de protecci�n
5. **Flexibilidad**: F�cil agregar nuevas funcionalidades

La arquitectura est� preparada para crecer con el negocio y adaptarse a nuevos requisitos sin comprometer la estabilidad del sistema existente.
