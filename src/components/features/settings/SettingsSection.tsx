/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-18
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import React, { Children, Fragment, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { DetailSection } from "../../common/DetailSection";
import { AppDivider } from "../../common/AppDivider";

type SettingsSectionProps = Readonly<{
  title: string;
  // SettingsRows
  children: ReactNode;
}>;

/**
 * A Profile & Settings section: the uppercase title, then a card of rows
 * with a full-width divider between them.
 *
 * @example <SettingsSection title="Security"><SettingsRow … /><SettingsRow … /></SettingsSection>
 */
export function SettingsSection({ title, children }: SettingsSectionProps) {
  const rows = Children.toArray(children);

  return (
    <DetailSection title={title} cardStyle={styles.card}>
      {rows.map((row, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <AppDivider marginVertical={false} style={styles.fullWidth} />
          )}
          {row}
        </Fragment>
      ))}
    </DetailSection>
  );
}

const styles = StyleSheet.create({
  // The rows set their own spacing, so the card adds none
  card: {
    gap: Spacing.s0,
    paddingVertical: Spacing.s0,
  },
  // Edge to edge
  fullWidth: {
    width: "auto",
    marginHorizontal: -Spacing.s5,
  },
});
