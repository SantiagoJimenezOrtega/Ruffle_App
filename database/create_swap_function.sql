-- =====================================================
-- FUNCIÓN SQL PARA INTERCAMBIAR RESULTADOS
-- =====================================================
-- Esta función usa una transacción con constraint DEFERRED
-- para hacer el swap correctamente

CREATE OR REPLACE FUNCTION swap_raffle_results(
  result_id_1 UUID,
  result_id_2 UUID
)
RETURNS json AS $$
DECLARE
  temp_participant_id UUID;
  temp_slot_number INTEGER;
  temp_total_slots INTEGER;
  r1 RECORD;
  r2 RECORD;
BEGIN
  -- Hacer la constraint DEFERRED durante esta transacción
  SET CONSTRAINTS raffle_results_raffle_id_participant_id_slot_number_key DEFERRED;

  -- Obtener ambos registros
  SELECT * INTO r1 FROM raffle_results WHERE id = result_id_1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Result 1 not found: %', result_id_1;
  END IF;

  SELECT * INTO r2 FROM raffle_results WHERE id = result_id_2;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Result 2 not found: %', result_id_2;
  END IF;

  -- Guardar valores de result1
  temp_participant_id := r1.participant_id;
  temp_slot_number := r1.slot_number;
  temp_total_slots := r1.total_slots;

  -- Paso 1: Actualizar result1 con valores de result2
  UPDATE raffle_results
  SET
    participant_id = r2.participant_id,
    slot_number = r2.slot_number,
    total_slots = r2.total_slots
  WHERE id = result_id_1;

  -- Paso 2: Actualizar result2 con valores originales de result1
  UPDATE raffle_results
  SET
    participant_id = temp_participant_id,
    slot_number = temp_slot_number,
    total_slots = temp_total_slots
  WHERE id = result_id_2;

  -- La constraint se valida aquí al final de la transacción
  RETURN json_build_object('success', true, 'message', 'Swap completed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION swap_raffle_results(UUID, UUID) TO authenticated;
