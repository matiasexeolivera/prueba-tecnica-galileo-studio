# Documento de decisiones

## Interpretación de producto

Descarté la lectura obvia ("necesitan un chat mejor") apenas junté las ocho frases de la reunión: casi
todas apuntan al mismo síntoma, que nadie tiene visibilidad de nada. El canal (WhatsApp/email/llamadas)
no es el problema, es que ese canal no tiene memoria ni estado. Para mí el problema real es de
**trazabilidad**, no de comunicación — la prueba está en "a veces nos piden cosas que ya nos habían
pedido y no nos damos cuenta": eso no se arregla con un chat más rápido, se arregla con algo consultable.

Por eso lo primero que construí fue el circuito completo, aunque austero: login → crear ticket → verlo
con estado → comentarlo → que el staff lo cierre. Preferí las cinco piezas funcionando de punta a punta
antes que una perfecta, porque un producto a medias se evalúa como fragmento y el enunciado pide
explícitamente lo contrario.

Dejé afuera, a propósito:
- **Notificaciones** — el valor ya existe sin ellas (el estado es consultable); es conveniencia, no núcleo.
- **Detección de tickets duplicados** — resolverla bien es un problema de similaridad semántica en sí
  mismo. Dejé la base (`TicketEvent`, tickets consultables) sin forzar una heurística mala solo por tildar el casillero.
- **Gestión de usuarios desde la UI** — CRUD estándar que no dice nada sobre criterio de producto y come horas; hoy se resuelve por seed.
- **Roles más granulares** que Admin/Miembro por organización — no hay pista en las notas de que haga falta.
- **Facturación, SLAs automáticos, i18n, tests exhaustivos** — fuera de alcance explícito.

Antes de una V2 le preguntaría al cliente: (1) si "transparencia" alcanza con estado + comentarios o
esperan SLAs visibles; (2) cuántos clientes/usuarios manejan hoy, porque cambia si SQLite alcanza o
conviene migrar antes; (3) si el cliente debería gestionar su propio equipo o eso lo controla siempre
Galileo Studio; (4) qué tan crítico es que un comentario también llegue por email; (5) si hay picos de
urgencia fuera de horario que hagan que push/SMS sea día-uno.

## Arquitectura

Elegí Next.js full-stack (App Router + Server Actions) en un solo proyecto, sin backend separado: con el
tiempo disponible, montar dos repos con su propio deploy y contrato de API agrega fricción, no valor. Si
en algún momento otra app necesitara consumir los mismos datos, ahí separaría un servicio de API — hoy
no hay señal de que eso vaya a pasar.

Modelo de datos: `Organization` es el límite del tenant. `User` cuelga de una organización o es `null`
si es staff — usé ese `null` en vez de una tabla aparte porque el enum `Role` ya distingue el caso y
simplifica las queries. `Ticket` siempre pertenece a una organización, con `status`/`priority`/`type`
como enums en vez de strings libres (agregar un valor nuevo no rompe datos existentes, y el filtro
urgente-vs-duda de la reunión sale directo del enum `type`). `TicketEvent` es un log de auditoría pensado
como base para detectar patrones más adelante sin migrar nada.

Para escalabilidad: índices en `organizationId` y `(organizationId, status)`, el filtro que corre en cada
request. Y, más importante, **toda** lectura/escritura de tickets pasa por un único archivo,
`src/lib/tickets.ts` — ninguna page llama a Prisma directo. Si cambia la regla de quién ve qué, se cambia
en un lugar, no en diez pantallas.

SQLite es deliberado para *este* entregable, no algo que se me escapó — con un driver adapter (que
Prisma 7 exige incluso para SQLite; no lo sabía hasta que el seed tiró "PrismaClient was instantiated
without any options"), migrar a Postgres el día de mañana es cambiar una env var y el provider, no
reescribir queries.

En seguridad, lo que más cuidé es que el aislamiento no dependiera de la UI: cada query de `tickets.ts`
filtra por `organizationId` sacado de la sesión, nunca de un parámetro del cliente HTTP. Lo verifiqué a
mano — logueado como Acme, pedí por URL un ticket de Bluewave y me devolvió 404 (no 403, para no
confirmar que el recurso existe). El middleware bloquea rutas sin sesión, pero cada Server Action
re-chequea la sesión por su cuenta; no confío en una sola barrera. Ahí encontré un bug real: Auth.js con
Credentials usa bcrypt y Prisma, y el middleware de Next corre en Edge Runtime, que no soporta ninguno de
los dos. Tuve que separar la config en dos archivos (`auth.config.ts` sin el provider, para el
middleware; `auth.ts` completo para el resto) — quedó en el historial de commits porque fue un bug que
encontré desarrollando, no algo planificado de entrada.

Sin maquillarlo, lo que falta en seguridad: rate limiting en el login e invalidación de sesión al cambiar
contraseña. La validación de inputs sí la resolví con `zod` en las tres Server Actions que reciben datos
del usuario, con mensajes de error específicos por campo en vez de un genérico "algo salió mal".

## Estado de la entrega

**Terminado:** login, dashboard por rol, alta de ticket, detalle con comentarios y cambio de estado
(staff), aislamiento multi-tenant verificado a mano, seed con datos de prueba, e interfaz propia —
sidebar de marca, logomark, favicon — con el tono de galileostudio.ai sin copiarlo.

**A medias:** no recorrí a fondo estados raros como un usuario sin organización asignada.

**Sin tocar:** notificaciones, gestión de usuarios desde UI, detección de duplicados, tests
automatizados y — esto lo noto releyendo — mobile. Lo armé y probé en desktop; el sidebar fijo y la
tabla del dashboard seguramente no se vean bien en una pantalla chica.

**Cómo seguiría:** búsqueda/filtros en el dashboard (lo primero que pediría un cliente con muchos
tickets), después notificación por email al cambiar estado, después gestión de equipo desde UI. Los tests de integración sobre `tickets.ts` los dejaría últimos en esta lista solo
porque prioricé el circuito completo — pero es el código con menos margen de error, así que en un
proyecto real no lo dejaría relegado tanto tiempo.

*Nota: `npm audit` marca 3 vulnerabilidades "high", transitivas de `deepmerge-ts` vía `@prisma/config`.
Arreglarlas con `--force` bajaría Prisma a v6, cambio más grande de lo que amerita esta entrega — queda
para revisar cuando salga un parche sobre v7.*
