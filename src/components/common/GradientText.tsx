/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-07
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ComponentProps } from "react";
import { AppText } from "./AppText";
import { useAppTheme } from "../../hooks/useAppTheme";
import MaskedView from "@react-native-masked-view/masked-view";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 1, y: 0 };

// Same props as AppText, except the color (the gradient replaces it).
type GradientTextProps = Omit<ComponentProps<typeof AppText>, "color">;

// Text filled with the brand gradient (e.g. the lock screen greeting).
export function GradientText({ style, ...textProps }: GradientTextProps) {
  const { colors } = useAppTheme();

  return (
    <MaskedView maskElement={<AppText {...textProps} style={style} />}>
      <LinearGradient
        colors={[colors.brandGradientStart, colors.brandGradientEnd]}
        start={GRADIENT_START}
        end={GRADIENT_END}
      >
        {/* Invisible copy: gives the gradient the text's exact size. */}
        <AppText {...textProps} style={[style, styles.hidden]} />
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
});
