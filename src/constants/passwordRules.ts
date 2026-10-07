/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-15
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  PASSWORD_HAS_SPACE_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_SPECIAL_CHAR_ONLY_REGEX,
} from "./validation";

export type PasswordRule = Readonly<{
  labelKey: string;
  test: (password: string) => boolean;
}>;

export const PASSWORD_RULES: PasswordRule[] = [
  {
    labelKey: "validation.passwordRuleMinLength",
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    labelKey: "validation.passwordRuleUppercase",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    labelKey: "validation.passwordRuleLowercase",
    test: (password) => /[a-z]/.test(password),
  },
  {
    labelKey: "validation.passwordRuleSpecialChar",
    test: (password) => PASSWORD_SPECIAL_CHAR_ONLY_REGEX.test(password),
  },
  {
    labelKey: "validation.passwordRuleNumber",
    test: (password) => /\d/.test(password),
  },
  {
    labelKey: "validation.passwordRuleNoSpaces",
    test: (password) =>
      password.length > 0 && !PASSWORD_HAS_SPACE_REGEX.test(password),
  },
];
