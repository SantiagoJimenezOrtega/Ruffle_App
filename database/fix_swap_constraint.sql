-- =====================================================
-- SOLUCIÓN: HACER LA CONSTRAINT DEFERRABLE
-- =====================================================
-- Esto permite que la constraint se valide al final de la transacción
-- en lugar de en cada UPDATE individual

-- 1. Eliminar la constraint existente
ALTER TABLE raffle_results
DROP CONSTRAINT IF EXISTS raffle_results_raffle_id_participant_id_slot_number_key;

-- 2. Recrear la constraint como DEFERRABLE INITIALLY DEFERRED
ALTER TABLE raffle_results
ADD CONSTRAINT raffle_results_raffle_id_participant_id_slot_number_key
UNIQUE (raffle_id, participant_id, slot_number)
DEFERRABLE INITIALLY DEFERRED;

-- Esto permite que durante una transacción, la constraint se valide solo al final
-- permitiendo estados temporales que violarían la constraint
