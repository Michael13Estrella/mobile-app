/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Control, FieldValues, Path } from "react-hook-form";
import { useFormField } from "../../hooks/useFormField";
import { FieldShell } from "./FieldShell";
import { SegmentedControl } from "../common/SegmentedControl";
import { BrandCountryFlag } from "../icons";
import { CURRENCY_COUNTRY } from "../../constants/currency";

const FLAG_SIZE = 18;

type AppCurrencySelectProps<
  T extends FieldValues,
  C extends string,
> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  // The currencies to choose from, in display order (e.g. PHP, USD, JPY)
  currencies: readonly C[];
}>;

/**
 * A currency picker as a form field: one flag + code segment per currency
 *
 * @example @example <AppCurrencySelect control={control} name="currency" label={t("…")} required currencies={METROBANK_ACCOUNT_CURRENCIES} />
 */
export function AppCurrencySelect<T extends FieldValues, C extends string>({
  control,
  name,
  label,
  required = false,
  currencies,
}: AppCurrencySelectProps<T, C>) {
  const { value, onChange, onBlur, errorMessage } = useFormField({
    control,
    name,
  });

  // A tap is a complete answer: validate right away (no blur on a switch)
  const handleChange = (currency: C) => {
    onChange(currency);
    onBlur();
  };

  return (
    <FieldShell label={label} required={required} errorMessage={errorMessage}>
      <SegmentedControl
        variant="pill"
        accessibilityLabel={label}
        value={value}
        onChange={handleChange}
        options={currencies.map((code) => ({
          value: code,
          label: code,
          icon: (
            <BrandCountryFlag
              code={CURRENCY_COUNTRY[code] ?? ""}
              size={FLAG_SIZE}
              shape="circle"
            />
          ),
        }))}
      />
    </FieldShell>
  );
}
