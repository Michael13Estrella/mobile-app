import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { useAppSelector } from "../../../store";
import { Spacing } from "../../../constants/spacing";
import { Typography } from "../../../constants/typography";
import { FIELD_SIZE } from "../../../theme/field";
import { DropdownOption } from "../../../utils/referenceData";
import { buildSelectList, SelectListRow } from "../../../utils/selectList";
import { AppText } from "../../common/AppText";
import { BrandIcon } from "../../icons";
import { ALPHABET_INDEX_WIDTH, AlphabetIndex } from "./AlphabetIndex";
import { SelectOptionRow } from "./SelectOptionRow";

const SHEET_HEIGHT = "87%";
const SHEET_RADIUS = 24;
const SHEET_ANIMATION_MS = 250;
const SHEET_ANIMATION = {
  duration: SHEET_ANIMATION_MS,
  easing: Easing.out(Easing.cubic),
};
// Short lists are faster to scan than to search.
const MIN_OPTIONS_FOR_SEARCH = 10;
const SEARCH_ICON_SIZE = 24;
// Fixed heights for A–Z grouped lists (lets the index jump without measuring).
const OPTION_ROW_HEIGHT = 56;
const SECTION_HEADER_HEIGHT = 32;

export type SelectHeaderAction = "cancel" | "clear";

type SelectSheetProps = Readonly<{
  visible: boolean;
  title: string;
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (option: DropdownOption) => void;
  onClear: () => void;
  onClose: () => void;
  // "cancel" closes the sheet; "clear" removes the current selection.
  headerAction?: SelectHeaderAction;
  pinnedValues?: readonly string[];
  groupByLetter?: boolean;
  sortAscending?: boolean;
  showFlags?: boolean;
}>;

