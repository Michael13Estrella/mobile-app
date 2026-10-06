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

export default function Preview() {
  return (
    // <SplashScreen />

    // <SetPinScreen />
    // <RegisterAccountScreen />
    <VerifyEmailScreen />
    // <RegisterBasicInfoScreen />
    // <RegisterEmploymentInfoScreen />
    // <RegisterContactInfoScreen />
    // <RegisterIdentityInfoScreen />
    // <RegisterConfirmScreen />

    // <SecurePromptScreen />
    // <SetPasscodeScreen />
    // <EnableBiometricScreen />
    // <RegisterSubmittedScreen />

    // <HomeScreen />
  );
}
