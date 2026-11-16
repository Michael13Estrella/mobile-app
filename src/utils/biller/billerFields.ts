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

import { CREDIT_CARD_BILLER_CODES } from "../../constants/biller";
import { Biller } from "../../types";

// Which fields Add Biller asks for, after the biller itself
export type BillerFields = Readonly<{
  isCreditCard: boolean;
  subscriberNo: boolean;
  docRefNo: boolean;
  telNo: boolean;
}>;

/**
 * The fields a biller asks for, from its flags.
 *
 * @param biller - The picked biller; undefined when none is picked yet
 * @returns Which fields to show and validate (none without a biller)
 * @example getBillerFields(biller).telNo; // true when its telNoFlg is set
 */
export const getBillerFields = (biller: Biller | undefined): BillerFields => ({
  isCreditCard:
    !!biller?.subscriberNoFlg &&
    CREDIT_CARD_BILLER_CODES.includes(biller.utilityCode),
  subscriberNo: !!biller?.subscriberNoFlg,
  docRefNo: !!biller?.docRefNoFlg,
  telNo: !!biller?.telNoFlg,
});
