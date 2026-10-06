import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";
import { PASSWORD_RULES } from "../../constants/passwordRules";
import { BrandIcon } from "../icons";

const ICON_SIZE = 10;

type PasswordRequirementsChecklistProps = Readonly<{ password: string }>;

export function PasswordRequirementsChecklist({
  password,
}: PasswordRequirementsChecklistProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {PASSWORD_RULES.map((rule) => {
        const isMet = rule.test(password);
        return (
          <View key={rule.labelKey} style={styles.row}>
            {isMet ? (
              <BrandIcon
                name="checkLine"
                size={ICON_SIZE}
                color={colors.iconSuccess}
              />
            ) : (
              <BrandIcon
                name="xLine"
                size={ICON_SIZE}
                color={colors.iconTertiary}
              />
            )}
            <Text
              style={[
                styles.label,
                { color: isMet ? colors.textPrimary : colors.textTertiary },
              ]}
            >
              {t(rule.labelKey)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.s2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
  },
  label: {
    fontSize: Typography.sizes.sm,
  },
});
