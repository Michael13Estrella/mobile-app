/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useState } from "react";
import { Spacing } from "../../../src/constants/spacing";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useEnrolledBillers } from "../../../src/hooks/useEnrolledBillers";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { BILLER_SEARCH_MIN_COUNT } from "../../../src/constants/biller";
import { matchesEnrolledBillerSearch } from "../../../src/utils/biller/enrolledBillers";
import { AppText } from "../../../src/components/common/AppText";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { EnrolledBillerCard } from "../../../src/components/features/biller/EnrolledBillerCard";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { router } from "expo-router";
import { AppSearchInput } from "../../../src/components/form/AppSearchInput";
import { AppFloatingButton } from "../../../src/components/common/AppFloatingButton";
import { ROUTES } from "../../../src/constants/routes";

// Room below the last card, so the floating "+ Add biller" never covers it
const FLOATING_BUTTON_CLEARANCE = Spacing.s12;

// Enrolled Billers: the Pay Bills tab, when the remitter has billers
export default function EnrolledBillersScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { billers, isLoading, hasError, refresh } = useEnrolledBillers();
  const [query, setQuery] = useState("");

  // A short list is faster to scan than to search
  const hasSearch = (billers?.length ?? 0) > BILLER_SEARCH_MIN_COUNT;
  const visible = (billers ?? []).filter((biller) =>
    matchesEnrolledBillerSearch(biller, hasSearch ? query : ""),
  );

  const renderList = () => {
    if (isLoading) {
      return <ActivityIndicator color={colors.primary} />;
    }

    if (hasError && !billers) {
      return (
        <AppText
          typographyType="body2"
          color={colors.textSecondary}
          style={styles.state}
        >
          {t("enrolledBillers.loadError")}
        </AppText>
      );
    }

    if (visible.length === 0) {
      return (
        <AppText
          typographyType="body2"
          color={colors.textSecondary}
          style={styles.state}
        >
          {hasSearch && query.trim()
            ? t("enrolledBillers.noResults")
            : t("enrolledBillers.empty")}
        </AppText>
      );
    }

    return visible.map((biller) => (
      <EnrolledBillerCard
        key={biller.beneficiaryGuid}
        biller={biller}
        onPress={() => undefined}
      />
    ));
  };

  return (
    <View style={styles.fill}>
      <AppScreen
        gradient
        contentGap={Spacing.s5}
        onRefresh={refresh}
        header={
          <>
            <AppHeader
              title={t("enrolledBillers.title")}
              onBack={() => router.back()}
            />
            {hasSearch && (
              <View style={styles.headerContainer}>
                <AppSearchInput value={query} onChangeText={setQuery} />
              </View>
            )}
          </>
        }
      >
        <View style={styles.list}>{renderList()}</View>

        <View style={styles.clearance} />
      </AppScreen>

      <AppFloatingButton
        label={t("enrolledBillers.add")}
        icon="plusLine"
        onPress={() => router.push(ROUTES.ADD_BILLER)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: Spacing.s7,
  },
  list: {
    gap: Spacing.s4,
  },
  state: {
    textAlign: "center",
    marginTop: Spacing.s9,
  },
  clearance: {
    height: FLOATING_BUTTON_CLEARANCE,
  },
});
