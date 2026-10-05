import { StyleSheet, ViewStyle, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Typography } from "../../constants/typography";
import { OldPalette } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { IconName } from "../../types";
import { Spacing } from "../../constants/spacing";
import { Palette } from "../../constants/palette";
import { AppText } from "./AppText";

type ButtonVariant =
  | "solid"
  | "gradient"
  | "gradientOutline"
  | "outline"
  | "ghost";

const GRADIENT_BORDER_WIDTH = 1.5;

type AppButtonProps = Readonly<{
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  icon?: IconName;
  onDark?: boolean;
}>;

type ContentProps = Readonly<{
  loading: boolean;
  label: string;
  icon?: IconName;
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
        <MaterialCommunityIcons name={icon} size={20} color={textColor} />
      ) : null}
      <AppText typographyType="button1" weight="bold" color={textColor}>
        {label}
      </AppText>
    </>
  );
}

type GradientLabelRowProps = Readonly<{
  label: string;
  icon?: IconName;
  hidden?: boolean;
}>;

// Label/icon used both as the MaskedView mask shape and as an invisible copy
// that sizes the gradient beneath it.
function GradientLabelRow({ label, icon, hidden }: GradientLabelRowProps) {
  return (
    <View style={[styles.gradientTextRow, hidden && styles.hidden]}>
      {icon ? (
        <MaterialCommunityIcons name={icon} size={20} color="black" />
      ) : null}
      <AppText typographyType="button1" weight="bold">
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
  icon?: IconName;
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
    disabled: {
      background: onDark
        ? OldPalette.slate700
        : colors.buttonDisabledBackground,
      text: onDark ? OldPalette.slate500 : colors.buttonDisabledText,
    },
  };

  const textColorByVariant: Record<ButtonVariant, string> = {
    solid: resolvedColors.solid.text,
    gradient: resolvedColors.gradient.text,
    gradientOutline: colors.buttonPrimary,
    outline: resolvedColors.outline.text,
    ghost: resolvedColors.ghost.text,
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
  };

  const disabledStyleByVariant: Record<ButtonVariant, ViewStyle> = {
    solid: { backgroundColor: resolvedColors.disabled.background },
    gradient: { backgroundColor: resolvedColors.disabled.background },
    gradientOutline: { backgroundColor: resolvedColors.disabled.background },
    outline: { backgroundColor: resolvedColors.disabled.background },
    ghost: { backgroundColor: "transparent" },
  };

  const isTransparentVariant = variant === "outline" || variant === "ghost";
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: Spacing.s7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s7,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.5,
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
    gap: 8,
  },
  hidden: {
    opacity: 0,
  },
});
