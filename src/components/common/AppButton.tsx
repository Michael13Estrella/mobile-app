/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, ViewStyle, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAppTheme } from "../../hooks/useAppTheme";
import { OldPalette } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Spacing } from "../../constants/spacing";
import { Palette } from "../../constants/palette";
import { AppText } from "./AppText";
import { GradientBorder } from "./GradientBorder";
import { BrandIcon, BrandIconName } from "../icons";
import { resolveShadows } from "../../theme/shadows";

type ButtonVariant =
  | "solid"
  | "gradient"
  | "gradientOutline"
  | "outline"
  | "ghost"
  | "glass"
  | "elevated";

const ICON_SIZE = 18;

const BUTTON_RADIUS = 24;
const GLASS_BORDER_WIDTH = 1;
const GLASS_BORDER_LOCATIONS = [0, 0.5, 1] as const;
const GLASS_BORDER_START = { x: 0.21, y: -1.37 };
const GLASS_BORDER_END = { x: 0.79, y: 2.37 };

const GRADIENT_BORDER_WIDTH = 1.5;

type AppButtonProps = Readonly<{
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  icon?: BrandIconName;
  onDark?: boolean;
}>;

type ContentProps = Readonly<{
  loading: boolean;
  label: string;
  icon?: BrandIconName;
  textColor: string;
  spinnerColor: string;
}>;

function ButtonContent({
  loading,
  label,
  icon,
  textColor,
  spinnerColor,
}: ContentProps) {
  if (loading) return <ActivityIndicator size="small" color={spinnerColor} />;
  return (
    <>
      {icon ? (
        <BrandIcon name={icon} size={ICON_SIZE} color={textColor} />
      ) : null}
      <AppText
        typographyType="button1"
        weight="bold"
        color={textColor}
        style={styles.label}
      >
        {label}
      </AppText>
    </>
  );
}

type GradientLabelRowProps = Readonly<{
  label: string;
  icon?: BrandIconName;
  hidden?: boolean;
}>;

