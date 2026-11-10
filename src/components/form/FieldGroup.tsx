/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-10
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/spacing";

type FieldGroupProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Controls that belong to one field (e.g. a dropdown and its "Others" text
 * box), closer together than the fields of a FieldsContainer.
 *
 * @example <FieldGroup><AppSelect … /><AppInput … /></FieldGroup>
 */
export function FieldGroup({ children }: FieldGroupProps) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    gap: Spacing.s3,
  },
});
