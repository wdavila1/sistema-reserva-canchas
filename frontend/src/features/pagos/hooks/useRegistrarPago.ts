import { registrarPago } from "../services/pagos.api";

export function useRegistrarPago(
    refetchPendientes: () => Promise<void>,
    refetchConfirmados: () => Promise<void>
) {

    const registrar = async ( reservaId: number, metodoPagoId: number ) => {

        let data = await registrarPago({ reservaId, metodoPagoId});

        await Promise.all([
            refetchPendientes(),
            refetchConfirmados()
        ]);
    };

    return {registrar};
}