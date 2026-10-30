# NIVEA SUN — Find Your Summer

Experiencia web de campaña (propuesta conceptual académica): portada que se abre con el scroll, descripción de la marca, un quiz de personalidad de verano de 5 preguntas y un premio que se gana jugando.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · GSAP + ScrollTrigger (`@gsap/react`) · Lenis · Lucide · Instrument Serif + Archivo (Fontsource, sin requests externos).

```bash
npm install
npm run dev      # desarrollo
npm run build    # typecheck + build de producción en /dist
```

En Vercel se detecta como proyecto Vite (build `npm run build`, salida `dist`).

## Recorrido

| Sección | Archivo |
|---------|---------|
| Portada (dos latas) que se abre en dos mitades al scrollear y revela la descripción de la marca | `src/sections/Intro.tsx` |
| Entrada al quiz | `src/sections/QuizStart.tsx` |
| Quiz a pantalla completa (una pregunta por pantalla, progreso, volver atrás, atajos A–D) | `src/sections/quiz/*` |
| Resultado: cuatro composiciones distintas, aparece al terminar | `src/sections/result/*` |
| Premio: la lata se desbloquea al terminar el quiz; al tocarla se abre y muestra el premio demo | `src/sections/Rewards.tsx` |

El scroll es suave (Lenis) y está sincronizado con GSAP ScrollTrigger; con “reducir movimiento” se desactiva.

## Lógica

- `src/lib/quizLogic.ts` — cuenta la letra más elegida. **Empate:** gana la letra elegida más recientemente y la otra se muestra como personalidad complementaria.
- `src/hooks/QuizContext.tsx` — estado del quiz y recompensas, guardado en `sessionStorage` (se conserva al recargar dentro de la pestaña).
- `src/lib/share.ts` — `navigator.share` con fallback a copiar. El enlace compartido lleva `?r=A|B|C|D` y quien lo abre ve qué personalidad le compartieron.
- No se piden ni guardan datos personales.

## Contenido editable

- Preguntas y opciones: `src/data/quiz.ts` (P1–P3 de la campaña original + P4 y P5 nuevas).
- Personalidades: `src/data/personalities.ts`.
- Producto asociado a cada resultado (solo el nombre): `src/data/products.ts`.
- Premio y códigos (ficticios, señalizados como demo): `src/data/rewards.ts`.

## Imágenes (`public/images`)

| Archivo | Uso |
|---|---|
| `hero.jpg` | Portada (las dos latas). **Reemplazar por la foto final en alta resolución con el mismo nombre.** |
| `brand-open-tin.jpg` | Lata abierta en la descripción de marca. |
| `nivea-logo.png`, `nivea-wordmark-white.png` | Logo NIVEA provisto (fondo transparente). |
| `summer-beach.jpg`, `pool-background.jpg`, `summer-skincare.jpg`, `summer-travel.jpg`, `summer-still.jpg`, `sky.jpg` | Fotos de preguntas y resultados (recortes del carrusel de referencia, máx. 1080 px). |
