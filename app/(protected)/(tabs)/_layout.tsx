import { router, Tabs } from "expo-router";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { AppTabBar } from "../../../src/components/navigation/AppTabBar";
import { ROUTES } from "../../../src/constants/routes";

// Tab order = the order of the screens below.
export default function TabLayout() {
  const { t } = useTranslation();

  return (
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
      <Tabs.Screen name="send-money" options={{ title: t("tabs.sendMoney") }} />
      <Tabs.Screen name="pay-bills" options={{ title: t("tabs.payBills") }} />
      <Tabs.Screen name="more" options={{ title: t("tabs.more") }} />
    </Tabs>
  );
}
