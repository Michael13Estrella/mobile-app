import { AppColors } from "../constants/colors";

type ShadowSpec = Readonly<{
  x: number;
  y: number;
  blur: number;
  spread: number;
}>;

// Figma "Shadows and blurs" values, named after the Figma elevation tokens
// (e.g. elevation/tinted/02/top -> tinted02Top).
const SHADOW_SPECS = {
  tinted02Top: { x: 0, y: -2, blur: 4, spread: 0 },
} as const satisfies Record<string, ShadowSpec>;

type ShadowName = keyof typeof SHADOW_SPECS;

const toBoxShadow = ({ x, y, blur, spread }: ShadowSpec, color: string) =>
  `${x}px ${y}px ${blur}px ${spread}px ${color}`;

// CSS boxShadow strings for the current theme, e.g.
// style={{ boxShadow: resolveShadows(colors).tinted02Top }}
export function resolveShadows(colors: AppColors): Record<ShadowName, string> {
  return {
    tinted02Top: toBoxShadow(SHADOW_SPECS.tinted02Top, colors.shadowTintedLow),
  };
}
