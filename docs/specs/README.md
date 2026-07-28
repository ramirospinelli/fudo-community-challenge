# Especificaciones funcionales de Fudo Community

Estas especificaciones describen el comportamiento observable del MVP. Son el contrato de **qué** debe ofrecer el producto; las decisiones sobre **cómo** implementarlo pertenecen a [`technical-decisions.md`](../technical-decisions.md).

## Flujo SDD

[`proposal.md`](proposal.md) → especificaciones → [`design.md`](design.md) → [`tasks.md`](tasks.md)

## Alcance

| Capacidad | Especificación | Depende de |
| --- | --- | --- |
| Explorar publicaciones | [`explorar-publicaciones.md`](explorar-publicaciones.md) | — |
| Gestionar publicaciones | [`gestionar-publicaciones.md`](gestionar-publicaciones.md) | Exploración para reflejar los cambios |
| Participar en conversaciones anidadas | [`conversaciones-anidadas.md`](conversaciones-anidadas.md) | Detalle de una publicación |

```text
Explorar publicaciones
├── Gestionar publicaciones
└── Conversaciones anidadas
```

## Requisitos transversales

Estos requisitos aplican a las tres capacidades y no se repiten en cada archivo:

- La interfaz **DEBE** ser operable con teclado, conservar un foco predecible y comunicar carga, guardado y errores a tecnologías de asistencia.
- El contenido **DEBE** seguir siendo legible y operable desde 320 CSS px, sin desplazamiento horizontal de la página; los textos largos **DEBEN** ajustarse.
- Los errores **DEBEN** explicar qué falló sin exponer trazas ni detalles internos, y **NO DEBEN** borrar datos introducidos cuando la operación pueda reintentarse.
- El contenido aportado por participantes **DEBE** mostrarse como texto sin formato, conservar saltos de línea y **NO DEBE** interpretarse como HTML.
- Un avatar ausente o fallido **DEBE** sustituirse por la inicial del nombre, o `?` si no existe una inicial; el nombre del autor **DEBE** permanecer disponible como texto.
- La interfaz **NO DEBE** insinuar identidad autenticada, propiedad del contenido ni permisos exclusivos del autor mostrado.

## Fuera de alcance

Estas especificaciones no incluyen autenticación, autorización, paginación, búsqueda, filtros, ordenación, reacciones, moderación, tiempo real, texto enriquecido ni actualizaciones optimistas.

## WHAT frente a HOW

| Pertenece a estas specs (WHAT) | Pertenece al diseño técnico (HOW) |
| --- | --- |
| Resultados visibles, validaciones, errores y reglas de conversación | Framework, componentes, estado, transporte HTTP, estilos, algoritmo y despliegue |
