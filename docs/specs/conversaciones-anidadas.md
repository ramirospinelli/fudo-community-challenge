# Especificación: conversaciones anidadas

## Propósito

Permitir comentar, responder y mantener conversaciones jerárquicas completas, conservando el contenido incluso ante relaciones malformadas.

## Requisitos

### Requisito: crear comentarios y respuestas

El participante **DEBE** poder crear un comentario raíz o responder a cualquier comentario a cualquier profundidad. El nombre y el contenido son obligatorios; el avatar es opcional. El nombre admite 1 a 80 caracteres y el contenido 1 a 1000 después de recortar extremos.

#### Escenario: comentario raíz

- **DADO** un comentario válido dirigido a la publicación
- **CUANDO** el servidor confirma su creación
- **ENTONCES** se actualiza la conversación completa
- **Y** el comentario aparece en el nivel raíz según los datos recibidos

#### Escenario: respuesta anidada

- **DADO** un comentario existente a cualquier profundidad
- **CUANDO** el participante publica una respuesta válida
- **ENTONCES** se actualiza la conversación completa
- **Y** la respuesta aparece debajo del comentario objetivo

#### Escenario: creación inválida o fallida

- **DADO** que faltan datos, exceden sus límites, el avatar no es HTTPS o el servicio rechaza la creación
- **CUANDO** el participante intenta enviar
- **ENTONCES** no se muestra un comentario como persistido sin confirmación
- **Y** se conservan los datos y se comunica una causa comprensible

### Requisito: editar y eliminar comentarios

El participante **DEBE** poder editar o eliminar cualquier comentario. La edición **DEBE** conservar su identidad, fecha, publicación y relación con el padre. La eliminación **DEBE** requerir confirmación y **NO DEBE** presumir eliminación en cascada.

#### Escenario: edición confirmada

- **DADO** un comentario existente con cambios válidos
- **CUANDO** el servidor confirma la edición
- **ENTONCES** se vuelve a obtener la conversación
- **Y** el comentario conserva su posición según la relación devuelta

#### Escenario: eliminación confirmada

- **DADO** que el participante confirma eliminar un comentario
- **CUANDO** el servidor completa la operación
- **ENTONCES** se vuelve a obtener y representar la conversación completa
- **Y** cualquier descendiente que haya quedado huérfano permanece visible como raíz

#### Escenario: mutación cancelada o fallida

- **DADO** una edición o eliminación en curso
- **CUANDO** el participante cancela o la operación falla
- **ENTONCES** el árbol visible permanece intacto
- **Y** los fallos se comunican sin inventar un resultado exitoso

### Requisito: representar la jerarquía completa

La conversación **DEBE** mostrar una vez cada comentario válido recibido, sin paginar, truncar ni contraer deliberadamente. Cada hijo válido **DEBE** aparecer bajo su padre y el recuento de respuestas **DEBE** incluir todos los descendientes, no solo los hijos directos.

#### Escenario: profundidad y recuento

- **DADO** un comentario con un hijo y un nieto
- **CUANDO** se representa la conversación
- **ENTONCES** ambos aparecen en su jerarquía
- **Y** el padre muestra 2 respuestas y el hijo muestra 1

#### Escenario: relación malformada

- **DADO** un comentario huérfano, autorreferenciado o integrante de un ciclo
- **CUANDO** se representa la conversación
- **ENTONCES** aparece una sola vez en el nivel raíz defensivo
- **Y** la interfaz no entra en recursión infinita ni modifica los datos recibidos

#### Escenario: colección inexistente

- **DADO** que la publicación existe y su colección de comentarios se informa como inexistente
- **CUANDO** se abre el detalle
- **ENTONCES** se trata como una conversación vacía
- **Y** se invita a publicar el primer comentario
