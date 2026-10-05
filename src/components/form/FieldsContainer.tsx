import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/spacing";

type FieldsContainerProps = Readonly<{
  children: ReactNode;
}>;

export function FieldsContainer({ children }: FieldsContainerProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.s5,
  },
});
