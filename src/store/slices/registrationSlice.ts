import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthTokens, RegisterRequest } from "../../types";

// Kept in sync with RegisterSubmit by construction - if that type gains
// or drops a field, this won't compile until initialDetails is updated too.
type RegistrationDetails = Omit<
  RegisterRequest,
  "challenge" | "email" | "password"
>;

interface RegistrationState {
  email: string;
  password: string;
  txId: string | null;
  challenge: string | null;
  details: RegistrationDetails;
  tokens: AuthTokens | null;
}

const initialDetails: RegistrationDetails = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  gender: "",
  postalCode: "",
  prefecture: "",
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  birthDate: "",
  mobile: "",
  mobileCountryCode: "",
  professionCode: "",
  professionOthers: "",
  companyName: "",
  nationality: "",
  visaStatusCode: "",
  visaStatusOthers: "",
  schoolName: "",
  natureOfBusiness: "",
  primaryIDType: "",
  primaryIDNo: "",
  primaryIDExpiry: "",
  advertisingCode: "",
};

const initialState: RegistrationState = {
  email: "",
  password: "",
  txId: "",
  challenge: "",
  details: initialDetails,
  tokens: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setAccount: (
      state,
      action: PayloadAction<{ email: string; password: string }>,
    ) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    setTxId: (state, action: PayloadAction<string>) => {
      state.txId = action.payload;
    },
    setChallenge: (state, action: PayloadAction<string>) => {
      state.challenge = action.payload;
    },

    // Any step can merge in whatever subset of fields it collected -
    // no reducer changes needed if the step grouping changes later.
    updateRegistrationDetails: (
      state,
      action: PayloadAction<Partial<RegistrationDetails>>,
    ) => {
      state.details = { ...state.details, ...action.payload };
    },

    setRegistrationTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
    },

    // After sign-in: wipe the password, tokens and one-time values right away.
    // Email + details stay until the Submitted screen has shown them.
    clearRegistrationSecrets: (state) => {
      state.password = "";
      state.tokens = null;
      state.challenge = null;
      state.txId = null;
    },

    clearRegistration: () => initialState,
  },
});

export const {
  setAccount,
  setTxId,
  setChallenge,
  updateRegistrationDetails,
  setRegistrationTokens,
  clearRegistrationSecrets,
  clearRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;
