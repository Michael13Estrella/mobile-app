/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Pressable, StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { ExchangeRate } from "../../../types/exchangeRate.types";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { useState } from "react";
import { resolveShadows } from "../../../theme/shadows";
import { INTL_LOCALE } from "../../../constants/locale";
import { formatAmount } from "../../../utils/formatCurrency";
import { convertAmount } from "../../../utils/exchangeRate";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../../common/AppText";
import { BrandCountryFlag, BrandIcon } from "../../icons";
import {
  CURRENCY_COUNTRY,
  WALLET_ESTIMATE_CURRENCIES,
} from "../../../constants/currency";
import { AppButton } from "../../common/AppButton";
import CardPattern from "../../../../assets/images/pattern/wallet-card-pattern.svg";

const CARD_RADIUS = Spacing.s6;
const CARD_TOP_BORDER_WIDTH = 3;
const ARROW_SIZE = 16;
const EYE_SIZE = 20;
const FLAG_SIZE = 16;
const ADD_BUTTON_HEIGHT = 42;

const GRADIENT_LOCATIONS = [0, 0.456] as const;
const GRADIENT_START = { x: 0.44, y: -0.1 };
const GRADIENT_END = { x: 0.56, y: 1.1 };

// Decorative shapes, placed as in the 312-wide Figma card
const PATTERN_TOP = 20.65;
const PATTERN_LEFT = 37.58;
const PATTERN_OPACITY = 0.5;

const HIDDEN_AMOUNT = "***,***.**";
const MISSING_AMOUNT = "-";

function CurrencyFlag({ currency }: Readonly<{ currency: string }>) {
  return (
    <BrandCountryFlag
      code={CURRENCY_COUNTRY[currency] ?? ""}
      size={FLAG_SIZE}
      shape="rounded"
    />
  );
}

type WalletCardProps = Readonly<{
  balance: number | null;
  currency: string;
  rates: readonly ExchangeRate[];
  onDetailsPress: () => void;
  onAddToWalletPress: () => void;
}>;

