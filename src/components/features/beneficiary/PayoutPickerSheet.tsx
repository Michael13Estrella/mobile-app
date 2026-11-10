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

import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { resolveShadows } from "../../../theme/shadows";
import { BeneficiaryPayout } from "../../../types";
import { AppBottomSheet } from "../../common/AppBottomSheet";
import { AppText } from "../../common/AppText";
import { AppCard } from "../../common/AppCard";
import { PayoutMethodRow } from "./PayoutMethodRow";
import { PAYOUT_TYPE } from "../../../constants/payout";

// The sheet's side padding (AppBottomSheet's), cancelled around the list so
// the card's shadows aren't cut off at its edges
const SHEET_SIDE_PADDING = Spacing.s7;
// Every card has it (transparent until selected), so selecting doesn't
// shift the layout
const CARD_BORDER_WIDTH = 1;

type PayoutPickerSheetProps = Readonly<{
  visible: boolean;
  beneficiaryName: string;
  payouts: readonly BeneficiaryPayout[];
  selectedPayoutId?: number;
  onSelect: (payout: BeneficiaryPayout) => void;
  onClose: () => void;
}>;

/**
 * The "Payout method" drawer: the beneficiary's saved payout methods as
 * cards, the selected one outlined.
 *
 * @example <PayoutPickerSheet visible={isOpen} beneficiaryName="Jung Kook" payouts={payouts} selectedPayoutId={id} onSelect={select} onClose={close} />
 */
export function PayoutPickerSheet({
  visible,
  beneficiaryName,
  payouts,
  selectedPayoutId,
  onSelect,
  onClose,
}: PayoutPickerSheetProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const shadows = resolveShadows(colors);

  return (
    <AppBottomSheet visible={visible} onClose={onClose}>
      {/* Header */}
      <View style={styles.header}>
        <AppText typographyType="h4" weight="bold" color={colors.textPrimary}>
          {t("sendMoney.payoutPicker.title")}
        </AppText>
        <Pressable
          onPress={onClose}
          hitSlop={Spacing.s3}
          accessibilityRole="button"
        >
          <AppText
            typographyType="button1"
            weight="bold"
            color={colors.textBrandPrimary}
          >
            {t("common.cancel")}
          </AppText>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        persistentScrollbar
      >
        <AppText
          typographyType="overline2"
          weight="bold"
          color={colors.textTertiary}
          style={styles.overline}
        >
          {t("sendMoney.payoutPicker.savedFor", { name: beneficiaryName })}
        </AppText>

        {payouts.map((payout) => {
          const isSelected = payout.payoutId === selectedPayoutId;
          return (
            <Pressable
              key={payout.payoutId}
              onPress={() => onSelect(payout)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <AppCard
                variant="elevated"
                style={{
                  ...styles.card,
                  boxShadow: shadows.neutral02Bottom,
                  borderColor: isSelected
                    ? colors.inputBorderFocused
                    : "transparent",
                }}
              >
                <PayoutMethodRow
                  payout={payout}
                  details={
                    payout.payoutType === PAYOUT_TYPE.CASH_PICKUP
                      ? t("sendMoney.payoutPicker.cashPickupDetails")
                      : undefined
                  }
                />
              </AppCard>
            </Pressable>
          );
        })}
      </ScrollView>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.s5,
  },
  // Shrinks to the sheet's maximum height, then scrolls
  scroll: {
    flexShrink: 1,
    marginHorizontal: -SHEET_SIDE_PADDING,
  },
  content: {
    paddingHorizontal: SHEET_SIDE_PADDING,
    paddingBottom: Spacing.s3,
    gap: Spacing.s4,
  },
  // Uppercase by style, so the translation (and the name) stay normal text
  overline: {
    textTransform: "uppercase",
  },
  // The row has its own vertical padding
  card: {
    paddingVertical: Spacing.s0,
    borderWidth: CARD_BORDER_WIDTH,
  },
});
