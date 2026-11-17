/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { CREDIT_CARD_BILLER_CODES } from "../../constants/biller";
import { EnrolledBiller } from "../../types";
import { maskAccountNumber } from "../beneficiary/payout";

/**
 * An enrolled biller's number for lists: a card biller's card number with
 * only its last digits, otherwise the subscriber number as saved.
 *
 * @param biller - The enrolled biller
 * @returns The number to show
 * @example getEnrolledBillerNumber({ bpUtilityCode: "090", bpSubscriberNo: "5412750012344821", … }); // "•••• 4821"
 */
export const getEnrolledBillerNumber = (
  biller: Pick<EnrolledBiller, "bpUtilityCode" | "bpSubscriberNo">,
): string =>
  CREDIT_CARD_BILLER_CODES.includes(biller.bpUtilityCode)
    ? maskAccountNumber(biller.bpSubscriberNo)
    : biller.bpSubscriberNo;

/**
 * Whether an enrolled biller matches the search: its name or alias
 * (ignoring case). A card number isn't searched, since it isn't shown.
 *
 * @param biller - The enrolled biller
 * @param query - What was typed; empty matches every biller
 * @returns true when it matches
 * @example matchesEnrolledBillerSearch(biller, "cable");
 */
export const matchesEnrolledBillerSearch = (
  biller: Pick<EnrolledBiller, "bpSubscriberName" | "beneAlias">,
  query: string,
): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [biller.bpSubscriberName, biller.beneAlias].some((field) =>
    field.toLowerCase().includes(normalized),
  );
};
