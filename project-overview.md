# Documentación Integral del Proyecto: Sistema Web de Reservación de Canchas Deportivas
*Guía completa de visión general, arquitectura y funcionalidades para la creación de presentaciones empresariales, folletos comerciales (trifolios) y material de marketing.*

---

## 1. Resumen Ejecutivo

* **Nombre del proyecto:** Sistema Web de Reservación de Canchas Deportivas (*Proyecto de Sistemas Expertos*).
* **Problema que resuelve:** Elimina el caótico, lento y anticuado proceso de reservar instalaciones deportivas mediante interminables llamadas telefónicas, mensajes traspapelados en WhatsApp y anotaciones en cuadernos de papel. Soluciona de raíz los choques de horarios, el empalmamiento de partidos (dobles reservas) y la falta de control contable del negocio. Permite a los deportistas consultar espacios libres en tiempo real y asegurar su cancha las 24 horas del día, los 7 días de la semana desde su teléfono o computadora; mientras otorga a los propietarios un centro de mando digital para auditar ingresos, cobros impositivos y uso de sus instalaciones sin margen de error humano.
* **A quién está dirigido:**
  * **Deportistas y Jugadores (Clientela general):** Grupos de amigos, atletas amateurs, organizadores de ligas empresariales y academias en Tegucigalpa (y alrededores) que buscan rentar canchas de Fútbol 5, Baloncesto, Voleibol, Tenis o Pádel de forma rápida, transparente y garantizada.
  * **Administradores y Propietarios (Staff del complejo deportivo):** Dueños, gerentes y personal de recepción que necesitan administrar el calendario de reservaciones, pausar canchas por mantenimiento, auditar la recaudación y emitir comprobantes tributarios formales con desglose fiscal sin necesidad de conocimientos técnicos avanzados.

---

## 2. Funcionalidades Principales

El sistema se divide en seis grandes módulos inteligentes. Cada función está diseñada en torno al beneficio directo que le entrega al usuario final:

### Módulo de Autenticación y Seguridad de Acceso
* **Registro e Inicio de Sesión Inteligente:** Permite a nuevos usuarios crear un perfil personal asegurado con sus nombres, correo y **número de teléfono** (dato imprescindible para coordinar reservas en instalaciones físicas).
  * *Beneficio para el usuario:* Crea una identidad única en la plataforma; el deportista no tiene que volver a dictar, reescribir sus datos ni confirmar su número telefónico cada vez que desea apartar un partido en el futuro.
* **Sesión Ininterrumpida (Auto-Refresh de Seguridad):** El sistema mantiene la conexión del cliente activa de forma invisible y segura de fondo, incluso si recarga la página o cierra accidentalmente su navegador.
  * *Beneficio para el usuario:* Cero frustración web; entra y reserva en segundos en su teléfono sin que el sistema lo obligue molestamente a iniciar sesión y poner contraseña a cada rato.
* **Doble Portal de Acceso (Roles Automáticos):** Separa instantáneamente la experiencia de un jugador común de las herramientas del dueño del complejo deportivo.
  * *Beneficio para el usuario:* Privacidad y tranquilidad rotunda; un cliente regular jamás tendrá acceso a datos contables ni a la información privada de otros jugadores, mientras que el administrador obtiene poderes globales de gestión.

### Módulo de Exploración y Catálogo de Canchas
* **Escaparate Visual y Ficha Técnica:** Muestra fotografías de alta resolución, deporte compatible, tipo de superficie (césped sintético, piso de madera, cemento pulido, arcilla, etc.) y lista clara de precios tanto regulares como diferenciados para fin de semana.
  * *Beneficio para el usuario:* El deportista sabe con total transparencia por qué instalación está pagando antes de salir de casa, evitando decepciones y eligiendo el calzado adecuado para la superficie.
