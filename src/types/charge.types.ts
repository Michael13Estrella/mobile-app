/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// GET /api/reference-master/charges: service charge tiers by send amount.
// Amounts are in JPY
export interface ChargeTier {
  amountFrom: number;
  amountTo: number;
  charge: number;
  points: number;
}
