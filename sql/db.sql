-- =====================================================================
-- Sistema Web de Reservación de Canchas Deportivas
-- Base de datos en PostgreSQL (3FN)
-- Empresa única (no se manejan sucursales)
-- Facturación con CAI tomada como referencia del modelo de hotel
-- Pagos simulados (sin integración real a pasarela de pago)
-- =====================================================================


CREATE DATABASE reservas_canchas;
-- Extensión necesaria para la restricción de exclusión que evita
-- choques de horario (combina igualdad de entero con rangos en GiST)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- =====================================================================
-- 1. Roles
-- Catálogo de roles del sistema (Administrador, Cliente, etc.)
-- =====================================================================
CREATE TABLE Roles (
    RolID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NombreRol VARCHAR(50) NOT NULL UNIQUE,
    Descripcion VARCHAR(200)
);

-- =====================================================================
-- 2. Personas
-- Datos personales base, tanto de clientes como de administradores
-- =====================================================================
CREATE TABLE Personas (
    PersonaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PrimerNombre VARCHAR(50) NOT NULL,
    SegundoNombre VARCHAR(50),
    PrimerApellido VARCHAR(50) NOT NULL,
    SegundoApellido VARCHAR(50),
    NumeroIdentidad VARCHAR(13) UNIQUE,
    RTN VARCHAR(40) UNIQUE,              -- Solo aplica a quienes piden factura con RTN
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Telefono VARCHAR(15) NOT NULL,        -- Obligatorio: es el medio de contacto directo con el cliente
    Direccion VARCHAR(200),
    FotoPerfilURL VARCHAR(255)            -- URL pública del archivo en Supabase Storage (bucket "perfiles")
);

-- =====================================================================
-- 3. Usuarios
-- Credenciales de acceso al sistema (clientes y administradores)
-- =====================================================================
CREATE TABLE Usuarios (
    UsuarioID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PersonaID INT NOT NULL REFERENCES Personas(PersonaID),
    RolID INT NOT NULL REFERENCES Roles(RolID),
    NombreUsuario VARCHAR(50) UNIQUE NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,          -- Se debe guardar con hash desde la aplicación
    EstadoUsuario BOOLEAN NOT NULL DEFAULT TRUE, -- Activo/Inactivo
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP,
    -- Campos opcionales para recuperación básica de contraseña
    TokenRecuperacion VARCHAR(100),
    TokenExpiracion TIMESTAMP
);

-- =====================================================================
-- 4. TiposCancha
-- Catálogo de disciplinas/tipos de cancha (fútbol, básquet, etc.)
-- =====================================================================
CREATE TABLE TiposCancha (
    TipoCanchaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NombreTipo VARCHAR(50) NOT NULL UNIQUE,
    Descripcion VARCHAR(200)
);

-- =====================================================================
-- 5. Canchas
-- =====================================================================
CREATE TABLE Canchas (
    CanchaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TipoCanchaID INT NOT NULL REFERENCES TiposCancha(TipoCanchaID),
    NombreCancha VARCHAR(50) NOT NULL UNIQUE,
    Capacidad INT NOT NULL CHECK (Capacidad > 0),
    PrecioPorHora NUMERIC(10,2) NOT NULL CHECK (PrecioPorHora >= 0),
    Estado VARCHAR(20) NOT NULL DEFAULT 'Disponible'
        CHECK (Estado IN ('Disponible', 'Ocupada', 'Mantenimiento')),
    Descripcion VARCHAR(200),
    ImagenURL VARCHAR(255)                -- URL pública del archivo en Supabase Storage (bucket "canchas-imagenes")
);