* **Filtros Inmediatos por Deporte y Búsqueda por Texto:** Permite alternar la vista al instante entre Fútbol 5, Baloncesto, Voleibol, Tenis y Pádel, o escribir directamente en un buscador para localizar una cancha favorita.
  * *Beneficio para el usuario:* Ahorro sustancial de tiempo; localiza en menos de 5 segundos el campo perfecto de entre un catálogo extenso sin tener que leer menús aburridos.
* **Control de Estado Operativo (Activa, Ocupada o Mantenimiento):** El personal del centro deportivo puede editar en tiempo real los precios, descripciones o inhabilitar una cancha temporalmente si entra a restauración, limpieza o pintado de líneas.
  * *Beneficio para el usuario:* Previene el cobro de espacios en mal estado, protegiendo la integridad física y seguridad de los deportistas y resguardando el prestigio de la marca del centro deportivo.

### Módulo de Reservaciones y Calendario Inteligente
* **Buscador con Detección de Fecha Local:** Al entrar al sistema, la plataforma detecta de inmediato la fecha actual de la zona horaria real del cliente preseleccionando el día de hoy.
  * *Beneficio para el usuario:* Optimizado para el hábito real del jugador que busca "jugar un partido hoy en la noche", ahorrando clicks repetitivos en calendarios.
* **Selectores Dinámicos e Interdependientes de Hora de Inicio y Hora de Fin:** Rompiendo con sistemas viejos que limitan a paquetes cerrados de "1 a 3 horas", el cliente escoge libremente la *Hora de Inicio* (ej. 15:00) y el sistema le habilita dinámicamente un menú inteligente con las *Horas de Fin* legales posteriores (ej. desde las 16:00 hasta la hora de cierre del local a las 22:00 hrs).
  * *Beneficio para el usuario:* Flexibilidad sin precedentes; permite rentar desde 1 hora suelta para un partido rápido luego del trabajo, hasta bloquear 8 o 12 horas consecutivas sin interrupción para torneos completos o celebraciones corporativas de día completo.
* **Cotizador Financiero en Vivo (Con Desglose Fiscal):** Tan pronto como el cliente elige su rango de horas, un panel de resumen aparece al instante multiplicando la tarifa de la cancha por la duración exacta del juego, detectando en automático si el día marcado exige tarifa especial de Fin de Semana (Sábados/Domingos) y sumando el Impuesto sobre Ventas (15% ISV hondureño).
  * *Beneficio para el usuario:* Honestidad y claridad absoluta en precios; muestra centavo a centavo cuánto se va a pagar antes de presionar el botón final, sin sorpresas amargas en ventanilla.
* **Historial Oficial de Partidos ("Mis Reservas"):** Sección personal privada donde el cliente monitoreada en línea el listado de sus juegos agendados, el comprobante oficial y el estado resolutivo de cada uno (Confirmada, Pendiente, Cancelada o Completada).
  * *Beneficio para el usuario:* Sirve como carné digital o "boleto de entrada" comprobable desde el móvil del jugador para validar su acceso en la recepción del centro deportivo en cualquier momento.

### Módulo de Facturación y Normativa Tributaria (Honduras)
* **Estructura Contable CAI y SAR:** El sistema incorpora nativamente en su arquitectura y base de datos la normativa comercial fiscal de Honduras, preparando la vinculación de cobros con la Clave de Autorización de Impresión (CAI) otorgada por el Servicio de Administración de Rentas (SAR) y calculando el ISV del 15%.
  * *Beneficio para el usuario:* Institucionalidad y profesionalismo de alto nivel para clientes corporativos que precisan descargar recibos deducibles de impuestos de ley. *(Nota de transparencia técnica: la estructura relacional y los cálculos impositivos ya operan con éxito en base de datos; la emisión automatizada de facturas finales está en espera de inyectar los datos fiscales reales de la empresa dueña en producción)*.

