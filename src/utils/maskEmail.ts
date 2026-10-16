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

const VISIBLE_PREFIX_LENGTH = 2;
const MASK_LENGTH = 4;
const MASK_CHAR = "*";

/**
 * Hides most of an email's local part for display: the first 2 characters
 * stay, then a fixed 4-star mask (so the real length isn't revealed), then
 * the domain.
 *
 * @param email - The email address.
 * @returns The masked email, or the input unchanged if it has no "@" parts.
 * @example maskEmail("lorem@gmail.com"); // "lo****@gmail.com"
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  const visible = localPart.slice(0, VISIBLE_PREFIX_LENGTH);
  const mask = MASK_CHAR.repeat(MASK_LENGTH);

  return `${visible}${mask}@${domain}`;
}
