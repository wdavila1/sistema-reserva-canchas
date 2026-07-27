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
                {/* SECCIÓN 1 */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">01</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Introducción
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, voluptatibus. Consectetur earum aliquid, explicabo dolor ad quas itaque delectus dolorum voluptatem quibusdam quo maiores expedita nisi, velit voluptatum ab cumque!
                    </p>
                </section>

                {/* SECCIÓN 2 */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">02</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Aceptación de los Términos
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores explicabo velit molestias suscipit dicta quidem rem incidunt hic labore beatae, ipsum dignissimos officia libero exercitationem totam laudantium! Provident, ullam ducimus.
                    </p>
                </section>

                {/* SECCIÓN 3 (con lista) */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">03</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Obligaciones del Usuario
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed mb-stack-md">
                        Como usuario de la plataforma, usted se compromete a:
                    </p>
                    {/* Lista con viñetas naranjas usando la pseudo-clase marker de Tailwind */}
                    <ul className="font-body-md text-white/80 space-y-stack-sm list-disc pl-5 marker:text-secondary">
                        <li>
                            Proporcionar información de contacto verídica y actualizada durante el proceso de registro y reserva.
                        </li>
                        <li>
                            Utilizar las instalaciones deportivas de manera responsable, respetando los horarios establecidos y las normas de convivencia.
                        </li>
                        <li>
                            No revender, transferir o ceder su reserva a terceros sin la autorización previa por escrito de la empresa.
                        </li>
                        <li>
                            Ser mayor de edad (18 años) o contar con el consentimiento de un tutor legal para contratar nuestros servicios.
                        </li>
                    </ul>
                </section>

                {/* SECCIÓN 4 */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">04</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Política de no reembolso
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi, nulla ea nesciunt adipisci ipsa maxime, commodi tempora saepe enim, numquam quibusdam assumenda animi in impedit earum est voluptatem voluptates delectus.
                    </p>
                </section>

                {/* SECCIÓN 5 */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">05</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Limitación de Responsabilidad
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias veritatis exercitationem earum vero corporis, ex ducimus? Molestiae, ad! Ipsam iusto eaque unde, corrupti voluptatum saepe modi ullam soluta voluptate accusamus.
                    </p>
                </section>

                {/* SECCIÓN 6 */}
                <section className="mb-stack-lg">
                    <div className="flex items-center gap-3 mb-stack-sm">
                        <span className="text-secondary font-label-sm text-2xl font-bold">06</span>
                        <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase">
                            Ley Aplicable y Jurisdicción
                        </h2>
                    </div>
                    <p className="font-body-md text-white/80 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos aspernatur consectetur laboriosam repudiandae nulla eaque explicabo accusamus suscipit autem nisi, minus perspiciatis illo magnam dolore, architecto debitis id aliquam vitae!
                    </p>
                </section>
            </div>
        </div>
    );
}

export default Terminos;