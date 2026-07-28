# Documento de requisitos del producto: Desafío de frontend de Fudo Community

> **Estado: Aprobado para implementación**
> **Línea base de implementación:** Este PRD es la referencia normativa aprobada para la implementación. Todo cambio futuro de alcance requiere una revisión y aprobación explícitas del PRD.

## 1. Control del documento

| Campo                   | Valor                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| Producto                | Fudo Community                                                                                 |
| Artefacto               | Documento de requisitos técnicos y funcionales del producto                                    |
| Versión                 | 1.0.0                                                                                          |
| Estado                  | Aprobado para implementación                                                                  |
| Fecha                   | 2026-07-27                                                                                     |
| Responsable de producto | Responsable del proyecto                                                                       |
| Responsable técnico     | Candidato del desafío de frontend                                                              |
| Revisores               | Evaluador del desafío; revisor de producto; revisor técnico                                    |
| Fuente primaria         | `docs/Challenge Técnico -  Senior Front-end Developer.pdf`, páginas 1-3                        |
| Evidencia secundaria    | Código fuente actual del repositorio, pruebas, Dockerfile, README y flujo de trabajo de despliegue inspeccionados el 2026-07-27 |
| Efecto de la aprobación | La aprobación establece la línea base de la versión y desbloquea los cambios de implementación |

### 1.1 Jerarquía de fuentes

Cuando las fuentes difieran, se debe usar este orden:

1. **Requisito obligatorio del desafío:** requisito o restricción explícitos del PDF; normativo.
2. **Sugerencia del desafío:** orientación deseable incluida en `Sugerencias`; no es formalmente obligatoria salvo que una decisión de proyecto aprobada la eleve a esa categoría.
3. **Decisión de proyecto aprobada en el PRD:** interpretación deliberada necesaria para que el producto sea verificable o para resolver una brecha contractual.
4. **Evidencia de implementación:** prueba del stack o comportamiento actual; informativa, sin autoridad para debilitar el PDF.
5. **Supuesto:** premisa de planificación sujeta a validación durante la implementación.
6. **Decisión resuelta:** resultado aprobado que completa o precisa la línea base y conserva su identificador para trazabilidad.

Las palabras **debe**, **debería** y **puede** significan obligatorio, recomendado y opcional, respectivamente. Las etiquetas de requisitos usan `[Obligatorio]`, `[Sugerencia]` o `[Decisión]`. El código actual se cita únicamente como `[Evidencia]`.

## 2. Resumen ejecutivo

Fudo Community es un frontend acotado de una comunidad social, construido con React y TypeScript sobre la MockAPI pública del desafío. Un participante anónimo puede explorar publicaciones, abrir una publicación completa con toda su conversación y crear, editar o eliminar publicaciones y comentarios. Las respuestas forman un árbol con anidamiento arbitrario, similar a Reddit, con un recuento explícito de respuestas descendientes.

La versión favorece una arquitectura pequeña y defendible en una entrevista: React Router con `HashRouter`, estado de React local a cada ruta, Fetch nativo, CSS Modules con un mínimo de CSS global y una transformación pura O(n) del árbol de comentarios. Excluye deliberadamente autenticación, paginación, búsqueda, «me gusta», actualizaciones en tiempo real, actualizaciones optimistas, bibliotecas de estado global, kits de UI con estilos prediseñados y abstracciones especulativas.

### 2.1 Ruta rápida de revisión

1. Implementar el límite obligatorio de la versión definido en las Secciones 5 y 7.
2. Aplicar las decisiones sobre brechas contractuales de las Secciones 9, 15 y 17.4, en especial `PUT`, el endpoint singular verificado `/comment` y la semántica del recuento de respuestas.
3. Verificar la cobertura del PDF en la matriz de trazabilidad de la Sección 20.
4. Usar la Definición de Terminado de la Sección 18.2 para comprobar la entrega.

## 3. Contexto del producto

### 3.1 Problema

Los participantes de la comunidad necesitan una forma ligera de publicar ideas y mantener conversaciones en hilos. Una lista plana de comentarios pierde el contexto de la conversación, mientras que una plataforma sobredimensionada ocultaría los aspectos centrales de frontend del desafío: integración con la API, coherencia del CRUD, presentación recursiva de datos, interacción adaptable y diseño mantenible en React.

### 3.2 Visión

Ofrecer la experiencia de comunidad completa más pequeña posible, en la que cada publicación pueda convertirse en una conversación anidada, legible y resiliente tanto en escritorio como en dispositivos móviles.

### 3.3 Usuario objetivo y rol

| Rol                                  | Necesidad                                                                        | Permisos                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Participante anónimo de la comunidad | Leer, publicar y participar en conversaciones en hilos sin configurar una cuenta | Ver y realizar todas las operaciones CRUD de publicaciones y comentarios expuestas por el desafío |

No se deben inventar mecanismos de autenticación ni controles de propiedad. La API proporciona los campos de autor `name` y `avatar`, pero no un modelo de identidad o autorización.

### 3.4 Propuesta de valor

- Un flujo completo desde la publicación hasta la conversación, con poca sobrecarga de navegación.
- Una estructura de hilos y totales de respuestas que permiten comprender las conversaciones anidadas.
- Retroalimentación fiable sobre las mutaciones y conciliación con el servidor sin infraestructura innecesaria en el cliente.
- Una solución técnica enfocada que demuestra criterio sénior de frontend en lugar de un exceso de frameworks.

## 4. Objetivos y criterios de éxito

### 4.1 Objetivos

| ID   | Objetivo                                                                                                             |
| ---- | -------------------------------------------------------------------------------------------------------------------- |
| G-01 | Proporcionar un CRUD completo de publicaciones y comentarios sobre la API suministrada.                              |
| G-02 | Representar cada comentario asociado en un árbol de conversación claro y con anidamiento arbitrario.                 |
| G-03 | Mantener comprensibles y recuperables los resultados de carga, ausencia de contenido, error y recurso no encontrado. |
| G-04 | Funcionar de forma adaptable y accesible en los navegadores de escritorio y móviles compatibles.                     |
| G-05 | Seguir siendo fácil de compilar, probar, explicar, desplegar y revisar.                                              |

### 4.2 Éxito medible de la versión

| ID    | Medida                   | Umbral de la versión                                                                                                                                              |
| ----- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SC-01 | Trazabilidad obligatoria | El 100 % de los requisitos del PDF está asociado a un requisito aprobado del PRD y a un método de verificación                                                    |
| SC-02 | Verificación del CRUD    | Se superan todas las pruebas de aceptación de creación, edición y eliminación de publicaciones y comentarios                                                      |
| SC-03 | Corrección del árbol     | Se superan las pruebas automatizadas de profundidad arbitraria, entrada independiente del orden, descendientes, huérfanos, autorreferencias y ciclos              |
| SC-04 | Cobertura de estados     | Ambas rutas tienen verificados los comportamientos de carga, ausencia de contenido cuando corresponda, error y recurso no encontrado                              |
| SC-05 | Controles de calidad     | Se superan `pnpm test`, `pnpm run build` y las comprobaciones de compilación e inicio del contenedor                                                              |
| SC-06 | Accesibilidad            | No hay ningún impedimento conocido para cumplir WCAG 2.1 AA en los recorridos principales; se superan las comprobaciones rápidas con teclado y lector de pantalla |
| SC-07 | Usabilidad adaptable     | Los recorridos principales se completan sin desplazamiento horizontal de la página a 320 CSS px y en anchos representativos de tableta y escritorio               |
| SC-08 | Despliegue               | El repositorio contiene una vía funcional multietapa con Docker/Nginx y una vía documentada de despliegue alojado                                                 |

Los criterios de éxito son comprobaciones de la versión, no afirmaciones sobre la implementación actual.

## 5. Alcance y límite de la versión

### 5.1 Dentro del alcance

- Frontend de aplicación de página única con React y TypeScript.
- Pantalla principal con la lista de publicaciones.
- Pantalla de detalle de una publicación con el contenido completo y todos los comentarios asociados.
- Creación, edición y eliminación de publicaciones y comentarios.
- Comentarios raíz y respuestas con profundidad de anidamiento arbitraria.
- Recuentos explícitos de respuestas descendientes y jerarquía visual escalonada.
- Estados de carga, ausencia de contenido, error y recurso no encontrado.
- Interacción adaptable y accesible.
- Integración con la MockAPI pública, incluido el comportamiento de compatibilidad aprobado.
- Pruebas automatizadas proporcionales al riesgo del desafío.
- Repositorio del código fuente, servicio mediante Docker/Nginx y vía de despliegue alojado.

### 5.2 Objetivos excluidos

