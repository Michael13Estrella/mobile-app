import { Ref, useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Typography } from "../../constants/typography";

// Each "x" in a template is one digit slot; other characters are shown as-is.
const CURSOR_BLINK_INTERVAL_MS = 500;
const CURSOR_BAR_WIDTH = 2;

// Every Latin letter in a template is one digit slot ("x", or "M"/"D"/"Y" in
// dates) and is shown as its placeholder; everything else is shown as-is
// (" - ", " / ", "年").
const isDigitSlot = (char: string): boolean => /[A-Za-z]/.test(char);

const countDigitSlots = (template: string): number =>
  template.split("").filter(isDigitSlot).length;

type MaskedDigitsInputProps = Readonly<{
  ref?: Ref<TextInput>;
  template: string; // e.g. "xxx", "xx - xxxx - xxxx", "MM / DD / YYYY"
  value: string; // digits only
  onChangeDigits: (digits: string) => void;
  // Custom cleaning (e.g. phone: drop the leading 0). Default: digits only.
  sanitize?: (text: string) => string;
  onFocus?: () => void;
  onBlur?: () => void;
  textColor: string;
  placeholderColor: string;
  cursorColor: string;
}>;

// Digits input whose template stays visible while typing ("90 - 1|xxx"):
// an invisible native input takes the keystrokes, the template is drawn on
// top. Renders without its own border; callers draw the box around it.
export function MaskedDigitsInput({
  ref,
  template,
  value,
  onChangeDigits,
  sanitize,
  onFocus,
  onBlur,
  textColor,
  placeholderColor,
  cursorColor,
}: MaskedDigitsInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const digitCount = countDigitSlots(template);

  useEffect(() => {
    if (!isFocused) return;
    const interval = setInterval(
      () => setCursorVisible((prev) => !prev),
      CURSOR_BLINK_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [isFocused]);

  const handleChangeText = (text: string) => {
    const digits = sanitize
      ? sanitize(text)
      : text.replace(/\D/g, "").slice(0, digitCount);
    onChangeDigits(digits);
    setCursorVisible(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const cursorBarStyle = [
    styles.cursorBar,
    { backgroundColor: cursorColor, opacity: cursorVisible ? 1 : 0 },
  ];

  return (
    <View style={styles.container}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType="number-pad"
        maxLength={digitCount}
        // The text is invisible, so keep the native cursor at the end where
        // the drawn cursor is; typing and deleting always happen there.
        // selection={{ start: value.length, end: value.length }}
        // The overlay draws the digits and cursor. The real caret is made
        // invisible via selectionColor (iOS) / opacity (Android), not
        // caretHidden, which breaks KeyboardAwareScrollView on iOS.
        selectionColor="transparent"
        contextMenuHidden
        style={styles.hiddenInput}
      />

      <View style={styles.overlay}>
        {template.split("").map((templateChar, index, chars) => {
          if (!isDigitSlot(templateChar)) {
            return (
              <Text
                key={index}
                style={[styles.char, { color: placeholderColor }]}
              >
                {templateChar}
              </Text>
            );
          }

          const digitsBefore = chars.slice(0, index).filter(isDigitSlot).length;
          const digit = value[digitsBefore];
          const isCursorSlot =
            isFocused && !digit && digitsBefore === value.length;

          return (
            <View key={index} style={styles.slot}>
              {isCursorSlot && <View style={cursorBarStyle} />}
              <Text
                style={[
                  styles.char,
                  { color: digit ? textColor : placeholderColor },
                ]}
              >
                {digit ?? templateChar}
              </Text>
            </View>
          );
        })}
        {isFocused && value.length >= digitCount && (
          <View style={cursorBarStyle} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  hiddenInput: {
    height: "100%",
    backgroundColor: "transparent",
    zIndex: 2,
    // Invisible but tappable: iOS ignores touches on opacity-0 views;
    // Android ignores a transparent text color.
    ...Platform.select({
      ios: { color: "transparent" },
      android: { opacity: 0 },
    }),
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
    pointerEvents: "none",
  },
  slot: {
    flexDirection: "row",
    alignItems: "center",
  },
  char: {
    fontSize: Typography.sizes.md,
  },
  cursorBar: {
    width: CURSOR_BAR_WIDTH,
    height: Typography.sizes.md * Typography.lineHeights.tight,
  },
});