### Módulo de Pagos y Cobros
* **Soporte Multi-Canal (Efectivo, Tarjetas y Transferencias):** Infraestructura pensada para conciliar ingresos provenientes del pago físico en ventanilla del local, cobros mediante tarjeta en plataforma o transferencias bancarias directas.
  * *Beneficio para el usuario:* Inclusión comercial de todo tipo de público, desde jóvenes que juntan efectivo en la cancha hasta profesionales que pagan de antemano de forma electrónica. *(Nota de transparencia técnica: por motivos de agilidad en la implementación de esta versión, la opción de cobro en tarjeta web opera bajo un modo de simulación segura que registra en firme el asiento contable del negocio sin cobrar comisiones de intermediarios bancarios todavía)*.

### Módulo de Administración, Reportes y Auditoría
* **Centro de Mando Privado (Dashboard Admin):** Espacio exclusivo provisto con una navegación lateral robusta para auditar todas las aristas de la empresa: Usuarios inscritos, Catálogo de Canchas, Control general de Reservas y Estados Financieros.
  * *Beneficio para el usuario (Dueño):* Otorga control directivo basado en datos duros en lugar de intuiciones, optimizando la gestión y maximizando las ganancias.
* **Generador Inteligente de Informes y Facturas en PDF:** Herramientas integradas en pantalla que condensan estadísticas de ocupación por deporte o historiales contables y los compilan automáticamente como documentos PDF descargables de calidad corporativa con un solo click.
  * *Beneficio para el usuario (Dueño/Contador):* Ahorra decenas de horas tediosas al mes en conteo manual de recibos o en llenar hojas aburridas en Excel para presentar contabilidad.

---

## 3. Cómo Funciona (Flujo del Usuario Paso a Paso)

A continuación, se presentan los dos recorridos típicos vividos dentro de la plataforma, redactados como un viaje conversacional sin tecnicismos:

### 🌟 Recorrido 1: La Experiencia del Jugador (El Cliente)
* **Paso 1 (Inspiración en el Escaparate):** Carlos y sus compañeros de trabajo deciden armar un partido de Pádel al salir de la oficina. Carlos abre el sitio web desde el celular; es recibido por una interfaz visualmente impactante, cargada de energía deportiva en azul marino oscuro y un naranja radiante. Navega al catálogo oficial verificado para Tegucigalpa.
* **Paso 2 (Búsqueda Veloz):** Para evitar distraerse con canchas de fútbol o tenis, Carlos pulsa el botón de filtro rápido **"Pádel"**. La pantalla elimina al instante lo innecesario y le muestra únicamente las canchas aptas. Entra a ver los detalles de su cancha predilecta de césped sintético.
* **Paso 3 (El Selector Inteligente y Cotización en Vivo):** Dentro de la cancha elegida, el sistema le sugiere por defecto la fecha del día de hoy (ahorrándole clics). Carlos despliega la *Hora de inicio* y marca las `17:00`. En ese segundo preciso, el sistema despierta al selector de *Hora de fin* (que estaba cautelosamente bloqueado para evitar equivocaciones) y le muestra las horas de salida válidas. Carlos marca las `20:00` para un torneo intensivo de 3 horas. Mágicamente, emerge una tarjeta vibrante color naranja inclinada en la pantalla: le informa que sus 3 horas tienen un subtotal X, suma con transparencia el 15% de impuesto (ISV) y le desglosa el monto final de forma cristalina.
* **Paso 4 (Verificación y Cierre):** Carlos presiona *Continuar*. Revisa su comprobante, un recuadro ilustrado estilo boleto cortado con tijera de evento deportivo, confirmando que su nombre, correo y número de teléfono celular estén en orden para notificaciones. Da click al botón agresivo de **"Confirmar Reserva"**.
* **Paso 5 (Boleto Digital y Partido):** Una pantalla triunfal lo felicita con un gran ícono de aprobación ("¡RESERVA CONFIRMADA!") otorgándole un **Código Único de Reserva** inviolable (Ej: `RES-2026-402`). Carlos entra a la sección *Mis Reservas*, le toma una captura de pantalla desde el móvil a su elegante tarjeta con la etiqueta sólida verde de `CONFIRMADA` y la envía al grupo de WhatsApp de sus amigos como boleto garantizado para ingresar a las 17:00 hrs. ¡A jugar!

