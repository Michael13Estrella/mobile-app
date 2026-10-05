export const firstErrorMessage = (
  errors?: Record<string, string[]>,
): string | undefined => (errors ? Object.values(errors)[0]?.[0] : undefined);
