# Decisiones técnicas de Fudo Community

Este documento explica las decisiones vigentes del proyecto, sus motivos y sus
contrapartidas. La regla general es mantener la solución proporcional al
challenge: usar primero capacidades nativas, crear límites claros y sumar
infraestructura solo cuando exista una necesidad concreta.

## Resumen

| Área | Decisión | Motivo principal |
| --- | --- | --- |
| Paquetes | pnpm 11.9.0 y versiones directas explícitas | Instalaciones reproducibles con un único lockfile |
| Aplicación | React 19 + TypeScript estricto + Vite | SPA interactiva con build y configuración mínimos |
| Rutas | React Router con `HashRouter` | Navegación compatible con GitHub Pages sin rewrites |
| HTTP | Fetch nativo detrás de `src/api/api.ts` | JSON, errores y cancelación sin otra dependencia |
| Estado | Estado local por página | No existe estado compartido que justifique un store |
| Estilos | CSS Modules y CSS global mínimo | Aislamiento sin runtime ni kit visual |
| Pruebas | Vitest sobre lógica y contratos de mayor riesgo | Cobertura útil dentro del mismo toolchain de Vite |
| Entrega | Docker multietapa, Nginx y GitHub Pages | Runtime pequeño y despliegue estático verificable |

## 1. pnpm y reproducibilidad

### Decisión

El proyecto declara:

```json
"packageManager": "pnpm@11.9.0"
```

Las dependencias directas tienen versiones explícitas y `pnpm-lock.yaml`
registra el árbol resuelto.

### Por qué

- Corepack puede seleccionar la misma versión de pnpm localmente, en Docker y
  en CI.
- `pnpm install --frozen-lockfile` evita que una instalación de entrega
  modifique silenciosamente el lockfile.
- Las versiones explícitas evitan que regenerar el lockfile convierta
  `latest` en una actualización mayor accidental.
- Cambiar a npm o Yarn no resuelve ningún problema actual y obligaría a
  reemplazar una cadena de instalación que ya es coherente.

### Tradeoff y criterio de cambio

El lockfile debe revisarse junto con cualquier actualización. Solo corresponde
cambiar de gestor si una restricción del entorno de build o del equipo lo
exige; no por preferencia aislada.

## 2. Vite como servidor y herramienta de build

### Decisión

Vite ejecuta el servidor de desarrollo y genera `dist`. El plugin oficial de
React procesa JSX y Fast Refresh. `base: './'` produce referencias relativas a
los assets.

### Por qué

- El proyecto es una SPA y no necesita renderizado del servidor.
- Vite integra React, TypeScript, CSS Modules y Vitest con poca configuración.
- La base relativa permite servir el mismo build desde el subdirectorio de
  GitHub Pages y desde Nginx.

### Qué no se agregó

Next.js, Remix o una configuración manual de Webpack añadirían routing,
runtime o configuración que el challenge no utiliza. Se reconsiderarían ante
SSR, SEO indexable, rutas de servidor o una plataforma que lo requiera.

## 3. React y `StrictMode`

### Decisión

La UI usa componentes funcionales y hooks. `main.tsx` monta la aplicación con
`createRoot` dentro de `StrictMode`.

### Por qué

React encaja con páginas interactivas, formularios reutilizables y el render
recursivo de comentarios. `StrictMode` ayuda a detectar efectos sin cleanup y
supuestos incorrectos durante desarrollo.

### Tradeoff

En desarrollo React puede repetir ciclos de efectos para revelar errores. Por
eso las lecturas tienen cleanups cancelables; no se debe quitar `StrictMode`
para ocultar un efecto defectuoso.

## 4. TypeScript y límites de compilación

### Decisión

Se usa TypeScript con `strict: true`, `noEmit: true` y resolución de módulos
para bundlers.

Los proyectos están separados:

- `tsconfig.app.json`: `src`, JSX y APIs del navegador.
- `tsconfig.node.json`: `vite.config.ts` y `nginx.test.ts`, ejecutados en Node.
- `tsconfig.json`: referencias para que `tsc -b` verifique ambos.

Los archivos incrementales se guardan en `node_modules/.cache`.

### Por qué

- El modo estricto detecta campos ausentes, valores nulos y contratos
  incompatibles antes de ejecutar la aplicación.
- Vite emite los assets; TypeScript se limita a comprobar tipos.
- Separar navegador y tooling evita aplicar accidentalmente supuestos DOM a
  código de Node.
- `src` es el límite de la aplicación. Por eso el cliente HTTP vive en
  `src/api`, no fuera de `src`.
- `nginx.test.ts` forma parte del typecheck de Node porque importa
  `node:fs` y lee configuración del repositorio.

### Criterio de cambio