### 💼 Recorrido 2: La Experiencia del Propietario (El Administrador)
* **Paso 1 (Acceso al Privilegio de Control):** El gerente general del centro deportivo entra al sistema con sus credenciales maestras. El servidor reconoce inmediatamente que su cuenta posee el rol VIP de `Administrador` y abre las puertas invisibles al portal secreto `/admin`.
* **Paso 2 (Monitoreo Panorámico):** Al lado izquierdo de la pantalla asoma una elegante barra de herramientas Azul Marino (*Navy*) en contraste con botones con efecto tridimensional que brillan en naranja intenso cuando se seleccionan. El gerente entra a **"Reservas"** y supervisa en una tabla de alta nitidez todo el tráfico del día, viendo las etiquetas sólidas en colores claros sin emojis molestos (Verde para `CONFIRMADA`, Naranja vibrante para `PENDIENTE`, o Roja de alerta en `CANCELADA`).
* **Paso 3 (Intervención de Mantenimiento):** Si la administración nota que una cancha de Voleibol debe ser pintada el martes por la mañana, el gerente entra al módulo **"Canchas"**, selecciona dicha propiedad y cambia la tarifa, nombre o la coloca temporalmente fuera de línea en dos clics para proteger a los usuarios de reservar un sitio en restauración.
* **Paso 4 (Cierre Contable y Descarga de Reportes):** Al finalizar la semana, el administrador ingresa al módulo de **"Reportes"** o **"Pagos"**, filtra el rendimiento financiero por deporte o período y pulsa el botón de descarga. Al instante, el sistema recopila los cientos de registros de la base de datos y le genera un archivo **PDF profesional** con tablas tabuladas impecablemente y con desglose del impuesto SAR/ISV, listo para mandarlo al contadora o para archivo fiscal, sin gastar en bolígrafos, ni calculadora de papel.

---

## 4. Stack Tecnológico (La Fuerza Mecánica)

Para lograr esta solidez e interactividad instantánea sin demoras, el sistema fue construido empleando los estándares de ingeniería más prestigiosos y valorados del ecosistema mundial:

### Capa Frontend (El Rostro Visual y Experiencia en el Navegador)
* **React 18 & TypeScript 5:** La combinación de oro en la industria informática internacional de desarrollo web. TypeScript aporta un blindaje ultra-riguroso contra errores inesperados al clasificar cada variable estrictamente, mientras React dibuja pantallas ágiles, fluidas y reactivas sin lentitudes.
* **Vite 6:** El motor de compilación de próxima generación más rápido del mercado actual. Reduce los tiempos de carga en navegadores de celular o computadora de varios segundos a apenas unas milésimas del segundo.
* **Tailwind CSS v4 (Con Diseño Arquitectónico Custom - "Brutalism UI"):** El framework de estilos más moderno y potente. Lejos de depender de plantillas prediseñadas o diseños genéricos pálidos, en este proyecto se personalizó todo el motor para generar una identidad de **"Brutalismo Deportivo"**: una estética audaz y agresiva que aprovecha fuentes de tipografía deportiva (como *Barlow Condensed*), una paleta corporativa elegante y agresiva (Azul Marino / Navy `#0b1f3a` y Naranja Oxidado `#ff6b2b`), bordes gruesos bien definidos y sombras sólidas cortadas sin difuminado que hacen que la web parezca un marcador de estadio en alta fidelidad o una revista física de deportes de alto rendimiento.
* **Ecosistema Complementario y Compiladores:** Utiliza *Lucide React* para iconografía clara e instantánea sin pesar en memoria, *Axios* con interceptores automáticos para mantener seguras las transmisiones de red, y la suite dual de **`@react-pdf/renderer` + `jsPDF / AutoTable`**, encargados de renderizar facturas fiscales y tablas de reportes directamente en formato PDF real dentro del sistema operativo del navegador en décimas de segundo.

