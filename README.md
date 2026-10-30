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
| Intro cinematográfica: la lata NIVEA Creme sobre azul; con el scroll la tapa se desplaza, la cámara entra en la crema y el blanco se vuelve la página | `src/sections/Intro.tsx` |
| La campaña: titular con franja solar, foto protagonista que se abre a sangre con el envase integrado y cuatro momentos de verano | `src/sections/Campaign.tsx` |
| Entrada al quiz: la foto del agua se expande a pantalla completa | `src/sections/QuizStart.tsx` |
| Quiz: cinco escenas a pantalla dividida, foto que se encadena con la anterior, progreso continuo, atajos A–D | `src/sections/quiz/*` |
| Resultado: paleta y motivo gráfico propios por personalidad + tarjeta 4:5 para redes (se descarga o comparte como PNG) | `src/sections/result/*`, `src/lib/shareCard.ts` |
| Premio: la misma lata de la intro; la tapa se arrastra o se toca para abrirla | `src/sections/Rewards.tsx`, `src/components/Tin.tsx` |

El scroll es suave (Lenis) y está sincronizado con GSAP ScrollTrigger; con “reducir movimiento” se desactivan las animaciones largas.

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
| `hero.jpg` | Foto de la lata NIVEA Creme provista (sin el texto del aviso original). |
| `tin-lid.png`, `tin-base.png` | Tapa y base recortadas de `hero.jpg`; la base se reconstruyó bajo la tapa. Se usan en la intro, la transición al resultado y el premio. |
| `product-protect-moisture.png` | Packshot recortado del carrusel de referencia (versión UK, baja resolución). |
| `nivea-logo.png`, `nivea-wordmark-white.png` | Logo NIVEA provisto. |
| `summer-beach.jpg`, `pool-background.jpg`, `summer-skincare.jpg`, `summer-travel.jpg`, `summer-still.jpg`, `sky.jpg` | Recortes del carrusel de referencia con un grade común (luz cálida, sombras azuladas). Reemplazar por las finales en alta resolución con el mismo nombre. |
