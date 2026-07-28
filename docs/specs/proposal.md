# Propuesta: entregar el MVP de Fudo Community

## Intención

Construir la experiencia mínima completa de una comunidad anónima: explorar publicaciones, mantenerlas y participar en conversaciones anidadas. El objetivo es cumplir el desafío con una solución pequeña, verificable y accesible, sin ocultar el problema central detrás de infraestructura innecesaria.

## Alcance

### Dentro

- SPA adaptable con lista, detalle y rutas no encontradas.
- CRUD de publicaciones, comentarios raíz y respuestas.
- Conversaciones de profundidad arbitraria con recuento de descendientes.
- Estados de carga, vacío y error; validación y mutaciones confirmadas por servidor.
- Pruebas de contratos y lógica de riesgo, build reproducible y entrega estática.

### Fuera

- Autenticación, autorización y propiedad del contenido.
- Paginación, búsqueda, filtros, reacciones, moderación y tiempo real.
- Estado global, caché cliente, actualizaciones optimistas y sistema de diseño.
- Cambios en la MockAPI suministrada.

## Capacidades

- [Explorar publicaciones](explorar-publicaciones.md): lista, detalle, navegación y estados de lectura.
- [Gestionar publicaciones](gestionar-publicaciones.md): creación, edición y eliminación confirmadas.
- [Conversaciones anidadas](conversaciones-anidadas.md): CRUD de comentarios, jerarquía defensiva y recuentos.

## Enfoque

Usar React y TypeScript con estado local por ruta, React Router, Fetch nativo y CSS Modules. Concentrar el contrato HTTP en un módulo, transformar la lista plana de comentarios mediante una función pura y volver a consultar la conversación después de cada mutación.

## Áreas afectadas

| Área | Impacto |
| --- | --- |
| `src/pages/`, `src/components/`, `src/App.tsx` | Recorridos, formularios y estados de UI |
| `src/api/api.ts`, `src/types.ts` | Contrato HTTP y DTO |
| `src/commentTree.ts`, `src/utils/` | Árbol, validación y presentación |
| `src/**/*.test.ts`, `nginx.test.ts` | Verificación automatizada |
| `Dockerfile`, `nginx.conf`, `.github/workflows/deploy-pages.yml` | Build y despliegue |

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Diferencias entre PDF y MockAPI | Verificar rutas y cuerpos con pruebas contractuales |
| Datos de comentarios malformados | Promover nodos inseguros a raíz y evitar ciclos |
| Respuestas obsoletas | Cancelar lecturas y comprobar la ruta vigente |
| MVP amplio para una revisión | Entregar por unidades verticales reversibles |

## Rollback

Revertir la unidad vertical afectada y volver a desplegar el último `dist` válido. No hay migraciones ni datos locales que restaurar; las mutaciones ya confirmadas permanecen en la API.

## Criterios de éxito

- [ ] Las tres especificaciones pasan sus escenarios funcionales.
- [ ] `pnpm test` y `pnpm build` finalizan correctamente.
- [ ] Los recorridos principales funcionan con teclado y desde 320 CSS px.
- [ ] Docker/Nginx y GitHub Pages sirven la SPA sin ocultar assets inexistentes.
