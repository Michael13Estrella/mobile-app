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
  beneficiaryType: string;
  firstName: string;
  lastName: string;
  companyName: string;
  nameInitial: string;
}

export interface RecentTransaction {
  transDate: string;
  transRef: string;
  runningBalance: number;
  sourceAmount: number;
  destCurrency: string;
  destAmount: number;
  beneficiary: string;
  payoutType: string;
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
  lastLogin: string | null;
  wallet: Wallet;
}