Se crearían más proyectos TypeScript únicamente si aparece otro runtime real,
por ejemplo un servidor Node o un paquete compartido publicado.

## 5. React Router y `HashRouter`

### Decisión

Las rutas son `/`, `/post/:id` y una ruta comodín. Se usa `HashRouter`.

### Por qué

GitHub Pages sirve archivos estáticos y no controla la parte posterior a `#`.
Una URL como `/#/post/1` siempre comienza cargando `index.html`, sin depender
de rewrites del servidor.

### Tradeoff y criterio de cambio

Las URL con hash son menos limpias y no son ideales para SEO. `BrowserRouter`
sería preferible cuando el hosting garantice rewrites SPA y las URL limpias o
el posicionamiento sean requisitos.

## 6. Cliente HTTP con Fetch nativo

### Decisión

`src/api/api.ts` concentra:

- URL base;
- serialización y `Content-Type`;
- parseo JSON y respuestas 204;
- errores de red y HTTP;
- operaciones CRUD.

`ApiError` conserva el mensaje y el status HTTP.

### Por qué

Fetch ya cubre los métodos requeridos, JSON, headers y `AbortSignal`. Centralizar
la mecánica evita repetirla en cada página sin crear capas `repository` o
`service` que hoy solo delegarían.

### Manejo de errores

- Un status no exitoso produce `ApiError`.
- Un error de conexión se convierte en un mensaje comprensible.
- `AbortError` se preserva para distinguir una cancelación de un fallo.
- Un 404 al leer la colección de comentarios se convierte en `[]`, porque la
  MockAPI puede representar así una colección todavía inexistente.
- Los 404 de posts y mutaciones continúan siendo errores.

### Qué no se agregó

Axios se reconsideraría si fueran necesarios interceptores compartidos,
progreso de transferencia o convenciones HTTP extensas. Hoy duplicaría una
capacidad ya nativa.

## 7. `AbortSignal` y control de carreras

### Decisión

Las lecturas de páginas reciben un `AbortSignal` creado por
`AbortController`. El cleanup aborta el pedido al cambiar de ruta o desmontar
el componente.

Las recargas de comentarios también:

- cancelan la recarga anterior;
- ignoran resultados de otro `postId`;
- no actualizan estado después del desmontaje.

### Por qué

Una respuesta vieja no debe sobrescribir datos más recientes. La cancelación
reduce trabajo innecesario y los controles de identidad protegen incluso los
límites entre cambios de ruta.

### Tradeoff

No existe caché entre rutas. Es aceptable para dos pantallas y una API pequeña.
SWR o React Query se justificarían con deduplicación, invalidación compleja,
paginación, actualización en segundo plano o muchas pantallas consumidoras.

## 8. Carga paralela del detalle

### Decisión

El post y sus comentarios se solicitan con `Promise.all`.

### Por qué

Ambos pedidos son independientes. Ejecutarlos en paralelo evita un waterfall
sin agregar coordinación adicional.

## 9. Endpoint singular de comentarios

### Decisión

Todas las operaciones usan directamente:

```text
/post/:postId/comment
```

No existe fallback plural/singular ni estado global para recordar una ruta.

### Por qué

Aunque el PDF documenta `/comments`, la API real fue verificada con
`/comment`. Probar primero una ruta conocida como inválida generaba un 404,
otra solicitud y estado mutable sin aportar compatibilidad útil.

### Tradeoff

Si el backend cambia, el módulo de API debe actualizarse explícitamente. Esa
corrección visible es preferible a ocultar cambios contractuales con reintentos
silenciosos.

## 10. Ediciones con `PUT` completo

### Decisión

Las ediciones usan `PUT` y combinan el recurso recibido con los campos
editables antes de enviarlo.

### Por qué

La API real anunció `PUT` y no `PATCH`. Enviar el recurso completo conserva
`id`, `createdAt`, `postId`, `parentId` y cualquier campo no editable.

### Tradeoff

Sin ETags o versiones, dos ediciones concurrentes podrían sobrescribirse. La
MockAPI no ofrece un contrato de concurrencia y el challenge no requiere
resolverlo.

## 11. Estado local y sincronización

### Decisión

`Home` administra publicaciones y `Detail` administra el post abierto y sus
comentarios con `useState`.

Las publicaciones se actualizan usando la respuesta exitosa del backend. Los
comentarios se vuelven a solicitar después de crear, responder, editar o
eliminar.

### Por qué

- No hay estado mutable que deba compartirse entre muchas funcionalidades.
- El backend sigue siendo la fuente de verdad para IDs, fechas, jerarquía y
  efectos de una eliminación.
- Rehacer el GET evita manipular optimistamente un árbol y diseñar rollback.

### Tradeoff y criterio de cambio

