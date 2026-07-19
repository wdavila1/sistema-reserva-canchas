# Sistema Web de Reservación de Canchas Deportivas

Monorepo del proyecto: **frontend** (React + Vite + TS), **backend** (Node.js + Express) y **base de datos** (PostgreSQL en Supabase). El detalle funcional está en [`docs/Propuesta_Sistemas_Expertos.md`](./docs/Propuesta_Sistemas_Expertos.md) y el esquema completo en [`sql/db.sql`](./sql/db.sqldb/db.sql).

## Estructura del proyecto

```
proyecto-canchas/
├── package.json   → npm workspaces (une backend + frontend, un solo install/dev)
├── backend/       → API REST en Express
├── frontend/      → SPA en React + Vite + TypeScript
├── docs/          → Propuesta funcional del proyecto
└── sql/db.sql        → Script de creación + datos base (seeds) de la base de datos
```

#### Instalar y ejecutar

```bash
npm install           # instala backend Y frontend de una vez, desde la raíz
npm run dev            # levanta backend (puerto 4000) + frontend (puerto 5173) juntos
```

Cada app tiene su propio `.env` estos ya estan con las api keys de supabase funcionando.

---

## Backend (`backend/`)

```
backend/src/
├── config/
│   ├── db.js            # Pool de conexión a Postgres (Supabase, modo Session)
│   ├── supabase.js       # Cliente de Supabase solo para Storage (no para tablas)
│   └── env.js            # Carga y valida las variables de entorno
├── middlewares/
│   ├── auth.middleware.js    # Valida el JWT y arma req.user
│   ├── roles.middleware.js   # requiereRol(['Administrador']) por ruta
│   └── error.middleware.js   # Manejador de errores centralizado
├── modules/
│   ├── auth/          # ✅ Implementado: registro, login, refresh, logout, /me
│   ├── usuarios/       # Stub (TODO)
│   ├── canchas/        # Stub (TODO)
│   ├── reservas/       # Stub (TODO)
│   ├── facturas/       # Stub (TODO) — Facturas, CAIControl, Empresa
│   ├── pagos/           # Stub (TODO) — pago simulado, sin pasarela real
│   └── reportes/        # Stub (TODO)
├── utils/
│   ├── jwt.js           # firmarAccessToken/RefreshToken, verificar*
│   ├── bcrypt.js         # hash/comparar contraseña (bcryptjs, sin compilación nativa)
│   ├── ApiError.js       # Error controlado con código HTTP
│   └── asyncHandler.js   # Wrapper para no repetir try/catch en cada controller
├── routes.js            # Junta las rutas de todos los módulos
└── app.js                # Express, cors, cookies, montaje de rutas, error handler
```

Convención por módulo: `*.routes.js` → `*.controller.js` → `*.service.js` (si hay lógica de negocio) → `*.repository.js` (queries SQL).

### Módulo `auth` — endpoints disponibles

| Endpoint                  | Qué hace                                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/auth/registro` | Crea Persona + Usuario (rol `Cliente`), hashea la contraseña, devuelve `{ usuario, accessToken }` + cookie httpOnly con el refresh token |
| `POST /api/auth/login`    | Verifica usuario/correo + contraseña, misma respuesta que registro                                                                       |
| `POST /api/auth/refresh`  | Usa la cookie httpOnly para dar un `accessToken` nuevo (así la sesión sobrevive un refresh de página)                                    |
| `POST /api/auth/logout`   | Borra la cookie del refresh token                                                                                                        |
| `GET /api/auth/me`        | Requiere `Authorization: Bearer <token>`, devuelve el perfil del usuario logueado                                                        |

---

## Frontend (`frontend/`)

```
frontend/src/
├── services/
│   ├── axiosClient.ts   # axios con el JWT inyectado + refresh automático ante un 401
│   ├── auth.api.ts       # ✅ login(), registro(), refresh(), me(), logout()
│   ├── canchas.api.ts    # Stub (TODO)
│   └── reservas.api.ts   # Stub (TODO)
├── context/
│   └── AuthContext.tsx   # Estado global de sesión + restaura la sesión al cargar la app
├── hooks/
│   └── useAuth.ts        # useContext(AuthContext)
├── routes/
│   ├── AppRouter.tsx      # Rutas reales de react-router-dom
│   ├── ProtectedRoute.tsx     # Exige login
│   └── AdminRoute.tsx          # Exige rol admin
├── layouts/
│   ├── PublicLayout.tsx   # Navbar + Outlet + Footer
│   └── AdminLayout.tsx    # Sidebar admin + Outlet
├── components/, pages/, types/, utils/, mocks/, styles/   # Base visual (ya existente)
└── tsconfig.json, tsconfig.app.json, tsconfig.node.json    # Chequeo de tipos real (tsc -b)
```

### Rutas de `AppRouter.tsx`

| Ruta                                                                                                | Acceso               |
| --------------------------------------------------------------------------------------------------- | -------------------- |
| `/`, `/canchas`, `/canchas/:id`, `/login`, `/registro`, `/nosotros`, `/contacto`                    | Público              |
| `/reservar/:courtId`, `/mis-reservas`                                                               | Requiere login       |
| `/admin`, `/admin/canchas`, `/admin/reservas`, `/admin/pagos`, `/admin/reportes`, `/admin/usuarios` | Requiere rol `admin` |

### Ya conectado al backend real

- **Login/Registro**: `LoginPage` y `RegistroPage` llaman a `services/auth.api.ts` de verdad. `RegistroPage` pide los campos separados como los tiene `Personas` en `db.sql` (primer/segundo nombre, primer/segundo apellido, correo, **teléfono obligatorio**, nombre de usuario, contraseña).
- **Sesión persistente**: al cargar la app, `AuthContext` restaura la sesión con la cookie httpOnly del refresh token — un refresh de página ya no desloguea.

### Todavía con datos de prueba (mocks)

- `CanchaDetailPage` y `ReservasPage` buscan la cancha en `mocks/courts.ts` en vez de pedirla al backend (marcado con `TODO` en el código) — depende de que se implemente `modules/canchas/`.

---

## Base de datos (`db.sql`)

PostgreSQL en 3FN, pensado para correr tal cual en el SQL Editor de Supabase. Incluye los **datos base (seeds)** sin los cuales el sistema no puede funcionar:

| Tabla                   | Seed                                                                                | Por qué es necesario                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `Roles`                 | `Administrador`, `Cliente`                                                          | El registro de usuarios asigna `Cliente` por defecto                                                           |
| `Usuarios` / `Personas` | 1 usuario admin (`admin` / `Admin123!`) y 1 usuario cliente (`esanchez` / `123456`) | Sin esto nadie puede entrar a `/admin` — el registro público siempre crea clientes                             |
| `TiposCancha`           | Fútbol 5, Baloncesto, Voleibol, Tenis, Pádel                                        | `Canchas.TipoCanchaID` es obligatorio                                                                          |
| `MetodosPago`           | Efectivo, Tarjeta (simulado), Transferencia (simulado)                              | `Pagos.MetodoPagoID` es obligatorio                                                                            |
| `Empresa`               | 1 fila de ejemplo (datos ficticios)                                                 | `Facturas` depende de esto vía `CAIControl` — **reemplazar con los datos fiscales reales** antes de producción |
| `CAIControl`            | 1 fila placeholder, `Estado = FALSE`                                                | El CAI real lo emite la SAR — esta fila queda inactiva a propósito hasta que se reemplace por el CAI verdadero |

> ⚠️ **Contraseña del admin** (`Admin123!`)

Columnas para imágenes (Supabase Storage — el backend es el único que sube archivos, nunca el frontend directo):

| Tabla      | Columna         | Bucket sugerido    |
| ---------- | --------------- | ------------------ |
| `Canchas`  | `ImagenURL`     | `canchas-imagenes` |
| `Personas` | `FotoPerfilURL` | `perfiles`         |
| `Empresa`  | `LogoURL`       | `empresa`          |

---

## Variables de entorno

**`backend/.env`**

```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx
JWT_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

