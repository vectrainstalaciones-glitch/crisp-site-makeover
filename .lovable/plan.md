## Objetivo

Convertir Vectra Instalaciones en un sitio multi-página con un sistema de presupuestos online (vivienda) y solicitud rápida (promotora/industrial), gestionable desde el panel de administrador con envío automático por email.

## Cambios visibles

### Navegación y páginas independientes
- `/` (Inicio): Hero + Sponsors + Trayectoria + Proyectos destacados + (al final) enlace discreto "Acceder".
  - Nota: el cliente pidió "totalmente oculto". Acepto eso y elimino el enlace; el acceso será únicamente escribiendo `/login` en la URL.
- `/servicios` — sección de servicios.
- `/empresa` — trayectoria/equipo.
- `/proyectos` — proyectos realizados.
- `/presupuestos` — landing con dos tarjetas:
  - `/presupuestos/promotora` → formulario corto (datos + descripción) que abre WhatsApp **y** guarda en BD.
  - `/presupuestos/vivienda` → presupuesto online con datos del cliente (nombre, email, teléfono, dirección) + recuento por estancias y selección de items **sin precios**.
- El header se actualiza con: Inicio · Servicios · Empresa · Proyectos · Presupuestos.

### Flujo de presupuesto online (vivienda)
1. Breve descripción: el cliente cuenta sus estancias (habitaciones, salón, cocina, baños, exteriores…) y para cada zona elige los items que necesita (puntos de luz, enchufes, datos, TV, etc.).
2. UI: añade zonas dinámicamente; en cada zona elige items del catálogo (sin precios) y cantidad.
3. Envía la solicitud → se guarda en BD con estado `pendiente_revision` y los datos del cliente.

### Panel de administrador (`/admin`)
Tres pestañas nuevas/ajustadas:
- **Solicitudes**: lista de todas las solicitudes (promotora + vivienda) con estado.
  - Al abrir una de vivienda: editor con las líneas seleccionadas por el cliente; puedo modificar cantidades, **añadir nuevos items**, eliminar, y asignar/ajustar precios. Total automático. Botón "Enviar presupuesto al cliente" que envía el email.
- **Catálogo**: CRUD de items (concepto, descripción, precio por defecto, categoría, orden). Pre-cargado con los del Excel.
- **Estadísticas** y **Chat** (ya existen).

El email enviado al cliente incluye: logo Vectra, datos de la empresa, sponsors, tabla de líneas con precios y total, datos de contacto. Sin PDF adjunto (la infraestructura de email de Lovable no soporta adjuntos); el presupuesto va como HTML rico en el cuerpo del email + un enlace público `/presupuesto/:token` con vista imprimible/guardable como PDF desde el navegador.

## Cambios de base de datos

- `catalog_items` (concepto, descripcion, precio_unitario, categoria, sort_order, activo).
- Ampliar `budget_requests`: añadir `tipo` ('promotora' | 'vivienda'), `direccion`, `payload` jsonb (estancias e items del cliente), `lines` jsonb (líneas finales con precio puestas por admin), `total`, `public_token`, `sent_at`.
- RLS: lectura pública del catálogo activo; escritura solo admin. Resto solo admin (insert público para crear solicitudes ya existe).
- Seed inicial del catálogo con los 14 conceptos del Excel.

## Detalles técnicos

- Rutas TanStack file-based: nuevos archivos en `src/routes/`. Reutilizo los componentes de sección existentes moviéndolos a su ruta. Header pasa de anclas `#` a `<Link to=...>`.
- Email: uso Lovable Emails (requiere dominio configurado). Si no está, te indicaré configurarlo desde Cloud → Emails antes de probar el envío real.
- Plantilla React Email con branding Vectra para el presupuesto.
- Vista pública `/presupuesto/$token` (lectura por token, sin auth) para que el cliente vea/imprima el presupuesto.

## Lo que NO incluyo en esta iteración (para no inflar)

- PDF adjunto (Lovable Emails no soporta adjuntos; queda el enlace imprimible).
- Edición visual de los textos de servicios/empresa desde admin (de momento se editan en código como ahora).
- Login social. El acceso sigue siendo solo el usuario `bichopalo` ya creado, accediendo por `/login` directamente.