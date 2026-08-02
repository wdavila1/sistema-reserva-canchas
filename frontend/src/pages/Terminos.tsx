export function Terminos() {
    return (
        <div className="min-h-screen bg-primary text-white px-margin-mobile lg:px-margin-desktop py-stack-lg pt-24">
            <div className="max-w-4xl mx-auto">
                <section className="mb-stack-lg border-b border-white/10 pb-stack-md">
                    <h1 className="font-headline-xl text-4xl lg:text-6xl font-extrabold uppercase tracking-tight">
                        Términos y <span className="text-secondary">Condiciones</span>
                    </h1>
                    <p className="font-label-sm text-muted-foreground mt-stack-sm uppercase tracking-wider text-sm">
                        Última actualización: 27 de Julio, 2026
                    </p>
                </section>

                {/* SECCIÓN 1 - INTRODUCCIÓN */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">01</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Introducción
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Estos Términos y Condiciones regulan el uso de nuestro sistema de reservas para canchas
                        deportivas. Al solicitar una reserva, usted acepta las condiciones aquí descritas.
                    </p>
                </section>

                {/* SECCIÓN 2 - ACEPTACIÓN */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">02</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Aceptación de los Términos
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Al realizar una reserva a través de nuestra web o aplicación, usted declara haber leído,
                        comprendido y aceptado estos Términos y Condiciones. Si no está de acuerdo, debe abstenerse
                        de utilizar el servicio. La confirmación de la reserva implica la aceptación plena de estas
                        reglas.
                    </p>
                </section>

                {/* SECCIÓN 3 - PROCESO DE RESERVA Y PAGO */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">03</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Proceso de Reserva y Pago
                        </h2>
                    </div>
                    <ul className="font-body-md text-white/80 space-y-stack-sm list-disc pl-5 marker:text-secondary">
                        <li>
                            <strong>Reserva:</strong> Usted selecciona la fecha, hora y cancha disponibles. La reserva
                            queda provisionalmente confirmada, pero <strong>no es definitiva</strong> hasta que se
                            realice el pago en nuestras instalaciones.
                        </li>
                        <li>
                            <strong>Pago presencial:</strong> Debe acudir a nuestras instalaciones al menos 15 minutos
                            antes del inicio del turno. El pago se realiza directamente al administrador en recepción
                            (efectivo o tarjeta). Una vez abonado el importe, el administrador registra el pago en el
                            sistema y la reserva queda <strong>definitivamente confirmada</strong>.
                        </li>
                        <li>
                            <strong>Sin pago, sin reserva:</strong> Si no se presenta a pagar dentro del plazo
                            establecido, la reserva se cancela automáticamente y el horario queda disponible para
                            otros usuarios.
                        </li>
                    </ul>
                </section>

                {/* SECCIÓN 4 - POLÍTICA DE NO REEMBOLSO */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">04</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Política de No Reembolso
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Una vez que el administrador ha registrado el pago en el sistema, la reserva es
                        <strong>definitiva y no reembolsable</strong>. No se devolverá el importe abonado por
                        ningún motivo, salvo en las siguientes excepciones:
                    </p>
                    <ul className="font-body-md text-white/80 space-y-stack-sm list-disc pl-5 marker:text-secondary mt-stack-sm">
                        <li>
                            <strong>Cancelación por parte del establecimiento:</strong> Si por causas de fuerza mayor
                            (clima extremo, avería en la cancha, cierre temporal, etc.) no podemos ofrecer el servicio,
                            se le ofrecerá la opción de <strong>reprogramar el turno</strong> para otra fecha
                            disponible o, en su defecto, un <strong>crédito</strong> por el importe pagado para
                            futuras reservas. En ningún caso se realizará un reembolso en efectivo o devolución
                            del dinero.
                        </li>
                        <li>
                            <strong>Error del administrador:</strong> Si se comprueba que el administrador registró
                            un pago por error (duplicidad, cobro indebido, etc.), se corregirá el saldo a favor
                            del usuario, pero siempre en forma de crédito o reprogramación, nunca en efectivo.
                        </li>
                        <li>
                            <strong>Inasistencia del usuario:</strong> Si no se presenta a la hora acordada, el
                            pago realizado se pierde y no se podrá recuperar bajo ningún concepto.
                        </li>
                    </ul>
                    <p className="font-body-md text-white/80 leading-relaxed mt-stack-sm">
                        Esta política es necesaria para garantizar la disponibilidad de los espacios y compensar
                        la pérdida de oportunidades de negocio que supone mantener un horario reservado sin uso.
                    </p>
                </section>

                {/* SECCIÓN 5 - CANCELACIONES Y MODIFICACIONES */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">05</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Cancelaciones y Modificaciones
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Si desea cancelar o modificar su reserva, deberá hacerlo con <strong>al menos 24 horas
                        de antelación</strong> al inicio del turno. En ese caso, podrá reprogramar la reserva a
                        otra fecha y hora disponibles, sin coste adicional, siempre que haya disponibilidad.
                        Sin embargo, <strong>el importe ya pagado no será reembolsado</strong>; se mantendrá como
                        crédito a favor para futuras reservas. Las solicitudes de cambio con menos de 24 horas
                        de antelación no serán atendidas y el pago se considerará perdido.
                    </p>
                </section>

                {/* SECCIÓN 6 - OBLIGACIONES DEL USUARIO */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">06</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Obligaciones del Usuario
                        </h2>
                    </div>
                    <ul className="font-body-md text-white/80 space-y-stack-sm list-disc pl-5 marker:text-secondary">
                        <li>
                            Proporcionar datos de contacto verídicos (nombre, teléfono, correo) al hacer la reserva.
                        </li>
                        <li>
                            Presentarse en las instalaciones con la puntualidad necesaria para realizar el pago
                            y comenzar el turno a la hora prevista.
                        </li>
                        <li>
                            Utilizar las canchas y el equipamiento de forma responsable, respetando las normas
                            de convivencia y las indicaciones del personal.
                        </li>
                        <li>
                            Asumir la responsabilidad por cualquier daño causado a las instalaciones o material
                            deportivo, comprometiéndose a repararlo o cubrir su coste.
                        </li>
                        <li>
                            No ceder ni transferir la reserva a terceros sin autorización previa y por escrito
                            de la administración.
                        </li>
                        <li>
                            Ser mayor de edad o contar con la autorización de un tutor legal para realizar la
                            reserva.
                        </li>
                    </ul>
                </section>

                {/* SECCIÓN 7 - LIMITACIÓN DE RESPONSABILIDAD */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">07</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Limitación de Responsabilidad
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Nuestra empresa no se hace responsable de lesiones, accidentes o daños personales que
                        pudieran ocurrir durante el uso de las instalaciones. El usuario asume todos los riesgos
                        inherentes a la práctica deportiva y se obliga a utilizar el equipamiento de forma segura
                        y adecuada. Tampoco nos responsabilizamos por la pérdida, robo o daño de objetos personales
                        dejados en las instalaciones. Recomendamos a los usuarios contratar un seguro de accidentes
                        si lo consideran necesario.
                    </p>
                </section>

                {/* SECCIÓN 8 - LEY APLICABLE */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">08</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Ley Aplicable y Jurisdicción
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Estos Términos y Condiciones se regirán por las leyes del país en el que operamos.
                        Cualquier controversia derivada del uso de la plataforma o de la prestación del servicio
                        será resuelta ante los tribunales competentes de nuestra ciudad de origen, con renuncia
                        expresa a cualquier otro fuero que pudiera corresponder.
                    </p>
                </section>

                {/* AVISO FINAL */}
                <section className="mt-stack-lg pt-stack-md border-t border-white/10">
                    <p className="font-body-sm text-white/60 text-sm">
                        Para cualquier consulta sobre estos Términos y Condiciones, puede contactarnos a través
                        de nuestro correo electrónico de soporte o en nuestras instalaciones durante el horario
                        de atención al público.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default Terminos;