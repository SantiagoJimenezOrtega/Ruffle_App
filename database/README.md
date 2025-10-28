# Configuración de Base de Datos - Supabase

## Instrucciones para ejecutar el esquema

### Paso 1: Acceder al SQL Editor de Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **SQL Editor**

### Paso 2: Ejecutar el esquema

1. Haz clic en **"New query"** (Nueva consulta)
2. Abre el archivo `schema.sql` de esta carpeta
3. Copia **TODO** el contenido del archivo
4. Pégalo en el editor SQL de Supabase
5. Haz clic en **"Run"** (Ejecutar) o presiona `Ctrl + Enter`

### Paso 3: Verificar las tablas

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver las siguientes tablas:
   - `raffles` - Sorteos realizados
   - `participants` - Participantes
   - `raffle_results` - Resultados del sorteo
   - `payments` - Pagos (para futuro)
   - `posts` - Publicaciones (para futuro)

## Estructura de la Base de Datos

### Tabla: raffles
Almacena información de cada sorteo realizado.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único del sorteo |
| name | TEXT | Nombre del sorteo |
| monthly_amount | DECIMAL | Monto mensual a pagar |
| start_month | INTEGER | Mes inicial (0-11) |
| start_year | INTEGER | Año inicial |
| status | TEXT | Estado: active, completed, cancelled |

### Tabla: participants
Participantes de cada sorteo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único del participante |
| raffle_id | UUID | Referencia al sorteo |
| name | TEXT | Nombre del participante |
| slots | INTEGER | Número de cupos (1 o 2) |

### Tabla: raffle_results
Resultados del sorteo (qué mes le tocó a cada participante).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único del resultado |
| raffle_id | UUID | Referencia al sorteo |
| participant_id | UUID | Referencia al participante |
| month | INTEGER | Mes asignado (0-11) |
| year | INTEGER | Año asignado |
| month_display | TEXT | Nombre del mes (ej: "Noviembre 2025") |
| slot_number | INTEGER | Número de slot (1 o 2) |
| month_index | INTEGER | Índice del mes en la secuencia |

### Tabla: payments (Preparado para futuro)
Tracking de pagos mensuales.

### Tabla: posts (Preparado para futuro)
Publicaciones y anuncios del administrador.

## Relaciones

- `participants.raffle_id` → `raffles.id`
- `raffle_results.raffle_id` → `raffles.id`
- `raffle_results.participant_id` → `participants.id`
- `payments.raffle_id` → `raffles.id`
- `payments.participant_id` → `participants.id`

## Próximos Pasos

Una vez ejecutado el esquema, la aplicación podrá:
1. ✅ Guardar sorteos en la base de datos
2. ✅ Persistir participantes y resultados
3. ✅ Consultar sorteos históricos
4. 🔜 Sistema de autenticación (próxima fase)
5. 🔜 Tracking de pagos (próxima fase)
6. 🔜 Sistema de publicaciones (próxima fase)
