-- =====================================================
-- AGREGAR POLÍTICA DE UPDATE PARA RAFFLE_RESULTS
-- =====================================================
-- Permite a los admins actualizar resultados (necesario para intercambiar posiciones)

CREATE POLICY "Admins can update raffle results"
  ON raffle_results FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
