import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { Spacing } from "../../constants/spacing";
import { FIELD_SIZE } from "../../theme/field";
import { BrandIcon } from "../icons";
import { AppText } from "../common/AppText";

const ICON_SIZE = 20;
const BANNER_RADIUS = 16;

type FormErrorSummaryProps = Readonly<{
  //Labels of the fields with errors, in screen order.
  fields: string[];
}>;

// Banner above a form's main button listing the fields that need attention
export function FormErrorSummary({ fields }: FormErrorSummaryProps) {
  const { colors } = useAppTheme();
  const { t, locale } = useTranslation();

  if (fields.length === 0) return null;

  const separator = locale === "ja" ? "、" : ", ";

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        {
          backgroundColor: colors.fillError,
          borderColor: colors.borderError,
        },
      ]}
    >
      <View style={styles.icon}>
        <BrandIcon
          name="alertTriangleSolid"
          size={ICON_SIZE}
          color={colors.iconError}
        />
      </View>

      <View style={styles.texts}>
        <AppText typographyType="body2" color={colors.textError}>
          {t("form.errorSummary.title")}
        </AppText>
        <AppText typographyType="body2" color={colors.textError}>
          {t("form.errorSummary.fields")}{" "}
          <AppText
            typographyType="body2"
            weight="bold"
            color={colors.textError}
          >
            {fields.join(separator)}
          </AppText>
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s4,
    borderWidth: FIELD_SIZE.borderWidth,
    borderRadius: FIELD_SIZE.borderRadius,
    paddingHorizontal: Spacing.s5,
    paddingVertical: Spacing.s4,
  },
  icon: {
    alignContent: "flex-start",
  },
  texts: {
    flex: 1,
    gap: Spacing.s1,
  },
});
