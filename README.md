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

Cuando tengas el dominio exacto, agregalo primero en Vercel:

1. Entrar a Vercel.
2. Abrir el proyecto `mambas-web`.
3. Ir a `Settings` -> `Domains`.
4. Agregar el dominio apex, por ejemplo `tudominio.com`.
5. Agregar tambien `www.tudominio.com` y dejar uno como principal con redirect.

Luego configurar DNS en Spaceship. Usa los valores que muestre Vercel en la pantalla del dominio.

Configuracion tipica:

| Tipo | Host | Valor |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | valor CNAME indicado por Vercel |

Despues de cambiar DNS, volver a Vercel y esperar la verificacion. Cuando Vercel marque el dominio como valido, crear o actualizar la variable de entorno:

```text
SITE_URL=https://tudominio.com
```

Aplicarla en `Production`, `Preview` y `Development` si quieres que sitemap, canonical y Open Graph usen el dominio nuevo en todos los entornos. Despues redeployar.

## Variables

El sitio usa:

- `SITE_URL`: URL publica canonica del sitio.
- Variables Supabase en `.env.local` para el registro de clientes.
