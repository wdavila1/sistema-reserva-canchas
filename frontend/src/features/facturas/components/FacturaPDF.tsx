import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { FacturaDetalle } from '../types/FacturaDetalle';
import { formatCurrency } from '@/shared/utils/formatCurrency';

Font.register({
    family: 'Helvetica',
    fonts: [{ src: 'https://fonts.gstatic.com/s/helvetica/v1/...' }], 
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: '#d1d5db',
        paddingBottom: 12,
        marginBottom: 16,
    },
    empresa: {
        flex: 1,
    },
    empresaNombre: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    empresaDireccion: {
        fontSize: 10,
        color: '#4b5563',
        marginTop: 4,
    },
    empresaInfo: {
        alignItems: 'flex-end',
    },
    infoText: {
        fontSize: 9,
        color: '#4b5563',
        marginBottom: 2,
    },
    infoLabel: {
        fontWeight: 'bold',
    },
    clienteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    clienteBox: {
        backgroundColor: '#f9fafb',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        flex: 1,
        marginRight: 8,
    },
    clienteBoxLast: {
        marginRight: 0,
    },
    label: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 10,
        color: '#1f2937',
        marginTop: 2,
    },
    table: {
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 4,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f9fafb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    tableHeaderText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tableRowLast: {
        borderBottomWidth: 0,
    },
    servicioCol: {
        flex: 3,
    },
    montoCol: {
        flex: 1,
        textAlign: 'right',
    },
    totals: {
        marginTop: 8,
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 180,
        marginBottom: 4,
    },
    totalLabel: {
        fontSize: 10,
        color: '#4b5563',
    },
    totalValue: {
        fontSize: 10,
        fontFamily: 'Courier',
    },
    totalBold: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2563eb',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 6,
    },
    exoneracion: {
        color: '#16a34a',
    },
    footer: {
        marginTop: 24,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 12,
    },
    footerText: {
        fontSize: 8,
        color: '#9ca3af',
    },
});

export function FacturaPDF({ factura }: { factura: FacturaDetalle }) {
    const subtotal = Number(factura.subtotal);
    const isv = Number(factura.isv);
    const exoneracion = Number(factura.exoneracion);
    const isvMostrado = exoneracion > 0 ? exoneracion : isv;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.empresa}>
                        <Text style={styles.empresaNombre}>{factura.razonsocial}</Text>
                        <Text style={styles.empresaDireccion}>{factura.direccion}</Text>
                    </View>
                    <View style={styles.empresaInfo}>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>RTN:</Text> {factura.rtnempresa}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>CAI:</Text> {factura.cai}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Rango:</Text> {factura.rangoautorizado}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Vence:</Text> {factura.fechafin}
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoLabel}>Factura:</Text> {factura.numerofactura}
                        </Text>
                    </View>
                </View>
                <View style={styles.clienteRow}>
                    <View style={styles.clienteBox}>
                        <Text style={styles.label}>Cliente</Text>
                        <Text style={styles.value}>{factura.rtncliente || 'Consumidor final'}</Text>
                    </View>
                    <View style={[styles.clienteBox, styles.clienteBoxLast]}>
                        <Text style={styles.label}>Fecha emisión</Text>
                        <Text style={styles.value}>{factura.fechaemision}</Text>
                    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.servicioCol]}>Servicio</Text>
                        <Text style={[styles.tableHeaderText, styles.montoCol]}>Monto</Text>
                    </View>
                    <View style={[styles.tableRow, styles.tableRowLast]}>
                        <Text style={[styles.servicioCol, { fontSize: 10 }]}>{factura.servicioadquirido}</Text>
                        <Text style={[styles.montoCol, { fontFamily: 'Courier', fontSize: 10 }]}>
                            {formatCurrency(subtotal)}
                        </Text>
                    </View>
                </View>
                <View style={styles.totals}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>ISV 15%</Text>
                        <Text style={styles.totalValue}>{formatCurrency(Number(isvMostrado.toFixed(2)))}</Text>
                    </View>
                    {exoneracion > 0 && (
                        <View style={[styles.totalRow, styles.exoneracion]}>
                            <Text style={styles.totalLabel}>Exoneración</Text>
                            <Text style={styles.totalValue}>- {formatCurrency(Number(exoneracion.toFixed(2)))}</Text>
                        </View>
                    )}
                    <View style={[styles.totalRow, styles.totalBold]}>
                        <Text style={[styles.totalLabel, { fontWeight: 'bold', color: '#111827' }]}>Total</Text>
                        <Text style={[styles.totalValue, { fontWeight: 'bold', color: '#2563eb', fontSize: 14 }]}>
                            {formatCurrency(Number(Number(factura.total).toFixed(2)))}
                        </Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Gracias por su preferencia</Text>
                    <Text style={[styles.footerText, { fontFamily: 'Courier', color: '#d1d5db' }]}>
                        Factura generada electrónicamente
                    </Text>
                </View>
            </Page>
        </Document>
    );
}