La versión no debe añadir lo siguiente salvo que cambien los requisitos:

- Autenticación, autorización, cuentas o reglas de propiedad.
- Paginación o desplazamiento infinito.
- Búsqueda, filtrado, controles de ordenación, etiquetas o categorías.
- «Me gusta», reacciones, votaciones, moderación, denuncias o funciones para compartir.
- Actualizaciones en tiempo real, notificaciones, WebSockets o sondeo periódico.
- Texto enriquecido, Markdown, creación de HTML, carga de archivos o carga de avatares.
- Modo sin conexión, service workers, analítica o integración con proveedores de telemetría.
- Desarrollo del backend o cambios en la MockAPI proporcionada.
- Actualizaciones optimistas o flujos de resolución de conflictos.
- Bibliotecas de estado global, bibliotecas de estado del servidor, kits de UI con estilos prediseñados o un sistema de diseño generalizado.

Estas exclusiones mantienen el esfuerzo proporcionado. Solo se pueden reconsiderar cuando requisitos de escala, identidad, colaboración o descubrimiento del producto generen una necesidad concreta.

## 6. Recorridos principales del usuario

| ID    | Recorrido                          | Resultado esperado                                                                                                                     |
| ----- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| UJ-01 | Abrir la aplicación                | El participante ve la lista de publicaciones o un estado claro de carga, ausencia de contenido o error.                                |
| UJ-02 | Crear una publicación              | Se persiste una publicación válida y aparece en la lista sin recargar toda la página.                                                  |
| UJ-03 | Leer una conversación              | Al seleccionar una publicación, se abre su contenido completo y todos los comentarios en orden anidado.                                |
| UJ-04 | Mantener una publicación           | El participante edita o confirma la eliminación; la UI refleja el resultado del servidor.                                              |
| UJ-05 | Iniciar o ampliar una conversación | El participante crea un comentario raíz o responde a cualquier comentario; los datos actualizados aparecen en la rama correcta.        |
| UJ-06 | Mantener un comentario             | El participante edita el contenido o confirma la eliminación; se representa el estado actualizado del servidor.                        |
| UJ-07 | Recuperarse de un fallo            | El participante recibe un error claro, conserva el contexto o los datos introducidos cuando sea práctico y puede reintentar la acción. |
| UJ-08 | Seguir una URL no válida           | El participante ve un estado de recurso no encontrado y una ruta para volver a la lista de publicaciones.                              |

## 7. Requisitos funcionales

### 7.1 Pantallas, navegación y estados de lectura

| ID     | Fuente        | Requisito y criterios de aceptación                                                                                                                                                                                                                                                                                                                                                                |
| ------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001 | [Obligatorio] | **Lista de publicaciones:** La pantalla principal debe solicitar y mostrar las publicaciones. **Aceptación:** cada elemento presenta el nombre del autor, el avatar o su alternativa, la fecha de creación, el título, una vista previa legible del contenido y un control para abrir el detalle.                                                                                                  |
| FR-002 | [Obligatorio] | **Detalle de la publicación:** La pantalla de detalle debe solicitar una publicación y todos los comentarios asociados. **Aceptación:** representa el título y el contenido completos de la publicación, los metadatos del autor y cada comentario devuelto.                                                                                                                                       |
| FR-003 | [Decisión]    | **Navegación:** Las rutas deben admitir la lista, el detalle por ID de publicación y el estado de aplicación no encontrada. **Aceptación:** los enlaces de marca, lista y regreso funcionan sin recargar el documento; el historial del navegador funciona; las rutas desconocidas ofrecen un enlace a la lista.                                                                                   |
| FR-004 | [Decisión]    | **Carga:** Cada lectura inicial de una ruta debe presentar un estado de carga no bloqueante. **Aceptación:** el estado se anuncia de forma cortés a las tecnologías de asistencia; el contenido obsoleto no se presenta como datos recién cargados.                                                                                                                                                |
| FR-005 | [Decisión]    | **Estados sin contenido:** La ausencia de publicaciones y la ausencia de comentarios deben tener mensajes diferenciados y accionables. **Aceptación:** una lista vacía invita a crear una publicación; una conversación vacía invita a escribir el primer comentario.                                                                                                                              |
| FR-006 | [Decisión]    | **Errores de lectura:** Los errores de red y las respuestas HTTP no exitosas deben producir errores comprensibles para el usuario. **Aceptación:** los errores no dejan vacío el armazón de la aplicación, no se muestran trazas de pila sin procesar y sigue siendo posible reintentar repitiendo la navegación o recargando.                                                                     |
| FR-007 | [Decisión]    | **No encontrado:** Las rutas desconocidas de la aplicación y los recursos de publicación ausentes deben distinguirse de los fallos genéricos del servidor. **Aceptación:** ambos resultados explican que no se encontró el contenido y proporcionan una ruta a la lista de publicaciones; un HTTP 404 únicamente para comentarios puede resolverse como una conversación vacía conforme a API-006. |
| FR-008 | [Decisión]    | **Ciclo de vida de las solicitudes:** Las lecturas iniciales obsoletas deben poder cancelarse. **Aceptación:** un cambio de ruta o desmontaje cancela las lecturas pendientes y las cancelaciones no se muestran como errores al usuario.                                                                                                                                                          |

### 7.2 CRUD de publicaciones

| ID     | Fuente        | Requisito y criterios de aceptación                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-101 | [Obligatorio] | **Crear publicación:** El participante debe poder crear una publicación. **Aceptación:** el nombre, el título y el contenido son obligatorios; la URL del avatar es opcional; se eliminan los espacios en blanco de los extremos; solo hay una solicitud activa por envío; al completarse correctamente, se cierra y restablece el formulario y se muestra la publicación devuelta; un fallo conserva el contexto de edición y muestra un error. |
| FR-102 | [Obligatorio] | **Editar publicación:** El participante debe poder editar una publicación existente desde la lista o el detalle. **Aceptación:** el formulario comienza con los valores editables actuales; la validación coincide con la de creación; cancelar no produce cambios; al completarse correctamente, se representa el recurso devuelto por el servidor.                                                                                             |
| FR-103 | [Obligatorio] | **Eliminar publicación:** El participante debe poder eliminar una publicación. **Aceptación:** una confirmación explícita identifica la acción destructiva; cancelar no envía ninguna solicitud; al completarse correctamente, se elimina el elemento de la lista o se vuelve del detalle a la lista; un fallo mantiene visible la publicación e informa del error.                                                                              |
| FR-104 | [Decisión]    | **Validación de publicaciones:** El nombre debe contener entre 1 y 80 caracteres después de eliminar espacios de los extremos, el título entre 3 y 120 y el contenido entre 3 y 2000; el avatar puede estar vacío y, cuando se proporcione, debe ser una URL sintácticamente válida que use `https:` en producción. **Aceptación:** los formularios no válidos no se envían y los controles presentan validación nativa o en línea.                                                     |
| FR-105 | [Decisión]    | **Coherencia de publicaciones:** Las mutaciones de publicaciones deben conciliarse a partir de la respuesta exitosa de la API. **Aceptación:** la creación inserta la publicación devuelta, la edición reemplaza el elemento o recurso coincidente y la eliminación solo lo quita después de la confirmación del servidor.                                                                                                                       |

### 7.3 CRUD e hilos de comentarios

