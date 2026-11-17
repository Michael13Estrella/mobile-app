/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useFormatJapanDateTime } from "../../../hooks/useFormatJapanDateTime";
import { useTranslation } from "../../../hooks/useTranslation";
import { SubmittedBiller } from "../../../store/slices/addBillerSlice";
import { getBillerFields } from "../../../utils/biller/billerFields";
import { AppButton } from "../../common/AppButton";
import { AppHeader } from "../../common/AppHeader";
import { AppScreen } from "../../common/AppScreen";
import { StatusIcon } from "../../common/StatusIcon";
import { AppText } from "../../common/AppText";
import { AppCard } from "../../common/AppCard";
import { DetailRow } from "../../common/DetailRow";
import { formatPhoneNumber } from "../../../utils/format/phone";
import { PHONE_COUNTRIES } from "../../../constants/phone";
import { maskAccountNumber } from "../../../utils/beneficiary/payout";

type BillerSubmittedProps = Readonly<{
  submitted: SubmittedBiller;
  onAddAnother: () => void;
  onGoToPayBills: () => void;
}>;

/**
 * "Biller under review": the saved biller's details (only the fields it
 * asked for) and when it was saved.
 *
 * @example <BillerSubmitted submitted={submitted} onAddAnother={addAnother} onGoToPayBills={goToPayBills} />
 */
export function BillerSubmitted({
  submitted,
  onAddAnother,
  onGoToPayBills,
}: BillerSubmittedProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const formatJapanDateTime = useFormatJapanDateTime();

  const { biller, values, submittedAt } = submitted;
  const fields = getBillerFields(biller);

  return (
    <AppScreen
      gradient
      contentGap={Spacing.s7}
      header={
        <AppHeader title={t("payBills.addBiller.submitted.headerTitle")} />
      }
      footer={
        <AppButton
          label={t("payBills.addBiller.submitted.goToPayBills")}
          variant="gradient"
          onPress={onGoToPayBills}
        />
      }
    >
      <View style={styles.status}>
        <StatusIcon status="pending" />
        <AppText
          typographyType="h4"
          color={colors.textPrimary}
          style={styles.centered}
        >
          {t("payBills.addBiller.submitted.title")}
        </AppText>
        <AppText
          typographyType="body2"
          color={colors.textPrimary}
          style={styles.centered}
        >
          {t("payBills.addBiller.submitted.message")}
        </AppText>
      </View>

      <AppCard variant="outlined" style={styles.rows}>
        <DetailRow
          label={t("payBills.addBiller.submitted.biller")}
          value={biller.utilityDesc}
        />
        {fields.subscriberNo && (
          <DetailRow
            label={
              fields.isCreditCard
                ? t("payBills.addBiller.submitted.creditCardNo")
                : t("payBills.addBiller.submitted.subscriberNo")
            }
            value={
              fields.isCreditCard
                ? maskAccountNumber(values.subscriberNo)
                : values.subscriberNo
            }
          />
        )}
        {fields.docRefNo && (
          <DetailRow
            label={t("payBills.addBiller.submitted.docRefNo")}
            value={values.docRefNo}
          />
        )}
        {fields.telNo && (
          <DetailRow
            label={t("payBills.addBiller.submitted.telNo")}
            value={formatPhoneNumber(
              PHONE_COUNTRIES[values.telCountry],
              values.telNo,
            )}
          />
        )}
        <DetailRow
          label={t("payBills.addBiller.submitted.dateTime")}
          value={formatJapanDateTime(submittedAt)}
        />
      </AppCard>

      <AppButton
        label={t("payBills.addBiller.submitted.addAnother")}
        variant="elevated"
        icon="plusLine"
        onPress={onAddAnother}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  status: {
    alignItems: "center",
    gap: Spacing.s4,
  },
  centered: {
    textAlign: "center",
  },
  rows: {
    gap: Spacing.s5,
  },
});
