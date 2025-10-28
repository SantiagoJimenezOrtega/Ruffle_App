-- =====================================================
-- FIX: Crear perfil para usuario creado manualmente
-- =====================================================

-- IMPORTANTE: Cambia estos valores por los tuyos
-- User ID: Copia el ID de la consola del navegador (el error muestra el User ID)
-- Email: El email que usaste para crear el usuario
-- Full Name: Tu nombre completo

INSERT INTO profiles (id, email, full_name, role)
VALUES (
  '9099794d-8c68-4035-ae2b-ab724a02ca6b',  -- ⚠️ CAMBIA ESTO por tu User ID
  'admin@example.com',                      -- ⚠️ CAMBIA ESTO por tu email
  'Administrador',                          -- ⚠️ CAMBIA ESTO por tu nombre
  'admin'                                   -- ✅ Este no lo cambies, es el role de admin
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- Verifica que se creó correctamente
SELECT * FROM profiles WHERE id = '9099794d-8c68-4035-ae2b-ab724a02ca6b';  -- ⚠️ CAMBIA el ID

-- =====================================================
-- Si ya existe el perfil pero con role 'participant'
-- =====================================================

-- Usa este query para cambiar el role a admin
-- UPDATE profiles
-- SET role = 'admin'
-- WHERE id = '9099794d-8c68-4035-ae2b-ab724a02ca6b';  -- ⚠️ CAMBIA el ID
