/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router, Stack } from "expo-router";
import { ROUTES } from "../../../../src/constants/routes";
import { useAppDispatch, useAppSelector } from "../../../../src/store";
import { useEffect, useState } from "react";
import { clearAddBiller } from "../../../../src/store/slices/addBillerSlice";
import { BackHandler } from "react-native";
import { BillerSubmitted } from "../../../../src/components/features/biller/BillerSubmitted";

// Leaves the finished flow for the Pay Bills tab
const goToPayBills = () => router.dismissTo(ROUTES.PAY_BILLS);

// Add Biller, after a successful save: the biller is now being reviewed;
// there's no going back to the form
export default function BillerSubmittedScreen() {
  const dispatch = useAppDispatch();
  const stored = useAppSelector((s) => s.addBiller.submitted);
  // Read once: clearing it on leaving must not blank the page while it animates away
  const [submitted] = useState(stored);

  // Forgotten however the screen is left
  useEffect(() => {
    return () => {
      dispatch(clearAddBiller());
    };
  }, [dispatch]);

  // Android back: the biller is already saved, so it leaves the flow
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        goToPayBills();
        return true;
      },
    );
    return () => subscription.remove();
  }, []);

  // A fresh start: the tabs with a new form on top
  const addAnother = () => {
    router.dismissTo(ROUTES.HOME);
    router.push(ROUTES.ADD_BILLER);
  };

  // Only reachable through a successful Save, which sets it
  if (!submitted) return null;

  return (
    <>
      {/* No swipe back to the form */}
      <Stack.Screen options={{ gestureEnabled: false }} />

      <BillerSubmitted
        submitted={submitted}
        onAddAnother={addAnother}
        onGoToPayBills={goToPayBills}
      />
    </>
  );
}
