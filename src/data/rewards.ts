import type { Letter } from './quiz'

/**
 * Recompensas CONCEPTUALES. Ningún código, descuento ni sorteo es real:
 * es una propuesta académica de campaña y así se comunica en la interfaz.
 */
export const DEMO_DISCLAIMER =
  'Propuesta conceptual académica. Códigos, descuentos y sorteos son ficticios, no tienen validez comercial y no son promociones de NIVEA.'

export const demoCodes: Record<Letter, string> = {
  A: 'DEMO-VERANIEGA-15',
  B: 'DEMO-AVENTURERA-15',
  C: 'DEMO-ESPONTANEA-15',
  D: 'DEMO-SKINCARE-15',
}

export const bonusCode = 'DEMO-AMIGA-2X1'
