# Modulo de Canchas: Arquitectura y Cambios

Desarrollé este módulo para que sea el núcleo administrativo y visual de los espacios deportivos. Permite a los usuarios ver qué canchas están disponibles y a nosotros como administradores controlar todo el inventario. Sus tareas principales son listar el catálogo, controlar estados (Disponible, Ocupada, Mantenimiento) y manejar la creación, edición y eliminación de canchas de forma segura.

## Funcionalidades y Mejoras Implementadas

1. Borrado Seguro: Agregué una validación estricta. No podemos borrar una cancha si ya tiene un historial de reservas. Si la cancha ya fue usada, el sistema te bloquea y te sugiere pasarla a estado de Mantenimiento. Solo si es totalmente nueva permite el borrado físico.
2. Edición Inteligente: Reciclé el formulario de creación para no duplicar código. El formulario ahora lee la URL; si encuentra un ID, descarga los datos, rellena los campos y cambia su interfaz a modo edición.
3. Reglas de Mantenimiento: Configure el sistema para que, al pasar una cancha a Mantenimiento, el frontend oculte el botón de reserva y el backend devuelva la disponibilidad vacía, pintando todo el calendario semanal como bloqueado.
4. Ajustes Visuales y Prevención de Errores: Unifiqué el diseño de las tarjetas (CourtCard) para que tengan la misma altura y respondan bien a los clics. Además, impuse límites estrictos en los inputs del formulario (50 caracteres en nombre, 200 en descripción) para coincidir con la base de datos y evitar que Postgres tire error.

## Archivos Modificados

### Backend (Node.js)

- canchas.repository.js: Agregué la función tieneReservas(id) para consultar el historial en DetalleReservas, y eliminarCancha(id) para ejecutar el DELETE. También implementé la función mapearCancha para estandarizar los nombres de las columnas a PascalCase (ej. CanchaID) y corregir el comportamiento por defecto de Postgres que devuelve todo en minúsculas.
- canchas.service.js: Modifiqué las funciones obtenerDisponibilidad y obtenerDisponibilidadSemana. Ahora, si la cancha tiene un estado distinto a 'Disponible', corto la ejecución y devuelvo arreglos vacíos. También agregué la regla de negocio para evitar eliminar canchas con historial.
- canchas.controller.js: Creé la función deleteCancha, la cual recibe el parámetro ID desde la ruta, invoca la regla de negocio en el servicio y retorna el código de éxito al cliente.
- canchas.routes.js: Añadí el endpoint DELETE /api/canchas/:id, conectando la solicitud HTTP directamente con el controlador.

### Frontend (React)

- hooks/useCanchas.ts: Extraje toda la lógica de filtrado y estado de la página principal hacia este hook. Ahora centraliza el manejo de los parámetros de búsqueda de la URL y la obtención del catálogo mediante la API.
- hooks/useCanchasDetails.ts: Creé este hook para encapsular la carga de los detalles de una cancha específica. Usa Promise.all para pedir en paralelo la información de la cancha y la disponibilidad semanal, reduciendo el tiempo de carga.
- hooks/useCanchaForm.ts: Reescribí el comportamiento del formulario. Añadí lógica para detectar si estamos en modo edición evaluando los parámetros de la URL, hacer un GET para rellenar los datos, y utilizar updateCancha (PUT) en vez de createCancha (POST) al guardar.
- constants/horarios.ts: Ajusté la constante HORARIOS para que finalice a las 21:00, estandarizando la regla de negocio de la última hora de alquiler y sincronizando el calendario del frontend con la generación del backend.
- pages/admin/AdminCanchasPage.tsx: Habilité las acciones de la tabla. Vinculé el botón de editar con la ruta correspondiente y le agregué confirmación de navegador nativa (window.confirm) al botón de borrar antes de llamar a la API.
- pages/admin/canchas/nueva/CanchaFormPage.tsx: Agregué validaciones nativas HTML (maxLength) en los inputs junto con contadores visuales. Implementé renderizado condicional basándome en la variable isEditMode para alterar los títulos y el botón de acción.
- components/ui/CourtCard.tsx: Reescribí la estructura del componente usando clases de flexbox para forzar alturas iguales independientemente del contenido. Aseguré el paso de la propiedad onClick al contenedor padre para reparar la redirección hacia la vista de detalles.
- pages/CanchaDetailPage.tsx: Modifiqué el renderizado del calendario semanal para que consuma correctamente el objeto vacío que ahora manda el backend en caso de mantenimiento, garantizando que las celdas se pinten como ocupadas.
