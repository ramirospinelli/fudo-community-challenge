# Diseño: entregar el MVP de Fudo Community

## Enfoque técnico

Una SPA de dos páginas concentra la interacción en React y conserva la MockAPI como fuente de verdad. Las tres [especificaciones funcionales](README.md) se implementan con estado local, un cliente HTTP pequeño y una transformación pura para la conversación. No se agregan capas que solo delegarían.

## Decisiones

| Decisión | Alternativa y tradeoff | Motivo |
| --- | --- | --- |
| React 19, TypeScript estricto y Vite | SSR/otro bundler: más runtime y configuración | La aplicación es interactiva, pública y estática |
| `HashRouter` con `/`, `/post/:id` y `*` | `BrowserRouter`: URL más limpia, exige rewrites | Funciona en GitHub Pages sin soporte del servidor |
| Estado local en `Home` y `Detail` | Store o caché: útil con consumidores compartidos | Las rutas son independientes y pequeñas |
| Fetch centralizado en `src/api/api.ts` | Axios/repository: más dependencia o wrappers | Fetch cubre JSON, errores y `AbortSignal` |
| Mutaciones pesimistas y recarga de comentarios | Optimismo: mejor latencia percibida, exige rollback | La UI solo afirma resultados confirmados |
| `Map` más render recursivo | Búsquedas repetidas o librería de árbol | Enlaza una lista plana y calcula descendientes sin dependencia |
| CSS Modules y estilos globales mínimos | Kit UI: acelera uniformidad a costa de peso | El alcance no requiere un sistema de diseño |

Las lecturas se cancelan al desmontar o cambiar de publicación. El detalle carga publicación y comentarios en paralelo. Huérfanos, autorreferencias y ciclos se muestran como raíces para no perder contenido ni recursar indefinidamente.

## Flujo de datos

```text
HashRouter
  ├─ Home ──→ api.posts / create / update / delete
  │              │
  │              └──→ MockAPI ──→ estado local ──→ lista
  └─ Detail ─→ Promise.all(post, comments) ──→ estado local
                     │                              │
                     └── mutación → recarga ───────┤
                                                    └→ buildCommentTree → CommentItem*
```

## Estructura y cambios

| Ruta | Acción | Responsabilidad |
| --- | --- | --- |
| `src/main.tsx`, `src/App.tsx` | Crear | Montaje, `HashRouter`, shell y rutas |
| `src/pages/Home.tsx` | Crear | Lista y CRUD de publicaciones |
| `src/pages/Detail.tsx` | Crear | Detalle, carga coordinada y conversación |
| `src/pages/NotFound.tsx` | Crear | Ruta desconocida |
| `src/components/{Avatar,PostForm,CommentForm,CommentItem}.tsx` | Crear | Presentación y mutaciones reutilizables |
| `src/api/api.ts`, `src/types.ts` | Crear | Transporte, errores y DTO |
| `src/commentTree.ts`, `src/utils/*.ts` | Crear | Árbol, validación y mensajes |
| `src/**/*.module.css`, `src/styles/global.css` | Crear | Estilos aislados y fundamentos accesibles |
| `src/**/*.test.ts`, `nginx.test.ts` | Crear | Contratos HTTP, árbol, utilidades y Nginx |
| `vite.config.ts`, `Dockerfile`, `nginx.conf`, `.github/workflows/deploy-pages.yml` | Crear | Build relativo y entrega |

## Contratos

- Publicación: `id`, `createdAt`, `name`, `avatar`, `title`, `content`.
- Comentario: los campos de autor y contenido, más `postId` y `parentId: string | null`.
- HTTP: `/post`, `/post/:id` y `/post/:postId/comment[/commentId]`; crear con `POST`, editar con `PUT` completo y eliminar con `DELETE`.
- Un `404` de colección de comentarios equivale a `[]`; un `404` de publicación conserva su significado.
- Los formularios recortan extremos, aplican límites de las specs y aceptan solo avatar HTTPS opcional.

## Estrategia de pruebas

| Capa | Cobertura | Mecanismo |
| --- | --- | --- |
| Unidad | Árbol, ciclos, huérfanos, validación y mensajes | Vitest sobre funciones puras |
| Contrato | URL, método, cuerpo, 404 y 204 | Vitest con `fetch` simulado |
| Integración | Lista, detalle, CRUD, recarga y cancelación | Recorridos manuales contra MockAPI |
| Entrega | Build, fallback SPA y assets 404 | `pnpm build`, Vitest y contenedor |

Cada unidad sigue RED → GREEN → REFACTOR; se prueba primero el contrato o rama de riesgo mínima.

## Matriz de amenazas

N/A — no se modifican límites de routing del sistema, shell, subprocesos, automatización VCS/PR, clasificación de ejecutables ni integración de procesos.

## Despliegue y migración

No requiere migración de datos ni feature flag. `pnpm build` produce `dist`; Docker lo sirve con Nginx y el workflow publica el mismo artefacto en GitHub Pages. El rollout es reemplazable por el build anterior.

## Preguntas abiertas

Ninguna que bloquee el MVP. Autenticación, escala y URL sin hash requieren contratos futuros explícitos.