export function WalletCard({
  balance,
  currency,
  rates,
  onDetailsPress,
  onAddToWalletPress,
}: WalletCardProps) {
  const { colors } = useAppTheme();
  const { t, locale } = useTranslation();
  const [isHidden, setIsHidden] = useState(false);
  const shadows = resolveShadows(colors);
  const intlLocale = INTL_LOCALE[locale];

  const showAmount = (amount: number | null) => {
    if (isHidden) return HIDDEN_AMOUNT;
    return amount === null ? MISSING_AMOUNT : formatAmount(amount, intlLocale);
  };

  const estimate = (to: string) =>
    balance === null ? null : convertAmount(balance, currency, to, rates);

  return (
    <View style={[styles.shadow, { boxShadow: shadows.tinted02Bottom }]}>
      {/* Bright edge color behind the card; the card sits
          CARD_TOP_BORDER_WIDTH lower, leaving a crescent along the top. */}
      <View style={[styles.edge, { backgroundColor: colors.walletCardBorder }]}>
        <LinearGradient
          colors={[
            colors.walletCardGradientStart,
            colors.walletCardGradientEnd,
          ]}
          locations={GRADIENT_LOCATIONS}
          start={GRADIENT_START}
          end={GRADIENT_END}
          style={styles.card}
        >
          {/* Background layers: decorative shapes, then a darkening overlay */}
          <View pointerEvents="none" style={styles.pattern}>
            <CardPattern
              width="100%"
              height="100%"
              // Fill the area to the card's corner, scaling with the card.
              preserveAspectRatio="xMinYMin slice"
              color={colors.walletCardPattern}
              opacity={PATTERN_OPACITY}
            />
          </View>
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.walletCardOverlay },
            ]}
          />
          <View style={styles.content}>
            <View style={styles.balanceBlock}>
              <View style={styles.labelRow}>
                <AppText
                  typographyType="overline2"
                  weight="bold"
                  color={colors.textOnBrandSecondary}
                  style={styles.label}
                >
                  {"Wallet Balance"}
                </AppText>
                <Pressable
                  onPress={onDetailsPress}
                  hitSlop={Spacing.s3}
                  accessibilityRole="button"
                  accessibilityLabel={t("home.wallet.details")}
                >
                  <BrandIcon
                    name="arrowNarrowRightLine"
                    size={ARROW_SIZE}
                    color={colors.textOnBrand}
                  />
                </Pressable>
              </View>

              {/* Balance row */}
              <View style={styles.amountRow}>
                <View style={styles.amountGroup}>
                  <AppText
                    typographyType="body2"
                    color={colors.textOnBrandSecondary}
                  >
                    {currency}
                  </AppText>
                  <AppText
                    typographyType="display"
                    weight="semibold"
                    color={colors.textOnBrand}
                    numberOfLines={1}
                    adjustsFontSizeToFit // large balances shrink instead of wrapping
                    style={styles.amount}
                  >
                    {showAmount(balance)}
                  </AppText>
                </View>
                <Pressable
                  onPress={() => setIsHidden((hidden) => !hidden)}
                  hitSlop={Spacing.s3}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isHidden
                      ? t("home.wallet.showBalance")
                      : t("home.wallet.hideBalance")
                  }
                >
                  <BrandIcon
                    name={isHidden ? "eyeOffLine" : "eyeLine"}
                    size={EYE_SIZE}
                    color={colors.textOnBrand}
                  />
                </Pressable>
              </View>
            </View>

            {/* Estimates */}
            <View style={styles.estimateContainer}>
              <View style={styles.estimates}>
                {WALLET_ESTIMATE_CURRENCIES.map((currency) => (
                  <View key={currency} style={styles.estimateRow}>
                    <CurrencyFlag currency={currency} />
                    <AppText
                      typographyType="title2"
                      color={colors.textOnBrandSecondary}
                    >{`${currency} ${showAmount(estimate(currency))}`}</AppText>
                    {!isHidden && (
                      <AppText
                        typographyType="title2"
                        color={colors.textTertiary}
                        italic
                      >
                        {t("home.wallet.estimate")}
                      </AppText>
                    )}
                  </View>
                ))}
              </View>
              {!isHidden && (
                <View>
                  <AppText typographyType="title4" color={colors.textTertiary}>
                    {t("home.wallet.disclaimer")}
                  </AppText>
                </View>
              )}
            </View>
          </View>

          <AppButton
            label={t("home.wallet.addToWallet")}
            variant="glass"
            icon="plusLine"
            onPress={onAddToWalletPress}
          />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: CARD_RADIUS,
  },
  card: {
    borderRadius: CARD_RADIUS,
    padding: Spacing.s6,
    gap: Spacing.s4,
    overflow: "hidden",
  },
  // The bright crescent along the top: this layer shows above the card,
  // which sits CARD_TOP_BORDER_WIDTH lower with the same rounded corners.
  edge: {
    borderRadius: CARD_RADIUS,
    paddingTop: CARD_TOP_BORDER_WIDTH,
    overflow: "hidden",
  },
  // From Figma's offset to the card's bottom-right corner (the exported SVG
  // is exactly that area: 275 × 188 on the 312 × 208 card).
  pattern: {
    position: "absolute",
    top: PATTERN_TOP,
    left: PATTERN_LEFT,
    right: Spacing.s0,
    bottom: Spacing.s0,
  },
  content: {
    gap: Spacing.s7,
  },
  balanceBlock: {
    gap: Spacing.s2,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Uppercase by style, so the translations stay normal text
  label: {
    textTransform: "uppercase",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s4,
  },
  amountGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s2,
    flexShrink: 1,
  },
  amount: {
    flexShrink: 1,
  },
  estimateContainer: {
    gap: Spacing.s3,
  },
  estimates: {
    gap: Spacing.s2,
  },
  estimateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
  },
  addButton: {
    height: ADD_BUTTON_HEIGHT,
  },
});