// The common selection drawer used by every dropdown (AppSelect).
export function SelectSheet({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClear,
  onClose,
  headerAction = "cancel",
  pinnedValues,
  groupByLetter = false,
  sortAscending = false,
  showFlags = false,
}: SelectSheetProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const locale = useAppSelector((s) => s.ui.locale);
  const listRef = useRef<FlatList<SelectListRow>>(null);
  const [query, setQuery] = useState("");

  // ---------- Open / close animation ----------

  // 0 = hidden below the screen, 1 = fully open.
  const progress = useSharedValue(0);
  // Stays true until the slide-out has finished, so closing is animated too.
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      progress.value = withTiming(1, SHEET_ANIMATION);
      return;
    }

    progress.value = withTiming(0, SHEET_ANIMATION);
    const timer = setTimeout(() => setIsMounted(false), SHEET_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * windowHeight }],
  }));

  // ---------- List ----------

  const { rows, letterIndex } = useMemo(
    () =>
      buildSelectList({
        options,
        query,
        locale,
        pinnedValues,
        groupByLetter,
        sortAscending,
      }),
    [options, query, locale, pinnedValues, groupByLetter, sortAscending],
  );

  const availableLetters = Object.keys(letterIndex);
  const showIndex = availableLetters.length > 0;
  // Based on all options, not the filtered rows, so the search box doesn't
  // disappear while typing.
  const showSearch = options.length >= MIN_OPTIONS_FOR_SEARCH;

  // Row offsets for fixed-height (grouped) lists; enables instant jumps.
  const rowLayouts = useMemo(() => {
    let offset = 0;
    return rows.map((row) => {
      const length =
        row.type === "header" ? SECTION_HEADER_HEIGHT : OPTION_ROW_HEIGHT;
      const layout = { length, offset };
      offset += length;
      return layout;
    });
  }, [rows]);

  // ---------- Bring the selected option into view ----------

  const isListLaidOut = useRef(false);
  const hasScrolledToSelected = useRef(false);

  // Reset once the sheet is fully gone, so the next opening starts with the
  // full list. (Resetting on open is too late: the list's first layout would
  // still use the old search, which can hide the selected option.)
  useEffect(() => {
    if (isMounted) return;
    setQuery("");
    isListLaidOut.current = false;
    hasScrolledToSelected.current = false;
  }, [isMounted]);

  // Centres the selected option once per opening. Needs the list's height
  // (otherwise it centres against 0 and the row ends up half hidden) and the
  // option to be in the rows; marks itself done only after it really scrolled.
  const scrollToSelectedOnce = () => {
    if (
      !isListLaidOut.current ||
      hasScrolledToSelected.current ||
      !selectedValue
    ) {
      return;
    }

    const index = rows.findIndex(
      (row) => row.type === "option" && row.option.value === selectedValue,
    );
    if (index < 0) return;

    hasScrolledToSelected.current = true;
    // Next frame: by then the native list has committed its content size.
    requestAnimationFrame(() =>
      listRef.current?.scrollToIndex({
        index,
        animated: false,
        viewPosition: 0.5,
      }),
    );
  };

  const handleListLayout = () => {
    isListLaidOut.current = true;
    scrollToSelectedOnce();
  };

  // Rows can arrive after the first layout (e.g. options still loading).
  useEffect(() => {
    scrollToSelectedOnce();
  }, [rows]);

  // ---------- Actions ----------

  const handleHeaderAction = headerAction === "clear" ? onClear : onClose;

  const scrollToLetter = (letter: string) => {
    listRef.current?.scrollToIndex({
      index: letterIndex[letter],
      animated: false,
    });
  };

  const renderRow = ({ item }: { item: SelectListRow }) => {
    if (item.type === "header") {
      return (
        <View
          style={[
            styles.sectionHeader,
            { backgroundColor: colors.listSectionHeaderBg },
          ]}
        >
          <AppText
            typographyType="title2"
            weight="bold"
            color={colors.textTertiary}
          >
            {item.letter}
          </AppText>
        </View>
      );
    }

    return (
      <SelectOptionRow
        option={item.option}
        selected={item.option.value === selectedValue}
        showFlag={showFlags}
        fixedHeight={groupByLetter ? OPTION_ROW_HEIGHT : undefined}
        endInset={showIndex ? ALPHABET_INDEX_WIDTH : 0}
        onPress={onSelect}
      />
    );
  };

  return (
    <Modal
      visible={isMounted}
      transparent
      // The slide/fade is done with Reanimated below; the native animation
      // would also slide the backdrop.
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {/* Backdrop: fades in/out, tap to close */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.overlay },
            backdropAnimatedStyle,
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t("common.cancel")}
          />
        </Animated.View>

        {/* Sheet: slides up from below the screen */}
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, paddingBottom: insets.bottom },
            sheetAnimatedStyle,
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <AppText
              typographyType="h4"
              weight="bold"
              color={colors.textPrimary}
            >
              {title}
            </AppText>
            <Pressable
              onPress={handleHeaderAction}
              hitSlop={Spacing.s3}
              accessibilityRole="button"
            >
              <AppText
                typographyType="button1"
                weight="bold"
                color={colors.textBrandPrimary}
              >
                {headerAction === "clear"
                  ? t("common.clear")
                  : t("common.cancel")}
              </AppText>
            </Pressable>
          </View>

          {/* Search */}
          {showSearch && (
            <View
              style={[
                styles.search,
                {
                  borderColor: colors.borderSubtle,
                  backgroundColor: colors.inputBackground,
                },
              ]}
            >
              <BrandIcon
                name="searchLine"
                size={SEARCH_ICON_SIZE}
                color={colors.iconBrandPrimary}
              />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t("common.search")}
                placeholderTextColor={colors.textTertiary}
                selectionColor={colors.inputBorderFocused}
                autoCorrect={false}
                style={[styles.searchInput, { color: colors.textPrimary }]}
              />
            </View>
          )}

          {/* Options */}
          <View style={styles.listArea}>
            <FlatList
              ref={listRef}
              onLayout={handleListLayout}
              data={rows}
              keyExtractor={(row) => row.key}
              renderItem={renderRow}
              keyboardShouldPersistTaps="handled"
              persistentScrollbar
              getItemLayout={
                groupByLetter
                  ? (_, index) => ({ ...rowLayouts[index], index })
                  : undefined
              }
              onScrollToIndexFailed={({ index }) => {
                // Only for variable-height lists: retry once rows are measured.
                setTimeout(
                  () =>
                    listRef.current?.scrollToIndex({
                      index,
                      animated: false,
                      viewPosition: 0.5,
                    }),
                  100,
                );
              }}
              ListEmptyComponent={
                <AppText
                  typographyType="body2"
                  color={colors.textTertiary}
                  style={styles.emptyText}
                >
                  {t("common.noResults")}
                </AppText>
              }
            />

            {showIndex && (
              <AlphabetIndex
                availableLetters={availableLetters}
                onSelectLetter={scrollToLetter}
              />
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    height: SHEET_HEIGHT,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: Spacing.s7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.s7,
    marginBottom: Spacing.s5,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s4,
    height: FIELD_SIZE.height,
    borderRadius: FIELD_SIZE.height / 2,
    borderWidth: FIELD_SIZE.borderWidth,
    paddingHorizontal: Spacing.s5,
    marginHorizontal: Spacing.s7,
    marginBottom: Spacing.s4,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: Typography.sizes.md,
  },
  listArea: {
    flex: 1,
  },
  sectionHeader: {
    height: SECTION_HEADER_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: Spacing.s7,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: Spacing.s7,
  },
});
