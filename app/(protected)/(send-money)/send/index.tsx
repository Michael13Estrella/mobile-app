/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useLocalSearchParams } from "expo-router";
import { SendMoneyForm } from "../../../../src/components/features/remittance/SendMoneyForm";

// Send Money: who to send to, how, and how much. Opened from the tab (nothing
// picked) or from a beneficiary's screen (that beneficiary picked).
export default function SendMoneyScreen() {
  const { beneficiaryGuid } = useLocalSearchParams<{
    beneficiaryGuid?: string;
  }>();

  const handleSubmit = () => {
    // TODO: open Confirm with the form's values
  };

  return (
    <SendMoneyForm
      initialBeneficiaryGuid={beneficiaryGuid}
      onSubmit={handleSubmit}
    />
  );
}
