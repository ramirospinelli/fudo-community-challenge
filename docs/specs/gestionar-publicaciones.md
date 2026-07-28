# Especificación: gestionar publicaciones

## Propósito

Permitir crear, editar y eliminar publicaciones con validación clara y sin comunicar éxitos que el servidor no haya confirmado.

## Requisitos

### Requisito: crear una publicación

El participante **DEBE** poder crear una publicación con nombre, título y contenido obligatorios, y avatar opcional. Los extremos con espacios **DEBEN** eliminarse antes de validar y enviar.

#### Escenario: creación válida

- **DADO** un nombre de 1 a 80 caracteres, un título de 3 a 120 y contenido de 3 a 2000
- **CUANDO** el participante envía el formulario
- **ENTONCES** solo se procesa un envío mientras la operación está en curso
- **Y** tras la confirmación se cierra el formulario y aparece la publicación devuelta

#### Escenario: datos inválidos

- **DADO** que falta un campo obligatorio, excede sus límites o el avatar no es una URL HTTPS válida
- **CUANDO** el participante intenta publicar
- **ENTONCES** la solicitud **NO DEBE** enviarse
- **Y** se identifica el requisito incumplido sin borrar los valores introducidos

#### Escenario: fallo al crear

- **DADO** que los datos son válidos
- **CUANDO** el servidor rechaza o no completa la creación
- **ENTONCES** la nueva publicación **NO DEBE** mostrarse como persistida
- **Y** el formulario conserva los datos y comunica el error

### Requisito: editar una publicación

El participante **DEBE** poder editar una publicación desde la lista o su detalle. El formulario **DEBE** comenzar con los valores actuales y aplicar las mismas validaciones de creación.

#### Escenario: edición confirmada

- **DADO** que una publicación está en edición
- **CUANDO** el servidor confirma cambios válidos
- **ENTONCES** se muestra el recurso devuelto con sus datos actualizados
- **Y** finaliza el modo de edición

#### Escenario: edición cancelada o fallida

- **DADO** que una publicación está en edición
- **CUANDO** el participante cancela o la operación falla
- **ENTONCES** la publicación visible **NO DEBE** cambiar
- **Y** ante un fallo se conservan los valores editados y se informa el error

### Requisito: eliminar una publicación

La aplicación **DEBE** pedir confirmación inmediatamente antes de eliminar, identificando la publicación cuando sea posible. **NO DEBE** retirarla hasta recibir confirmación del servidor.

#### Escenario: eliminación confirmada

- **DADO** que el participante acepta la confirmación
- **CUANDO** el servidor completa la eliminación
- **ENTONCES** la publicación desaparece de la lista
- **Y** si se eliminó desde el detalle, se regresa a la lista

#### Escenario: eliminación cancelada o fallida

- **DADO** que se solicita eliminar una publicación
- **CUANDO** el participante cancela o el servidor rechaza la operación
- **ENTONCES** la publicación permanece visible
- **Y** solo ante un fallo se comunica el error
