/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-29
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
import { AppTextButton } from "./AppTextButton";

const ICON_CIRCLE_SIZE = 56;
const ICON_SIZE = 28;

type AppConfirmSheetProps = Readonly<{
  visible: boolean;
  title: string;
  message: string;
  // e.g. "Delete"
  confirmLabel: string;
  // e.g. "Keep as beneficiary": closes without doing it
  cancelLabel: string;
  icon?: BrandIconName;
  // While the action runs: a spinner on the confirm button, and the sheet
  // can't be closed
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}>;

/**
 * Asks before a destructive action (e.g. deleting a beneficiary or a
 * payout method): an icon, a title, what will happen, a red confirm button
 * and a way to keep things as they are.
 *
 * @example <AppConfirmSheet visible={!!payoutToDelete} title={…} message={…} confirmLabel={t("common.delete")} cancelLabel={…} onConfirm={deletePayout} onCancel={close} />
 */
export function AppConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  icon = "trash03Line",
  isConfirming = false,
  onConfirm,
  onCancel,
}: AppConfirmSheetProps) {
  const { colors } = useAppTheme();

  // Not while the action runs: it can't be taken back halfway
  const handleClose = () => {
    if (!isConfirming) onCancel();
  };

  return (
    <AppBottomSheet visible={visible} onClose={handleClose} backdrop="blur">
      <View style={styles.content}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.iconDangerBackground },
          ]}
        >
          <BrandIcon name={icon} size={ICON_SIZE} color={colors.iconError} />
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
            label={confirmLabel}
            variant="danger"
            loading={isConfirming}
            disabled={isConfirming}
            onPress={onConfirm}
          />
          <AppTextButton
            label={cancelLabel}
            size="button1"
            align="center"
            disabled={isConfirming}
            onPress={handleClose}
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
  // Full width: the button stretches, the text button centers under it
  actions: {
    alignSelf: "stretch",
    gap: Spacing.s5,
  },
});
