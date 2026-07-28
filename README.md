# Fudo Community

Resolución del challenge técnico Senior Front-end: una comunidad de publicaciones con conversaciones anidadas, construida con React, TypeScript y la API provista.

## Ejecutar localmente

Requiere Node.js 22 o superior.

```bash
corepack enable
pnpm install
pnpm dev
```

Validaciones antes de entregar:

```bash
pnpm test
pnpm build
```

## Docker

```bash
docker build -t fudo-community .
docker run --rm -p 8080:80 fudo-community
```

Abrir `http://localhost:8080`.

## Decisiones fáciles de explicar

- **HashRouter:** funciona al refrescar rutas en GitHub Project Pages sin configurar rewrites del servidor.
- **Fetch y CSS nativos:** el alcance no justifica sumar clientes HTTP, librerías de estado ni kits visuales.
- **Árbol de comentarios:** `buildCommentTree` indexa comentarios por ID, enlaza hijos y calcula descendientes con recursión. Un `parentId` inexistente queda como raíz, así nunca desaparece contenido.
- **Actualización con PUT:** la API real no admite PATCH; se fusiona el DTO existente con los campos editados antes de enviarlo para conservar propiedades.
- **Ruta de comentarios verificada:** todas las operaciones usan directamente `/post/:postId/comment`, que es la ruta disponible en la API real; no se mantiene un fallback ni estado global del endpoint.
- **Estado local:** es suficiente para este CRUD pequeño. Después de mutar comentarios se consulta otra vez el recurso para mantener la API como fuente de verdad.

## Funcionalidad

- Listado, alta, edición y eliminación de publicaciones.
- Detalle con todos los comentarios.
- Alta de comentarios raíz y respuestas con profundidad arbitraria.
- Edición y eliminación de comentarios.
- Conteo de todas las respuestas descendientes.
- Estados de carga, error y contenido vacío.
- Validación nativa y manual en formularios.
- Lecturas cancelables con `AbortController`.
- Diseño responsive, HTML semántico, foco visible, labels y avisos accesibles.

## Tests

La suite cubre el árbol de comentarios (anidamiento, conteo, huérfanos y ciclos), el contrato HTTP de publicaciones y comentarios, validación y presentación de errores, y el fallback de Nginx para rutas SPA sin ocultar assets inexistentes.

El razonamiento completo detrás de las decisiones está en [`docs/technical-decisions.md`](docs/technical-decisions.md).

## Deploy en GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` ejecuta tests, build y deploy al hacer push a `main`. En GitHub hay que seleccionar **Settings → Pages → Source: GitHub Actions**. Vite usa `base: './'` para funcionar bajo el subdirectorio del repositorio.

## Fuera de alcance

No se agregaron autenticación, paginación, búsqueda ni likes porque el challenge no los requiere.
