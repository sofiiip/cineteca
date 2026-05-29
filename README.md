# 🎬 Cineteca — Tu watchlist personal

Aplicación web **serverless** para llevar el registro de las películas y series que
querés ver, estás viendo o ya viste. Cada usuario arma su propia lista, le pone
estado, puntaje y una reseña. Toda la información queda persistida en la nube y es
privada de cada usuario.

> Trabajo Práctico N.º 2 — **Aplicación Serverless**

**🔗 Demo en producción:** _(ver despliegue en Vercel)_

---

## ✨ Funcionalidades

- **Autenticación de usuarios**: registro, inicio y cierre de sesión (email + contraseña).
- **CRUD completo** de títulos asociados al usuario:
  - **Crear** un título (película o serie) con año, estado, puntaje y reseña.
  - **Visualizar** la lista con filtros por estado (pendiente / viendo / vista).
  - **Editar** cualquier título propio.
  - **Eliminar** títulos.
- **Persistencia en la nube** con PostgreSQL (Supabase).
- **Rutas protegidas**: sólo un usuario autenticado accede a su watchlist.
- **Aislamiento por usuario** a nivel de base de datos con Row Level Security.

---

## 🧱 Stack tecnológico

| Capa | Tecnología | Por qué |
|------|------------|---------|
| Frontend | **React + Vite** | SPA rápida, con HMR y build optimizado. |
| Ruteo | **React Router** | Navegación cliente y rutas protegidas. |
| Backend serverless | **Supabase** | Auth + base de datos PostgreSQL administrada, sin servidor propio. |
| Base de datos | **PostgreSQL** (Supabase) | Relacional, con RLS para seguridad por usuario. |
| Despliegue | **Vercel** | Deploy continuo desde GitHub y CDN global. |

### Decisiones técnicas

- **¿Por qué "serverless"?** No mantenemos un backend propio: Supabase expone la
  autenticación y la base de datos como servicios administrados, y la SPA los
  consume directamente desde el cliente con la _anon key_. La seguridad no depende
  del frontend sino de las **políticas RLS** en la base de datos.
- **Row Level Security**: aunque la _anon key_ es pública, cada consulta se filtra
  por `auth.uid()`. Un usuario **nunca** puede leer ni modificar filas de otro,
  incluso manipulando el request.
- **Context de React para la sesión**: `AuthContext` centraliza la sesión de
  Supabase y la escucha de cambios (`onAuthStateChange`), evitando prop-drilling.

---

## 📁 Estructura del proyecto

```
cineteca/
├── public/                 # favicon y estáticos
├── supabase/
│   └── schema.sql          # tabla + políticas RLS (ejecutar en Supabase)
├── src/
│   ├── components/         # Navbar, ProtectedRoute, TitleForm, TitleCard
│   ├── context/            # AuthContext (sesión global)
│   ├── pages/              # Login, Register, Watchlist
│   ├── supabaseClient.js   # cliente de Supabase
│   ├── App.jsx             # router
│   └── index.css           # estilos
├── .env.example            # plantilla de variables de entorno
└── README.md
```

---

## 🚀 Puesta en marcha (local)

### 1. Clonar e instalar

```bash
git clone https://github.com/sofiagrance/cineteca.git
cd cineteca
npm install
```

### 2. Crear el proyecto en Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecutar el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. En **Project Settings → API**, copiar la **Project URL** y la **anon public key**.

### 3. Variables de entorno

Copiar `.env.example` a `.env` y completar:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-public-key
```

### 4. Correr en desarrollo

```bash
npm run dev
```

La app queda en `http://localhost:5173`.

---

## 🌿 Estrategia de ramas (Git flow)

El repositorio sigue el modelo de trabajo pedido por la cátedra:

- **`main`** — versión estable y funcional. Es la que se despliega en producción.
- **`develop`** — rama de integración donde se juntan las features antes de pasar a `main`.
- **`sofia`** — rama de trabajo de la alumna 1 (layout, auth, estilos).
- **`nina`** — rama de trabajo de la alumna 2 (CRUD, base de datos, RLS).

El flujo: cada integrante trabaja en su rama → integra en `develop` → cuando hay
una versión estable se lleva a `main` y se despliega.

---

## 👥 Equipo

| Integrante | Rol | Responsabilidades |
|-----------|-----|-------------------|
| **sofiagrance** (Alumna 1) | Frontend / Auth | Layout, autenticación, estilos, ruteo. |
| **3Nina** (Alumna 2) | Datos / Backend | Modelo de datos, CRUD, políticas RLS, despliegue. |

---

## ☁️ Despliegue

El proyecto se despliega en **Vercel** conectando el repositorio de GitHub. Hay que
cargar las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en
**Project Settings → Environment Variables**. Cada push a `main` genera un nuevo
despliegue automático.
