/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

export type TextPart = Readonly<{ text: string; bold: boolean }>;

/**
 * Splits a text with **bold** parts (marked in the translations) into plain
 * and bold pieces, in order.
 *
 * @param text - The text, bold parts between double asterisks
 * @returns The pieces; empty pieces are left out
 * @example splitBoldText("Currency (**PHP, USD**) only"); // [{ text: "Currency (", bold: false }, { text: "PHP, USD", bold: true }, { text: ") only", bold: false }]
 */
export const splitBoldText = (text: string): TextPart[] =>
  text
    .split("**")
    .map((part, index) => ({ text: part, bold: index % 2 === 1 }))
    .filter((part) => part.text !== "");
