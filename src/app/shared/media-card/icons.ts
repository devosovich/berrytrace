/** Outline icons (24×24 viewBox, stroke only) for the badge on a media card. */
export const ICONS = {
  shield: ['M12 3 L20 6 V12 C20 16.5 16.5 20 12 21 C7.5 20 4 16.5 4 12 V6 Z', 'M9 12 L11 14 L15 10'],
  eye: ['M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z', 'M9 12 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0'],
  truck: ['M3 7 H14 V17 H3 Z', 'M14 10 H18 L21 13 V17 H14', 'M5 18 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0', 'M15 18 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0'],
  doc: ['M6 3 H14 L19 8 V21 H6 Z', 'M14 3 V8 H19', 'M9 13 H16', 'M9 17 H16'],
  gate: ['M3 10 L12 4 L21 10', 'M5 10 V18', 'M10 10 V18', 'M14 10 V18', 'M19 10 V18', 'M3 20 H21'],
  flask: ['M9 3 H15', 'M10 3 V9 L5 19 C4.5 20 5.2 21 6.3 21 H17.7 C18.8 21 19.5 20 19 19 L14 9 V3'],
  pin: ['M12 21 C7 15 5 12 5 9 A7 7 0 0 1 19 9 C19 12 17 15 12 21 Z', 'M9.5 9 a2.5 2.5 0 1 0 5.0 0 a2.5 2.5 0 1 0 -5.0 0'],
  user: ['M8 8 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0', 'M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21'],
  award: ['M7 9 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0', 'M9 13.5 L8 21 L12 18.5 L16 21 L15 13.5'],
  sparkle: ['M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z'],
} as const;

export type IconName = keyof typeof ICONS;
