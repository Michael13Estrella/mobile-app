import { Href, router, useLocalSearchParams } from "expo-router";

// Passed by the Confirm screen's "Edit" buttons.
export const REGISTER_EDIT_MODE = "edit";
const CONFIRM_ROUTE = "/(auth)/(register)/confirm";

// Navigation for registration steps.
// Editing from Confirm walks through the following steps too (pre-filled),
// because their fields depend on earlier answers (nationality -> nickname /
// visa status, occupation -> company or school), then returns to Confirm.
export function useRegisterStepNavigation() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isEditing = mode === REGISTER_EDIT_MODE;

  // Next step; keeps edit mode so the whole walk-through ends on Confirm.
  const goNext = (nextStep: Href) => {
    router.push(
      isEditing
        ? ({ pathname: nextStep, params: { mode: REGISTER_EDIT_MODE } } as Href)
        : nextStep,
    );
  };

  // Last step: when editing, close the edit screens back to the Confirm
  // already on the stack instead of opening a second one.
  const goToConfirm = () => {
    if (isEditing) {
      router.dismissTo(CONFIRM_ROUTE);
      return;
    }
    router.push(CONFIRM_ROUTE);
  };

  return { isEditing, goNext, goToConfirm };
}
