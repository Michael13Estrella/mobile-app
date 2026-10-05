const VISIBLE_PREFIX_LENGTH = 2;
const MASK_LENGTH = 4;
const MASK_CHAR = "*";

// lorem@gmail.com -> lo****@gmail.com
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  const visible = localPart.slice(0, VISIBLE_PREFIX_LENGTH);
  const mask = MASK_CHAR.repeat(MASK_LENGTH);

  return `${visible}${mask}@${domain}`;
}
