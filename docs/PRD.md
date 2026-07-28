# PRD: Fudo Community

> **Estado:** aprobado para implementación
>
> **Versión:** 1.0.0 · **Fecha:** 2026-07-27

Fudo Community es una experiencia mínima de comunidad anónima para publicar ideas y mantener conversaciones anidadas. Este documento define el **porqué**, el público, los objetivos y los límites del producto; no especifica su implementación.

## Propósito y autoridad documental

El PRD es la fuente de autoridad para el problema, los objetivos y el alcance del producto. Un cambio de alcance requiere actualizar y aprobar este documento antes de modificar el comportamiento esperado.

La fuente externa principal es el [desafío técnico](Challenge%20T%C3%A9cnico%20-%20%20Senior%20Front-end%20Developer.pdf), páginas 1–3. Dentro del proyecto, cada artefacto tiene una responsabilidad distinta:

| Artefacto | Autoridad |
| --- | --- |
| Este PRD | Problema, usuarios, objetivos y límites del producto |
| [Propuesta SDD](specs/proposal.md) | Intención y alcance del cambio que entrega el MVP |
| [Especificaciones](specs/README.md) | Comportamiento observable y criterios de aceptación |
| [Diseño](specs/design.md) | Enfoque de implementación |
| [Tareas](specs/tasks.md) | Secuencia de ejecución y verificación |
| [Decisiones técnicas](technical-decisions.md) | Decisiones duraderas, motivos y contrapartidas |

Si una especificación contradice el alcance de este PRD, prevalece el PRD. Si cambia una obligación del desafío, primero se revisa el alcance y luego se actualizan los artefactos derivados.

## Contexto y problema

Los participantes de la comunidad necesitan una forma ligera de publicar ideas y mantener conversaciones en hilos. Una lista plana de comentarios pierde el contexto entre respuestas; una plataforma sobredimensionada distraería de la experiencia central que plantea el desafío.

La visión es ofrecer la experiencia de comunidad completa más pequeña posible: cada publicación puede convertirse en una conversación anidada, legible y resiliente tanto en escritorio como en dispositivos móviles.

## Usuario objetivo

El producto está dirigido a un **participante anónimo de la comunidad** que necesita leer, publicar y conversar sin crear una cuenta.

Puede ver y realizar las operaciones de publicaciones y comentarios expuestas por el desafío. El producto no presupone identidad autenticada, propiedad del contenido ni permisos exclusivos del autor mostrado.

## Objetivos y criterios de éxito

### Objetivos

1. Permitir crear, leer, editar y eliminar publicaciones y comentarios mediante la API suministrada.
2. Representar los comentarios como una conversación clara, con profundidad arbitraria y recuento de respuestas descendientes.
3. Comunicar de forma comprensible los estados de carga, ausencia de contenido, error y recurso no encontrado.
4. Mantener los recorridos principales adaptables y accesibles en navegadores de escritorio y móviles compatibles.

### Criterios de éxito del producto

- Los escenarios de aceptación de creación, edición y eliminación de publicaciones y comentarios se cumplen.
- La conversación conserva la jerarquía completa y muestra el total de descendientes de cada comentario.
- La lista y el detalle comunican sus estados de carga, vacío, error y recurso no encontrado cuando corresponda.
- Los recorridos principales no presentan impedimentos conocidos para cumplir WCAG 2.1 AA y pueden completarse con teclado.
- Los recorridos principales funcionan sin desplazamiento horizontal de la página desde 320 CSS px y en anchos representativos de tableta y escritorio.

Estos criterios describen el resultado esperado; su estrategia de verificación pertenece a las especificaciones y al diseño.

## Alcance

### Incluido

- Lista de publicaciones y detalle de una publicación con su conversación completa.
- Creación, edición y eliminación de publicaciones y comentarios.
- Comentarios raíz y respuestas con profundidad arbitraria.
- Jerarquía visual y recuento de respuestas descendientes.
- Estados de carga, vacío, error y recurso no encontrado.
- Experiencia adaptable y accesible.
- Integración con la MockAPI pública suministrada.

### Fuera de alcance

- Autenticación, autorización, cuentas y reglas de propiedad.
- Paginación, desplazamiento infinito, búsqueda, filtros, ordenación, etiquetas y categorías.
- Reacciones, votaciones, moderación, denuncias y funciones para compartir.
- Tiempo real, notificaciones, modo sin conexión y analítica.
- Texto enriquecido, Markdown, HTML aportado por usuarios y carga de archivos o avatares.
- Desarrollo o modificación del backend.
- Actualizaciones optimistas y resolución de conflictos.

Estos límites solo se reconsideran cuando exista una necesidad concreta de escala, identidad, colaboración o descubrimiento.

## Recorridos principales

1. **Explorar:** abrir la aplicación, revisar la lista y entrar al detalle de una publicación.
2. **Publicar:** crear una publicación válida y verla reflejada en la lista.
3. **Mantener una publicación:** editarla o confirmar su eliminación y recibir el resultado correspondiente.
4. **Conversar:** crear un comentario raíz o responder a cualquier comentario dentro de su rama.
5. **Mantener un comentario:** editarlo o confirmar su eliminación y ver la conversación actualizada.
6. **Recuperarse:** comprender un fallo sin perder el contexto ni los datos introducidos cuando la operación pueda reintentarse.
7. **Volver al flujo:** ante un recurso o una ruta inexistentes, regresar a la lista de publicaciones.

## Riesgos, supuestos y restricciones

### Riesgos

- La capacidad, disponibilidad o contrato de la MockAPI pública puede cambiar y provocar fallos ajenos al frontend.
- Los datos compartidos de la API pueden ser modificados por otras personas y no son una línea base estable.
- El comportamiento externo al eliminar un comentario padre no está especificado; el producto debe representar lo que permanezca sin perder contenido visible.
- Conversaciones excepcionalmente profundas o relaciones malformadas pueden degradar la legibilidad.

### Supuestos

- La MockAPI permanece disponible por HTTPS y conserva sustancialmente sus recursos actuales.
- Los participantes anónimos pueden ejecutar todas las operaciones suministradas, sin reglas de propiedad.
- El volumen del desafío cabe en una respuesta y en la memoria del navegador; no requiere paginación.
- El orden devuelto por la API es aceptable porque no existe un criterio de ordenación de producto.
- Los identificadores y las fechas generados por el servidor son autoritativos.

### Restricciones de producto

- La interfaz pública permanece en español.
- El frontend no puede garantizar integridad, capacidad, autenticación ni reglas de eliminación del servicio externo.
- El contenido aportado por participantes se presenta como texto, no como HTML ejecutable.
- El producto debe conservar una experiencia operable y legible desde 320 CSS px.

## Trazabilidad mínima

| Capacidad del producto | Objetivos cubiertos | Especificación normativa |
| --- | --- | --- |
| Explorar publicaciones | Lectura, navegación y estados comprensibles | [Explorar publicaciones](specs/explorar-publicaciones.md) |
| Gestionar publicaciones | CRUD de publicaciones y recuperación ante fallos | [Gestionar publicaciones](specs/gestionar-publicaciones.md) |
| Participar en conversaciones | CRUD de comentarios, jerarquía y descendientes | [Conversaciones anidadas](specs/conversaciones-anidadas.md) |

El flujo documental completo es: [propuesta](specs/proposal.md) → [especificaciones](specs/README.md) → [diseño](specs/design.md) → [tareas](specs/tasks.md). Las decisiones de implementación se consultan en [decisiones técnicas](technical-decisions.md).
