-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA CADENA DE AHORRO
-- =====================================================

-- Tabla: raffles (Sorteos)
CREATE TABLE raffles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  monthly_amount DECIMAL(10, 2) DEFAULT 0,
  start_month INTEGER NOT NULL, -- 0-11 (Enero-Diciembre)
  start_year INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: participants (Participantes)
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  slots INTEGER NOT NULL CHECK (slots IN (1, 2)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: raffle_results (Resultados del sorteo)
CREATE TABLE raffle_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  month INTEGER NOT NULL, -- 0-11 (Enero-Diciembre)
  year INTEGER NOT NULL,
  month_display TEXT NOT NULL,
  slot_number INTEGER NOT NULL, -- 1 o 2
  total_slots INTEGER NOT NULL, -- Total de slots del participante
  month_index INTEGER NOT NULL, -- Índice del mes en la secuencia del sorteo
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(raffle_id, participant_id, slot_number),
  UNIQUE(raffle_id, month_index)
);

-- Tabla: payments (Pagos - para futuro)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'late')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: posts (Publicaciones - para futuro)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA MEJOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_participants_raffle ON participants(raffle_id);
CREATE INDEX idx_raffle_results_raffle ON raffle_results(raffle_id);
CREATE INDEX idx_raffle_results_participant ON raffle_results(participant_id);
CREATE INDEX idx_payments_raffle ON payments(raffle_id);
CREATE INDEX idx_payments_participant ON payments(participant_id);
CREATE INDEX idx_posts_raffle ON posts(raffle_id);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_raffles_updated_at
  BEFORE UPDATE ON raffles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Por ahora deshabilitado
-- Se habilitará cuando se implemente autenticación
-- =====================================================

-- Habilitar RLS (comentado por ahora)
-- ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE raffle_results ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Políticas (se crearán cuando se implemente auth)
-- CREATE POLICY "Enable read access for all users" ON raffles FOR SELECT USING (true);

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL)
-- =====================================================

-- Descomentar para insertar datos de prueba
/*
INSERT INTO raffles (name, monthly_amount, start_month, start_year)
VALUES ('Cadena de Ahorro Noviembre 2025', 1000000, 10, 2025);
*/

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================