Cada mutación de comentarios añade una lectura. Es la opción más fiable para
el volumen actual. Un store global o una librería de estado del servidor
corresponderían cuando múltiples rutas necesiten compartir y reconciliar los
mismos datos.

## 12. Formularios y mutaciones pesimistas

### Decisión

Los formularios:

- usan controles HTML nativos;
- limpian espacios;
- validan campos obligatorios y avatar HTTPS;
- deshabilitan el envío mientras guardan;
- se cierran solo después del éxito;
- conservan datos y muestran el error si falla.

### Por qué

Cerrar antes de la confirmación comunicaría un éxito inexistente y podría
hacer perder el texto ingresado. Para dos formularios pequeños, estado local y
validación nativa son más claros que una librería.

### Qué no se agregó

React Hook Form o un esquema runtime se reconsiderarían con formularios
grandes, validación compartida compleja o contratos externos no confiables que
necesiten validación estructural en runtime.

## 13. Estructura de carpetas

```text
src/
├── api/
├── components/
├── pages/
├── styles/
├── utils/
├── App.tsx
├── commentTree.ts
├── main.tsx
└── types.ts
```

### Responsabilidades

- `pages`: componentes asociados a rutas; coordinan carga y estado.
- `components`: piezas visuales reutilizables.
- `api`: transporte HTTP y pruebas de contrato.
- `utils`: funciones puras pequeñas de presentación y validación.
- `styles`: fundamentos globales.
- `types.ts`: contratos compartidos.
- `commentTree.ts`: transformación pura del dominio, sin JSX ni hooks.

### Por qué

La estructura separa responsabilidades actuales sin anticipar módulos que aún
no existen. `commentTree.ts` no pertenece a `components` porque no renderiza.
`api.ts` pasó a `src/api/api.ts` para darle un límite propio sin sacarlo del
proyecto TypeScript de la aplicación.

### Criterio de crecimiento

Si aparecen más recursos o lógica propia, `api` puede dividirse por recurso y
comentarios puede convertirse en `features/comments`. Hacerlo antes solo
añadiría navegación y archivos.

## 14. CSS Modules y estilos globales

### Decisión

Cada componente o página posee sus estilos mediante CSS Modules. `global.css`
contiene variables, reset, layout base, foco, skip link y preferencias de
movimiento.

### Por qué

Los módulos evitan colisiones y no agregan runtime. El CSS global queda
reservado para fundamentos realmente compartidos.

### Qué no se agregó

Tailwind, CSS-in-JS y kits visuales no resolverían un problema actual. Un
sistema de diseño sería razonable con más pantallas, tokens compartidos y un
catálogo real de componentes.

## 15. Accesibilidad

### Decisión

La implementación incluye HTML semántico, labels reales, botones nativos,
`aria-live`, `role="alert"`, `aria-busy`, foco visible, skip link,
`prefers-reduced-motion`, elementos `time` e idioma español.

### Por qué

Son fundamentos de una interfaz correcta, no una mejora opcional. Se usan
primitivas nativas antes que widgets personalizados.

### Verificación pendiente

La suite actual no renderiza componentes en un DOM de pruebas. Los recorridos
con teclado, lector de pantalla y viewport deben comprobarse manualmente o
automatizarse cuando la exigencia de entrega justifique esa infraestructura.

## 16. Avatar y fallback

### Decisión

Una imagen vacía o fallida muestra la inicial del nombre. El componente
recuerda qué URL falló, no un booleano permanente.

### Por qué

Así evita el ícono de imagen rota y, si `src` cambia, intenta cargar la URL
nueva en lugar de conservar por error el fallback anterior.

### Tradeoff

No se agregó precarga ni caché propia; el navegador ya cubre esas tareas.

## 17. Árbol de comentarios

### Decisión

`buildCommentTree`:

1. indexa nodos con un `Map`;
2. enlaza cada nodo con su padre;
3. conserva huérfanos como raíces;
4. evita autorreferencias y ciclos;
5. calcula todos los descendientes.

`CommentItem` representa el resultado recursivamente.

### Por qué

El backend entrega una lista plana, pero la UI necesita una conversación
jerárquica. El `Map` evita buscar cada padre recorriendo todo el array. La
promoción defensiva conserva contenido malformado y evita recursión infinita.

### Tradeoff y criterio de cambio

La comprobación de ancestros puede acercarse a O(n²) en cadenas adversas y una
profundidad extrema puede agotar la pila. Para el tamaño del challenge es
aceptable. Una estrategia iterativa o virtualización solo corresponde si
datos reales demuestran ese límite.

## 18. Mensajes específicos de MockAPI

### Decisión

El límite de capacidad de creación de comentarios se traduce a un mensaje de
producto comprensible. Otros errores conservan su mensaje normal.

