/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-11
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// POST /api/remittances/{remitterGuid}/send-money
export interface SendMoneyRequest {
  // A new GUID for each send
  correlationId: string;
  // From the verification (email OTP or biometrics)
  challenge: string;
  // Who was verified: the email (OTP) or the device id (biometrics)
  subject: string;
  originatingCountry: string;
  destinationCountry: string;
  // The wallet's currency (JPY)
  sourceCurrency: string;
  // The typed amount (net)
  remittanceAmount: number;
  remittanceCharge: number;
  // JPY -> JPY only
  liftingFee: number;
  totalPayment: number;
  destCurrency: string;
  destAmount: number;
  rate: number;
  remitterCompanyAddress: string;
  remitterCompanyTelNo: string;
  beneficiaryGuid: string;
  payoutId: number;
  sourceFundCode: string;
  sourceFundOthers: string;
  purposeCode: string;
  purposeOthers: string;
}