| ID     | Fuente        | Requisito y criterios de aceptación                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-201 | [Obligatorio] | **Crear comentario raíz:** El participante debe poder comentar directamente una publicación. **Aceptación:** la solicitud representa `parentId: null`; al completarse correctamente, se actualizan los comentarios desde la API y se muestra el nuevo comentario raíz.                                                                                                                                                                          |
| FR-202 | [Obligatorio] | **Responder:** El participante debe poder responder a cualquier comentario a cualquier profundidad. **Aceptación:** el nuevo comentario usa el ID del comentario objetivo como `parentId`; al completarse correctamente, se actualiza y se muestra debajo de ese padre.                                                                                                                                                                         |
| FR-203 | [Obligatorio] | **Editar comentario:** El participante debe poder editar cualquier comentario. **Aceptación:** los valores actuales rellenan el formulario; `id`, `createdAt`, la asociación con la publicación y `parentId` permanecen sin cambios; al completarse correctamente, se actualizan los comentarios desde la API.                                                                                                                                  |
| FR-204 | [Obligatorio] | **Eliminar comentario:** El participante debe poder eliminar cualquier comentario. **Aceptación:** se requiere confirmación; cancelar no envía ninguna solicitud; al completarse correctamente, se vuelven a obtener los comentarios y se representa la verdad devuelta por la API; los huérfanos se promueven defensivamente a raíces; un fallo mantiene intacto el árbol representado e informa del error. No se presupone un comportamiento en cascada. |
| FR-205 | [Obligatorio] | **Árbol anidado:** Los comentarios deben representarse como un árbol visualmente escalonado, similar a Reddit, con la profundidad arbitraria de los datos. **Aceptación:** cada hijo válido aparece bajo su padre y puede representar a sus propios hijos; el anidamiento sigue siendo comprensible en dispositivos móviles sin provocar desbordamiento horizontal de la página.                                                                |
| FR-206 | [Decisión]    | **Semántica del recuento de respuestas:** El valor visible `N respuestas` de un comentario significa **todos los descendientes**, no solo los hijos directos. **Aceptación:** un padre con un hijo y un nieto muestra 2; el hijo muestra 1; los comentarios hoja omiten el recuento o muestran cero de forma coherente. Los hijos directos siguen visibles como la lista anidada inmediata y no se presentan como una segunda métrica numérica. |
| FR-207 | [Decisión]    | **Validación de comentarios:** El nombre debe contener entre 1 y 80 caracteres después de eliminar espacios de los extremos y el contenido entre 1 y 1000; la URL del avatar puede estar vacía y, cuando se proporcione, debe ser sintácticamente válida y usar `https:` en producción. **Aceptación:** los formularios no válidos no se envían; los envíos repetidos están deshabilitados durante el guardado.                                      |
| FR-208 | [Decisión]    | **Coherencia de comentarios:** Después de cada creación, edición o eliminación exitosa de un comentario, se debe volver a solicitar la colección. **Aceptación:** la API sigue siendo la fuente de verdad para los IDs, las fechas, la jerarquía y los efectos de la eliminación; una recarga anterior no puede sobrescribir la última ni actualizar otra ruta o un componente desmontado; un fallo de actualización se informa y no inventa un estado exitoso. |
| FR-209 | [Decisión]    | **Todos los comentarios:** En esta versión, la vista de detalle no debe paginar, truncar ni contraer deliberadamente los comentarios devueltos. **Aceptación:** cada elemento válido de la respuesta de la colección está representado exactamente una vez en el árbol o en el conjunto raíz defensivo.                                                                                                                                         |

### 7.4 Interacción y contenido compartidos

| ID     | Fuente     | Requisito y criterios de aceptación                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-301 | [Decisión] | **Alternativa del avatar:** Una URL de avatar ausente, vacía o fallida debe mostrar una alternativa estable derivada del nombre del autor sin espacios en los extremos, o `?` cuando no esté disponible. **Aceptación:** un fallo de la imagen no deja un control de imagen rota; una URL nueva vuelve a intentarse aunque la anterior haya fallado; cuando la imagen se carga, se proporciona un texto alternativo útil; la alternativa decorativa se oculta a las tecnologías de asistencia porque el nombre del autor adyacente sigue disponible. |
| FR-302 | [Decisión] | **Confirmaciones:** Todas las eliminaciones requieren confirmación inmediatamente antes de la solicitud. **Aceptación:** la confirmación de una publicación incluye contexto identificativo cuando está disponible; la confirmación de un comentario identifica el tipo de elemento; las confirmaciones nunca aparecen al editar o cancelar.                                                                                                                                      |
| FR-303 | [Decisión] | **Fechas y texto:** Las fechas deben usar datos semánticos `<time>` y una presentación localizada legible; el contenido del usuario debe conservar los saltos de línea y ajustar el texto largo. **Aceptación:** las fechas no válidas se degradan de forma segura y el contenido no confiable se representa como texto, no como HTML inyectado.                                                                                                                                  |
| FR-304 | [Decisión] | **Retroalimentación de mutaciones:** Los formularios deben presentar estados de guardado y error. **Aceptación:** el control de envío no está disponible durante el guardado; los errores se asocian con el formulario o la acción correspondiente y se anuncian; al completarse correctamente, se sale del flujo de creación o edición finalizado.                                                                                                                               |

## 8. Modelo de datos e invariantes

### 8.1 DTO contractuales

El PDF define exactamente dos recursos de backend:

```ts
interface Post {
  createdAt: string;
  name: string;
  avatar: string;
  id: string;
  content: string;
  title: string;
}

interface Comment {
  createdAt: string;
  name: string;
  avatar: string;
  id: string;
  content: string;
  parentId: null | string;
}
```

| ID       | Fuente        | Invariante                                                                                                                                                                                               |
| -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DATA-001 | [Obligatorio] | `Post.createdAt`, `name`, `avatar`, `id`, `content` y `title` son cadenas.                                                                                                                               |
| DATA-002 | [Obligatorio] | `Comment.createdAt`, `name`, `avatar`, `id` y `content` son cadenas; `parentId` es `null` o una cadena.                                                                                                  |
| DATA-003 | [Obligatorio] | `name` y `avatar` describen a la persona que creó la publicación o el comentario; no establecen una identidad autenticada.                                                                               |
| DATA-004 | [Obligatorio] | `parentId: null` significa una respuesta directa a la publicación; un `parentId` de cadena significa una respuesta a otro comentario.                                                                    |
| DATA-005 | [Decisión]    | Las entradas de creación omiten `id` y `createdAt`, que pertenecen al servidor; antes de `PUT`, las cargas útiles de actualización combinan las ediciones con el recurso completo actual.                |
| DATA-006 | [Evidencia]   | La implementación actual en producción recibe `postId` en los comentarios para asociarlos con el endpoint. Se trata de metadatos de transporte, no de un campo añadido al DTO Comment normativo del PDF. |
| DATA-007 | [Decisión]    | El cliente debe conservar los identificadores inmutables, los metadatos de creación, la asociación con la publicación y la relación con el padre durante las ediciones.                                  |

### 8.2 Comportamiento defensivo del árbol

El contrato del backend no especifica el comportamiento ante jerarquías malformadas. Para evitar la pérdida silenciosa de contenido, el frontend adopta estas defensas técnicas:

- Un comentario cuyo objetivo `parentId` no exista se representa una vez en el nivel raíz.
- Un comentario que se referencia a sí mismo como padre se representa una vez en el nivel raíz.
- Los comentarios que participan en un ciclo de padres se representan una vez en el nivel raíz en lugar de procesarse recursivamente.
- Los IDs duplicados son una entrada no válida; el comportamiento debe ser determinista y registrarse durante el desarrollo y las pruebas, sin recursión infinita. La resolución preferida es un nodo visible por cada ID único.
- La promoción defensiva no modifica los datos del backend ni afirma repararlos.

Estas son decisiones de proyecto, no promesas sobre la validación de MockAPI.

## 9. Contrato de la API y compatibilidad

URL base: `https://665de6d7e88051d60408c32d.mockapi.io`

### 9.1 Contrato del PDF

| ID      | Operación del PDF | Método | URL contractual                         | Cuerpo             | Respuesta   |
| ------- | ----------------- | ------ | --------------------------------------- | ------------------ | ----------- |
| API-001 | `getPosts`        | GET    | `/post`                                 | `{}`               | `Post[]`    |
| API-002 | `getSinglePost`   | GET    | `/post/${postId}`                       | `{}`               | `Post`      |
| API-003 | `createPost`      | POST   | `/post`                                 | `Partial<Post>`    | `Post`      |
| API-004 | `deletePost`      | DELETE | `/post/${postId}`                       | `{}`               | `Post`      |
| API-005 | `getComments`     | GET    | `/post/${postId}/comments`              | `{}`               | `Comment[]` |
| API-006 | `createComment`   | POST   | `/post/${postId}/comments`              | `Partial<Comment>` | `Comment`   |
| API-007 | `deleteComment`   | DELETE | `/post/${postId}/comments/${commentId}` | `{}`               | `Comment`   |

La grafía contractual del PDF es el plural `/comments`; la Sección 9.3 documenta por separado la ruta singular verificada en el servicio desplegado.

### 9.2 Brecha obligatoria para la edición

| ID      | Fuente                   | Decisión                                                                                                                                                                                                     |
| ------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API-008 | [Obligatorio + Decisión] | Es obligatorio editar publicaciones aunque el PDF omita una operación de actualización. Usar `PUT /post/${postId}` con el Post completo actual combinado con las ediciones validadas.                        |
| API-009 | [Obligatorio + Decisión] | Es obligatorio editar comentarios aunque el PDF omita una operación de actualización. Usar `PUT /post/${postId}/comment/${commentId}` con el Comment completo actual combinado con las ediciones validadas. |

