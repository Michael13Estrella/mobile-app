import { Image, ImageStyle, StyleProp } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import logoForDarkBg from "../../../assets/images/metro-send-for-dark.png";
import logoForLightBg from "../../../assets/images/metro-send-for-light.png";

type AppLogoProps = Readonly<{
  onDark?: boolean;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}>;

export const AppLogo = ({
  onDark,
  width = 150,
  height = 40,
  style,
}: AppLogoProps) => {
  const { isDark } = useAppTheme();

  const onDarkBackground = onDark ?? isDark;
  const source = onDarkBackground ? logoForDarkBg : logoForLightBg;

  return (
    <Image
      source={source}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
};
