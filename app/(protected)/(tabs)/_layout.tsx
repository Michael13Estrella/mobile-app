import { Tabs } from "expo-router";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { AppTabBar } from "../../../src/components/navigation/AppTabBar";

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
      />
      <Tabs.Screen name="send-money" options={{ title: t("tabs.sendMoney") }} />
      <Tabs.Screen name="pay-bills" options={{ title: t("tabs.payBills") }} />
      <Tabs.Screen name="more" options={{ title: t("tabs.more") }} />
    </Tabs>
  );
}
