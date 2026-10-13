import { AppColors } from "../constants/colors";

type ShadowLayer = Readonly<{
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: keyof AppColors;
}>;

// Figma "Shadows and blurs" values, named after the Figma elevation tokens
// (e.g. elevation/tinted/02/top -> tinted02Top).
const SHADOW_SPECS = {
  tinted01Bottom: [
    { x: 0, y: 2, blur: 2, spread: 2, color: "shadowTintedLow" },
  ],
  tinted02Top: [{ x: 0, y: -2, blur: 4, spread: 0, color: "shadowTintedLow" }],
  tinted02Bottom: [
    { x: 0, y: 2, blur: 4, spread: 0, color: "shadowTintedMedium" },
    { x: 0, y: 4, blur: 8, spread: 2, color: "shadowTintedMedium" },
  ],
  neutral02Bottom: [
    { x: 0, y: 2, blur: 4, spread: 0, color: "shadowNeutralLow" },
    { x: 0, y: 4, blur: 8, spread: 2, color: "shadowNeutralLow" },
  ],
} as const satisfies Record<string, ShadowLayer[]>;

type ShadowName = keyof typeof SHADOW_SPECS;

const toBoxShadow = (layers: readonly ShadowLayer[], colors: AppColors) =>
  layers
    .map(
      ({ x, y, blur, spread, color }) =>
        `${x}px ${y}px ${blur}px ${spread}px ${colors[color]}`,
    )
    .join(", ");

// CSS boxShadow strings for the current theme, e.g.
// style={{ boxShadow: resolveShadows(colors).tinted02Top }}
export function resolveShadows(colors: AppColors): Record<ShadowName, string> {
  const entries = Object.entries(SHADOW_SPECS).map(([name, layers]) => [
    name,
    toBoxShadow(layers, colors),
  ]);
  return Object.fromEntries(entries) as Record<ShadowName, string>;
}
