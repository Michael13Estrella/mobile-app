/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-29
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useFocusEffect, useIsFocused, useNavigation } from "expo-router";
import { Spacing } from "../../constants/spacing";
import { useAppDispatch, useAppSelector } from "../../store";
import { StyleSheet, View } from "react-native";
import { AppToast } from "./AppToast";
import { hideToast, showPendingToast } from "../../store/slices/uiSlice";
import { useCallback, useEffect } from "react";

const SCREEN_PADDING = Spacing.s7;

type AppToastHostProps = Readonly<{
  // Distance from the top of its container (AppScreen: below the header)
  top: number;
}>;

/**
 * The app's one toast (uiSlice.toast), floating over the screen's content.
 * - dispatch(showToast(…)): on the current screen, now,
 * - dispatch(showToastOnNextScreen(…)): on the screen that gets focus next
 *   (e.g. saved on a form, then back to the page).
 * It closes when its screen is left by going back.
 *
 * Rendered by AppScreen; only the focused screen shows it (screens further
 * down the stack stay mounted).
 */
export function AppToastHost({ top }: AppToastHostProps) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const toast = useAppSelector((s) => s.ui.toast);

  // Back (button, swipe or Android back) removes this screen: close the
  // toast with it (a toast for the screen below waits in pendingToast)
  useEffect(
    () =>
      navigation.addListener("beforeRemove", () => {
        dispatch(hideToast());
      }),
    [navigation, dispatch],
  );

  // A toast left for this screen (showToastOnNextScreen) shows once it has
  // focus, after the screen it came from is gone
  useFocusEffect(
    useCallback(() => {
      dispatch(showPendingToast());
    }, [dispatch]),
  );

  if (!toast || !isFocused) return null;

  return (
    <View
      // The content under it stays usable around the toast
      pointerEvents="box-none"
      style={[styles.host, { top }]}
    >
      <AppToast
        // A new toast restarts AppToast (and its timer)
        key={toast.id}
        visible
        title={toast.title}
        message={toast.message}
        variant={toast.variant}
        onDismiss={() => dispatch(hideToast())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: SCREEN_PADDING,
    right: SCREEN_PADDING,
  },
});
