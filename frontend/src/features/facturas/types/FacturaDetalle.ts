export interface ReservaItem {
    cancha: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    precioHora: string;
    subtotal: string;
}

export interface FacturaDetalle {
    facturaid: number;
    razonsocial : string;
    rtnempresa : string;
    direccion : string;
    cai : string;
    rangoautorizado : string;
    fechafin : string;
    numerofactura : string;
    fechaemision : string;
    rtncliente: string;
    detalles: ReservaItem[];
    subtotal : string;
    descuento: string;
    isv : string;
    exoneracion : string;
    total : string;
}