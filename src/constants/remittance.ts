/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReceiveCurrency } from "./currency";

// Yen-to-yen (JPY -> JPY) lifting fee: 0.75% of the amount after the
// remittance charge, at least JPY_MINIMUM_LIFTING_FEE yen
export const JPY_LIFTING_RATE = 1.0075;
export const JPY_MINIMUM_LIFTING_FEE = 1000;

// Minimum per transfer: `send` in JPY, `receive` in the receiving currency
export const REMITTANCE_MINIMUMS: Readonly<
  Record<ReceiveCurrency, Readonly<{ send: number; receive: number }>>
> = {
  PHP: { send: 1000, receive: 300 },
  USD: { send: 2500, receive: 10 },
  JPY: { send: 3000, receive: 1250 },
};
