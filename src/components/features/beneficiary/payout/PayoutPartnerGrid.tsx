/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Image, StyleSheet, View } from "react-native";
import { Spacing } from "../../../../constants/spacing";
import { useAppTheme } from "../../../../hooks/useAppTheme";
import { CASH_PICKUP_PARTNERS } from "./cashPickupPartners";

const TILE_HEIGHT = 56;
const TILE_RADIUS = 16;
// Two tiles per row: each starts at 40% and grows to share the row
// with the gap between them
const TWO_COLUMN_BASIS = "40%";

/**
 * The cash pick-up payout partners' logos, two per row.
 *
 * @example <PayoutPartnerGrid />
 */
export function PayoutPartnerGrid() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.grid}>
      {CASH_PICKUP_PARTNERS.map((partner) => (
        <View
          key={partner.name}
          accessible
          accessibilityRole="image"
          accessibilityLabel={partner.name}
          style={[styles.tile, { backgroundColor: colors.surface }]}
        >
          <Image source={partner.logo} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.s4,
  },
  tile: {
    flexGrow: 1,
    flexBasis: TWO_COLUMN_BASIS,
    height: TILE_HEIGHT,
    borderRadius: TILE_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
});
