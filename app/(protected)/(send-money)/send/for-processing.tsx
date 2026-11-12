/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-12
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../src/store";
import { router, Stack } from "expo-router";
import { ROUTES } from "../../../../src/constants/routes";
import { clearSendMoney } from "../../../../src/store/slices/sendMoneySlice";
import { BackHandler } from "react-native";
import { SendMoneyForProcessing } from "../../../../src/components/features/remittance/SendMoneyForProcessing";

// Send Money's "Transaction Details", after a successful send. The
// remittance is sent: there's no going back to the flow
export default function SendMoneyForProcessingScreen() {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.sendMoney);
  // Read once: clearing the draft on leaving must not blank the page while
  // it animates away
  const [sent] = useState(draft);

  // Leaves the finished flow, and forgets it
  const goToDashboard = useCallback(() => {
    router.dismissTo(ROUTES.HOME);
    dispatch(clearSendMoney());
  }, [dispatch]);

  // Android back: the remittance is already sent, so it leaves the flow
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        goToDashboard();
        return true;
      },
    );
    return () => subscription.remove();
  }, [goToDashboard]);

  const { form, beneficiary, payout, companyDetails, confirmation, sentAt } =
    sent;
  // Only reachable through a successful send, which sets all of them
  if (!form || !beneficiary || !payout || !confirmation || !sentAt) {
    return null;
  }

  return (
    <>
      {/* No swipe back to the flow (the header has no back arrow either) */}
      <Stack.Screen options={{ gestureEnabled: false }} />

      <SendMoneyForProcessing
        form={form}
        beneficiary={beneficiary}
        payout={payout}
        companyDetails={companyDetails}
        confirmation={confirmation}
        sentAt={sentAt}
        onDone={goToDashboard}
      />
    </>
  );
}
