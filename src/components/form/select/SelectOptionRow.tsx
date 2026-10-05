import { Pressable, StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { DropdownOption } from "../../../utils/referenceData";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";
import CountryFlag from "react-native-country-flag";
import { BrandIcon } from "../../icons";

const FLAG_SIZE = 16;
const CHECK_ICON_SIZE = 24;

type SelectOptionRowProps = Readonly<{
  option: DropdownOption;
  selected: boolean;
  showFlag?: boolean;
  // Fixed single-line height, needed when the list jumps by index (A-Z).
  // Without it the label wraps and the row grows
  fixedHeight?: number;
  // Extra right padding so the ✓ stays clear of the A–Z index.
  endInset?: number;
  onPress: (option: DropdownOption) => void;
}>;

export function SelectOptionRow({
  option,
  selected,
  showFlag = false,
  fixedHeight,
  endInset = 0,
  onPress,
}: SelectOptionRowProps) {
  const { colors } = useAppTheme();
  const isFixedHeight = fixedHeight !== undefined;

  return (
    <Pressable
      onPress={() => onPress(option)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.row,
        { paddingRight: styles.row.paddingHorizontal + endInset },
        isFixedHeight && { height: fixedHeight },
        selected && { backgroundColor: colors.listItemSelectedBg },
      ]}
    >
      {showFlag && !!option.isoAlpha2 && (
        <CountryFlag
          isoCode={option.isoAlpha2}
          size={FLAG_SIZE}
          style={[styles.flag, { borderColor: colors.borderDefault }]}
        />
      )}
      <View style={styles.labelWrapper}>
        <AppText
          typographyType="body1"
          weight={selected ? "bold" : "regular"}
          color={selected ? colors.textBrandPrimary : colors.textPrimary}
          numberOfLines={isFixedHeight ? 1 : undefined}
        >
          {option.label}
        </AppText>
      </View>

      {selected && (
        <BrandIcon
          name="checkLine"
          size={CHECK_ICON_SIZE}
          color={colors.iconBrandSecondary}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s8,
    paddingVertical: Spacing.s4,
  },
  flag: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  labelWrapper: {
    flex: 1,
  },
});
