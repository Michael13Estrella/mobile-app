/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// English is the source of truth: every key must exist there (ja falls back)
type Translations = typeof import("../locales/en.json");

// Plural entries ({ one, other }) are looked up by their parent key
type PluralForm = "zero" | "one" | "other";

// Every "a.b.c" path to a text (or to a plural entry). The "---- SECTION ----"
// lines in en.json are only dividers, not texts.
type KeyPaths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: K extends `---${string}`
    ? never
    : T[K] extends string
      ? `${Prefix}${K}`
      : keyof T[K] extends PluralForm
        ? `${Prefix}${K}`
        : KeyPaths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

// A key of en.json, e.g. "validation.required"
export type TranslationKey = KeyPaths<Translations>;
