# Instrucciones para habilitar autenticación

## ⚠️ IMPORTANTE: Ejecuta este SQL antes de probar el login

### Paso 1: Ve a Supabase SQL Editor
1. Abre https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Haz clic en **SQL Editor** en el menú lateral
4. Haz clic en **"New query"**

### Paso 2: Copia y pega el SQL completo

Abre el archivo `auth_schema.sql` de esta carpeta y copia **TODO** el contenido, o copia lo siguiente:

```sql
-- Tabla: profiles (Perfiles de usuario)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'participant' CHECK (role IN ('admin', 'participant')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Trigger para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para raffles
CREATE POLICY "Everyone can view raffles"
  ON raffles FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert raffles"
  ON raffles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update raffles"
  ON raffles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete raffles"
  ON raffles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para participants
CREATE POLICY "Everyone can view participants"
  ON participants FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert participants"
  ON participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update participants"
  ON participants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete participants"
  ON participants FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para raffle_results
CREATE POLICY "Everyone can view raffle results"
  ON raffle_results FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert raffle results"
  ON raffle_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete raffle results"
  ON raffle_results FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para payments
CREATE POLICY "Everyone can view payments"
  ON payments FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert payments"
  ON payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para posts
CREATE POLICY "Everyone can view posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert posts"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update posts"
  ON posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'participant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### Paso 3: Ejecuta el SQL
1. Haz clic en **"Run"** (esquina inferior derecha)
2. Deberías ver: "Success. No rows returned"

### Paso 4: Verifica las tablas
1. Ve a **"Table Editor"**
2. Deberías ver la nueva tabla: `profiles`

### Paso 5: Crea tu usuario admin
1. Ve a **"Authentication"** → **"Users"** en Supabase
2. Haz clic en **"Add user"** → **"Create new user"**
3. Ingresa:
   - Email: tu@email.com
   - Password: tu contraseña segura
   - **IMPORTANTE:** En "User Metadata" añade:
     ```json
     {
       "full_name": "Tu Nombre",
       "role": "admin"
     }
     ```
4. Haz clic en **"Create user"**

### Paso 6: Prueba la aplicación
1. Ve a http://localhost:5174/
2. Se te redirigirá a `/login`
3. Inicia sesión con las credenciales del admin que creaste
4. Deberías ver el **Panel de Administración**

### Paso 7: Crea un usuario participante para probar
1. En la aplicación, haz clic en "Regístrate aquí"
2. Crea un usuario normal (este será participante por defecto)
3. Cierra sesión
4. Inicia sesión con el participante
5. Deberías ver el **Dashboard de Participante**

---

## ✅ ¡Listo! El sistema de autenticación está configurado

Ahora tienes:
- ✅ Login/Register funcionando
- ✅ Roles de usuario (Admin/Participante)
- ✅ Dashboards diferentes según el rol
- ✅ Protección de rutas
- ✅ RLS (Row Level Security) habilitado
- ✅ Solo admins pueden crear/editar/eliminar sorteos