-- =====================================================================
-- 6. Reservas
-- Encabezado de una reservación hecha por un usuario (cliente)
-- =====================================================================
CREATE TABLE Reservas (
    ReservaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UsuarioID INT NOT NULL REFERENCES Usuarios(UsuarioID),
    FechaReserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha en que se creó la reserva
    EstadoReserva VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
        CHECK (EstadoReserva IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada')),
    Total NUMERIC(10,2) NOT NULL DEFAULT 0,
    FechaModificacion TIMESTAMP
);

-- =====================================================================
-- 7. DetalleReservas
-- Cada fila es un bloque de cancha + fecha + horario dentro de una reserva.
-- Permite que una reserva incluya más de una cancha/horario si se necesita.
-- La restricción EXCLUDE evita que la misma cancha se reserve en
-- horarios que se solapen (esto resuelve "evitar conflictos de horarios"
-- =====================================================================
CREATE TABLE DetalleReservas (
    DetalleReservaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ReservaID INT NOT NULL REFERENCES Reservas(ReservaID),
    CanchaID INT NOT NULL REFERENCES Canchas(CanchaID),
    Fecha DATE NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFin TIME NOT NULL,
    PrecioHora NUMERIC(10,2) NOT NULL,   -- Copia del precio vigente al momento de reservar
    Subtotal NUMERIC(10,2) NOT NULL,
    FranjaHoraria TSRANGE GENERATED ALWAYS AS (
        TSRANGE((Fecha + HoraInicio), (Fecha + HoraFin))
    ) STORED,
    CONSTRAINT CK_Horario_Valido CHECK (HoraFin > HoraInicio),
    CONSTRAINT EXCL_Cancha_Horario EXCLUDE USING gist (
        CanchaID WITH =,
        FranjaHoraria WITH &&
    )
);

CREATE INDEX IX_DetalleReservas_Cancha_Fecha ON DetalleReservas (CanchaID, Fecha);
CREATE INDEX IX_DetalleReservas_Reserva ON DetalleReservas (ReservaID);

-- =====================================================================
-- 8. Empresa
-- Datos fiscales de la empresa (una sola fila), usados en el
-- encabezado de las facturas
-- =====================================================================
CREATE TABLE Empresa (
    EmpresaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    RazonSocial VARCHAR(100) NOT NULL,
    RTN VARCHAR(40) NOT NULL UNIQUE,
    Direccion VARCHAR(200),
    Telefono VARCHAR(15),
    Correo VARCHAR(100),
    LogoURL VARCHAR(255)                  -- URL pública del archivo en Supabase Storage (bucket "empresa"), usado en el encabezado de facturas
);

-- =====================================================================
-- 9. CAIControl
-- Control de autorización de facturación (CAI) emitido por la SAR
-- =====================================================================
CREATE TABLE CAIControl (
    CAIID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpresaID INT NOT NULL REFERENCES Empresa(EmpresaID),
    CAICode VARCHAR(150) NOT NULL UNIQUE,
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    RangoInicial VARCHAR(150) NOT NULL,
    RangoFinal VARCHAR(150) NOT NULL,
    UltimoCorrelativo INT NOT NULL DEFAULT 0,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,  -- TRUE = Activo, FALSE = Expirado
    CONSTRAINT CK_CAI_Fechas CHECK (FechaFin > FechaInicio)
);

-- =====================================================================
-- 10. MetodosPago
-- =====================================================================
CREATE TABLE MetodosPago (
    MetodoPagoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Metodo VARCHAR(70) NOT NULL UNIQUE
);

-- =====================================================================
-- 11. Facturas
-- =====================================================================
CREATE TABLE Facturas (
    FacturaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ReservaID INT NOT NULL REFERENCES Reservas(ReservaID),
    CAIID INT NOT NULL REFERENCES CAIControl(CAIID),
    UsuarioEmiteID INT NOT NULL REFERENCES Usuarios(UsuarioID), -- Admin/encargado que emite
    NumeroFactura VARCHAR(20) NOT NULL UNIQUE,
    FechaEmision TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    SubTotal NUMERIC(10,2) NOT NULL,
    ISV NUMERIC(10,2) NOT NULL,          -- Monto del impuesto (no la tasa)
    Exoneracion NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    Total NUMERIC(10,2) NOT NULL,
    EstadoFactura BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = activa, FALSE = anulada
    RTNCliente VARCHAR(40),
    RazonSocialCliente VARCHAR(100),
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FechaModificacion TIMESTAMP
);

CREATE INDEX IX_Facturas_Reserva ON Facturas (ReservaID);

-- =====================================================================
-- 12. Pagos
-- Pago simulado: no hay integración real a pasarela, solo se registra
-- el resultado simulado y una referencia ficticia
-- =====================================================================
CREATE TABLE Pagos (
    PagoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ReservaID INT NOT NULL REFERENCES Reservas(ReservaID),
    FacturaID INT REFERENCES Facturas(FacturaID),  -- Puede ser NULL si aún no hay factura
    MetodoPagoID INT NOT NULL REFERENCES MetodosPago(MetodoPagoID),
    FechaPago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Monto NUMERIC(10,2) NOT NULL CHECK (Monto > 0),
    EstadoPago VARCHAR(20) NOT NULL DEFAULT 'Simulado'
        CHECK (EstadoPago IN ('Simulado', 'Aprobado', 'Rechazado')),
    ReferenciaPago VARCHAR(100) -- Código ficticio generado por la simulación
);

CREATE INDEX IX_Pagos_Reserva ON Pagos (ReservaID);

-- =====================================================================
-- Notas de diseño
-- =====================================================================
-- * Usuarios = clientes y administradores; se distinguen por RolID.
-- * Reservas/DetalleReservas siguen el patrón encabezado-detalle: una
--   reserva puede tener una o varias canchas/horarios.
-- * La restricción EXCL_Cancha_Horario impide solapamientos de horario
--   para una misma cancha directamente a nivel de base de datos.
-- el cálculo de Total, ISV, Subtotal, etc. queda a cargo de la aplicación.
-- * Personas.FotoPerfilURL, Canchas.ImagenURL y Empresa.LogoURL guardan solo
--   la URL pública del archivo; el archivo en sí vive en Supabase Storage.
--   El backend es el único que sube a Storage (con la Service Role Key) y
--   luego guarda esa URL en estas columnas — el frontend nunca sube directo.
