# Ingesuelos Concalidad S.A.S. — Sitio web

Sitio catálogo de [Ingesuelos Concalidad S.A.S.](https://www.ingesuelosconcalidad.com), empresa de obras civiles, consultoría, interventoría y laboratorio de suelos, concretos y pavimentos en Apartadó (Urabá, Colombia).

Hecho con [Astro](https://astro.build) y [Tailwind CSS](https://tailwindcss.com). Es un sitio estático, bilingüe (español / inglés), con modo oscuro y sin JavaScript salvo lo mínimo.

## Comandos

| Comando | Acción |
| :-- | :-- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera el sitio en `./dist/` |
| `npm run deploy` | Genera y publica en Cloudflare Pages |

## Dónde editar

| Qué | Dónde |
| :-- | :-- |
| Teléfonos, correo, dirección, cifras | `src/data/empresa.ts` |
| Servicios (un archivo por servicio) | `src/content/servicios/*.md` |
| Obras (un archivo por obra) | `src/content/proyectos/*.md` |
| Textos de la interfaz (ES / EN) | `src/i18n/ui.ts` |
| Colores y estilos globales | `src/styles/global.css` |

La traducción al inglés de cada servicio u obra va en el bloque `en:` de su archivo `.md`. Si falta, la versión en inglés muestra el texto en español.

Para añadir fotos a una obra, coloca las imágenes junto a su `.md` y referéncialas en `portada:` o `galeria:`. Astro las optimiza automáticamente.

## Despliegue

- Hosting: Cloudflare Pages (proyecto `ingesuelosconcalidad`).
- DNS: Cloudflare. El dominio y el correo siguen registrados en Dongee.

## Licencia

Código publicado solo para consulta: todos los derechos reservados. El contenido, la marca y las fotografías pertenecen a Ingesuelos Concalidad S.A.S. Ver [LICENSE](LICENSE).
