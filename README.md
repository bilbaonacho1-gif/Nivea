# NIVEA SUN — Find Your Summer

Experiencia web de campaña (propuesta conceptual académica): un recorrido one-page con scroll storytelling, un test de personalidad de verano de 5 preguntas, resultados personalizados, recompensas demostrativas y cierre para compartir.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · GSAP + ScrollTrigger (`@gsap/react`) · Lucide · Instrument Serif + Archivo (Fontsource, sin requests externos).

```bash
npm install
npm run dev      # desarrollo
npm run build    # typecheck + build de producción en /dist
```

En Vercel se detecta como proyecto Vite (build `npm run build`, salida `dist`).

## Recorrido

| # | Sección | Archivo |
|---|---------|---------|
| 01 | Intro / The summer begins — escena fijada: el envase pasa al frente, la pantalla se divide, abajo aparece la pileta, las mitades se separan y revelan la playa | `src/sections/Intro.tsx` |
| 02 | Conocé NIVEA SUN — manifiesto y los cuatro productos del test | `src/sections/Universe.tsx` |
| 03 | Start the quiz | `src/sections/QuizStart.tsx` |
| — | Quiz a pantalla completa (una pregunta por pantalla, progreso, volver atrás, atajos A–D) | `src/sections/quiz/*` |
| 04 | Resultado: cuatro composiciones distintas (póster, foto inclinada, collage, calma) | `src/sections/result/*` |
| 05 | Summer rewards: lata que se abre, sorteo ficticio, desafío para desbloquear | `src/sections/Rewards.tsx` |
| 06 | Share your summer + cierre | `src/sections/Share.tsx` |

## Lógica

- `src/lib/quizLogic.ts` — cuenta la letra más elegida. **Empate:** gana la letra elegida más recientemente y la otra se muestra como personalidad complementaria.
- `src/hooks/QuizContext.tsx` — estado del quiz y recompensas, guardado en `sessionStorage` (se conserva al recargar dentro de la pestaña).
- `src/lib/share.ts` — `navigator.share` con fallback a copiar. El enlace compartido lleva `?r=A|B|C|D` y quien lo abre ve qué personalidad le compartieron.
- No se piden ni guardan datos personales.

## Contenido editable

- Preguntas y opciones: `src/data/quiz.ts` (P1–P3 de la campaña original + P4 y P5 nuevas).
- Personalidades: `src/data/personalities.ts`.
- Productos: `src/data/products.ts`. Las descripciones se limitan a lo que expresa el nombre oficial de cada producto: **validarlas con la ficha oficial antes de publicar.**
- Recompensas (todas ficticias y señalizadas como DEMO): `src/data/rewards.ts`.

## Imágenes (`public/images`)

| Archivo | Estado |
|---|---|
| `nivea-logo.png`, `nivea-wordmark-white.png` | Del logo NIVEA provisto (fondo transparente). Reemplazar por el lockup oficial NIVEA SUN si está disponible. |
| `product-protect-moisture.png` | Packshot real recortado del carrusel de referencia (versión con textos en inglés, baja resolución). Reemplazar por el packshot oficial argentino. |
| `product-dry-touch.png`, `product-control-brillo.png`, `product-antimanchas.png` | **Pendientes.** Mientras no existan se muestra una silueta punteada con la leyenda “Envase oficial pendiente”. Al subir el PNG con ese nombre aparece automáticamente. |
| `summer-beach.jpg`, `pool-background.jpg`, `summer-skincare.jpg`, `summer-travel.jpg`, `summer-still.jpg`, `sky.jpg`, `sea-horizon.jpg` | Recortes del carrusel de referencia (máx. 1080 px). Reemplazar por las fotos finales en alta resolución con el mismo nombre. |
| `summer-sports.jpg` | Pendiente (no se usa todavía). |

No se usaron imágenes generadas ni envases inventados.