La evidencia histórica de `OPTIONS` en producción informó `GET, PUT, POST, DELETE, OPTIONS` y rechazó `PATCH`. Por tanto, `PUT` con el recurso completo es la opción compatible menos especulativa. Combinar el recurso actual antes de enviarlo evita la pérdida de propiedades omitidas. Se rechaza `PATCH` porque el servicio en producción lo rechazó; se rechaza enviar únicamente los campos editables con `PUT` porque la semántica de reemplazo podría descartar campos del servidor.

### 9.3 Ruta verificada de comentarios

| ID      | Fuente     | Requisito                                                                                                                                                                                                                 |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API-010 | [Decisión] | La API desplegada fue verificada con la ruta singular `/post/${postId}/comment`; todas las lecturas y mutaciones de comentarios deben usarla directamente, sin una solicitud previa a la ruta plural.                     |
| API-011 | [Decisión] | El cliente no debe mantener estado global para elegir el segmento del endpoint ni reintentar automáticamente una variante de ruta. Si el contrato del backend cambia, debe corregirse de forma explícita y verificable. |
| API-012 | [Decisión] | Los componentes siguen refiriéndose al dominio de comentarios; la grafía del endpoint permanece encapsulada en el módulo de API.                                                                                         |
| API-013 | [Decisión] | Un HTTP 404 al leer la colección singular de comentarios se interpreta como una conversación vacía. Un 404 de una publicación o de cualquier mutación sigue siendo un error o recurso no encontrado.                     |

La tabla de la Sección 9.1 conserva el contrato histórico del PDF. La implementación usa el comportamiento real verificado para evitar pedidos fallidos y complejidad de compatibilidad innecesaria.

### 9.4 Política de solicitudes y errores

- Enviar `Content-Type: application/json` cuando exista un cuerpo JSON.
- Tratar únicamente las respuestas HTTP exitosas como éxitos; en caso contrario, analizar y presentar un error seguro y comprensible para el usuario.
- Tratar los fallos de transporte por separado de los fallos de estado HTTP.
- Tratar un HTTP 404 de ambas variantes de la colección de comentarios como una colección vacía solo para lecturas de comentarios; no aplicar esa regla a publicaciones ausentes ni a mutaciones.
- Evitar los reintentos automáticos de mutaciones porque pueden duplicar creaciones o repetir operaciones destructivas.
- Mantener la URL base en un único límite de configuración. Se puede añadir una sustitución mediante una variable de entorno en tiempo de compilación si se materializan varios entornos; no debe haber secretos en la configuración del frontend.

## 10. UX, diseño adaptable, accesibilidad y contenido

### 10.1 UX e interacción

| ID     | Requisito                                                                                                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UX-001 | La interfaz debe priorizar la lista de publicaciones, el contenido de la publicación y la conversación por encima de los controles decorativos.                                                               |
| UX-002 | Los formularios de creación y edición deberían aparecer cerca del contenido que afectan y proporcionar acciones explícitas de envío y cancelación.                                                            |
| UX-003 | Los controles destructivos deben distinguirse visualmente sin depender únicamente del color; cuando corresponda, el texto de confirmación debe describir la irreversibilidad.                                 |
| UX-004 | El foco debe moverse o permanecer de manera predecible cuando los formularios se abran o cierren y después de la navegación; las acciones exitosas no deben dejar el foco del teclado en un lugar inadecuado. |
| UX-005 | La UI no debe insinuar una propiedad autenticada ni identificar acciones como exclusivas del autor mostrado.                                                                                                  |

### 10.2 Requisitos de diseño adaptable

| ID     | Requisito                                                                                                                                                                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UX-101 | El diseño debe seguir siendo utilizable desde 320 CSS px hasta los anchos de escritorio modernos.                                                                                              |
| UX-102 | Las acciones principales deben seguir siendo accesibles y tener objetivos táctiles adecuados; los grupos horizontales de acciones pueden pasar a otra línea.                                   |
| UX-103 | Los comentarios anidados deben reducir la sangría o usar otra señal jerárquica clara en anchos estrechos para que el contenido siga siendo legible sin desplazamiento horizontal de la página. |
| UX-104 | Los nombres, títulos, URL y contenidos largos sin espacios deben ajustarse sin recortar las acciones adyacentes.                                                                               |

### 10.3 Objetivo de accesibilidad

| ID       | Requisito                                                                                                                                                                         |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A11Y-001 | Los recorridos principales tienen como objetivo WCAG 2.1 AA.                                                                                                                      |
| A11Y-002 | Usar regiones semánticas, orden de encabezados, artículos o listas, botones para acciones, enlaces para navegación, etiquetas para controles y `<time>` para fechas.              |
| A11Y-003 | Todas las funciones deben poder operarse con teclado y mostrar un indicador de foco visible; un enlace para omitir contenido debe conducir al contenido principal.                |
| A11Y-004 | La carga y las actualizaciones no interruptivas usan regiones vivas corteses; los errores de acciones bloqueantes usan una semántica de alerta adecuada sin anuncios duplicados.  |
| A11Y-005 | El contraste del texto y de los estados interactivos debe cumplir el nivel AA; la información y el estado destructivo no deben depender únicamente del color.                     |
| A11Y-006 | Respetar las preferencias de movimiento reducido; ningún significado esencial puede depender de una animación.                                                                    |
| A11Y-007 | La validación debe identificar por escrito el campo no válido o el requisito del formulario, conservar los valores introducidos cuando haya un fallo y evitar la pérdida de foco. |

### 10.4 Reglas de contenido

- La UI pública debe permanecer en español. El PRD y las conversaciones de aprobación también permanecen en español.
- Los mensajes de error deberían indicar qué falló y cuál es la siguiente acción segura sin exponer detalles de implementación.
- Las etiquetas en singular y plural deben ser gramaticalmente correctas para cero, uno y varios comentarios o respuestas.
- El texto proporcionado por el usuario debe mostrarse literalmente como texto sin formato después de eliminar los espacios de los extremos en el límite del formulario; no se interpreta como HTML.

## 11. Requisitos no funcionales

| ID      | Área                           | Requisito y verificación                                                                                                                                                                                                                                                                                 |
| ------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-001 | Fiabilidad                     | Una mutación fallida no debe mostrarse como exitosa ni eliminar localmente contenido persistido. Verificar las pruebas de rutas de fallo y las comprobaciones manuales de fallos de red.                                                                                                                 |
| NFR-002 | Fiabilidad                     | Las solicitudes iniciales de las rutas deben poder cancelarse; los resultados obsoletos no deben sobrescribir el estado de una ruta más reciente. Verificar el comportamiento durante la navegación rápida y el desmontaje.                                                                              |
| NFR-003 | Rendimiento                    | Para colecciones a la escala del desafío, transformar los comentarios en un tiempo esperado O(n) y un espacio O(n); no realizar una solicitud por comentario. Verificar mediante la revisión del algoritmo y la medición temporal con datos representativos.                                             |
| NFR-004 | Rendimiento                    | Mantener las dependencias y la representación proporcionadas: ningún kit de UI, almacén global, framework de consultas, virtualización ni memorización prematura sin una necesidad medida. Verificar mediante la revisión de dependencias y arquitectura.                                                |
| NFR-005 | Accesibilidad                  | Cumplir el objetivo de la Sección 10.3 en todos los recorridos principales. Verificar mediante comprobaciones automatizadas y pruebas rápidas con teclado y lector de pantalla.                                                                                                                          |
| NFR-006 | Seguridad                      | Representar el contenido del usuario mediante la interpolación de texto de React; no usar `dangerouslySetInnerHTML`; permitir avatares vacíos y exigir URL `https:` válidas cuando se proporcionen en producción; servir el despliegue mediante HTTPS cuando el alojamiento lo permita. Verificar mediante revisión del código y una prueba rápida del sitio alojado. |
| NFR-007 | Seguridad                      | No se pueden incluir secretos, credenciales privilegiadas ni tokens privados en el paquete. La URL de la API pública puede ser visible para el cliente. Verificar mediante la revisión de los recursos compilados y la configuración.                                                                    |
| NFR-008 | Compatibilidad con navegadores | Admitir las dos versiones estables más recientes de Chrome, Edge, Firefox y Safari, incluido el Safari actual de iOS. No se incluye ningún compromiso con navegadores antiguos ni polyfills. Verificar mediante pruebas rápidas representativas.                                                         |
| NFR-009 | Mantenibilidad                 | Mantener las pantallas de rutas, los componentes reutilizables, el transporte de la API, los DTO y la lógica pura del árbol separados por responsabilidad, sin capas especulativas. Verificar mediante la revisión de arquitectura.                                                                      |
| NFR-010 | Mantenibilidad                 | La compilación de TypeScript debe completarse sin errores; la lógica pura no trivial y la del adaptador deben tener pruebas específicas. Verificar en CI.                                                                                                                                                |
| NFR-011 | Observabilidad                 | Los fallos visibles para el usuario requieren mensajes contextuales; los diagnósticos de desarrollo pueden usar la consola, pero producción no debe emitir errores evitables ni cargas útiles sensibles. No se requiere un servicio externo de monitorización.                                           |
| NFR-012 | Coherencia de datos            | Las respuestas del servidor y las actualizaciones de comentarios posteriores a las mutaciones son la fuente autoritativa; el cliente no debe inventar IDs, marcas de tiempo ni persistencias exitosas. Verificar mediante pruebas de integración.                                                        |

