/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// GET /api/remitters/{remitterGuid}/dashboard-stats
// Dates are ISO 8601 strings; amounts are numbers
import { Remitter } from "./remitter.types";

export interface RecentBeneficiary {
  beneficiaryGuid: string;
  beneficiaryType: string;
  firstName: string;
  lastName: string;
  companyName: string;
  nameInitial: string;
}

export interface RecentTransaction {
  id: number;
  transDate: string;
  transRef: string;
  runningBalance: number;
  sourceAmount: number;
  destCurrency: string;
  destAmount: number;
  beneFirstName: string;
  beneMiddleName: string;
  beneLastName: string;
  beneAlias: string;
  beneCompanyName: string;
  // I: Individual | C: Corporate
  beneficiaryType: string;
  // CA: Credit Metrobank Account | CP: Cash Pick-up | OB: Other Banks | BP: Bill Payment
  payoutType: string;
  // 0: Debit (e.g. remittance)
  // 1: Credit (e.g. add wallet)
  // 2: Refund (e.g. remittance reversal such as closed account)
  transPostType: number;
}

export interface Wallet {
  remitterGuid: string;
  currency: string;
  currentBalance: number;
}

export interface DashboardStatsResponse {
  remitter: Remitter;
  recentBeneficiaries: RecentBeneficiary[];
  recentTransactions: RecentTransaction[];
  wallet: Wallet;
  lastLogin: string | null;
  hasMetrobankYenAccount: boolean;
}
