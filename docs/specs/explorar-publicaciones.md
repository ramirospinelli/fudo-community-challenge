# Especificación: explorar publicaciones

## Propósito

Permitir que cualquier participante recorra la lista de publicaciones, abra una publicación completa y comprenda los estados de lectura sin perder una vía de navegación.

## Requisitos

### Requisito: lista de publicaciones

La aplicación **DEBE** mostrar cada publicación con autor, avatar o alternativa, fecha, título, vista previa del contenido y una acción para abrir el detalle. **DEBE** diferenciar carga, lista vacía y error de lectura.

#### Escenario: lista disponible

- **DADO** que existen publicaciones
- **CUANDO** el participante abre la aplicación
- **ENTONCES** ve todas las publicaciones recibidas con sus datos principales
- **Y** puede abrir el detalle de cualquiera de ellas

#### Escenario: lista vacía

- **DADO** que no existen publicaciones
- **CUANDO** finaliza la lectura
- **ENTONCES** se informa que todavía no hay publicaciones
- **Y** se invita a crear la primera

#### Escenario: fallo de lectura

- **DADO** que la lista no puede recuperarse
- **CUANDO** termina el intento de carga
- **ENTONCES** se muestra un error comprensible sin vaciar el armazón de la aplicación
- **Y** el participante puede reintentar mediante una nueva navegación o recarga

### Requisito: detalle y conversación

La aplicación **DEBE** mostrar el título, contenido completo, autor y fecha de la publicación seleccionada, junto con todos sus comentarios. **NO DEBE** presentar datos de una navegación anterior como si pertenecieran al detalle actual.

#### Escenario: publicación existente

- **DADO** que una publicación existe
- **CUANDO** el participante abre su detalle
- **ENTONCES** ve la publicación completa y la conversación asociada
- **Y** dispone de una acción para volver a la lista

#### Escenario: conversación vacía

- **DADO** que la publicación existe pero no tiene comentarios
- **CUANDO** se abre su detalle
- **ENTONCES** se muestra la publicación y un estado de conversación vacía
- **Y** se invita a iniciar la conversación

#### Escenario: publicación inexistente

- **DADO** que el identificador no corresponde a una publicación
- **CUANDO** se abre ese detalle
- **ENTONCES** se informa que la publicación no fue encontrada
- **Y** se ofrece una ruta de regreso a la lista

### Requisito: navegación y presentación segura

La aplicación **DEBE** admitir la lista, el detalle por identificador y un estado para rutas desconocidas. Los enlaces **DEBEN** conservar el historial de navegación. Las fechas **DEBEN** ser legibles y degradarse al valor recibido si no pueden interpretarse.

#### Escenario: ruta desconocida

- **DADO** que el participante abre una ruta no reconocida
- **CUANDO** la aplicación resuelve la navegación
- **ENTONCES** se muestra un estado de contenido no encontrado
- **Y** se ofrece un enlace a la lista de publicaciones