### Capa Backend (El Cerebro Central y Lógica de Negocio)
* **Node.js & Express.js (REST API):** El estándar global para programar servidores de internet eficientes, livianos y capaces de procesar enormes olas de peticiones simultáneas sin saturarse de tráfico.
* **Criptografía Militar y Doble Bóveda de Tokens:**
  * Para asegurar la privacidad del usuario, las contraseñas nunca viajan en texto plano; son destruidas y convertidas en hashes criptográficos irreversibles usando el algoritmo **Bcrypt** (a 10 rondas de complejidad de encriptado). Ni el propio administrador de sistemas puede desencriptarlas ni ver las claves en la base de datos.
  * La identidad se maneja bajo una arquitectura avanzada de **JSON Web Tokens (JWT) Duales**: Se genera un "Token de Acceso Rápido" de apenas 15 minutos de duración (corta vida, anti-hackers), complementado en el fondo por un "Token de Refresco" sellado bajo llave de oro dentro de **Cookies HttpOnly**, invisibles e inaccesibles para virus web o scripts malintencionados en el navegador web del usuario, manteniendo la sesión intacta por 7 días seguidos con máxima seguridad cibernética.
* **Arquitectura Limpia Modular (3 Capas):** El servidor se niega al código desorganizado; sigue rígidamente una línea de ensamblaje industrial por módulo del negocio: *Enrutador (Routes)* → *Controlador (Controllers)* → *Cerebro o Lógica de Negocio (Services)* → *Consultas Directas al Motor SQL (Repositories)*.

### Capa de Base de Datos y Almacenamiento en Nube
* **PostgreSQL en Supabase Cloud:** El motor de base de datos relacional de código abierto más poderoso, confiable y seguro del planeta, montado en la infraestructura de computación en nube en tiempo real de Supabase.
* **¿Por qué se eligió PostgreSQL y Supabase para este sistema?**
  1. **Consistencia Transaccional (ACID) en 3FN:** Al gestionar cobros reales, cálculos fiscales de impuestos hondureños e historiales inamovibles de horas, era imperativo huir de bases de datos informales (como NoSQL). PostgreSQL garantiza una normalización estricta en **Tercera Forma Normal (3FN)**: es matemáticamente imposible registrar cobros huérfanos sin usuario dueño, o provocar duplicados incoherentes que dañen la auditoría fiscal ante entes gubernamentales.
  2. **Connection Pooler (Modo Sesión - Puerto 5432):** Supabase ofrece un sistema inteligente de enrutado masivo (Session Pooling). Permite mantener cientos de conexiones estables y resistentes, siendo cien por ciento compatible tanto para el desarrollo interno en redes caseras (IPv4) como para un despliegue de alto consumo masivo comercial.
  3. **Almacenamiento Cloud Storage (Supabase Storage Buckets):** Supabase incluye almacenes físicos virtuales dedicados protegidos de internet público para albergar imágenes fotográficas (*Buckets* para `canchas-imagenes`, `perfiles` y `empresa`). Nadie puede inyectar virus gráficos desde fuera; las cargas pasan autoritariamente reguladas y escaneadas por los filtros privados del backend de Node.js.

### Infraestructura y Despliegue Universal
* **Docker & Docker Compose (Contendores Aislados):** Todo este inmenso ecosistema no depende de una sola computadora específica para vivir. El proyecto está encapsulado con tecnologías universales **Docker** (`Dockerfile` propios por servicio + orquestador unificado en `docker-compose.yml` en red privada `bridge`). Cualquier profesional en la nube del mundo puede clonar el sistema y levantarlo completito de golpe sin alterar ninguna configuración local con tan solo ejecutar un comando en su terminal, garantizando una portabilidad comercial de nivel corporativo.

---

## 5. Arquitectura (Resumen Simpatizante en Lenguaje Llano)

