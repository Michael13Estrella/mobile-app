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

import { StyleSheet } from "react-native";
import { ComingSoonScreen } from "../../../src/components/screens/ComingSoonScreen";
import { useEffect } from "react";
import { remitterService } from "../../../src/services/remitter/remitterService";
import { useDashboard } from "../../../src/hooks/useDashboard";

export default function HomeScreen() {
  const { data, isLoading, hasError } = useDashboard();

  useEffect(() => {
    void remitterService.fetchDashboardStats().then((data) => {
      if (__DEV__)
        console.log("dashboardStats:", { isLoading, hasError, loaded: !!data });
    });

    console.log("test");
  }, []);

  return <ComingSoonScreen title={"Home"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
