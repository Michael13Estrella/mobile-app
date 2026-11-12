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

import {
  buildSendMoneyRequest,
  SendMoneyRequestInput,
} from "../sendMoneyRequest";
import { PAYOUT_TYPE } from "../../../constants/payout";
import { BeneficiaryPayout, ExchangeRate } from "../../../types";

const PHP_RATE = {
  fromCurrency: "JPY",
  toCurrency: "PHP",
  rate: 0.385,
} as ExchangeRate;
const USD_RATE = {
  fromCurrency: "USD",
  toCurrency: "JPY",
  rate: 154.65,
} as ExchangeRate;

const payout = (
  overrides: Partial<BeneficiaryPayout> = {},
): BeneficiaryPayout => ({
  payoutId: 7,
  beneficiaryGuid: "bene-1",
  payoutType: PAYOUT_TYPE.METROBANK_ACCOUNT,
  accountName: "MAX DELA CRUZ",
  accountNo: "1234567890123",
  currency: "PHP",
  bankCode: "MBTC",
  bankName: "METROBANK",
  ...overrides,
});

// JPY 50,000 to a PHP account, without "Others" or company details
const INPUT: SendMoneyRequestInput = {
  form: {
    beneficiaryGuid: "bene-1",
    payoutId: 7,
    sourceFundCode: "01",
    sourceFundOthers: "",
    purposeCode: "02",
    purposeOthers: "",
    amount: "50000",
  },
  payout: payout(),
  companyDetails: null,
  confirmation: {
    quote: {
      charge: 1_390,
      totalPayment: 51_390,
      liftingFee: null,
      receiveAmount: 19_250,
    },
    rate: PHP_RATE,
    correlationId: "corr-1",
  },
  challenge: "challenge-1",
  subject: "remitter@example.com",
};

describe("buildSendMoneyRequest", () => {
  it("builds the body from the draft, the confirmation and the verification", () => {
    expect(buildSendMoneyRequest(INPUT)).toEqual({
      correlationId: "corr-1",
      challenge: "challenge-1",
      subject: "remitter@example.com",
      originatingCountry: "JP",
      destinationCountry: "PH",
      sourceCurrency: "JPY",
      remittanceAmount: 50_000,
      remittanceCharge: 1_390,
      liftingFee: 0,
      totalPayment: 51_390,
      destCurrency: "PHP",
      destAmount: 19_250,
      rate: 0.385,
      remitterCompanyAddress: "",
      remitterCompanyTelNo: "",
      beneficiaryGuid: "bene-1",
      payoutId: 7,
      sourceFundCode: "01",
      sourceFundOthers: "",
      purposeCode: "02",
      purposeOthers: "",
    });
  });

  it("sends the USD rate as the API has it (JPY per USD)", () => {
    const request = buildSendMoneyRequest({
      ...INPUT,
      payout: payout({ currency: "USD" }),
      confirmation: { ...INPUT.confirmation, rate: USD_RATE },
    });
    expect(request.destCurrency).toBe("USD");
    expect(request.rate).toBe(154.65);
  });

  it("sends no rate and the lifting fee for JPY -> JPY", () => {
    const request = buildSendMoneyRequest({
      ...INPUT,
      payout: payout({ currency: "JPY" }),
      confirmation: {
        ...INPUT.confirmation,
        quote: {
          charge: 380,
          totalPayment: 10_000,
          liftingFee: 1_000,
          receiveAmount: 8_620,
        },
        rate: null,
      },
    });
    expect(request.rate).toBe(0);
    expect(request.liftingFee).toBe(1_000);
    expect(request.destinationCountry).toBe("PH");
  });

  it("sends a cash pick-up in PHP", () => {
    const request = buildSendMoneyRequest({
      ...INPUT,
      payout: payout({ payoutType: PAYOUT_TYPE.CASH_PICKUP, currency: "" }),
    });
    expect(request.destCurrency).toBe("PHP");
  });

  it("sends the company details when they were asked for", () => {
    const request = buildSendMoneyRequest({
      ...INPUT,
      companyDetails: {
        companyAddress: "1-2-3 MARUNOUCHI",
        companyTelNo: "0212345678",
      },
    });
    expect(request.remitterCompanyAddress).toBe("1-2-3 MARUNOUCHI");
    expect(request.remitterCompanyTelNo).toBe("0212345678");
  });

  it("sends the Others texts only with Others picked", () => {
    const withOthers = buildSendMoneyRequest({
      ...INPUT,
      form: {
        ...INPUT.form,
        sourceFundCode: "99",
        sourceFundOthers: "LOTTERY",
        purposeCode: "99",
        purposeOthers: "BIRTHDAY GIFT",
      },
    });
    expect(withOthers.sourceFundOthers).toBe("LOTTERY");
    expect(withOthers.purposeOthers).toBe("BIRTHDAY GIFT");

    const leftBehind = buildSendMoneyRequest({
      ...INPUT,
      form: {
        ...INPUT.form,
        sourceFundOthers: "LOTTERY",
        purposeOthers: "GIFT",
      },
    });
    expect(leftBehind.sourceFundOthers).toBe("");
    expect(leftBehind.purposeOthers).toBe("");
  });
});
