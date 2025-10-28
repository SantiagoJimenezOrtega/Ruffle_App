# Cambios de Tema - Morado a Azul + Modo Oscuro

## ✅ Completado:
1. [ThemeContext.jsx](src/contexts/ThemeContext.jsx) - Context para tema oscuro
2. [index.css](src/index.css) - Colores actualizados
3. [App.jsx](src/App.jsx) - ThemeProvider agregado
4. [Navbar.jsx](src/components/Navbar.jsx) - Toggle de tema + colores neutros
5. [PageContainer.jsx](src/components/PageContainer.jsx) - Componente wrapper
6. [Login.jsx](src/pages/Login.jsx) - Tema blanco/azul minimalista

## 🔄 Pendiente - Cambiar en estos archivos:

### Buscar y reemplazar globalmente:
- `from-purple-600 to-purple-900` → `bg-gray-50 dark:bg-gray-900`
- `bg-purple` → `bg-blue`
- `text-purple` → `text-blue`
- `border-primary` → `border-blue-500`
- `bg-primary` → `bg-blue-600`
- `hover:bg-primary-dark` → `hover:bg-blue-700`
- `focus:ring-primary` → `focus:ring-blue-500`
- `bg-white/10 backdrop-blur-md` → `bg-white dark:bg-gray-800`
- `text-white` → `text-gray-900 dark:text-white`
- `border-white/20` → `border-gray-200 dark:border-gray-700`

### Archivos a actualizar:
- [ ] Register.jsx
- [ ] AdminDashboard.jsx
- [ ] ParticipantDashboard.jsx
- [ ] CreateRaffle.jsx
- [ ] RaffleDetail.jsx
- [ ] PublicRaffleView.jsx
- [ ] ParticipantForm.jsx
- [ ] RaffleModal.jsx
- [ ] RaffleResults.jsx

## Paleta de Colores Nueva:

### Modo Claro:
- Fondo: `bg-gray-50`
- Tarjetas: `bg-white`
- Texto: `text-gray-900`
- Texto secundario: `text-gray-600`
- Bordes: `border-gray-200`
- Primario (azul): `bg-blue-600`, `hover:bg-blue-700`

### Modo Oscuro:
- Fondo: `dark:bg-gray-900`
- Tarjetas: `dark:bg-gray-800`
- Texto: `dark:text-white`
- Texto secundario: `dark:text-gray-400`
- Bordes: `dark:border-gray-700`
- Primario (azul): `bg-blue-600`, `hover:bg-blue-700`
