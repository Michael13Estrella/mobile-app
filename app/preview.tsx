import { SplashScreen } from "../src/components/screens/SplashScreen";
import RegisterAccountScreen from "./(auth)/(register)/login-info";
import RegisterConfirmScreen from "./(auth)/(register)/confirm";
import RegisterContactInfoScreen from "./(auth)/(register)/contact-info";
import RegisterPersonalInfoScreen from "./(auth)/(register)/basic-info";
import VerifyEmailScreen from "./(auth)/(register)/verify-email";
import RegisterBasicInfoScreen from "./(auth)/(register)/basic-info";
import RegisterEmploymentInfoScreen from "./(auth)/(register)/employment-info";
import RegisterIdentityInfoScreen from "./(auth)/(register)/identity-info";
import SecurePromptScreen from "./(protected)/(onboarding)/secure-prompt";
import SetPasscodeScreen from "./(protected)/(onboarding)/set-passcode";
import EnableBiometricScreen from "./(protected)/(onboarding)/biometric";
import RegisterSubmittedScreen from "./(protected)/(onboarding)/submitted";
import HomeScreen from "./(protected)/(tabs)/home";
import { PasscodeUnlockScreen } from "../src/components/screens/lock/PasscodeUnlockScreen";
import { LockWelcomeScreen } from "../src/components/screens/lock/LockWelcomeScreen";
import OtpScreen from "./(auth)/otp";
import { AuthLoadingOverlay } from "../src/components/screens/AuthLoadingOverlay";

export default function Preview() {
  return (
    // <SplashScreen />
    // <PasscodeUnlockScreen
    //   busy={false}
    //   error={null}
    //   onSubmit={() => {}}
    //   onLoginWithPassword={() => {}}
    //   onBack={() => {}}
    // />

    // <LockWelcomeScreen
    //   method={"biometric"}
    //   biometryType={null}
    //   busy={false}
    //   onBiometricLogin={function (): void {
    //     throw new Error("Function not implemented.");
    //   }}
    //   onPasscodeLogin={function (): void {
    //     throw new Error("Function not implemented.");
    //   }}
    //   onLoginWithPassword={function (): void {
    //     throw new Error("Function not implemented.");
    //   }}
    //   onForgotPassword={function (): void {
    //     throw new Error("Function not implemented.");
    //   }}
    // />

    // <RegisterAccountScreen />
    // <VerifyEmailScreen />
    // <RegisterBasicInfoScreen />
    // <RegisterEmploymentInfoScreen />
    // <RegisterContactInfoScreen />
    // <RegisterIdentityInfoScreen />
    // <RegisterConfirmScreen />

    // <SecurePromptScreen />
    // <SetPasscodeScreen />
    // <EnableBiometricScreen />
    // <RegisterSubmittedScreen />

    // <OtpScreen />

    <AuthLoadingOverlay />

    // <HomeScreen />
  );
}
