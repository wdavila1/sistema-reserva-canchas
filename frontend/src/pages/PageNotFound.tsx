import { useNavigate } from "react-router-dom";

export function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-primary text-white px-margin-mobile lg:px-margin-desktop pt-24 pb-stack-lg">

      <div className="relative max-w-lg w-full">

        <div className="absolute inset-0 bg-secondary translate-x-4 translate-y-4 z-0" />

        <div className="relative z-10 bg-primary border-4 border-secondary p-8 lg:p-12 text-center shadow-lg">

          <div className="font-headline-xl text-8xl lg:text-[10rem] font-extrabold tracking-tight text-white leading-none">
            404
          </div>

          <div className="font-label-sm text-secondary uppercase tracking-widest text-sm mt-2">
            Error
          </div>

          <div className="h-0.5 w-12 bg-secondary mx-auto my-4" />

          <h2 className="font-headline-lg text-2xl lg:text-3xl font-bold uppercase mt-2">
            Página no encontrada
          </h2>

          <p className="font-body-md text-white/80 mt-4 mb-6 max-w-xs mx-auto">
            La página que buscas no existe.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-secondary text-secondary-foreground font-headline-md font-bold uppercase px-8 py-4 border-b-4 border-primary shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Volver al inicio
          </button>

        </div>
      </div>
    </div>
  );
}

export default PageNotFound;