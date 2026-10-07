/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { LinearGradient } from "expo-linear-gradient";
import { Palette } from "../../constants/palette";
import {
  StyleSheet,
  View,
  Text,
  Image,
  useWindowDimensions,
} from "react-native";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";
import ESCUDO_S from "../../../assets/images/diamonds/escudo-S.png";
import ESCUDO_L from "../../../assets/images/diamonds/escudo-L.png";

const SPLASH_DIAMONDS = {
  top: {
    widthRatio: 0.93,
    leftRatio: -0.12,
    centerOffsetRatio: -0.89,
  },
  bottom: {
    widthRatio: 1.45,
    leftRatio: 0.06,
    centerOffsetRatio: -0.37,
  },
} as const;

// Read the aspect ratio from the files themselves, so replacing an
// image never requires touching the numbers here.

const aspectRatioOf = (source: number) => {
  const { width, height } = Image.resolveAssetSource(source);
  return width / height;
};

const APP_DISPLAY_NAME = "MetroRemit";
const APP_VERSION = "1.0.0";

type DiamondGeometry = (typeof SPLASH_DIAMONDS)[keyof typeof SPLASH_DIAMONDS];

const diamondStyle = (
  geometry: DiamondGeometry,
  source: number,
  screenWidth: number,
  screenHeight: number,
) => ({
  width: screenWidth * geometry.widthRatio,
  aspectRatio: aspectRatioOf(source),
  left: screenWidth * geometry.leftRatio,
  top: screenHeight / 2 + screenWidth * geometry.centerOffsetRatio,
});

export function SplashScreen() {
  const { width, height } = useWindowDimensions();

  return (
    <LinearGradient
      colors={[Palette.mbAzure500, Palette.mbBlue500]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFill, styles.container]}
    >
      <Image
        source={ESCUDO_S}
        style={[
          styles.diamond,
          diamondStyle(SPLASH_DIAMONDS.top, ESCUDO_S, width, height),
        ]}
        resizeMode="contain"
      />
      <Image
        source={ESCUDO_L}
        style={[
          styles.diamond,
          diamondStyle(SPLASH_DIAMONDS.bottom, ESCUDO_L, width, height),
        ]}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Text style={[styles.logoText, { color: Palette.white100 }]}>
          {APP_DISPLAY_NAME}
        </Text>
        <Text style={[styles.version, { color: Palette.white075 }]}>
          Version {APP_VERSION}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  diamond: {
    position: "absolute",
  },
  content: {
    alignItems: "center",
    gap: Spacing.s3,
  },
  logoText: {
    fontSize: Typography.sizes.xxxxl,
    fontWeight: Typography.weights.bold,
  },
  version: {
    fontSize: Typography.sizes.xs,
    opacity: 0.8,
  },
});
