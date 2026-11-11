/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  CURRENCY_COUNTRY,
  CURRENCY_FRACTION_DIGITS,
  RECEIVE_CURRENCIES,
  ReceiveCurrency,
  WALLET_CURRENCY,
} from "../../../constants/currency";
import { INTL_LOCALE } from "../../../constants/locale";
import { Spacing } from "../../../constants/spacing";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { ChargeTier } from "../../../types/charge.types";
import { ExchangeRate } from "../../../types/exchangeRate.types";
import { yenToYenAmountForNet } from "../../../utils/remittance/charges";
import {
  convertAmount,
  findPairRate,
} from "../../../utils/remittance/exchangeRate";
import { formatAmount } from "../../../utils/format/formatCurrency";
import {
  parseAmountInput,
  roundUp,
} from "../../../utils/remittance/amountInput";
import { AppButton } from "../../common/AppButton";
import { AppCard } from "../../common/AppCard";
import { AppText } from "../../common/AppText";
import { SegmentedControl } from "../../common/SegmentedControl";
import { AppAmountInput } from "../../form/AppAmountInput";
import { BrandCountryFlag, BrandIcon } from "../../icons";
import { REMITTANCE_MINIMUMS } from "../../../constants/remittance";
import { getRemittanceQuote } from "../../../utils/remittance/quote";

const SEND_CURRENCY = WALLET_CURRENCY;
const PLACEHOLDER_FRACTION_DIGITS = 2;
const RATE_MAX_DECIMALS = 4;
const FLAG_SIZE = 20;
const ICON_SIZE = 16;
const MISSING_AMOUNT = "-";

const fractionDigitsOf = (currency: string) =>
  CURRENCY_FRACTION_DIGITS[currency] ?? PLACEHOLDER_FRACTION_DIGITS;

// The field the user typed in; the other one is calculated from it.
type Edited = Readonly<{ side: "send" | "receive"; value: string }>;

type RemittanceSimulatorProps = Readonly<{
  // Indicative rates
  rates: readonly ExchangeRate[];
  // Remittance charge tiers by send amount (JPY).
  chargeTiers: readonly ChargeTier[];
  allowJpy: boolean;
  onSendPress: (amount: number, currency: ReceiveCurrency) => void;
}>;

