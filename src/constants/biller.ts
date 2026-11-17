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

// Billers whose subscriber number is a credit card number (Biller.utilityCode)
export const CREDIT_CARD_BILLER_CODES: readonly string[] = ["090"];

// A credit card number: its digits, shown in groups while typing
export const CREDIT_CARD_NUMBER_LENGTH = 16;
export const CREDIT_CARD_NUMBER_TEMPLATE = "xxxx xxxx xxxx xxxx";

// A biller is saved as a beneficiary. These fill the beneficiary fields a
// biller doesn't have
export const BILLER_RELATIONSHIP = "BILLS PAYMENT";
export const BILLER_ADDRESS = "Bills Payment";
// Both cityProvCode and zipPosCode
export const BILLER_AREA_CODE = "9999";

// Enrolled Billers shows a search box above this many billers
export const BILLER_SEARCH_MIN_COUNT = 10;

// Hides a card number's digits on Biller Information ("•••• •••• •••• 4821")
export const CARD_NUMBER_MASK_CHAR = "•";
