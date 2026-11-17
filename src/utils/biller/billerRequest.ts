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

import {
  BENEFICIARY_TYPE,
  MY_ACCOUNT_FLAG,
  RELATIONSHIP_OTHERS_CODE,
} from "../../constants/beneficiary";
import {
  BILLER_ADDRESS,
  BILLER_AREA_CODE,
  BILLER_RELATIONSHIP,
} from "../../constants/biller";
import { PAYOUT_TYPE } from "../../constants/payout";
import { PHONE_COUNTRIES } from "../../constants/phone";
import { NOT_ASKED_TEXT } from "../../constants/remittance";
import { AddBillerFormValues } from "../../schemas/biller/addBillerSchema";
import { AddBillerRequest, Biller } from "../../types";
import { toInternationalPhoneNumber } from "../format/phone";
import { getBillerFields } from "./billerFields";

/**
 * The Create Beneficiary body for a new biller: the biller as a beneficiary
 * (its name and the agreed fixed values) with a bills payment payout.
 * Fields the biller doesn't ask for are sent as "".
 *
 * @param values - The Add Biller form's values
 * @param biller - The picked biller
 * @returns The request body
 * @example const request = buildAddBillerRequest(values, biller);
 */
export const buildAddBillerRequest = (
  values: AddBillerFormValues,
  biller: Biller,
): AddBillerRequest => {
  const fields = getBillerFields(biller);

  return {
    beneficiary: {
      beneficiaryType: BENEFICIARY_TYPE.BILLER,
      companyName: biller.utilityDesc,
      officeTelNo: NOT_ASKED_TEXT,
      relationToBeneCode: RELATIONSHIP_OTHERS_CODE,
      relationToBeneOthers: BILLER_RELATIONSHIP,
      address1: BILLER_ADDRESS,
      cityProvCode: BILLER_AREA_CODE,
      zipPosCode: BILLER_AREA_CODE,
      myAccountFlg: MY_ACCOUNT_FLAG.NO,
    },
    payout: {
      payoutType: PAYOUT_TYPE.BILLS_PAYMENT,
      currency: biller.acctCurrency,
      bpUtilityCode: biller.utilityCode,
      bpSubscriberName: biller.utilityDesc,
      bpSubscriberNo: fields.subscriberNo
        ? values.subscriberNo.trim()
        : NOT_ASKED_TEXT,
      bpDocuRefNo: fields.docRefNo ? values.docRefNo.trim() : NOT_ASKED_TEXT,
      bpTelNo: fields.telNo
        ? toInternationalPhoneNumber(
            PHONE_COUNTRIES[values.telCountry],
            values.telNo,
          )
        : NOT_ASKED_TEXT,
    },
  };
};
