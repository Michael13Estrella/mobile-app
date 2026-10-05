import Svg, { Path } from "react-native-svg";
import { BRAND_ICON_PATHS, BrandIconName } from "./brandIconPaths";
import { useAppTheme } from "../../hooks/useAppTheme";

const DEFAULT_SIZE = 24;

export type BrandIconProps = Readonly<{
  name: BrandIconName;
  size?: number;
  color?: string;
}>;

export function BrandIcon({
  name,
  size = DEFAULT_SIZE,
  color,
}: BrandIconProps) {
  const { colors } = useAppTheme();
  const fillColor = color ?? colors.primary;
  const { viewBox, paths } = BRAND_ICON_PATHS[name];

  return (
    <Svg width={size} height={size} viewBox={viewBox} fill="none">
      {paths.map((d, index) => (
        <Path
          key={index}
          fillRule="evenodd"
          clipRule="evenodd"
          d={d}
          fill={fillColor}
        />
      ))}
    </Svg>
  );
}
