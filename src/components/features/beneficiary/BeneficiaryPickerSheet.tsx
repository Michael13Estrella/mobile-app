/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { Spacing } from "../../../constants/spacing";
import { BeneficiarySummary, RecentBeneficiary } from "../../../types";
import {
  getBeneficiaryTitle,
  getRecentBeneficiaryLabel,
  matchesBeneficiarySearch,
} from "../../../utils/beneficiary/beneficiary";
import { AppBottomSheet } from "../../common/AppBottomSheet";
import { AppText } from "../../common/AppText";
import { GradientText } from "../../common/GradientText";
import { AppSearchInput } from "../../form/AppSearchInput";
import { BeneficiaryAvatarItem } from "./BeneficiaryAvatarItem";
import { BeneficiaryCard } from "./BeneficiaryCard";

// The sheet's side padding (AppBottomSheet's), cancelled around the list so
// the cards' shadows aren't cut off at its edges
const SHEET_SIDE_PADDING = Spacing.s7;

const byTitle = (a: BeneficiarySummary, b: BeneficiarySummary) =>
  getBeneficiaryTitle(a).localeCompare(getBeneficiaryTitle(b));

function SectionTitle({ text }: Readonly<{ text: string }>) {
  const { colors } = useAppTheme();
  return (
    <AppText typographyType="title1" weight="bold" color={colors.textPrimary}>
      {text}
    </AppText>
  );
}

type BeneficiaryPickerSheetProps = Readonly<{
  visible: boolean;
  // Every saved beneficiary
  beneficiaries: readonly BeneficiarySummary[];
  // The dashboard's most recent ones
  recentBeneficiaries: readonly RecentBeneficiary[];
  onSelect: (beneficiary: BeneficiarySummary) => void;
  onClose: () => void;
}>;

/**
 * The "Select a beneficiary" drawer: a search, the most recent beneficiaries
 * as avatars, then the other ones as cards (A-Z). While searching, one list
 * of matches across all of them.
 *
 * @example <BeneficiaryPickerSheet visible={isOpen} beneficiaries={all} recentBeneficiaries={recent} onSelect={select} onClose={close} />
 */
export function BeneficiaryPickerSheet({
  visible,
  beneficiaries,
  recentBeneficiaries,
  onSelect,
  onClose,
}: BeneficiaryPickerSheetProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  // Every opening starts with the two sections, not the last search
  useEffect(() => {
    if (visible) setQuery("");
  }, [visible]);

  const { recent, others } = useMemo(() => {
    const byGuid = new Map(
      beneficiaries.map((beneficiary) => [
        beneficiary.beneficiaryGuid,
        beneficiary,
      ]),
    );
    // only those still saved, in the dashboard's order
    const recentSaved = recentBeneficiaries.flatMap(
      ({ beneficiaryGuid }) => byGuid.get(beneficiaryGuid) ?? [],
    );
    const recentGuids = new Set(
      recentSaved.map((beneficiary) => beneficiary.beneficiaryGuid),
    );
    return {
      recent: recentSaved,
      others: beneficiaries
        .filter((beneficiary) => !recentGuids.has(beneficiary.beneficiaryGuid))
        .sort(byTitle),
    };
  }, [beneficiaries, recentBeneficiaries]);

  const isSearching = query.trim().length > 0;

  const matches = useMemo(
    () =>
      beneficiaries
        .filter((beneficiary) => matchesBeneficiarySearch(beneficiary, query))
        .sort(byTitle),
    [beneficiaries, query],
  );

  const cards = isSearching ? matches : others;
  const showRecent = !isSearching && recent.length > 0;
  const emptyKey = isSearching
    ? "beneficiaries.noResults"
    : "beneficiaries.empty";

  return (
    <AppBottomSheet visible={visible} onClose={onClose}>
      {/* Header */}
      <View style={styles.header}>
        <AppText typographyType="h4" weight="bold" color={colors.textPrimary}>
          {t("sendMoney.beneficiaryPicker.title")}
        </AppText>
        <Pressable
          onPress={onClose}
          hitSlop={Spacing.s3}
          accessibilityRole="button"
        >
          <AppText
            typographyType="button1"
            weight="bold"
            color={colors.textBrandPrimary}
          >
            {t("common.cancel")}
          </AppText>
        </Pressable>
      </View>

      <AppSearchInput
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        persistentScrollbar
      >
        {/* Most recent: avatars */}
        {showRecent && (
          <View style={styles.section}>
            <SectionTitle text={t("sendMoney.beneficiaryPicker.mostRecent")} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
            >
              {recent.map((beneficiary) => (
                <BeneficiaryAvatarItem
                  key={beneficiary.beneficiaryGuid}
                  label={getRecentBeneficiaryLabel(beneficiary)}
                  onPress={() => onSelect(beneficiary)}
                >
                  <GradientText typographyType="h5" weight="bold">
                    {beneficiary.nameInitial}
                  </GradientText>
                </BeneficiaryAvatarItem>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Other beneficiaries, or the search matches: cards */}
        {cards.length > 0 && (
          <View style={styles.section}>
            {!isSearching && (
              <SectionTitle text={t("sendMoney.beneficiaryPicker.others")} />
            )}
            {cards.map((beneficiary) => (
              <BeneficiaryCard
                key={beneficiary.beneficiaryGuid}
                beneficiary={beneficiary}
                onPress={() => onSelect(beneficiary)}
              />
            ))}
          </View>
        )}

        {cards.length === 0 && !showRecent && (
          <AppText
            typographyType="body2"
            color={colors.textTertiary}
            style={styles.emptyText}
          >
            {t(emptyKey)}
          </AppText>
        )}
      </ScrollView>
    </AppBottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.s5,
  },
  search: {
    marginBottom: Spacing.s5,
  },
  // Shrinks to the sheet's maximum height, then scrolls
  scroll: {
    flexShrink: 1,
    marginHorizontal: -SHEET_SIDE_PADDING,
  },
  content: {
    paddingHorizontal: SHEET_SIDE_PADDING,
    paddingBottom: Spacing.s3,
    gap: Spacing.s6,
  },
  section: {
    gap: Spacing.s4,
  },
  recentList: {
    gap: Spacing.s4,
  },
  emptyText: {
    textAlign: "center",
  },
});
