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

import { StyleSheet, View } from "react-native";
import { INTL_LOCALE, LIST_DATE_LOCALE } from "../../../constants/locale";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { RecentTransaction } from "../../../types";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";
import { formatShortDateTime } from "../../../utils/formatDate";
import { formatAmount } from "../../../utils/formatCurrency";
import { AppTextButton } from "../../common/AppTextButton";

// Sign shown before money leaving the wallet.
// TODO: decide per transaction once the API says which ones add money.
const DEBIT_SIGN = "-";
const BORDER_BOTTOM_WIDTH = 1;

type TFunction = (key: string, options?: Record<string, unknown>) => string;

// TODO: pick the title by transaction type ("Send Money to ..." vs "Bills Payment ...") once the API's type values are known
const transactionTitle = (transaction: RecentTransaction, t: TFunction) =>
  t("home.transactions.sendMoneyTo", { name: transaction.beneficiary });

type TransactionRowProps = Readonly<{
  transaction: RecentTransaction;
  // Currency of sourceAmount (the wallet's), e.g. "JPY"
  walletCurrency: string;
}>;

function TransactionRow({ transaction, walletCurrency }: TransactionRowProps) {
  const { colors } = useAppTheme();
  const { t, locale } = useTranslation();
  const intlLocale = INTL_LOCALE[locale];

  // The received amount only when it's in another currency.
  const showDestination =
    transaction.destCurrency !== walletCurrency && transaction.destAmount > 0;

  return (
    <View style={[styles.row, { borderColor: colors.borderSubtle }]}>
      <View style={styles.details}>
        <AppText typographyType="body3" color={colors.textPrimary}>
          {transactionTitle(transaction, t)}
        </AppText>
        <AppText typographyType="body4" color={colors.textTertiary}>
          {formatShortDateTime(transaction.transDate, LIST_DATE_LOCALE[locale])}
        </AppText>
      </View>

      <View style={styles.amounts}>
        <View style={styles.amountRow}>
          <AppText typographyType="body3" color={colors.textSecondary}>
            {`${DEBIT_SIGN} ${walletCurrency}`}
          </AppText>
          <AppText typographyType="body1" color={colors.textPrimary}>
            {formatAmount(transaction.sourceAmount, intlLocale)}
          </AppText>
        </View>
        {showDestination && (
          <AppText typographyType="body4" color={colors.textTertiary}>
            {`${transaction.destCurrency} ${formatAmount(transaction.destAmount, intlLocale)}`}
          </AppText>
        )}
      </View>
    </View>
  );
}

type RecentTransactionsProps = Readonly<{
  // null while the dashboard is loading
  transactions: readonly RecentTransaction[] | null;
  walletCurrency: string;
  onViewAllPress: () => void;
}>;

export function RecentTransactions({
  transactions,
  walletCurrency,
  onViewAllPress,
}: RecentTransactionsProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  // Nothing to show until the dashboard has loaded.
  if (!transactions) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText typographyType="h4" color={colors.textPrimary}>
          {t("home.transactions.title")}
        </AppText>
        {transactions.length > 0 && (
          <View>
            <AppTextButton
              label={t("common.viewAll")}
              size="button3"
              align="right"
              onPress={onViewAllPress}
            />
          </View>
        )}
      </View>

      {transactions.length === 0 ? (
        <AppText typographyType="body2">{t("home.transactions.empty")}</AppText>
      ) : (
        <View>
          {transactions.map((transaction) => (
            <View key={transaction.transRef}>
              <TransactionRow
                transaction={transaction}
                walletCurrency={walletCurrency}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.s4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: BORDER_BOTTOM_WIDTH,
    paddingTop: Spacing.s4,
    paddingBottom: Spacing.s5,
  },
  itemContainer: {
    paddingTop: Spacing.s4,
    paddingBottom: Spacing.s5,
  },
  // Title + date take the free width; long titles wrap.
  details: {
    flex: 1,
    gap: Spacing.s2,
  },
  amounts: {
    alignItems: "flex-end",
    gap: Spacing.s1,
  },
  // "- JPY" and the amount share one baseline despite different sizes.
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.s2,
  },
});
