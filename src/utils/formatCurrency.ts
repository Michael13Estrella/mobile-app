export const formatCurrency = (
  amount: number,
  currency: string = "JPY",
  locale: string = "ja-JP",
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};
