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

import {
  CARD_NUMBER_MASK_CHAR,
  CREDIT_CARD_BILLER_CODES,
  CREDIT_CARD_NUMBER_LENGTH,
  CREDIT_CARD_NUMBER_TEMPLATE,
} from "../../constants/biller";
import { ACCOUNT_NO_VISIBLE_DIGITS } from "../../constants/payout";
import { EnrolledBiller } from "../../types";
import { maskAccountNumber } from "../beneficiary/payout";
import { fillDigitsTemplate } from "../format/phone";

/**
 * Whether an enrolled biller's subscriber number is a credit card number.
 *
 * @param biller - The enrolled biller
 * @returns true for a card biller
 * @example isCreditCardEnrolledBiller({ bpUtilityCode: "090" }); // true
 */
export const isCreditCardEnrolledBiller = (
  biller: Pick<EnrolledBiller, "bpUtilityCode">,
): boolean => CREDIT_CARD_BILLER_CODES.includes(biller.bpUtilityCode);

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
  isCreditCardEnrolledBiller(biller)
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

/**
 * A card number with every group hidden but the last digits, for Biller
 * Information. A number that isn't a full card number gets the short mask.
 *
 * @param cardNo - The card number (digits only)
 * @returns e.g. "•••• •••• •••• 4821"
 * @example maskCardNumber("5412750012344821"); // "•••• •••• •••• 4821"
 */
export const maskCardNumber = (cardNo: string): string => {
  if (cardNo.length !== CREDIT_CARD_NUMBER_LENGTH) {
    return maskAccountNumber(cardNo);
  }
  const hidden = CARD_NUMBER_MASK_CHAR.repeat(
    cardNo.length - ACCOUNT_NO_VISIBLE_DIGITS,
  );
  return fillDigitsTemplate(
    CREDIT_CARD_NUMBER_TEMPLATE,
    `${hidden}${cardNo.slice(-ACCOUNT_NO_VISIBLE_DIGITS)}`,
  );
};
