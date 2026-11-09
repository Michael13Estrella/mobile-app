import { router, Tabs } from "expo-router";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { AppTabBar } from "../../../src/components/navigation/AppTabBar";
import { ROUTES } from "../../../src/constants/routes";
import { useAppSelector } from "../../../src/store";
import { useRef, useState } from "react";
import { AppMessageSheet } from "../../../src/components/common/AppMessageSheet";
import { AddBeneficiarySheet } from "../../../src/components/features/beneficiary/AddBeneficiarySheet";

// Tab order = the order of the screens below.
export default function TabLayout() {
  const { t } = useTranslation();

  // Saved byt the dashboard's last load (Home); null until then
  const recentBeneficiaries = useAppSelector(
    (s) => s.dashboard.recentBeneficiaries,
  );
  const [isNoBeneficiariesOpen, setIsNoBeneficiariesOpen] = useState(false);
  const [isAddBeneSheetOpen, setIsAddBeneSheetOpen] = useState(false);
  // "Add beneficiary" wad tapped: the type drawer opens once the message
  // sheet has slid out (two sheets can't be opened at once)
  const isAddPending = useRef(false);

  // Send Money needs a beneficiary. The recent list includes recently added
  // ones, so empty means none are saved. Not loaded yet: open Send Money
  // anyway (it handles an empty list itself)
  const openSendMoney = () => {
    if (recentBeneficiaries?.length === 0) {
      setIsNoBeneficiariesOpen(true);
      return;
    }
    router.push(ROUTES.SEND_MONEY);
  };

  const handleAddBeneficiary = () => {
    isAddPending.current = true;
    setIsNoBeneficiariesOpen(false);
  };

  const handleNoBeneficiariesClosed = () => {
    if (!isAddPending.current) return;
    isAddPending.current = false;
    setIsAddBeneSheetOpen(true);
  };

  return (
    <>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <AppTabBar {...props} />}
      >
        <Tabs.Screen name="home" options={{ title: t("tabs.home") }} />
        <Tabs.Screen
          name="beneficiaries"
          options={{ title: t("tabs.beneficiaries") }}
          // Opens Manage Beneficiaries as a full screen (no tab bar, with a
          // back arrow) instead of switching to this empty tab.
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push(ROUTES.MANAGE_BENEFICIARIES);
            },
          }}
        />
        <Tabs.Screen
          name="send-money"
          options={{ title: t("tabs.sendMoney") }}
          // Opens Send Money as a full screen (no tab bar, with a back arrow)
          // instead of switching to this empty tab.
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              openSendMoney();
            },
          }}
        />
        <Tabs.Screen name="pay-bills" options={{ title: t("tabs.payBills") }} />
        <Tabs.Screen name="more" options={{ title: t("tabs.more") }} />
      </Tabs>

      {/* Send Money without beneficiaries: add one first */}
      <AppMessageSheet
        visible={isNoBeneficiariesOpen}
        icon="user01Line"
        title={t("sendMoney.noBeneficiaries.title")}
        message={t("sendMoney.noBeneficiaries.message")}
        actionLabel={t("sendMoney.noBeneficiaries.add")}
        onAction={handleAddBeneficiary}
        onClose={() => setIsNoBeneficiariesOpen(false)}
        onClosed={handleNoBeneficiariesClosed}
      />

      {/* The beneficiary type, the the Add Beneficiary form */}
      <AddBeneficiarySheet
        visible={isAddBeneSheetOpen}
        onSelect={(category) => {
          setIsAddBeneSheetOpen(false);
          router.push(ROUTES.ADD_BENEFICIARY(category));
        }}
        onClose={() => setIsAddBeneSheetOpen(false)}
      />
    </>
  );
}
