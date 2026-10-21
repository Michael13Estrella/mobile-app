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
import { RecentTransactions } from "../../../src/components/features/home/RecentTransactions";
import { RemittanceSimulator } from "../../../src/components/features/home/RemitanceSimulator";
import { useCharges } from "../../../src/hooks/useCharges";
import { OffersCarousel } from "../../../src/components/features/home/OffersCarousel";
import { SAMPLE_OFFERS } from "../../../__mocks__/offers";
import { useState } from "react";
import { router } from "expo-router";
import { ROUTES } from "../../../src/constants/routes";
export default function HomeScreen() {
  const { data, refresh } = useDashboard();
  const { rates, refresh: refreshRates } = useExchangeRates();
  const { charges, refresh: refreshCharges } = useCharges();
  const displayName = useRemitterDisplayName();

  // Changing the simulator's key on refresh remounts it: both fields
  // start empty again
  const [simulatorKey, setSimulatorKey] = useState(0);

  // Pull-to-refresh both the dashboard and the rates.
  const handleRefresh = () => {
    setSimulatorKey((key) => key + 1);
    return Promise.all([refresh(), refreshRates(), refreshCharges()]);
  };

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
        onViewAllPress={() => router.push(ROUTES.MANAGE_BENEFICIARIES)}
      />

      {/* Exchange rate card */}
      <ExchangeRateCard />

      <RemittanceSimulator
        key={simulatorKey}
        rates={rates}
        chargeTiers={charges}
        allowJpy={!!data?.hasMetrobankYenAccount}
        onSendPress={() => {}}
      />

      {/* Recent transactions */}
      <RecentTransactions
        transactions={data?.recentTransactions ?? null}
        walletCurrency={data?.wallet.currency ?? WALLET_CURRENCY}
        onViewAllPress={() => {}}
      />

      {/* Offers */}
      <OffersCarousel offers={SAMPLE_OFFERS} />
    </AppScreen>
  );
}
