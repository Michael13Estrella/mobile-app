/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-08
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useState } from "react";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppTabs } from "../../../src/components/common/AppTabs";
import { AppSearchInput } from "../../../src/components/form/AppSearchInput";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useManageBeneficiaries } from "../../../src/hooks/useManageBeneficiaries";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { BeneficiaryCategory } from "../../../src/types";
import { BENEFICIARY_CATEGORIES } from "../../../src/constants/beneficiary";
import { matchesBeneficiarySearch } from "../../../src/utils/beneficiary";
import { router } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Spacing } from "../../../src/constants/spacing";
import { AppText } from "../../../src/components/common/AppText";
import { BeneficiaryCard } from "../../../src/components/features/beneficiary/BeneficiaryCard";
import { AppFloatingButton } from "../../../src/components/common/AppFloatingButton";

// Room below the last card, so the floating "+ Add" never covers it.
const FLOATING_BUTTON_CLEARANCE = Spacing.s12;

export default function BeneficiariesScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { data, isLoading, hasError, refresh } = useManageBeneficiaries();

  const [category, setCategory] = useState<BeneficiaryCategory>(
    BENEFICIARY_CATEGORIES[0],
  );
  const [query, setQuery] = useState("");

  // Each tab's beneficiaries matching the search (all of them when empty)
  const filtered = (key: BeneficiaryCategory) =>
    (data?.[key] ?? []).filter((beneficiary) =>
      matchesBeneficiarySearch(beneficiary, query),
    );

  const tabs = BENEFICIARY_CATEGORIES.map((key) => ({
    value: key,
    label: t(`beneficiaries.categories.${key}`),
    count: filtered(key).length,
  }));
  const visible = filtered(category);

  // A tab screen has nothing behind it; the arrow shows only when opened
  // from somewhere (e.g. Home's "View all")
  const canGoBack = router.canGoBack();

  const renderList = () => {
    if (isLoading) {
      return <ActivityIndicator color={colors.primary} />;
    }

    if (hasError && !data) {
      return (
        <AppText
          typographyType="body2"
          color={colors.textSecondary}
          style={styles.state}
        >
          {t("beneficiaries.loadError")}
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
          {query.trim()
            ? t("beneficiaries.noResults")
            : t("beneficiaries.empty")}
        </AppText>
      );
    }

    return visible.map((beneficiary) => (
      <BeneficiaryCard
        key={beneficiary.beneficiaryGuid}
        beneficiary={beneficiary}
        onPress={() => {}}
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
              title={t("beneficiaries.title")}
              onBack={canGoBack ? () => router.back() : undefined}
            />

            <View style={styles.headerContainer}>
              <AppSearchInput value={query} onChangeText={setQuery} />

              <AppTabs tabs={tabs} value={category} onChange={setCategory} />
            </View>
          </>
        }
      >
        <View style={styles.list}>{renderList()}</View>

        <View style={styles.clearance} />
      </AppScreen>

      <AppFloatingButton
        label={t("common.add")}
        icon="plusLine"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  headerContainer: {
    gap: Spacing.s4,
    paddingHorizontal: Spacing.s5,
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
