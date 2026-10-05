import { StyleSheet, View, Text } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";
import CountryFlag from "react-native-country-flag";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppCard } from "./AppCard";

type ExchangeRate = Readonly<{
  fromCountry: string; // ISO 3166-1 alpha-2, for CountryFlag
  fromCurrency: string;
  fromAmount: number;
  toCountry: string;
  toCurrency: string;
  toAmount: number;
}>;

const EXCHANGE_RATES: ExchangeRate[] = [
  {
    fromCountry: "JP",
    fromCurrency: "JPY",
    fromAmount: 1,
    toCountry: "PH",
    toCurrency: "PHP",
    toAmount: 0.3985,
  },
  {
    fromCountry: "US",
    fromCurrency: "USD",
    fromAmount: 1,
    toCountry: "JP",
    toCurrency: "JPY",
    toAmount: 154.65,
  },
];

const PLACEHOLDER_VALID_UNTIL = "Sep 8, 2026 10:30 AM.";

const FLAG_SIZE = 18;
const LEFT_COLUMN_WIDTH = 72;

export function ExchangeRateCard() {
  const { colors } = useAppTheme();

  return (
    <AppCard style={styles.card}>
      <Text style={[styles.updatedText, { color: colors.textSecondary }]}>
        Exchange rate until {PLACEHOLDER_VALID_UNTIL}
      </Text>
      {EXCHANGE_RATES.map((rate) => (
        <View
          key={`${rate.fromCurrency}-${rate.toCurrency}`}
          style={styles.row}
        >
          <View style={[styles.side, styles.leftSide]}>
            <View style={styles.flagCircle}>
              <CountryFlag isoCode={rate.fromCountry} size={FLAG_SIZE} />
            </View>
            <Text style={[styles.amountText, { color: colors.textPrimary }]}>
              {rate.fromAmount} {rate.fromCurrency}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="arrow-right"
            size={16}
            color={colors.textSecondary}
          />
          <View style={styles.side}>
            <View style={styles.flagCircle}>
              <CountryFlag isoCode={rate.toCountry} size={FLAG_SIZE} />
            </View>
            <Text
              style={[styles.amountTextBold, { color: colors.textPrimary }]}
            >
              {rate.toAmount} {rate.toCurrency}
            </Text>
          </View>
        </View>
      ))}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: Spacing.s5,
    gap: Spacing.s5,
  },
  updatedText: {
    fontSize: Typography.sizes.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s7,
  },
  side: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s5,
  },
  leftSide: {
    minWidth: LEFT_COLUMN_WIDTH,
  },
  flagCircle: {
    width: FLAG_SIZE,
    height: FLAG_SIZE,
    borderRadius: FLAG_SIZE / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  amountText: {
    fontSize: Typography.sizes.md,
  },
  amountTextBold: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});
