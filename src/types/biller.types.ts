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

// A biller the remitter can enroll (GET /api/reference-master/billers).
// The *Flg fields say which fields the Add Biller form asks for
export interface Biller {
  utilityCode: string;
  // Name shown in the biller list
  utilityDesc: string;
  shortCode: string;
  acctNo: string;
  acctCurrency: string;
  subscriberNameFlg: boolean;
  subscriberNoFlg: boolean;
  docRefNoFlg: boolean;
  telNoFlg: boolean;
  acctType: string;
  tranType: string;
  mosaicOutputFlg: boolean;
  branchCode: string;
}
