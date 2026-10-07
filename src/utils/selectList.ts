/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-01
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Language } from "../types/language.types";
import { DropdownOption } from "./referenceData";

export type SelectListRow =
  | Readonly<{ type: "header"; key: string; letter: string }>
  | Readonly<{ type: "option"; key: string; option: DropdownOption }>;

export type SelectList = Readonly<{
  rows: SelectListRow[];
  // Section letter -> row index of its header, used by the A-Z index
  letterIndex: Readonly<Record<string, number>>;
}>;

type BuildSelectListParams = Readonly<{
  options: DropdownOption[];
  query: string;
  locale: Language;
  // Shown first (in this order) when not searching, e.g. main countries.
  pinnedValues?: readonly string[];
  // Sorts the list and splits it into A-Z sections
  groupByLetter?: boolean;
  // Sorts the list ascending by label without sections.
  // Lists with neither option keep the order of the API sends.
  sortAscending?: boolean;
}>;

export const buildSelectList = ({
  options,
  query,
  locale,
  pinnedValues = [],
  groupByLetter = false,
  sortAscending = false,
}: BuildSelectListParams): SelectList => {
  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const showSections = groupByLetter && locale === "en";

  const rows: SelectListRow[] = [];
  const letterIndex: Record<string, number> = {};

  // Pinned options are a shortcut on the full list; while searching
  // they're found like any other option
  if (!isSearching) {
    pinnedValues.forEach((value) => {
      const option = options.find((o) => o.value === value);
      if (option) {
        rows.push({ type: "option", key: `pinned-${value}`, option });
      }
    });
  }

  const visible = isSearching
    ? options.filter((o) => o.label.toLowerCase().includes(normalizedQuery))
    : options;

  const ordered =
    groupByLetter || sortAscending
      ? [...visible].sort((a, b) => a.label.localeCompare(b.label, locale))
      : visible;

  ordered.forEach((option) => {
    if (showSections) {
      const letter = option.label.charAt(0).toUpperCase();
      if (!(letter in letterIndex)) {
        letterIndex[letter] = rows.length;
        rows.push({ type: "header", key: `header-${letter}`, letter });
      }
    }
    rows.push({ type: "option", key: option.value, option });
  });

  return { rows, letterIndex };
};