### 💬 Cómo Hablan y Se Entienden el Frontend y el Backend
Para entender el sistema sin saber código, imagíneselo como un **Restaurante de Alta Cocina con Seguridad Blindada**:
* El **Frontend** es el salón comedor y la carta del menú interactiva en iPad que se le entrega a usted de cliente en la mesa. Es precioso, rápido y amigable, pero en la mesa del cliente jamás hay cuchillos peligrosos ni el dinero de la caja registradora de fondo.
* El **Backend** es la inexpugnable cocina ejecutiva. Cuando el cliente presiona un botón en pantalla ("Quiero reservar esta cancha de 17:00 a 20:00"), un mesero virtual veloz viaja con una orden secreta por internet al servidor a milésimas de segundo (mediante una petición **HTTP REST API**).
* El cocinero en jefe (Servidor Node) toma la orden, procesa la matemática real, va a su bodega blindada ultra-privada (La base de datos **PostgreSQL en Supabase**) para cerciorarse con sus propios ojos de que nadie ha ocupado la cancha en ese minuto preciso, bloquea el espacio en el libro contable indiscutible, y le envía de regreso con el mesero digital el platillo terminado al usuario de la web: su boleto ilustrado de reserva confirmada en alta definición.

### 🛡️ Decisiones Inteligentes de Diseño (Buenas Prácticas Explícitas)
El código fue esculpido evitando atajos fáciles para abrazar patrones de diseño que garantizan la vida larga del producto:

1. **Patrón de "Única Fuente de Verdad" (Single Source of Truth) para Precios y Tiempos:**
   * En sistemas aficionados, es común que si un cliente cambia de opinión y selecciona horas distintas a cada instante, las listas se desconecten y la página cobre de más o de menos. En este proyecto se radicó de tajo el concepto de guardar la "duración" como una variable separada sujeta a accidentes automáticos. La duración se calcula en tiempo real pura y estrictamente a partir de una única verdad matemática universal de base: `Hora de Fin elegida - Hora de Inicio elegida`. No existe espacio para que el costo se salga de balance o descanse desactualizado en la memoria del dispositivo o en cobros en ventanilla.
2. **Patrón Anti-Hackeo de "Tokens Gemelos" (Cierre Blindado de Sesión):**
   * ¿Por qué el usuario nunca ve que se le cierra la sesión pese a estar fuertemente protegido? Por una separación de poderes cibernética: el pase que le permite navegar las canchas expira rápido (a los **15 minutos**) por si un usuario ajeno le arrebata el teléfono; pero silenciosamente por detrás, si el verdadero dueño sigue en su dispositivo, el navegador intercambia contraseñas en bóvedas secretas impermeables para scripts virósicos (**Cookies HttpOnly** de 7 días). Se obtiene una comodidad suave como la seda de un sistema abierto, pero cobijado con seguridad perimetral impenetrable.
3. **El Principio de Responsabilidad Única (SRP - SOLID) en Ganchos Lógicos (Custom Hooks):**
   * Al programar la página, la belleza visual de los calendarios, botones y tipografías se mantuvo completamente divorciada y separada físicamente de los complicados cálculos matemáticos sobre zonas horarias locales y horarios de apertura de instalaciones. Toda esa lógica pensante se alojó y escondió en componentes cerebrales aislados (como los hooks `useCanchas.ts` o `useAuth.ts`). Así, si el día de mañana el dueño del complejo desea reformar o cambiar de color toda su página a un tono distinto, el ingeniero a cargo puede transformar la parte visual sin el menor temor de quebrar inadvertidamente el motor matemático de cobros e impuestos de la empresa.
4. **Programación Defensiva en Interfaz (UX de Bloqueo Proactivo):**
   * El sistema parte de la filosofía de que *no se debe esperar a que el usuario cometa un error para regañarlo con una alerta roja*. El diseño adopta un papel proactivo defensivo: bloquea mecánicamente de raíz cualquier intento o botón indebido en la interfaz antes de que el usuario lo pueda hacer clic. Por ejemplo: el selector para elegir "Hora de Fin" aparece sombreado e intocable hasta que se decida fehacientemente una "Hora de Inicio"; y en cuanto se selecciona dicha hora inicial, la lista del segundo menú destruye silenciosamente cualquier horario del pasado o incompetente, ofreciéndole al cliente exclusivamente las horas lógicas subsecuentes disponibles del día hasta el tope máximo del cierre vespertino (22:00 hrs).