## 12. Arquitectura del frontend y estrategia de datos

### 12.1 Línea base aprobada

| Capa           | Decisión                                                                                      | Justificación                                                                                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compilación    | Vite + TypeScript                                                                             | Herramientas rápidas y mínimas para SPA, con un límite de compilación estricto y sin aspectos de un framework que el desafío no necesita.                            |
| UI             | React                                                                                         | Mandato explícito del desafío y modelo de composición recursiva adecuado.                                                                                            |
| Enrutamiento   | React Router con `HashRouter`                                                                 | Dos pantallas a nivel de ruta y un comportamiento de recurso no encontrado; el enrutamiento por hash funciona en GitHub Project Pages sin reescrituras del servidor. |
| HTTP           | Fetch nativo detrás de un único módulo de API                                                 | La API es pequeña; Fetch junto con `AbortController` cubre las necesidades de transporte, cancelación y JSON sin el peso de una biblioteca cliente.                  |
| Estado         | Estado de React local a la ruta                                                               | Las rutas de lista y detalle no requieren un estado de dominio mutable compartido. Las respuestas del servidor siguen siendo autoritativas.                          |
| Estilos        | CSS Modules más un mínimo de CSS global                                                       | La propiedad local evita fugas de selectores; el CSS global se limita a tokens, fundamentos, accesibilidad y elementos primitivos realmente compartidos.             |
| Componentes    | Formularios, avatar y nodo de comentario pequeños y reutilizables, además de páginas de rutas | La reutilización existe donde se repite el comportamiento, mientras que la coordinación de las rutas permanece visible.                                              |
| Pruebas        | Vitest                                                                                        | Integración ligera con Vite y suficiente para la lógica pura y el comportamiento del adaptador.                                                                      |
| Sistema visual | HTML/CSS semántico personalizado, sin kit de UI con estilos prediseñados                      | Es obligatorio por la restricción del PDF y mantiene visible la autoría del diseño.                                                                                  |

`package.json`, `src/main.tsx`, los módulos de rutas y componentes, CSS Modules y las pruebas actuales son evidencia de implementación de este stack. La aprobación vuelve normativa la línea base; la evidencia por sí sola no lo hace.

### 12.2 Estrategia de obtención y mutación de datos

1. La ruta de lista obtiene las publicaciones al montarse y cancela la solicitud al desmontarse.
2. La ruta de detalle obtiene la publicación y los comentarios de forma concurrente porque ninguno depende del otro.
3. Una publicación ausente produce un resultado de recurso no encontrado; un 404 al leer la colección singular de comentarios puede representar una conversación vacía conforme a API-013.
4. La creación o edición de publicaciones puede conciliarse directamente a partir de la respuesta de la mutación porque se devuelve el recurso afectado.
5. Las mutaciones de comentarios vuelven a obtener toda la colección de comentarios porque el anidamiento, los metadatos del servidor y los efectos de eliminación pueden modificar más de una rama local.
6. Las mutaciones son pesimistas: mostrar el progreso, esperar el éxito y luego conciliar. Esto evita la complejidad de las reversiones y los falsos éxitos frente a un servicio simulado externo.
7. No se introduce un framework de invalidación de caché del cliente para dos rutas y dos colecciones de recursos.

### 12.3 Alternativas rechazadas y contrapartidas

| Alternativa                                                   | Justificación del rechazo                                                                                                                          | Reconsiderar cuando                                                                                                       |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Biblioteca de estado global                                   | Añade indirección y riesgo de sincronización sin requisitos de estado entre rutas.                                                                 | Varias funcionalidades independientes deban coordinar un estado compartido de larga duración en el cliente.               |
| Biblioteca de consultas o estado del servidor                 | La política de caché y el peso de la dependencia exceden la superficie de esta API.                                                                | Más rutas, deduplicación, actualización en segundo plano, paginación o invalidación compleja se conviertan en requisitos. |
| Axios o biblioteca cliente HTTP                               | Fetch ya admite los métodos, el tratamiento de estados, JSON y la cancelación requeridos.                                                          | Lo justifiquen interceptores, progreso avanzado de cargas o convenciones amplias de API.                                  |
| Kit de UI con estilos prediseñados                            | Está expresamente prohibido por el desafío y también ocultaría la implementación del diseño.                                                       | Nunca para este desafío, salvo que cambie el requisito de origen.                                                         |
| Biblioteca de UI sin estilos                                  | Está permitida, pero es innecesaria para los elementos primitivos actuales de formularios y navegación nativos.                                    | Sea obligatorio un widget accesible complejo, como un diálogo, un cuadro combinado o un menú.                             |
| Actualizaciones optimistas                                    | Generan complejidad de reversión y divergencia del servidor, en especial ante fallos de servicios externos y eliminaciones anidadas.               | La latencia se convierta en un problema de usabilidad medido y se definan reglas para los conflictos de mutación.         |
| Obtención recursiva desde la API                              | Arriesga solicitudes N+1 y el contrato ya devuelve la colección completa de comentarios.                                                           | El contrato del backend cambie a endpoints de hijos paginados.                                                            |
| BrowserRouter                                                 | Requiere reescrituras fiables del alojamiento para las cargas directas de rutas. El enrutamiento por hash es más sencillo en GitHub Pages y Nginx. | El alojamiento normalice las reescrituras para SPA y las URL limpias se conviertan en un objetivo del producto.           |
| Capas generales de repositorio, servicio y dominio            | Las abstracciones especulativas ocultarían un desafío con dos recursos.                                                                            | Aparezcan varios backends o dominios con numerosas reglas de negocio.                                                     |
| Paginación, búsqueda, autenticación, «me gusta» o tiempo real | No se solicitan y modificarían el alcance del producto y los supuestos del backend.                                                                | Se proporcionen requisitos explícitos y compatibilidad de la API.                                                         |

## 13. Requisitos del algoritmo del árbol de comentarios

| ID      | Requisito                                                                                                                                                                                                                                                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ALG-001 | Construir un mapa de ID a nodo en una pasada, conservando cada comentario único como un nodo con una colección de hijos.                                                                                                                                                                                                      |
| ALG-002 | Vincular los nodos hijos válidos con sus padres en una pasada lineal posterior; recopilar por separado los nodos raíz y los promovidos de forma defensiva.                                                                                                                                                                    |
| ALG-003 | Calcular el recuento de respuestas de cada nodo como la suma de todos sus descendientes: `sum(child.replyCount + 1)`.                                                                                                                                                                                                         |
| ALG-004 | Producir un orden determinista de hermanos y raíces basado en el orden de entrada de la API, salvo que se añada un requisito de ordenación aprobado.                                                                                                                                                                          |
| ALG-005 | Detectar padres ausentes, autorreferencias y ciclos antes de la representación o el recuento recursivos para que los datos malformados no oculten contenido ni generen recursión infinita.                                                                                                                                    |
| ALG-006 | El tiempo de ejecución y la memoria esperados deben ser O(n), donde n es el número de comentarios. Las comprobaciones de ciclos no deben degradar los árboles válidos normales hasta una implementación O(n²) evitable; usar un estado de visita si las pruebas de escala revelan ese riesgo.                                 |
| ALG-007 | La representación puede ser recursiva, pero la verificación del producto debe incluir un anidamiento profundo representativo. Si la profundidad real de la API puede superar los límites seguros de la pila de llamadas o del diseño, una revisión explícita del PRD debe definir una profundidad máxima o una estrategia iterativa. |

La implementación actual demuestra la vinculación mediante mapas y el recuento de descendientes, además de pruebas de huérfanos y ciclos. Su recorrido de ancestros por comentario puede ser O(n²) en cadenas adversas; esto solo es aceptable a la escala del desafío y sigue siendo una contrapartida técnica documentada, no una afirmación de escalabilidad sin reservas.

## 14. Estrategia de pruebas

### 14.1 Pirámide de pruebas basada en riesgos