### Por qué

MockAPI expone ese caso mediante texto, no mediante un código estable. El
mapeo puntual evita construir un sistema general de errores sobre un contrato
que no existe.

### Tradeoff

Comparar texto es frágil. Debe reemplazarse por códigos estructurados si el
backend los ofrece.

## 19. Vitest y alcance de pruebas

### Decisión

Vitest cubre:

- árbol, huérfanos y ciclos;
- rutas y cuerpos HTTP;
- endpoint singular y 404 vacío;
- `PUT` completo y eliminación confirmada por servidor;
- validación y presentación de errores;
- reglas de Nginx para SPA y assets.

### Por qué

Vitest comparte el toolchain de Vite y ejecuta TypeScript sin configurar Jest
o Babel. La cobertura se concentra en lógica ramificada y regresiones
contractuales, no en snapshots de bajo valor.

### Límite actual

No se agregaron jsdom ni Testing Library únicamente para dos correcciones
locales de hooks. La carrera de recarga y el reintento de Avatar se verifican
mediante typecheck/build y revisión de sus guards; una suite de integración de
componentes es el siguiente paso cuando el criterio de evaluación la exija.

## 20. Docker multietapa

### Decisión

La primera etapa usa Node para instalar y compilar. La imagen final usa Nginx
y recibe únicamente `dist` y su configuración.

### Por qué

El runtime no necesita Node, TypeScript, Vite, dependencias de desarrollo ni
código fuente. Esto reduce la imagen y su superficie operativa.

### Criterio de cambio

Fijar imágenes por digest o sumar escaneo de imágenes sería razonable en una
cadena de suministro de producción estricta, no es necesario para demostrar
este challenge.

## 21. Nginx

### Decisión

`nginx.conf`:

- resuelve rutas de aplicación a `index.html`;
- responde 404 para assets estáticos inexistentes.

`nginx.test.ts` protege ambas reglas y está incluido en
`tsconfig.node.json`.

### Por qué

Un asset JavaScript inexistente no debe devolver HTML con status 200.
`HashRouter` reduce la necesidad del fallback SPA, pero la configuración hace
al contenedor robusto y permite cambiar el modo de routing más adelante.

## 22. GitHub Pages y CI/CD

### Decisión

El workflow de `main`:

1. configura Node y Corepack;
2. instala con lockfile congelado;
3. ejecuta tests;
4. compila;
5. publica `dist`.

### Por qué

No se despliega una versión que no pase los controles básicos. GitHub Pages es
suficiente para una SPA pública sin secretos ni backend propio.

### Qué no se agregó

No hay previews por PR, ambientes múltiples ni orquestación de releases. Se
añadirían cuando haya un flujo de equipo o ambientes que realmente los usen.

## 23. Decisiones explícitas de no agregar complejidad

| No agregado | Por qué no hace falta hoy | Cuándo reconsiderarlo |
| --- | --- | --- |
| Redux, Zustand o Context global | El estado pertenece a dos rutas independientes | Estado compartido por varias funcionalidades |
| React Query o SWR | Cancelación y sincronización actuales son pequeñas | Caché, invalidación, paginación o deduplicación complejas |
| Axios | Fetch cubre el contrato presente | Interceptores o transferencias avanzadas |
| React Hook Form | Solo hay dos formularios simples | Formularios grandes y reglas compartidas |
| Zod u otro esquema | Los DTO son pequeños y controlados | Límites externos variables que exijan validación runtime |
| Tailwind, CSS-in-JS o kit de UI | CSS Modules cubre la interfaz actual | Sistema de diseño y catálogo de componentes reales |
| Capa repository/service | Sería un wrapper de una sola implementación | Reglas de dominio o múltiples fuentes de datos |
| Arquitectura completa por features | Hay dos recursos y pocos archivos | El crecimiento vuelva difícil encontrar o aislar cambios |
| Actualizaciones optimistas | El árbol exige rollback y reconciliación | Latencia medida y estrategia de conflictos definida |
| Paginación, tiempo real o autenticación | No forman parte del challenge ni del backend | Requisito explícito y soporte contractual |

## 24. Correcciones aplicadas durante la auditoría

1. Se eliminó la documentación obsoleta del fallback plural/singular.
2. Las recargas de comentarios cancelan respuestas anteriores y no actualizan
   otra ruta ni un componente desmontado.
3. `latest` fue reemplazado por las versiones ya resueltas en el lockfile, sin
   actualizar paquetes.
4. Avatar vuelve a intentar una URL nueva después de que la anterior falla.
5. `nginx.test.ts` quedó incluido en el typecheck de Node ejecutado por
   `tsc -b`.

Estas correcciones cierran inconsistencias concretas. No justifican añadir
dependencias o capas nuevas.
