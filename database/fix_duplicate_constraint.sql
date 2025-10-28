-- Eliminar la restricción UNIQUE que causa el error
-- Esto permite que dos participantes con el mismo nombre estén en el mismo sorteo

ALTER TABLE participants
DROP CONSTRAINT IF EXISTS participants_raffle_id_name_key;

-- Verificación: Consulta para ver las restricciones actuales
-- (puedes ejecutar esto después para confirmar que se eliminó)
-- SELECT constraint_name FROM information_schema.table_constraints
-- WHERE table_name = 'participants' AND constraint_type = 'UNIQUE';
