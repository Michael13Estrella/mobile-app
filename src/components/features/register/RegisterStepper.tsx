/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BrandIcon, BrandIconName } from "../../icons";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { Spacing } from "../../../constants/spacing";

const CIRCLE_SIZE = 24;
const ICON_SIZE = 12;
const DONE_ICON_SIZE = 8;
const CONNECTOR_WIDTH = 65;

export const REGISTRATION_STEPS: StepperStep[] = [
  { icon: "lockKeyholeSquareSolid" },
  { icon: "mail02Solid" },
  { icon: "userSquareSolid" },
  { icon: "faceIdSquareSolid" },
];

type StepperStep = Readonly<{ icon: BrandIconName }>;

type AppStepperProps = Readonly<{ currentStep: number; steps?: StepperStep[] }>;

export function RegisterStepper({
  steps = REGISTRATION_STEPS,
  currentStep,
}: AppStepperProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <View key={index} style={styles.stepGroup}>
            {isActive ? (
              <LinearGradient
                colors={[colors.brandGradientStart, colors.brandGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.circle}
              >
                <BrandIcon
                  name={step.icon}
                  size={ICON_SIZE}
                  color={colors.stepperIconColor}
                />
              </LinearGradient>
            ) : (
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: isCompleted
                      ? colors.stepperCompletedBg
                      : colors.stepperIncompleteBg,
                  },
                ]}
              >
                <BrandIcon
                  name={isCompleted ? "checkLine" : step.icon}
                  size={isCompleted ? DONE_ICON_SIZE : ICON_SIZE}
                  color={colors.stepperIconColor}
                />
              </View>
            )}
            {!isLast && (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor: isCompleted
                      ? colors.stepperCompletedBg
                      : colors.stepperConnectorColor,
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.s3,
    paddingHorizontal: Spacing.s5,
    paddingBottom: Spacing.s5,
    gap: Spacing.s2,
  },
  stepGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  connector: {
    width: CONNECTOR_WIDTH,
    height: 1,
  },
});
