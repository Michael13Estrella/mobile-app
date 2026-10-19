/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-19
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { Spacing } from "../../constants/spacing";
import { FIELD_SIZE } from "../../theme/field";
import { TypographyTokens } from "../../constants/typography";
import { BrandIcon } from "../icons";

const ICON_SIZE = 24;

type AppSearchInputProps = Readonly<{
  value: string;
  onChangeText: (text: string) => void;
  // Defaults to "Search"
  placeholder?: string;
  // Outer spacing from the parent (margins)
  style?: StyleProp<ViewStyle>;
}>;

/**
 * A rounded search field with a search icon (select sheets, lists).
 *
 * @example <AppSearchInput value={query} onChangeText={setQuery} />
 */
export function AppSearchInput({
  value,
  onChangeText,
  placeholder,
  style,
}: AppSearchInputProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const label = placeholder ?? t("common.search");

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.borderSubtle,
          backgroundColor: colors.inputBackground,
        },
        style,
      ]}
    >
      <BrandIcon
        name="searchSmLine"
        size={ICON_SIZE}
        color={colors.iconBrandPrimary}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.inputBorderFocused}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        // iOS: an "x" to clear the search while typing.
        clearButtonMode="while-editing"
        accessibilityLabel={label}
        style={[styles.input, { color: colors.textPrimary }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s4,
    height: FIELD_SIZE.height,
    borderRadius: FIELD_SIZE.height / 2,
    borderWidth: FIELD_SIZE.borderWidth,
    paddingHorizontal: Spacing.s5,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: TypographyTokens.body1.fontFamily,
    fontSize: TypographyTokens.body1.fontSize,
  },
});