| Nivel                              | Enfoque                                              | Ejemplos obligatorios                                                                                                                                                                                                                                                                   |
| ---------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unidad                             | Lógica pura con muchas ramificaciones                | Construcción del árbol, profundidad arbitraria, recuentos de descendientes, independencia del orden de entrada, tratamiento de huérfanos, autorreferencias y ciclos, política de IDs duplicados y ayudantes de fechas o errores cuando las ramificaciones lo justifiquen                |
| Adaptador                          | Contrato HTTP y compatibilidad                       | Métodos, URL singular y cuerpos, `PUT` con recurso completo, errores no exitosos, propagación de cancelaciones, lectura vacía ante 404 de la colección y ausencia de fallback de rutas |
| Integración de componentes o rutas | Estados y flujos de trabajo visibles para el usuario | Carga de lista y detalle, ausencia de contenido, errores, publicación no encontrada, validación de formularios, éxito y fallo de todo el CRUD, cancelación y aceptación de confirmaciones, coherencia de actualización, alternativa del avatar y semántica de teclado                   |
| Prueba rápida de extremo a extremo | Integración en producción                            | Cargar la lista, abrir el detalle, realizar un recorrido CRUD reversible con datos controlados, entrada directa al sitio alojado, servicio mediante Docker y viewport móvil                                                                                                             |

### 14.2 Principios de prueba

- Priorizar el comportamiento y los roles o textos accesibles por encima de los detalles de implementación o las aserciones sobre clases CSS.
- Simular las respuestas de la API externa para obtener pruebas automatizadas deterministas; no hacer que la suite principal dependa de la capacidad compartida de MockAPI.
- Mantener las pruebas cerca del comportamiento que protegen e incluir cobertura de regresión para cada defecto contractual o algorítmico corregido.
- Evitar el uso intensivo de snapshots para conversaciones dinámicas; realizar aserciones sobre la jerarquía, los recuentos y los estados.
- CI debe ejecutar las pruebas antes de la compilación y el despliegue.
- Las comprobaciones manuales de la versión cubren el lector de pantalla, el teclado, el diseño adaptable, la jerarquía visual y el comportamiento rápido de la API externa que las pruebas unitarias no pueden demostrar.

## 15. Despliegue, repositorio y configuración

| ID      | Fuente                          | Requisito y criterios de aceptación                                                                                                                                                                                                                                                                                                                                                                                                |
| ------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEP-001 | [Obligatorio]                   | El código fuente debe estar disponible en un repositorio de cualquier plataforma. **Aceptación:** los revisores pueden acceder al código fuente, al historial, a las instrucciones de compilación y a este PRD aprobado.                                                                                                                                                                                                           |
| DEP-002 | [Obligatorio]                   | El repositorio debe contener un Dockerfile que compile y sirva la aplicación con Nginx. **Aceptación:** una compilación multietapa limpia instala las dependencias bloqueadas, crea los recursos de producción, copia únicamente los recursos desplegables a una imagen de ejecución de Nginx, expone HTTP e inicia Nginx en primer plano.                                                                                         |
| DEP-003 | [Decisión]                      | El despliegue de Nginx debe admitir una entrada alternativa de SPA. **Aceptación:** las rutas de aplicación que no sean recursos se resuelven a `index.html` sin ocultar recursos estáticos ausentes. HashRouter reduce la dependencia de este comportamiento, pero aun así se requiere una configuración alternativa explícita de Nginx para proporcionar un servicio robusto y admitir futuros cambios del modo de enrutamiento. |
| DEP-004 | [Sugerencia elevada a Decisión] | Proporcionar mediante GitHub Pages el flujo de trabajo y la vía alojada documentada. **Aceptación:** CI prueba y compila antes del despliegue; la ruta base desplegada y el modo de enrutamiento funcionan al actualizar y navegar; la persona responsable del repositorio solo debe habilitar la configuración requerida; una URL estable es obligatoria para la aprobación final de la entrega.                                                                                           |
| DEP-005 | [Decisión]                      | La configuración de compilación debe ser reproducible. **Aceptación:** se respeta el lockfile, se usan las versiones documentadas de Node y del gestor de paquetes, y la compilación no requiere archivos locales secretos.                                                                                                                                                                                                        |
| DEP-006 | [Decisión]                      | La configuración de la API debe tener una única fuente de verdad. **Aceptación:** producción usa de forma predeterminada el endpoint HTTPS suministrado; cualquier sustitución se documenta como un valor público en tiempo de compilación y falla claramente si no es válida.                                                                                                                                                     |

### 15.1 Evidencia y brechas de la implementación actual

- `[Evidencia]` El `Dockerfile` usa actualmente Node 22 Alpine para compilar y Nginx 1.27 Alpine para servir `dist`.
- `[Evidencia]` `.github/workflows/deploy-pages.yml` instala mediante el lockfile, ejecuta las pruebas y la compilación y despliega `dist` desde `main`.
- `[Evidencia]` Vite usa `base: './'` y la aplicación usa `HashRouter` para alojarse en páginas de proyecto.
- `[Evidencia]` `nginx.conf` implementa el fallback de SPA y devuelve 404 para assets inexistentes; `nginx.test.ts` verifica ambas reglas y forma parte del typecheck de Node.

## 16. Registro de decisiones

| ID      | Decisión                                                                                              | Motivo                                                                                                                                                        | Contrapartida                                                                                                                                |
| ------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ADR-001 | Usar recuentos de respuestas descendientes                                                            | Un total único comunica toda la conversación que se encuentra debajo de un comentario y coincide con el comportamiento actual del árbol.                      | Difiere del recuento de hijos directos; la etiqueta y las pruebas deben hacer explícita la semántica.                                        |
| ADR-002 | Usar `PUT` con el recurso completo para las ediciones                                                 | La edición es obligatoria, `OPTIONS` en producción presentó PUT y rechazó PATCH, y los recursos combinados protegen las propiedades.                          | Requiere conservar los datos del recurso actual y puede sobrescribir ediciones externas concurrentes; no existe un contrato de concurrencia. |
| ADR-003 | Usar directamente el endpoint singular `/comment` verificado                                          | Evita una solicitud fallida, estado global y una rama de compatibilidad que no aporta valor frente al comportamiento real de la API.                         | Si el backend corrige su contrato, el endpoint deberá actualizarse explícitamente en el módulo de API.                                       |
| ADR-004 | Volver a obtener los comentarios después de cada mutación                                             | Los IDs, las marcas de tiempo, la jerarquía y el comportamiento en cascada del servidor siguen siendo autoritativos.                                          | Añade una solicitud de colección por mutación, pero evita una manipulación local frágil del árbol.                                           |
| ADR-005 | Usar mutaciones pesimistas                                                                            | Los fallos del servicio externo y la coherencia anidada importan más que una percepción de velocidad instantánea a la escala del desafío.                     | La UI espera al servidor; la retroalimentación de progreso es obligatoria.                                                                   |
| ADR-006 | Usar estado local a la ruta y ninguna biblioteca de estado global o de consultas                      | Dos pantallas independientes no justifican una infraestructura de estado compartido.                                                                          | Volver a una ruta puede realizar otra solicitud y los beneficios de la caché local son limitados.                                            |
| ADR-007 | Usar HashRouter                                                                                       | Funciona en GitHub Project Pages sin controlar las reescrituras y sigue siendo compatible con el servicio estático mediante Nginx.                            | Las URL contienen `#`; las rutas limpias se aplazan.                                                                                         |
| ADR-008 | Usar CSS Modules más un mínimo de CSS global                                                          | Proporciona propiedad y evita fugas sin infringir la restricción de no usar kits con estilos prediseñados.                                                    | Los elementos primitivos compartidos requieren límites disciplinados.                                                                        |
| ADR-009 | Promover a la raíz los nodos de jerarquías malformadas                                                | Conserva la visibilidad y evita fallos recursivos sin pretender reparar los datos del backend.                                                                | La ubicación visual puede no reflejar la conversación prevista.                                                                              |
| ADR-010 | Mantener la arquitectura deliberadamente pequeña                                                      | El desafío evalúa el criterio; las capas especulativas aumentan la carga cognitiva sin requisitos que las justifiquen.                                        | El alcance futuro puede requerir una refactorización cuando aparezca una presión concreta.                                                   |
| ADR-011 | Exigir una alternativa explícita de Nginx para SPA                                                    | El servicio estático debería seguir siendo robusto más allá de las URL que solo usan hash y no debería depender de los valores predeterminados de una imagen. | Añade una pequeña configuración de despliegue aunque HashRouter ya gestione las rutas actuales del cliente.                                  |

## 17. Riesgos, supuestos, dependencias, restricciones y decisiones resueltas

### 17.1 Riesgos

