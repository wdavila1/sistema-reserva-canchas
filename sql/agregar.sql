-- =====================================================================
-- NUEVAS TABLAS Y ALTERACIONES: Sistema Experto + Promociones
-- =====================================================================

-- 1. Tabla de Promociones
CREATE TABLE Promociones (
    PromocionID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Titulo       VARCHAR(100) NOT NULL,
    Descripcion  VARCHAR(255),
    PorcentajeDescuento NUMERIC(5,2) NOT NULL 
        CHECK (PorcentajeDescuento > 0 AND PorcentajeDescuento <= 100),
    DiaSemana    INT CHECK (DiaSemana BETWEEN 0 AND 6), 
    -- NULL = aplica todos los días
    -- 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
    HoraInicio   TIME,
    HoraFin      TIME,
    Estado       BOOLEAN NOT NULL DEFAULT TRUE,
    FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Agregar columna Descuento al detalle de cada reserva
ALTER TABLE DetalleReservas
    ADD COLUMN PromocionID INT REFERENCES Promociones(PromocionID),
    ADD COLUMN Descuento   NUMERIC(10,2) NOT NULL DEFAULT 0.00;

-- 3. Agregar columna Descuento al encabezado de la factura
ALTER TABLE Facturas
    ADD COLUMN Descuento NUMERIC(10,2) NOT NULL DEFAULT 0.00;
