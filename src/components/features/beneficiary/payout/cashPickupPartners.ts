/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ImageSourcePropType } from "react-native";
import cebuanaLogo from "../../../../../assets/logos/cash-pick-up/cebuana.png";
import metrobankLogo from "../../../../../assets/logos/cash-pick-up/metrobank.png";
import mlhuillierLogo from "../../../../../assets/logos/cash-pick-up/mlhuillier.png";
import palawanLogo from "../../../../../assets/logos/cash-pick-up/palawan.png";
import perahubLogo from "../../../../../assets/logos/cash-pick-up/perahub.png";
import psbankLogo from "../../../../../assets/logos/cash-pick-up/psbank.png";
import robinsonsLogo from "../../../../../assets/logos/cash-pick-up/robinsons.png";
import villaricaLogo from "../../../../../assets/logos/cash-pick-up/villarica.png";

export type CashPickupPartner = Readonly<{
  // The brand name, read by screen readers (not translated)
  name: string;
  // PNG with @2x / @3x, shown at its @1x size
  logo: ImageSourcePropType;
}>;

// Where a cash pick-up can be claimed, in the design's order
export const CASH_PICKUP_PARTNERS: readonly CashPickupPartner[] = [
  { name: "Metrobank", logo: metrobankLogo },
  { name: "Cebuana Lhuillier", logo: cebuanaLogo },
  { name: "Palawan Pawnshop", logo: palawanLogo },
  { name: "Villarica", logo: villaricaLogo },
  { name: "M Lhuillier", logo: mlhuillierLogo },
  { name: "Robinsons Department Store", logo: robinsonsLogo },
  { name: "PSBank", logo: psbankLogo },
  { name: "PeraHub", logo: perahubLogo },
];
