/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect } from "react";
import { Href, router, useLocalSearchParams, useNavigation } from "expo-router";
import { CommonActions, ParamListBase } from "expo-router/react-navigation";
import type { NativeStackNavigationProp } from "expo-router/native-stack";

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

  // Always a push, so Confirm slides in forward. After an edit walk-through,
  // Confirm's useCollapseEditHistory removes the screens left behind it.
  const goToConfirm = () => {
    router.push(CONFIRM_ROUTE);
  };

  return { isEditing, goNext, goToConfirm };
}

// For the Confirm screen. After an edit walk-through the stack is
// [..., Confirm, Basic (edit), ..., Identity (edit), Confirm]. Once the new
// Confirm has finished sliding in, drop the older Confirm and the edit screens
// behind it, so Back leaves Confirm as usual. The visible screen doesn't
// change, so this happens without any animation. Normal sign-up: no-op.
export function useCollapseEditHistory() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      const state = navigation.getState();
      const lastIndex = state.routes.length - 1;
      const currentName = state.routes[lastIndex].name;

      // An earlier copy of this screen means we came back from an edit.
      const previousIndex = state.routes
        .map((route) => route.name)
        .lastIndexOf(currentName, lastIndex - 1);
      if (previousIndex < 0) return;

      const routes = [
        ...state.routes.slice(0, previousIndex),
        state.routes[lastIndex],
      ];
      navigation.dispatch(
        CommonActions.reset({ ...state, routes, index: routes.length - 1 }),
      );
    });

    return unsubscribe;
  }, [navigation]);
}