| ID   | Riesgo                                                                     | Impacto                                                                                                | Mitigación                                                                                                                                                                     |
| ---- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R-01 | Límite de capacidad de la colección externa de MockAPI                     | Las creaciones pueden fallar pese al comportamiento correcto del frontend.                             | Clasificarlo como riesgo del servicio externo, mostrar errores veraces, usar datos de prueba controlados y evitar reintentos automáticos. No es un requisito de la aplicación. |
| R-02 | Desviación entre la ruta plural documentada y `/comment`, verificada en la API | Fallan las lecturas o mutaciones si cambia el servicio externo.                                         | Ruta singular centralizada y cubierta por pruebas de contrato; cualquier cambio se actualiza explícitamente, sin fallback silencioso.                                          |
| R-03 | Los endpoints de actualización no están documentados                       | El comportamiento de edición puede diferir o dejar de funcionar.                                       | `PUT` aprobado con el recurso completo, verificación rápida en producción y tratamiento explícito de errores.                                                                  |
| R-04 | El comportamiento de eliminación de comentarios padre no está especificado | Los descendientes pueden eliminarse en cascada, quedar huérfanos o impedir la eliminación.             | Volver a obtener los datos tras la eliminación y conservar la visibilidad de los huérfanos conforme a OQ-04, sin presuponer el comportamiento externo.                         |
| R-05 | Árboles profundos o malformados                                            | Degradación del diseño o riesgo de recursión.                                                          | Objetivo O(n), defensas frente a ciclos, sangría adaptable y datos de prueba profundos.                                                                                        |
| R-06 | Datos compartidos de la API pública                                        | Las pruebas o los revisores pueden modificar o eliminar los registros de otros.                        | Pruebas simuladas deterministas, datos para pruebas rápidas identificables de forma única y ausencia de supuestos sobre la estabilidad de los datos iniciales.                 |
| R-07 | Una regresión en la configuración de Nginx puede ocultar assets inexistentes o romper rutas SPA | El despliegue puede devolver HTML para assets ausentes o fallar al navegar.                              | Configuración explícita cubierta por `nginx.test.ts` y build de CI.                                                                                                              |
| R-08 | Actualizar dependencias sin una revisión deliberada                         | Versiones incompatibles pueden romper el build o el comportamiento.                                    | Versiones directas explícitas, lockfile obligatorio y actualizaciones revisadas de forma intencional.                                                                            |

### 17.2 Supuestos

| ID    | Supuesto                                                                                                                                     |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| AS-01 | La MockAPI pública sigue siendo accesible mediante HTTPS y devuelve JSON con una forma sustancialmente igual a la de los DTO documentados.   |
| AS-02 | Se permite deliberadamente que los usuarios anónimos invoquen todas las operaciones CRUD suministradas; no existe una política de propiedad. |
| AS-03 | Las colecciones a la escala del desafío caben en una respuesta y en la memoria del navegador; no se requiere paginación.                     |
| AS-04 | El orden del array de la API es un orden de presentación aceptable porque no se especifica ningún requisito de ordenación.                   |
| AS-05 | Los IDs y las marcas de tiempo generados por el servidor son autoritativos.                                                                  |
| AS-06 | `PUT` continúa siendo compatible con los recursos de publicaciones y comentarios, tal como se verificó históricamente.                       |
| AS-07 | Un despliegue estático alojado y un contenedor Nginx son vías de entrega válidas e independientes para los mismos recursos compilados.       |

### 17.3 Dependencias y restricciones

- Disponibilidad, política CORS, comportamiento y capacidad de la MockAPI pública.
- React + TypeScript son tecnologías obligatorias.
- Las bibliotecas de componentes con estilos prediseñados están prohibidas; se permiten CSS de utilidades y bibliotecas sin estilos, pero no son necesarias.
- La entrega mediante un repositorio y Docker/Nginx es obligatoria.
- La línea base actual depende de Node 22, pnpm, Vite, React Router y Vitest.
- El código del frontend no puede imponer la integridad del backend, la autenticación, las eliminaciones en cascada ni la capacidad.

### 17.4 Registro de decisiones resueltas

| ID    | Estado   | Decisión definitiva                                                                                                                                                                                                                                  |
| ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OQ-01 | Resuelta | La UI pública permanece en español. El PRD y las conversaciones de aprobación permanecen en español.                                                                                                                                                |
| OQ-02 | Resuelta | La URL del avatar puede estar vacía. Cuando se proporciona, producción acepta únicamente una URL HTTPS sintácticamente válida; los formularios deben rechazar otros esquemas y las URL inseguras para evitar contenido mixto, conforme a FR-104, FR-207 y NFR-006. |
| OQ-03 | Resuelta | El recuento de respuestas incluye todos los descendientes, conforme a ADR-001 y FR-206.                                                                                                                                                               |
| OQ-04 | Resuelta | Tras eliminar un comentario padre, el cliente vuelve a obtener la verdad del servidor y representa todo lo que permanezca; los comentarios huérfanos se promueven defensivamente a raíces. No se presupone ni se exige un comportamiento en cascada de MockAPI. |
| OQ-05 | Resuelta | Se debe entregar y verificar una configuración alternativa explícita de Nginx para SPA, incluido `try_files`, aunque la aplicación use HashRouter, conforme a DEP-003 y ADR-011.                                                                      |
| OQ-06 | Resuelta | Se debe proporcionar el flujo de trabajo de GitHub Pages y documentar la vía alojada. La persona responsable del repositorio solo debe habilitar la configuración requerida; una URL estable forma parte de la aprobación final de la entrega.          |

## 18. Preparación para la entrega

### 18.1 Definición de preparado

La implementación está preparada para comenzar porque:

- [x] La Revisión de Producto aprobó el cambio de estado de este PRD.
- [x] Cada decisión de producto identificada tiene una resolución aprobada.
- [x] Se aceptaron el alcance obligatorio y los objetivos excluidos explícitos.
- [x] Se aceptaron las decisiones sobre DTO, recuento de descendientes, `PUT` y endpoint singular verificado.
- [x] Los criterios de aceptación se pueden verificar con las herramientas disponibles o con un método manual identificado.
- [x] Se aceptaron como riesgos externos, sin considerarlos resueltos, la disponibilidad y la capacidad de la API.
- [x] Ningún requisito depende de inventar autenticación o cambios en el backend.

### 18.2 Definición de terminado

- [ ] Todos los requisitos `FR-*`, `DATA-*`, `API-*`, `UX-*`, `A11Y-*`, `NFR-*`, `ALG-*` y `DEP-*` incluidos en el alcance aprobado de la versión superan la verificación.
- [ ] Cada requisito obligatorio del PDF tiene trazabilidad y evidencia.
- [ ] El CRUD de publicaciones y comentarios supera los escenarios de éxito, cancelación, validación y fallo.
- [ ] Se superan los estados de carga, ausencia de contenido, error, publicación ausente y ruta desconocida.
- [ ] El comportamiento del árbol supera las comprobaciones de anidamiento arbitrario, recuento de descendientes, huérfanos, autorreferencias, ciclos y diseño adaptable.
- [ ] Se superan las comprobaciones de teclado, prueba rápida con lector de pantalla, foco, contraste y movimiento reducido.
- [ ] `pnpm test` y `pnpm run build` se completan correctamente en CI.
- [ ] La imagen de Docker se compila y Nginx sirve la SPA con el comportamiento alternativo verificado.
- [ ] El despliegue alojado supera las pruebas rápidas de navegación y de dispositivos móviles y escritorio.
- [ ] El README documenta con precisión la configuración, la validación, el despliegue, las decisiones y los riesgos externos conocidos.
- [ ] No se incluyen secretos, errores evitables en la consola de producción ni funcionalidades fuera del alcance.

## 19. Lista de verificación para la aprobación

- [x] El problema del producto, el usuario, el valor y el límite de la versión son correctos.
- [x] La distinción entre el lenguaje obligatorio y el sugerido de las fuentes está representada con precisión.
- [x] Todos los campos de los DTO del PDF y los significados de `parentId` son correctos.
- [x] Se aprueban ambas pantallas y todos los requisitos del CRUD de publicaciones y comentarios.
- [x] Se aprueba la semántica del recuento de respuestas descendientes.
- [x] Se aprueban `PUT` con el recurso completo y el comportamiento de combinación.
- [x] El PDF documenta `/comments`; el cliente usa directamente `/comment`, que es la ruta verificada de la API real.
- [x] Los objetivos de diseño adaptable y WCAG 2.1 AA son proporcionados y están aprobados.
- [x] La arquitectura pequeña y las alternativas rechazadas son aceptables.
- [x] Se aprueban los criterios de Docker/Nginx y del despliegue alojado.
- [x] Se aceptan los riesgos, los supuestos y las decisiones resueltas de la Sección 17.4.
- [x] El estado cambió a `Aprobado para implementación`.

