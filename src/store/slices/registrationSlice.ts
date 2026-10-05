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
    // Never persisted anywhere (no redux-persist in this store), so this is
    // the only place the plaintext password ever lived, and it's gone here.
    clearRegistration: () => initialState,
  },
});

export const {
  setAccount,
  setTxId,
  setChallenge,
  updateRegistrationDetails,
  setRegistrationTokens,
  clearRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;