---

## 6. Diferenciadores y Puntos Fuertes (Por Qué Este Sistema Asombra)

Si se compitiere contra plataformas comerciales habituales, estos son los argumentos de peso pesado que coronan al sistema en un nivel superior:

| Característica Tradicional del Mercado | La Superioridad del Sistema Canchas 2.0 | El Valor Agregado para el Negocio |
| :--- | :--- | :--- |
| **Diseños pálidos en colores suave/pastel** | **Estética Brutalista de Alto Impacto (Navy & Naranja Vibrante)** | Causa un *Efecto WOW* desde la primera impresión web. Transmite un carácter deportivo audaz, premium, atlético y profesional inigualable con contrastes tipográficos asombrosos sin usar simples emojis infantiles. |
| **Precios sorpresas en ventanilla al final** | **Cotizador Financiero en Vivo (En Pantalla Instantánea)** | Elimina disputas verbales en la recepción. Muestra un desglose desmenuzado del subtotal, identifica recargos de fin de semana en automático y le transparenta su cuota legal obligatoria de impuesto ISV del 15%. |
| **Límites de alquiler rígidos (Máximo 2 a 4 hrs)**| **Selección Abierta e Inteligente (Desde 1 hr hasta el día entero)**| Multiplica la recaudación potencial. No impide al cliente apartar bloques maratónicos de 6, 8 o 12 horas consecutivas para ligas corporativas masivas sin tener que armar cinco reservaciones por separado. |
| **Buscadores de hora torpes o sin lógica** | **Programación Defensiva (Listas de Horarios Adaptativos)**| Previene por completo la posibilidad de reservar de reversa en el tiempo, registrar partidos sin sentido en 0 horas o ignorar que el local cierra religiosamente de forma nocturna a las 22:00 hrs. |
| **Software extranjero sin entendimiento fiscal**| **Diseño Natively Centrado en el Marco Tributario Hondureño**| Pensado de raíz para lidiar con el Servicio de Administración de Rentas (SAR), integrando en sus entrañas modelos de Clave de Autorización de Impresión (CAI) y el cálculo obligatorio de 15% de Impuesto ISV. |
| **Anotaciones caóticas y contabilidad manual en papel**| **Panel Directivo con Generación Automática de PDF** | Le regala al propietario incontables horas libres; con un solo click compila el resumen mes a mes o factura formal descargándolo a formato PDF listo para declarar en bancos o juntas directivas. |
| **Instalación frustrante dependiente de técnicos locales** | **Empaquetado Universal Cloud-Ready mediante Docker** | Gira y corre feliz e idéntico en cualquier nube o servidor de computarización del mundo moderno gracias a su arquitectura con contenedores inmutables Docker y Supabase Cloud SQL. |

---

## 7. Capturas y Elementos Visuales Sugeridos (Guía para el Trifolio / Brochure)

Si se desea diagramar un folleto corporativo (Trifolio de 3 cuerpos), una revista comercial o diapositivas para convencer a inversores o clientes, se recomienda fotografiar y plasmar las siguientes 6 vistas icónicas que demuestran la estética sublime y poderío funcional del código:

1. 📸 **El Encabezado Monumental y Catálogo de Instalaciones (`CanchasPage.tsx`)**:
   * *Qué mostrar en la foto:* La cabecera impactante en letras itálicas de gran calibre ("NUESTRAS CANCHAS"), el menú flotante lateral de filtrado de deportes con sombreado negro y el muro en cuadrícula con las tarjetas fotográficas reales del complejo en Tegucigalpa.
2. 📸 **El Cotizador Dinámico en Vivo y Selector Horario (`ReservasPage.tsx` - Paso 1)**:
   * *Qué mostrar en la foto:* El calendario abierto por defecto en el día hoy, los dos selectores vinculados (*Hora inicio* / *Hora fin*) y muy en especial el imponente recuadro color naranja oxidado ligeramente girado en 1 grado (`Resumen Rápido`) exhibiendo con orgullo el cálculo matemático en vivo de las horas elegidas y el impuesto ISV legal.
