# Tareas: entregar el MVP de Fudo Community

## Review Workload Forecast

| Campo | Valor |
| --- | --- |
| Líneas cambiadas estimadas | 900–1300 |
| Riesgo del presupuesto de 400 líneas | Alto |
| PR encadenadas recomendadas | Sí |
| División sugerida | Exploración → publicaciones → conversaciones → entrega |
| Delivery strategy | `ask-on-risk` |
| Chain strategy | `pending` |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Unidades de trabajo sugeridas

| Unidad | Objetivo | Prueba focalizada | Harness de ejecución | Límite de rollback |
| --- | --- | --- | --- | --- |
| 1 | Explorar publicaciones | `pnpm exec vitest run src/api/api.test.ts src/utils` | `pnpm dev`: lista, detalle y 404 | rutas, lectura y presentación |
| 2 | Gestionar publicaciones | `pnpm exec vitest run src/api/api.test.ts` | `pnpm dev`: crear, editar y eliminar | formularios y CRUD de posts |
| 3 | Conversaciones anidadas | `pnpm exec vitest run src/commentTree.test.ts src/api/api.test.ts` | `pnpm dev`: comentar, responder y mantener | árbol y CRUD de comentarios |
| 4 | Accesibilidad y entrega | `pnpm exec vitest run nginx.test.ts` | Docker: abrir rutas y asset inexistente | estilos, contenedor y workflow |

La estrategia de cadena debe decidirse antes de aplicar; este plan no elige por el equipo.

## 1. Explorar publicaciones

- [ ] **1.1 RED:** crear pruebas en `src/api/api.test.ts` y `src/utils/*.test.ts` para lecturas, 404, errores, fechas y avatar HTTPS.
- [ ] **1.2 GREEN:** crear `src/api/api.ts`, `src/types.ts`, `src/utils/*.ts`, `src/App.tsx`, `src/pages/{Home,Detail,NotFound}.tsx` con lista, detalle y cancelación.
- [ ] **1.3 REFACTOR:** extraer solo `Avatar` y presentación compartida; verificar los escenarios de [exploración](explorar-publicaciones.md).

## 2. Gestionar publicaciones

- [ ] **2.1 RED:** ampliar `src/api/api.test.ts` para `POST`, `PUT` completo, `DELETE`, 204 y fallos sin resultado optimista.
- [ ] **2.2 GREEN:** crear `src/components/PostForm.tsx` y conectar el CRUD en `src/pages/Home.tsx` y `src/pages/Detail.tsx`.
- [ ] **2.3 REFACTOR:** centralizar validación reutilizable en `src/utils/validation.ts`; verificar [gestión de publicaciones](gestionar-publicaciones.md).

## 3. Conversaciones anidadas

- [ ] **3.1 RED:** crear `src/commentTree.test.ts` para desorden, profundidad, descendientes, huérfanos, autorreferencias y ciclos; cubrir rutas singulares en `src/api/api.test.ts`.
- [ ] **3.2 GREEN:** crear `src/commentTree.ts`, `src/components/{CommentForm,CommentItem}.tsx` y conectar creación, edición, eliminación y recarga en `src/pages/Detail.tsx`.
- [ ] **3.3 REFACTOR:** conservar el algoritmo puro y el render recursivo separados; verificar [conversaciones anidadas](conversaciones-anidadas.md).

## 4. Accesibilidad y entrega

- [ ] **4.1 RED:** crear `nginx.test.ts` para fallback SPA y 404 de assets; registrar recorridos fallidos de teclado y 320 CSS px.
- [ ] **4.2 GREEN:** completar `src/**/*.module.css`, `src/styles/global.css`, `vite.config.ts`, `Dockerfile`, `nginx.conf` y `.github/workflows/deploy-pages.yml`.
- [ ] **4.3 REFACTOR:** eliminar duplicación accidental, ejecutar `pnpm test` y `pnpm build`, y comprobar Docker, teclado y viewport.
