# Actualización de Arquitectura Frontend (Diseño Navy & Orange)

Que pexis este es el primer cambio de estilo a Azul Navy y Anaranjado y, de paso, aprovechar para limpiar la arquitectura de nuestros componentes usando buenas prácticas y principios SOLID.

Aquí les dejo el resumen de los cambios, por qué se hicieron, y cómo pueden modificar las cosas si algo no les convence.

---

## 1. ¿Qué cambió y a qué afecta?

Hemos mudado el estilo anticuado (tipo Shadcn de bordes redondeados y colores tenues) a un diseño agresivo, deportivo y de alto contraste.

*   **Tema Global (`src/styles/theme.css`)**: Centralizamos TODAS las variables de diseño (Colores, Tipografías, Espaciados) usando la nueva API `@theme` de **Tailwind CSS v4**. Ahora el CSS es la **Única Fuente de Verdad (Single Source of Truth)**.
*   **Componentes UI (Dumb Components)**: Refactoricé `Button`, `Input`, `Badge`, `Select`, `CourtCard` y `StatCard`.
    *   **¿A qué afecta?**: Ahora usan `React.forwardRef` y extienden las propiedades nativas de HTML (`React.InputHTMLAttributes`). Esto significa que son 100% compatibles con librerías como `react-hook-form` sin causar bugs extraños, respetando el principio de Responsabilidad Única (SRP).
*   **Layouts (`Navbar`, `Footer`, `AdminLayout`)**: Se reescribieron para ser 100% responsivos (Mobile First). Se eliminaron colores y clases *hardcodeadas*.
    *   **AdminLayout**: Respeta el principio Open/Closed (OCP). La barra lateral se renderiza dinámicamente mapeando el arreglo de configuración `adminNav`. Agregar una nueva pantalla de admin no requiere tocar el Layout.
*   **Páginas (`Home.tsx`)**: Se integró el código de la nueva Landing Page. La página actúa como un "Smart Component" que ensambla el UI estático.
*   **Gestión de Estado (`useCanchas`, etc.)**: Hemos separado la lógica de negocio y las llamadas a la API de la capa visual usando Custom Hooks. Los componentes UI solo reciben `props`, no hacen Fetching (Separación de Preocupaciones).

---

## 2. Respeto a la Estructura del Proyecto

La refactorización se hizo estrictamente sobre la arquitectura que ya habíamos definido, sin inventar carpetas nuevas:
*   `src/components/ui/` -> Exclusivo para componentes base reutilizables (Botones, Inputs).
*   `src/components/layout/` -> Exclusivo para el marco de la página (Navbar, Footer).
*   `src/pages/` -> Para las vistas principales ensambladas.
*   `src/layouts/` -> Envoltorios de enrutamiento (como `AdminLayout` para proteger rutas).
*   `src/styles/theme.css` -> Donde vive la configuración de Tailwind.

No se instalaron librerías de estilos adicionales (como Bootstrap o Material UI); seguimos puros con **Tailwind CSS** y **Lucide React** para los iconos.

---

## 3. ¿No les gustan los colores, fuentes o espacios? ¡CÓMO CAMBIARLOS!

**REGLA DE ORO:** Si un color, margen o tamaño de letra no les gusta, **NO MODIFIQUEN EL COMPONENTE DE REACT.** (No toquen `Home.tsx` ni `Navbar.tsx`).

Toda la aplicación está anclada a las variables de diseño. Para cambiar algo, abran el archivo `src/styles/theme.css` y cambien el valor de la variable. 

### Ejemplos de personalización:

1.  **Cambiar el Azul Marino por Negro:**
    Abre `theme.css`, busca `--primary: #0b1f3a;` y cámbialo a `--primary: #000000;`. Automáticamente, el Navbar, Footer, Botones y el Sidebar del Admin cambiarán a negro.
2.  **Reducir los márgenes en celulares:**
    Busca `--spacing-margin-mobile: 16px;` y bájalo a `8px`. Todos los componentes del sistema se ajustarán solos.
3.  **Cambiar las fuentes de los marcadores:**
    Si no les gusta `Barlow Condensed`, cambien `--font-headline-xl: "Oswald", sans-serif;`. (Asegúrense de importar la fuente en el `index.html`).

### ¿Por qué hacerlo así?
Porque respeta el principio **DRY (Don't Repeat Yourself)**. Si cambian un color globalmente en el CSS, garantizan que toda la app se mantenga coherente. Si cambian clases a mano en un solo archivo, generaremos "deuda técnica" e inconsistencia visual con el tiempo.