## 20. Matriz de trazabilidad de requisitos

| Página/sección del PDF         | Declaración de la fuente                                                                                                                                | Clasificación                             | Correspondencia en el PRD                     | Verificación                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| p.1, introducción              | Construir un frontend acotado de red social con TypeScript y React usando la MockAPI suministrada                                                       | Obligatorio                               | G-01, Sección 12.1, API-001-API-012           | Revisión de dependencias; compilación; pruebas de la API          |
| p.1, imagen de DTO             | Los campos de Post son `createdAt`, `name`, `avatar`, `id`, `content` y `title`, todos cadenas                                                          | Obligatorio                               | DATA-001, Sección 8.1                         | Revisión de tipos; datos de prueba del contrato                   |
| p.1, imagen de DTO             | Los campos de Comment son las cadenas `createdAt`, `name`, `avatar`, `id` y `content`, y `parentId: null \| string`                                     | Obligatorio                               | DATA-002, Sección 8.1                         | Revisión de tipos; datos de prueba del contrato                   |
| p.1, `Aclaraciones`            | `name` y `avatar` identifican al creador                                                                                                                | Obligatorio                               | DATA-003, Sección 3.3                         | Pruebas de integración de UI y componentes                        |
| p.1, `Aclaraciones`            | Un `parentId` nulo responde a la publicación; una cadena responde a un comentario                                                                       | Obligatorio                               | DATA-004, FR-201, FR-202                      | Pruebas del árbol y de las cargas útiles de creación              |
| p.1, Requisito 1.a             | La pantalla principal muestra las publicaciones                                                                                                         | Obligatorio                               | FR-001                                        | Integración de la ruta y prueba rápida E2E                        |
| p.1, Requisito 1.b             | El detalle muestra la publicación completa y todos los comentarios asociados                                                                            | Obligatorio                               | FR-002, FR-209                                | Integración de la ruta y prueba rápida E2E                        |
| p.1, Requisito 2.a             | No se permiten bibliotecas de componentes con estilos prediseñados; se permiten bibliotecas de utilidades o sin estilos                                 | Restricción obligatoria                   | Sección 12.1, NFR-004, objetivos excluidos    | Revisión de dependencias y código fuente                          |
| p.1, Requisito 2.b             | Los comentarios anidados se muestran de forma escalonada o como un árbol, al estilo de Reddit, con totales visibles de respuestas y respuestas anidadas | Obligatorio                               | FR-205, FR-206, ALG-001-ALG-007               | Revisión unitaria, de integración y de diseño adaptable           |
| p.1, Requisito 3               | Crear, editar y eliminar publicaciones y comentarios                                                                                                    | Obligatorio                               | FR-101-FR-105, FR-201-FR-208, API-008-API-009 | Pruebas de integración o E2E del CRUD                             |
| p.1, Requisito 4               | Proyecto subido a un repositorio                                                                                                                        | Obligatorio                               | DEP-001                                       | Revisión del acceso al repositorio                                |
| p.2, Requisito 5               | El repositorio contiene un Dockerfile que compila una imagen servida con Nginx                                                                          | Obligatorio                               | DEP-002, DEP-003                              | Compilación e inicio del contenedor y comprobaciones de rutas     |
| p.2, `Sugerencias`             | Buenas prácticas                                                                                                                                        | Sugerencia                                | NFR-001-NFR-012, Secciones 12-14              | Revisión de calidad y CI                                          |
| p.2, `Sugerencias`             | Escalabilidad                                                                                                                                           | Sugerencia                                | NFR-003, NFR-004, ALG-006, ADR-010            | Revisión de complejidad y dependencias                            |
| p.2, `Sugerencias`             | Diseño adaptable                                                                                                                                        | Sugerencia                                | SC-07, UX-101-UX-104                          | Comprobaciones a 320 px, tableta y escritorio                     |
| p.2, `Sugerencias`             | Buena estrategia de solicitudes al backend                                                                                                              | Sugerencia                                | Sección 9.4, Sección 12.2, NFR-002, NFR-012   | Pruebas del adaptador y de integración                            |
| p.2, `Sugerencias`             | Alojar en gh-pages u otro proveedor                                                                                                                     | Sugerencia                                | DEP-004                                       | CI y prueba rápida del sitio alojado                              |
| p.2, `Sugerencias`             | Añadir pruebas útiles                                                                                                                                   | Sugerencia                                | SC-03-SC-05, Sección 14                       | Informe de pruebas de CI                                          |
| p.2, Endpoints `getPosts`      | `GET /post -> Post[]`                                                                                                                                   | Contrato                                  | API-001, FR-001                               | Prueba del adaptador                                              |
| p.2, Endpoints `getSinglePost` | `GET /post/${postId} -> Post`                                                                                                                           | Contrato                                  | API-002, FR-002, FR-007                       | Prueba del adaptador y de la ruta                                 |
| p.2, Endpoints `createPost`    | `POST /post`, `Partial<Post> -> Post`                                                                                                                   | Contrato                                  | API-003, FR-101                               | Prueba del adaptador y de integración                             |
| p.2, Endpoints `deletePost`    | `DELETE /post/${postId} -> Post`                                                                                                                        | Contrato                                  | API-004, FR-103                               | Prueba del adaptador y de integración                             |
| p.3, Endpoints `getComments`   | `GET /post/${postId}/comments -> Comment[]`                                                                                                             | Contrato histórico; API real singular     | API-005, FR-002, API-010-API-013              | Pruebas del endpoint singular verificado y del 404 vacío          |
| p.3, Endpoints `createComment` | `POST /post/${postId}/comments`, `Partial<Comment> -> Comment`                                                                                          | Contrato histórico; API real singular     | API-006, FR-201, FR-202                       | Pruebas de la carga útil sobre el endpoint singular               |
| p.3, Endpoints `deleteComment` | `DELETE /post/${postId}/comments/${commentId} -> Comment`                                                                                               | Contrato histórico; API real singular     | API-007, FR-204                               | Prueba del endpoint singular y de integración                     |
| omisión en p.1 + p.2-p.3       | La edición es obligatoria, pero los endpoints de actualización no figuran                                                                               | Brecha obligatoria + decisión de proyecto | API-008, API-009, ADR-002                     | Pruebas de PUT del adaptador y prueba rápida en producción        |

## Apéndice A: Instantánea de la evidencia actual

Esta instantánea explica las restricciones actuales sin redefinir los requisitos:

- `[Evidencia]` `package.json`: Vite, React, TypeScript, React Router y Vitest; ningún kit de UI con estilos prediseñados.
- `[Evidencia]` `src/main.tsx`: `HashRouter`.
- `[Evidencia]` `src/api/api.ts`: Fetch nativo, compatibilidad con cancelaciones, PUT con el recurso completo y endpoint singular directo para comentarios.
- `[Evidencia]` `src/types.ts`: Comment local incluye el `postId` de transporte y conserva `parentId` como `null | string`.
- `[Evidencia]` `src/commentTree.ts` y pruebas: anidamiento basado en mapas, recuentos de descendientes y visibilidad de huérfanos y ciclos.
- `[Evidencia]` Páginas y componentes actuales: rutas de lista, detalle y recurso no encontrado, controles CRUD completos, confirmaciones, validación, alternativa del avatar, estados de carga, ausencia de contenido y error, y nueva obtención de comentarios tras las mutaciones.
- `[Evidencia]` CSS Modules más un mínimo de CSS global implementan fundamentos adaptables, foco visible, enlace para omitir contenido y tratamiento del movimiento reducido.
- `[Evidencia]` Existen la compilación multietapa de Docker y el flujo de trabajo de GitHub Pages.
- `[Evidencia]` La suite actual cubre árbol y ciclos, contrato HTTP singular y PUT completo, validación, presentación de errores y configuración de Nginx.
- `[Brecha]` Sigue pendiente una suite de integración renderizada para accesibilidad de rutas y componentes y para todos los estados visibles del CRUD; no se agregó una dependencia solo para ampliar este challenge.

## Apéndice B: Registro del resultado de la revisión

| Revisión                     | Responsable              | Fecha      | Resultado/notas                                      |
| ---------------------------- | ------------------------ | ---------- | ---------------------------------------------------- |
| Alcance del producto         | Responsable del proyecto | 2026-07-27 | Aprobado                                             |
| Decisiones técnicas y de API | Responsable del proyecto | 2026-07-27 | Aprobadas                                            |
| Accesibilidad y UX           | Responsable del proyecto | 2026-07-27 | Aprobadas                                            |
| Aprobación final             | Responsable del proyecto | 2026-07-27 | Aprobada; implementación desbloqueada                |
