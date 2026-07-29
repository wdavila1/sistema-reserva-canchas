-- =====================================================================
-- Sistema Web de Reservación de Canchas Deportivas
--
-- Estos son los datos mínimos sin los cuales el sistema no puede
-- funcionar (catálogos obligatorios por FK, y un admin inicial para
-- poder entrar a /admin)
-- =====================================================================

-- =====================================================================
-- Roles
-- Sin esto, el registro de usuarios del backend falla
-- (auth.service.js busca el RolID de 'Cliente' al registrar).
-- =====================================================================
INSERT INTO Roles (NombreRol, Descripcion) VALUES
    ('Administrador', 'Control total del sistema'),
    ('Cliente', 'Usuario que reserva canchas');

-- =====================================================================
-- Usuario administrador inicial
-- Usuario: admin  /  Contraseña: Admin123!
-- =====================================================================
INSERT INTO Personas (PrimerNombre, PrimerApellido, Correo, Telefono) VALUES
    ('Admin', 'Sistema', 'admin@correoinventado.hn', '+504 0000-0000');

INSERT INTO Usuarios (PersonaID, RolID, NombreUsuario, Contrasena)
SELECT p.PersonaID, r.RolID, 'admin', '$2a$10$VkXxfivxBggOI2gs1ZUAfOZoqaVxybePNPyZZTlmT5DL8LGe/qLQG'
FROM Personas p, Roles r
WHERE p.Correo = 'admin@correoinventado.hn' AND r.NombreRol = 'Administrador';

-- =====================================================================
-- TiposCancha
-- Sin esto no se puede crear ninguna Cancha (FK NOT NULL).
-- Nombres alineados con frontend/src/types/sports/SportFilter.ts
-- =====================================================================
INSERT INTO TiposCancha (NombreTipo) VALUES
    ('Fútbol 5'),
    ('Baloncesto'),
    ('Voleibol'),
    ('Tenis'),
    ('Pádel');

-- =====================================================================
-- Empresa
-- Facturas depende de esto vía CAIControl. Son datos de EJEMPLO —
-- reemplazar RazonSocial/RTN/Direccion/Telefono/Correo por los datos
-- fiscales reales de la empresa antes de usarlo en producción.
-- =====================================================================
INSERT INTO Empresa (RazonSocial, RTN, Direccion, Telefono, Correo) VALUES
    ('Nombre Inventado HN', '08011993000000', 'Col. Lomas del Guijarro, Tegucigalpa, Honduras', '+504 2221-3344', 'info@correoinventado.hn'); --Después se edita el nombre como lo elijamos. 

-- =====================================================================
-- CAIControl
-- Placeholder para poder probar el módulo de facturas sin tener el CAI
-- real todavía. Queda con Estado = FALSE a propósito: el CAI real de la
-- SAR se pide aparte y se actualiza esta fila (o se inserta una nueva)
-- con Estado = TRUE antes de emitir facturas de verdad.
-- =====================================================================
INSERT INTO CAIControl (EmpresaID, CAICode, FechaInicio, FechaFin, RangoInicial, RangoFinal, Estado) VALUES
    (1, '7D9F2A-48C6B1-93E7F5-1A2D8C-6B4E90', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', '000-001-01-00000001', '000-001-01-00100000', TRUE);

-- =====================================================================
-- MetodosPago
-- Sin esto no se puede registrar ningún Pago (FK NOT NULL).
-- =====================================================================
INSERT INTO MetodosPago (Metodo) VALUES
    ('Efectivo'),
    ('Tarjeta de crédito/débito'), --simulado
    ('Transferencia bancaria'); --simulado
