import { Pressable, StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { AppText } from "../../common/AppText";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const ALPHABET_INDEX_WIDTH = 24;

type AlphabetIndexProps = Readonly<{
  // Letters that have a section in the list
  availableLetters: readonly string[];
  onSelectLetter: (letter: string) => void;
}>;

// Side index for A-Z grouped lists. Letters without a section jump to the
// next letter that has one, so every tap does something
export function AlphabetIndex({
  availableLetters,
  onSelectLetter,
}: AlphabetIndexProps) {
  const { colors } = useAppTheme();

  const handlePress = (letter: string) => {
    const target = ALPHABET.slice(ALPHABET.indexOf(letter)).find((l) =>
      availableLetters.includes(l),
    );
    if (target) onSelectLetter(target);
  };

  return (
    <View style={styles.container}>
      {ALPHABET.map((letter) => (
        <Pressable
          key={letter}
          onPress={() => handlePress(letter)}
          hitSlop={{ left: Spacing.s3, right: Spacing.s3 }}
          accessibilityRole="button"
          accessibilityLabel={letter}
        >
          <AppText
            typographyType="overline1"
            weight="bold"
            color={colors.textTertiary}
          >
            {letter}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: Spacing.s3,
    width: ALPHABET_INDEX_WIDTH,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