export function RemittanceSimulator({
  rates,
  chargeTiers,
  allowJpy,
  onSendPress,
}: RemittanceSimulatorProps) {
  const { colors } = useAppTheme();
  const { t, locale } = useTranslation();
  const intlLocale = INTL_LOCALE[locale];

  const receiveCurrencies = RECEIVE_CURRENCIES.filter(
    (code) => allowJpy || code !== SEND_CURRENCY,
  );
  const [selectedReceiveCurrency, setSelectedReceiveCurrency] =
    useState<ReceiveCurrency>(RECEIVE_CURRENCIES[0]);

  // Falls back to the first option if JPY was selected and is no longer allowed
  const receiveCurrency = receiveCurrencies.includes(selectedReceiveCurrency)
    ? selectedReceiveCurrency
    : receiveCurrencies[0];

  const [edited, setEdited] = useState<Edited>({ side: "send", value: "" });

  const sendDigits = fractionDigitsOf(SEND_CURRENCY);
  const receiveDigits = fractionDigitsOf(receiveCurrency);
  const placeholder = (0).toFixed(PLACEHOLDER_FRACTION_DIGITS);
  const minimum = REMITTANCE_MINIMUMS[receiveCurrency];

  // JPY -> JPY: no exchange rate, but a lifting fee (0.75%, at least ¥1,000).
  const isYenToYen = receiveCurrency == SEND_CURRENCY;

  // "You send" = the remittance amount (net: the charge goes on top, as in
  // Send Money). Typed, or (when the received amount was typed) the
  // smallest amount that still delivers it.
  const sendValue = (() => {
    if (edited.side === "send") return edited.value;
    const received = parseAmountInput(edited.value);
    if (received <= 0) return "";

    // JPY -> JPY: the lifting fee comes out of the amount, so add it back
    if (isYenToYen) return String(yenToYenAmountForNet(received));

    const amount = convertAmount(
      received,
      receiveCurrency,
      SEND_CURRENCY,
      rates,
    );
    return amount === null ? "" : String(roundUp(amount, sendDigits));
  })();

  const sendAmount = parseAmountInput(sendValue);

  // The charge, total money out, lifting fee and what arrives: the same
  // calculation as Send Money. Null when it can't be worked out (no tier,
  // no rate, or nothing would arrive).
  const quote = getRemittanceQuote(
    sendAmount,
    receiveCurrency,
    rates,
    chargeTiers,
  );

  // What the beneficiary gets, already rounded like the server
  const receiveValue = (() => {
    if (edited.side === "receive") return edited.value;
    return quote ? quote.receiveAmount.toFixed(receiveDigits) : "";
  })();

  const receiveAmount = parseAmountInput(receiveValue);

  // The minimum of the field the user typed in (once something is entered):
  // "You send" -> the send minimum, "Beneficiary gets" -> the receive minimum.
  const isSendTyped = edited.side === "send";
  const isBelowMinimum =
    edited.value !== "" &&
    (isSendTyped ? sendAmount < minimum.send : receiveAmount < minimum.receive);

  // Something must arrive after all fees, and the minimum must be met.
  const canSend = !!quote && !isBelowMinimum;

  const minimumMessage = (() => {
    if (!isBelowMinimum) return null;
    return isSendTyped
      ? t("home.simulator.minimumSend", {
          amount: formatAmount(minimum.send, intlLocale, sendDigits),
          currency: SEND_CURRENCY,
        })
      : t("home.simulator.minimumReceive", {
          amount: formatAmount(minimum.receive, intlLocale, receiveDigits),
          currency: receiveCurrency,
        });
  })();

  // The pair's rate in its own direction ("1 JPY = 0.3985 PHP",
  // "1 USD = 158.05 JPY"); none for JPY -> JPY.
  const pairRate = findPairRate(rates, SEND_CURRENCY, receiveCurrency);
  // const pairRate = rates.find(
  //   (r) =>
  //     (r.fromCurrency === SEND_CURRENCY && r.toCurrency === receiveCurrency) ||
  //     (r.fromCurrency === receiveCurrency && r.toCurrency === SEND_CURRENCY),
  // );

  const formatJpy = (amount: number | null) =>
    amount === null
      ? MISSING_AMOUNT
      : `${formatAmount(amount, intlLocale, sendDigits)} ${SEND_CURRENCY}`;

  const handleCurrencyChange = (code: ReceiveCurrency) => {
    setSelectedReceiveCurrency(code);
    // A typed received amount may not fit the new currency's decimals
    // (e.g. 5000.50 -> JPY): start over.
    if (edited.side === "receive") setEdited({ side: "send", value: "" });
  };

  return (
    <AppCard variant="elevated" style={styles.card}>
      <View style={styles.titles}>
        <AppText typographyType="h4" color={colors.textPrimary}>
          {t("home.simulator.title")}
        </AppText>
        <AppText typographyType="body2" color={colors.textSecondary}>
          {t("home.simulator.subtitle")}
        </AppText>
      </View>

      <View style={styles.fieldsContainer}>
        {/* SEND amount */}
        <AppAmountInput
          label={t("home.simulator.fromLabel")}
          currency={SEND_CURRENCY}
          value={sendValue}
          onChangeValue={(value) => setEdited({ side: "send", value })}
          fractionDigits={sendDigits}
          placeholder={placeholder}
          hasFlag
        />

        {/* Arrow circle */}
        <View style={styles.arrow}>
          <BrandIcon
            name="arrowCircleDownLine"
            size={ICON_SIZE}
            color={colors.iconTertiary}
          />
        </View>

        {/* (PHP) / (USD) / (JPY) */}
        <SegmentedControl
          accessibilityLabel={t("home.simulator.title")}
          value={receiveCurrency}
          onChange={handleCurrencyChange}
          options={receiveCurrencies.map((code) => ({
            value: code,
            label: code,
            icon: (
              <BrandCountryFlag
                code={CURRENCY_COUNTRY[code] ?? ""}
                size={FLAG_SIZE}
                shape="circle"
              />
            ),
          }))}
        />

        {/* RECEIVE amount */}
        <AppAmountInput
          label={t("home.simulator.toLabel")}
          currency={receiveCurrency}
          value={receiveValue}
          onChangeValue={(value) => setEdited({ side: "receive", value })}
          fractionDigits={receiveDigits}
          placeholder={placeholder}
          hint={
            pairRate
              ? `1 ${pairRate.fromCurrency} = ${pairRate.rate.toLocaleString(
                  intlLocale,
                  {
                    maximumFractionDigits: RATE_MAX_DECIMALS,
                  },
                )} ${pairRate.toCurrency} `
              : ""
          }
        />

        {!!minimumMessage && (
          <AppText typographyType="body3" color={colors.textError}>
            {minimumMessage}
          </AppText>
        )}

        {/* Summary */}
        {sendAmount > 0 && !minimumMessage && (
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <AppText typographyType="body2" color={colors.textSecondary}>
                {t("home.simulator.charge")}
              </AppText>
              <AppText typographyType="body2" color={colors.textPrimary}>
                {formatJpy(quote?.charge ?? null)}
              </AppText>
            </View>
            {isYenToYen && (
              <View style={styles.summaryRow}>
                <AppText typographyType="body2" color={colors.textSecondary}>
                  {t("home.simulator.liftingCharge")}
                </AppText>
                <AppText typographyType="body2" color={colors.textPrimary}>
                  {formatJpy(quote?.liftingFee ?? null)}
                </AppText>
              </View>
            )}
            <View style={styles.summaryRow}>
              <AppText typographyType="body1" color={colors.textSecondary}>
                {t("home.simulator.totalMoneyOut")}
              </AppText>
              <AppText
                typographyType="body1"
                weight="semibold"
                color={colors.textPrimary}
              >
                {formatJpy(quote?.totalPayment ?? null)}
              </AppText>
            </View>
          </View>
        )}
      </View>

      <AppButton
        label={t("common.send")}
        variant="gradient"
        disabled={!canSend}
        onPress={() => onSendPress(sendAmount, receiveCurrency)}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s6,
  },
  titles: {
    gap: Spacing.s3,
  },
  fieldsContainer: {
    gap: Spacing.s4,
  },
  arrow: {
    alignSelf: "center",
  },
  summary: {
    gap: Spacing.s3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
});