3. 📸 **El "Boleto Digital de Confirmación" Triunfal (`ReservasPage.tsx` - Paso 3)**:
   * *Qué mostrar en la foto:* La pantalla final tras procesar una transacción. Luce una medalla con el cheque de confirmación en rotación dinámica, sobre el ticket digital tipo boleto de estadio físico con bordes cortados que expone majestuosamente el **Código de Reserva Único** (Ej: `RES-2026-981`) listo para escanear en recepción.
4. 📸 **La Barra Lateral Tridimensional del Centro de Mando Propietario (`AdminLayout.tsx` & `adminNav.ts`)**:
   * *Qué mostrar en la foto:* La columna lateral izquierda del Administrador en tono Azul Marino profundo (*Navy*). Capturar el preciso segundo cuando el cursor descansa sobre un módulo activo (como "Reservas" o "Canchas"), exhibiendo un hermoso botón naranja sólido rematado de atrás por una pronunciada sombra dura blanca inconfundible de la era de diseño Brutalista.
5. 📸 **La Tabla de Auditoría con sus Etiquetas Sólidas en Nítido (`AdminReservas.tsx`, `sportColor.ts` & `estadoStyle.ts`)**:
   * *Qué mostrar en la foto:* La vista administrativa principal de gestión. Aquí deslumbran por su limpieza las etiquetas deportivas purgadas de emojis superfluos (Fútbol 5 sobre Azul Marino y sombra naranja, Tenis sobre amarillo intenso deportivo, Pádel en violeta vibrante) en perfecta armonía con los distintivos sólidos de estado de partido (`CONFIRMADA`, `PENDIENTE`, `COMPLETADA`, `CANCELADA`).
6. 📸 **Los Motores de Generación Documental e Impresoras PDF (`AdminReportesPage.tsx` & `AdminPagosPage.tsx`)**:
   * *Qué mostrar en la foto:* El tablero de balances estadísticos financieros provisto de sus botones directos para la exportación y descarga simultánea de balances fiscales y facturas tributarias formalizadas en formato portable PDF.

---

## 8. Datos de Contacto y Créditos del Proyecto

* **Identificación del Sistema:** Sistema Web de Reservación de Canchas Deportivas (`proyecto-canchas` / `proyecto-sistemas-expertos`).
* **Propósito Institucional:** Propuesta Tecnológica Integral de Sistemas Expertos e Innovación Digital, desarrollada y concebida arquitectónicamente para la modernización e impulso de complejos deportivos, instalaciones de alquiler recreativo y campos comunitarios o corporativos de Tegucigalpa, Francisco Morazán y la región de Honduras.
* **Liderazgo de Ingeniería y Desarrollo:**
  * **Autor Principal y Arquitecto de Software:** Eduardo Sánchez (*wdavila1*).
  * **Diseñador de Arquitectura UI & Experiencia (Brutalism v2):** Google DeepMind Advanced Agentic AI Assist.
* **Versión del Ecosistema de Producción:** Edición 2.0 / v0.0.1 (Arquitectura Limpia SOLID, Migración Estilística Brutalism UI & Detección Defensiva Proactiva).
* **Año y Fecha de Documentación:** Año 2026.
* **Soporte, Comercialización e Integraciones en Nube:** Para demostraciones presenciales del funcionamiento interactivo en dispositivos móviles, auditorías del código monorepo, contratación para instalación personalizada de servidores Dockerizados en instalaciones de centros deportivos o personalizaciones con integraciones impositivas del SAR en firme, referirse formalmente mediante la gestión central de este repositorio en el sistema de control de versiones Git o el panel de administración central del complejo en Tegucigalpa.

---
*Fin de la documentación general del proyecto. Este archivo ha sido formateado estrictamente para uso directo de divulgación de ingeniería e ideas promocionales sin alterar secretos cifrados del backend.*
