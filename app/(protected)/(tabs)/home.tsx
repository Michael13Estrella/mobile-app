/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-08
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { AppScreen } from "../../../src/components/common/AppScreen";
import { useDashboard } from "../../../src/hooks/useDashboard";
import { HomeHeader } from "../../../src/components/features/home/HomeHeader";
import { useRemitterDisplayName } from "../../../src/hooks/useRemitterDisplayName";
import { WalletCard } from "../../../src/components/features/home/WalletCard";
import { useExchangeRates } from "../../../src/hooks/useExchangeRates";
import { WALLET_CURRENCY } from "../../../src/constants/currency";
import { ExchangeRateCard } from "../../../src/components/common/ExchangeRateCard";
import { RecentBeneficiaries } from "../../../src/components/features/home/RecentBeneficiaries";
import { Spacing } from "../../../src/constants/spacing";
export default function HomeScreen() {
  const { data, refresh } = useDashboard();
  const { rates, refresh: refreshRates } = useExchangeRates();
  const displayName = useRemitterDisplayName();

  // Pull-to-refresh both the dashboard and the rates.
  const handleRefresh = () => Promise.all([refresh(), refreshRates()]);

  return (
    <AppScreen gradient contentGap={Spacing.s5} onRefresh={handleRefresh}>
      {/* Header: nickname and last login */}
      <HomeHeader
        displayName={displayName}
        lastLogin={data?.lastLogin ?? null}
        unreadCount={0}
      />

      {/* Wallet card */}
      <WalletCard
        balance={data?.wallet.currentBalance ?? null}
        currency={data?.wallet.currency ?? WALLET_CURRENCY}
        rates={rates}
        onDetailsPress={() => {}} // Todo
        onAddToWalletPress={() => {}} // Todo
      />

      {/* Recent beneficiaries */}
      <RecentBeneficiaries
        beneficiaries={data?.recentBeneficiaries ?? null}
        onAddPress={() => {}} // Todo
        onBeneficiaryPress={() => {}} // Todo
        onViewAllPress={() => {}}
      />

      {/* Exchange rate card */}
      <ExchangeRateCard />
    </AppScreen>
  );
}