`DATABASE_URL` usa el modo **Session** del pooler de Supabase (puerto 5432): funciona igual en desarrollo y producción, y es compatible con redes IPv4-only.

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:4000/api
```

## Ejecución con Docker

### Requisitos previos

Antes de ejecutar el proyecto utilizando Docker, asegúrese de cumplir con los siguientes requisitos:

1. Tener instalado y ejecutándose **Docker Desktop**.
2. Tener el repositorio del proyecto clonado en el equipo.
3. Configurar las variables de entorno del backend.

### Configuración de variables de entorno

Dentro de la carpeta del backend, se debe crear el archivo de variables de entorno a partir del archivo de ejemplo:

1. Ubicarse en la carpeta:

```bash
backend/
```

2. Copiar el archivo `.env.example` y renombrarlo como `.env`.

3. Completar los valores correspondientes dentro del archivo `.env`.

En caso de contar previamente con un archivo `.env`, verificar que la variable del frontend tenga el siguiente valor:
```env
FRONTEND_URL=http://localhost
```

Esto permite la comunicación correcta entre el frontend y el backend dentro del entorno local.

**Nota:** El cambio de `FRONTEND_URL=http://localhost` aplica únicamente para la ejecución del proyecto mediante Docker. En otros entornos, la variable debe configurarse con la URL correspondiente del frontend.

### Instalación de dependencias

Antes de construir las imágenes de Docker, verifique que el proyecto contenga el archivo `package-lock.json` en la carpeta raíz.

Este archivo permite instalar las mismas versiones de las dependencias utilizadas durante el desarrollo. Si el archivo no existe, genere el archivo ejecutando el siguiente comando desde la carpeta raíz del proyecto:

```bash
npm install
```

Una vez generado el package-lock.json, puede continuar con el proceso de construcción de las imágenes de Docker.

### Construcción y ejecución del proyecto
1. Iniciar Docker Desktop.
2. Abrir una terminal (Visual Studio Code, PowerShell o CMD).
3. Ubicarse en la carpeta raíz del proyecto, donde se encuentra el archivo:
```
docker-compose.yml
```
4. Construir las imágenes de Docker ejecutando:
```bash
docker compose build --no-cache
```
El parámetro --no-cache permite realizar una construcción limpia de las imágenes, ignorando capas almacenadas previamente por Docker.

5. Iniciar los servicios del proyecto:
```bash
docker compose up
```

### Comandos útiles

#### Ver el estado de los contenedores activos:
```bash
docker ps
```

#### Levantar los servicios (en segundo plano):
```bash
docker-compose up -d
```

#### Detener los servicios:
```bash
docker-compose down
```

#### Reconstruir las imágenes tras cambios en el código:
```bash
docker-compose up --build
```


#### Ver los logs de los servicios:
```bash
docker compose logs
```

#### Para ver los logs de un servicio específico:
```bash
docker compose logs frontend
```

```bash
docker compose logs backend
```

