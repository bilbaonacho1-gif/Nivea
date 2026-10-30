import { Logo } from './Logo'

/** Cierre de la experiencia. */
export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1300px] flex-col items-center px-5 pt-24 pb-10 text-center md:px-10 md:pt-32">
        <Logo tone="light" size="lg" />
        <p className="mt-10 flex flex-col items-center text-[clamp(1.6rem,5.4vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.01em] uppercase wide">
          <span className="block">Enjoy the sun.</span>
          <span className="block text-sun">Enjoy your summer.</span>
        </p>
        <p className="mt-16 max-w-3xl text-[0.72rem] leading-relaxed text-paper/50">
          Propuesta conceptual de campaña con fines académicos. NIVEA y NIVEA SUN son marcas registradas de Beiersdorf AG.
          El premio y el código son ficticios. Este sitio no solicita ni guarda datos personales: el progreso del quiz se
          conserva solo en esta pestaña del navegador.
        </p>
      </div>
    </footer>
  )
}