// Label/icon used both as the MaskedView mask shape and as an invisible copy
// that sizes the gradient beneath it.
function GradientLabelRow({ label, icon, hidden }: GradientLabelRowProps) {
  return (
    <View style={[styles.gradientTextRow, hidden && styles.hidden]}>
      {icon ? <BrandIcon name={icon} size={ICON_SIZE} color="black" /> : null}
      <AppText typographyType="button1" weight="bold" style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

type GradientButtonProps = Readonly<{
  onPress: () => void;
  fullWidth: boolean;
  style?: ViewStyle;
  gradientColors: [string, string];
  content: React.ReactNode;
}>;

function GradientButton({
  onPress,
  fullWidth,
  style,
  gradientColors,
  content,
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[fullWidth && styles.fullWidth, style]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        {content}
      </LinearGradient>
    </TouchableOpacity>
  );
}

type GradientOutlineButtonProps = Readonly<{
  onPress: () => void;
  fullWidth: boolean;
  style?: ViewStyle;
  gradientColors: [string, string];
  surfaceColor: string;
  loading: boolean;
  spinnerColor: string;
  label: string;
  icon?: BrandIconName;
}>;

function GradientOutlineButton({
  onPress,
  fullWidth,
  style,
  gradientColors,
  surfaceColor,
  loading,
  spinnerColor,
  label,
  icon,
}: GradientOutlineButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[fullWidth && styles.fullWidth, style]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientOutlineBorder}
      >
        <View
          style={[
            styles.gradientOutlineInner,
            { backgroundColor: surfaceColor },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={spinnerColor} />
          ) : (
            <MaskedView
              maskElement={<GradientLabelRow label={label} icon={icon} />}
            >
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <GradientLabelRow label={label} icon={icon} hidden />
              </LinearGradient>
            </MaskedView>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export const AppButton = ({
  label,
  onPress,
  variant = "solid",
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  icon,
  onDark = false,
}: AppButtonProps) => {
  const { colors } = useAppTheme();

  const isDisabled = disabled || loading;

  const resolvedColors = {
    solid: {
      background: onDark ? OldPalette.white : colors.buttonPrimary,
      text: onDark ? colors.buttonPrimary : OldPalette.white,
    },
    gradient: {
      start: Palette.mbAzure500,
      end: Palette.mbBlue500,
      text: Palette.white100,
    },
    outline: {
      border: onDark ? OldPalette.white : colors.buttonPrimary,
      text: onDark ? OldPalette.white : colors.buttonPrimary,
    },
    ghost: {
      text: onDark ? OldPalette.white : colors.buttonPrimary,
    },
    glass: {
      background: colors.buttonGlassBackground,
      text: colors.textOnBrand,
    },
    disabled: {
      background: onDark
        ? OldPalette.slate700
        : colors.buttonDisabledBackground,
      text: onDark ? OldPalette.slate500 : colors.buttonDisabledText,
    },
    elevated: {
      background: colors.surface,
      text: colors.buttonPrimary,
    },
  };

  const textColorByVariant: Record<ButtonVariant, string> = {
    solid: resolvedColors.solid.text,
    gradient: resolvedColors.gradient.text,
    gradientOutline: colors.buttonPrimary,
    outline: resolvedColors.outline.text,
    ghost: resolvedColors.ghost.text,
    glass: resolvedColors.glass.text,
    elevated: resolvedColors.elevated.text,
  };

  const styleByVariant: Record<ButtonVariant, ViewStyle> = {
    solid: { backgroundColor: resolvedColors.solid.background },
    gradient: { backgroundColor: resolvedColors.solid.background },
    gradientOutline: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: resolvedColors.outline.border,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: resolvedColors.outline.border,
    },
    ghost: { backgroundColor: "transparent" },
    glass: {
      backgroundColor: resolvedColors.glass.background,
    },
    elevated: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      boxShadow: resolveShadows(colors).neutral02Bottom,
    },
  };

  const disabledStyleByVariant: Record<ButtonVariant, ViewStyle> = {
    solid: { backgroundColor: resolvedColors.disabled.background },
    gradient: { backgroundColor: resolvedColors.disabled.background },
    gradientOutline: { backgroundColor: resolvedColors.disabled.background },
    outline: { backgroundColor: resolvedColors.disabled.background },
    ghost: { backgroundColor: "transparent" },
    glass: { backgroundColor: resolvedColors.glass.background },
    elevated: {
      backgroundColor: resolvedColors.disabled.background,
      borderRadius: 8,
    },
  };

  const isTransparentVariant =
    variant === "outline" || variant === "ghost" || variant === "elevated";
  const textColor = isDisabled
    ? resolvedColors.disabled.text
    : textColorByVariant[variant];
  const spinnerColor = isTransparentVariant
    ? resolvedColors.outline.text
    : OldPalette.white;
  const containerStyle = disabled
    ? disabledStyleByVariant[variant]
    : styleByVariant[variant];

  const content = (
    <ButtonContent
      loading={loading}
      label={label}
      icon={icon}
      textColor={textColor}
      spinnerColor={spinnerColor}
    />
  );

  if (variant === "gradient" && !isDisabled) {
    return (
      <GradientButton
        onPress={onPress}
        fullWidth={fullWidth}
        style={style}
        gradientColors={[
          resolvedColors.gradient.start,
          resolvedColors.gradient.end,
        ]}
        content={content}
      />
    );
  }

  if (variant === "gradientOutline" && !isDisabled) {
    return (
      <GradientOutlineButton
        onPress={onPress}
        fullWidth={fullWidth}
        style={style}
        gradientColors={[
          resolvedColors.gradient.start,
          resolvedColors.gradient.end,
        ]}
        surfaceColor={colors.surface}
        loading={loading}
        spinnerColor={resolvedColors.gradient.start}
        label={label}
        icon={icon}
      />
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.button,
        containerStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {content}
      {variant == "glass" && !isDisabled && (
        <GradientBorder
          colors={[
            colors.buttonGlassBorderStart,
            colors.buttonGlassBorderMiddle,
            colors.buttonGlassBorderEnd,
          ]}
          locations={GLASS_BORDER_LOCATIONS}
          start={GLASS_BORDER_START}
          end={GLASS_BORDER_END}
          radius={BUTTON_RADIUS}
          width={GLASS_BORDER_WIDTH}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: BUTTON_RADIUS,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s5,
    paddingVertical: Spacing.s4,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    lineHeight: undefined,
  },
  gradientOutlineBorder: {
    borderRadius: 30,
    padding: GRADIENT_BORDER_WIDTH,
  },
  gradientOutlineInner: {
    height: 52 - GRADIENT_BORDER_WIDTH * 2,
    borderRadius: 30 - GRADIENT_BORDER_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
  },
  gradientTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
  },
  hidden: {
    opacity: 0,
  },
});
