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

import { ComingSoonScreen } from "../../../src/components/screens/ComingSoonScreen";
import { useTranslation } from "../../../src/hooks/useTranslation";

export default function SendMoneyScreen() {
  const { t } = useTranslation();
  return <ComingSoonScreen title={t("tabs.sendMoney")} />;
}
