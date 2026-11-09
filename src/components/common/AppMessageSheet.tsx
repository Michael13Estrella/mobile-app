/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Spacing } from "../../constants/spacing";
import { BrandIcon, BrandIconName } from "../icons";
import { AppBottomSheet } from "./AppBottomSheet";
import { AppButton } from "./AppButton";
import { AppText } from "./AppText";

const ICON_CIRCLE_SIZE = 64;
const ICON_SIZE = 36;

type AppMessageSheetProps = Readonly<{
  visible: boolean;
  icon: BrandIconName;
  title: string;
  message: string;
  // The one thing to do next, e.g. "Add beneficiary"
  actionLabel: string;
  onAction: () => void;
  // Backdrop tap or Android back
  onClose: () => void;
  // Once it has fully slid out (see AppBottomSheet)
  onClosed?: () => void;
}>;

/**
 * Tells the user something and offers the one way forward (e.g. "No
 * beneficiaries yet" → "Add beneficiary"): an icon, a title, a message and
 * a button, over the blurred screen.
 *
 * @example <AppMessageSheet visible={isOpen} icon="users01Line" title={…} message={…} actionLabel={…} onAction={addBeneficiary} onClose={close} />
 */
export function AppMessageSheet({
  visible,
  icon,
  title,
  message,
  actionLabel,
  onAction,
  onClose,
  onClosed,
}: AppMessageSheetProps) {
  const { colors } = useAppTheme();

  return (
    <AppBottomSheet
      visible={visible}
      onClose={onClose}
      onClosed={onClosed}
      backdrop="blur"
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.surfacePrimary2 },
          ]}
        >
          <BrandIcon
            name={icon}
            size={ICON_SIZE}
            color={colors.alertInfoIcon}
          />
        </View>

        <View style={styles.texts}>
          <AppText
            typographyType="h4"
            weight="bold"
            color={colors.textPrimary}
            style={styles.centered}
          >
            {title}
          </AppText>
          <AppText
            typographyType="body2"
            color={colors.textPrimary}
            style={styles.centered}
          >
            {message}
          </AppText>
        </View>

        <View style={styles.actions}>
          <AppButton
            label={actionLabel}
            variant="gradient"
            onPress={onAction}
          />
        </View>
      </View>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    gap: Spacing.s7,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    gap: Spacing.s3,
  },
  centered: {
    textAlign: "center",
  },
  // Full width: the button stretches
  actions: {
    alignSelf: "stretch",
  },
});
