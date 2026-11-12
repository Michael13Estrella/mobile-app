/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-12
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { WALLET_CURRENCY } from "../../constants/currency";
import {
  DESTINATION_COUNTRY,
  NO_LIFTING_FEE,
  NO_RATE,
  NOT_ASKED_TEXT,
  ORIGINATING_COUNTRY,
  PURPOSE_OTHERS_CODE,
  SOURCE_FUND_OTHERS_CODE,
} from "../../constants/remittance";
import { CompanyDetailsFormValues } from "../../schemas/remittance/companyDetailsSchema";
import { SendMoneyFormValues } from "../../schemas/remittance/sendMoneySchema";
import { SendMoneyConfirmation } from "../../store/slices/sendMoneySlice";
import { BeneficiaryPayout, SendMoneyRequest } from "../../types";
import { getPayoutCurrency } from "../beneficiary/payout";
import { parseAmountInput } from "./amountInput";

export type SendMoneyRequestInput = Readonly<{
  form: SendMoneyFormValues;
  payout: BeneficiaryPayout;
  // Only for remittances that needed them
  companyDetails: CompanyDetailsFormValues | null;
  // What Review showed when the remitter confirmed
  confirmation: SendMoneyConfirmation;
  // From the verification: its challenge, and who was verified (the email
  // for the OTP, the device id for biometrics)
  challenge: string;
  subject: string;
}>;

/**
 * The send-money body: the form, the confirmed amounts and rate, and the
 * verification. Values that don't apply get their "not applicable" value
 * (no rate for JPY -> JPY, no lifting fee otherwise, empty texts).
 *
 * @param input - The draft, the confirmation and the verification
 * @returns The request body
 * @example buildSendMoneyRequest({ form, payout, companyDetails: null, confirmation, challenge, subject: email });
 */
export const buildSendMoneyRequest = ({
  form,
  payout,
  companyDetails,
  confirmation,
  challenge,
  subject,
}: SendMoneyRequestInput): SendMoneyRequest => {
  const { quote, rate, correlationId } = confirmation;

  return {
    correlationId,
    challenge,
    subject,
    originatingCountry: ORIGINATING_COUNTRY,
    destinationCountry: DESTINATION_COUNTRY,
    sourceCurrency: WALLET_CURRENCY,
    remittanceAmount: parseAmountInput(form.amount),
    remittanceCharge: quote.charge,
    liftingFee: quote.liftingFee ?? NO_LIFTING_FEE,
    totalPayment: quote.totalPayment,
    destCurrency: getPayoutCurrency(payout),
    destAmount: quote.receiveAmount,
    // As the API send it: JPY -> PHP 0.xxxx, USD -> JPY xxx.xx
    rate: rate?.rate ?? NO_RATE,
    remitterCompanyAddress: companyDetails?.companyAddress ?? NOT_ASKED_TEXT,
    remitterCompanyTelNo: companyDetails?.companyTelNo ?? NOT_ASKED_TEXT,
    beneficiaryGuid: form.beneficiaryGuid,
    payoutId: form.payoutId,
    sourceFundCode: form.sourceFundCode,
    sourceFundOthers:
      form.sourceFundCode === SOURCE_FUND_OTHERS_CODE
        ? form.sourceFundOthers
        : NOT_ASKED_TEXT,
    purposeCode: form.purposeCode,
    purposeOthers:
      form.purposeCode === PURPOSE_OTHERS_CODE
        ? form.purposeOthers
        : NOT_ASKED_TEXT,
  };
};
