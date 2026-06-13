# Mambas Tattoo & Cuts

Sitio web de Mambas Tattoo & Cuts para barberia, tattoo, piercing, anticipos, registro de lealtad, ubicacion y contacto por WhatsApp.

## Desarrollo

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Verificacion

```bash
npm run lint
npm run build
```

## Deploy

El proyecto esta ligado a Vercel:

- Project: `mambas-web`
- Repo: `https://github.com/inkvonher/mambas-web`

Para publicar una nueva version:

```bash
git push origin main
```

Si se quiere publicar directo desde la CLI:

```bash
npx -y vercel --prod
```

## Dominio en Spaceship

Dominio final:

```text
https://mambaspdc.com
```

El dominio ya fue agregado en Vercel al proyecto `mambas-web`:

- `mambaspdc.com`
- `www.mambaspdc.com`

Si necesitas repetirlo manualmente:

1. Entrar a Vercel.
2. Abrir el proyecto `mambas-web`.
3. Ir a `Settings` -> `Domains`.
4. Agregar `mambaspdc.com`.
5. Agregar tambien `www.mambaspdc.com` y dejar uno como principal con redirect.

Luego configurar DNS en Spaceship. Usa los valores que muestre Vercel en la pantalla del dominio.

Configuracion tipica:

| Tipo | Host | Valor |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| A | `www` | `76.76.21.21` |

Despues de cambiar DNS, volver a Vercel y esperar la verificacion. Cuando Vercel marque el dominio como valido, crear o actualizar la variable de entorno:

```text
SITE_URL=https://mambaspdc.com
```

Ya fue aplicada en `Production` y `Development`. Despues de cualquier cambio de `SITE_URL`, redeployar.

## Variables

Copia `.env.example` a `.env.local` y rellena los valores. El sitio usa:

- `SITE_URL`: URL publica canonica del sitio.
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: conexion a Supabase (publicas).
- `SUPABASE_SERVICE_ROLE_KEY`: secreta, solo servidor. Opcional pero recomendada (ver Seguridad).

## Seguridad

El proyecto incluye varias capas de proteccion:

- **Cabeceras HTTP** (`next.config.ts`): CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy y Permissions-Policy aplicadas a todas las rutas.
- **Registro protegido**: el formulario de lealtad ya no escribe directo a Supabase desde el
  navegador. Pasa por `/api/register`, que valida los datos, usa un campo *honeypot* anti-bots
  y aplica un rate limit basico por IP.
- **Base de datos**: ejecuta `supabase-hardening.sql` en el SQL editor de Supabase (despues de
  `supabase-appointments.sql` y `supabase-clients-policies.sql`). Anade limites de longitud
  (CHECK constraints) que aplican a cualquier insercion.

### Cerrar la insercion anonima (recomendado)

Por defecto cualquiera con la anon key puede insertar en `clients`. Para cerrarlo del todo:

1. En Vercel anade `SUPABASE_SERVICE_ROLE_KEY` (Supabase > Project Settings > API > `service_role`).
2. En `supabase-hardening.sql`, descomenta el bloque de la seccion 3 y vuelve a ejecutarlo.

El sitio sigue funcionando porque `/api/register` inserta del lado del servidor con esa clave.
