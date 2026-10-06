import {
  Control,
  FieldValues,
  Path,
  useController,
  UseFormClearErrors,
} from "react-hook-form";
import { useAppTheme } from "../../hooks/useAppTheme";
import { StyleSheet, View, Text } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";
import { BrandIcon } from "../icons";

const DEFAULT_LENGTH = 6;

type AppCodeInputProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  length?: number;
  prefix?: string;
  clearErrors?: UseFormClearErrors<T>;
}>;

export function AppCodeInput<T extends FieldValues>({
  control,
  name,
  length = DEFAULT_LENGTH,
  prefix,
  clearErrors,
}: AppCodeInputProps<T>) {
  const { colors } = useAppTheme();

  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name });

  const codeValue: string = value ?? "";

  const ref = useBlurOnFulfill({ value: codeValue, cellCount: length });
  const [fieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: codeValue,
    setValue: onChange,
  });

  const handleChangeText = (text: string) => {
    onChange(text.replace(/\D/g, "").slice(0, length));
    clearErrors?.(name);
  };

  const cellBorderColor = error ? colors.error : colors.borderSubtle;
  const cellTextColor = error ? colors.error : colors.textPrimary;

  return (
    <View>
      <View style={styles.container}>
        {!!prefix && (
          <Text style={[styles.prefix, { color: colors.textPrimary }]}>
            {prefix}
          </Text>
        )}
        <View style={styles.codeFieldColumn}>
          <CodeField
            ref={ref}
            {...fieldProps}
            value={codeValue}
            onChangeText={handleChangeText}
            onBlur={onBlur}
            cellCount={length}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            rootStyle={styles.codeFieldRoot}
            renderCell={({ index, symbol, isFocused }) => (
              <View
                key={index}
                style={[
                  styles.box,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: cellBorderColor,
                  },
                  isFocused && !error && { borderColor: colors.primary },
                ]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol ? (
                  <Text style={[styles.boxText, { color: cellTextColor }]}>
                    {symbol}
                  </Text>
                ) : (
                  isFocused && (
                    <Text style={[styles.boxText, { color: colors.primary }]}>
                      <Cursor />
                    </Text>
                  )
                )}
              </View>
            )}
          />
        </View>
      </View>
      {error && (
        <View style={styles.helperRow}>
          {!!prefix && (
            <Text style={[styles.prefix, styles.hiddenPrefix]}>{prefix}</Text>
          )}
          <View style={styles.codeFieldColumn}>
            <View style={styles.helperGroup}>
              <BrandIcon
                name="alertTriangleSolid"
                size={24}
                color={colors.iconError}
              />
              <Text style={[styles.helperText, { color: colors.textError }]}>
                {error?.message}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
  },
  helperRow: {
    flexDirection: "row",
    gap: Spacing.s3,
  },
  hiddenPrefix: {
    opacity: 0,
  },
  prefix: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  codeFieldRoot: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.s3,
  },
  box: {
    flex: 1,
    minWidth: 0,
    aspectRatio: 38 / 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  codeFieldColumn: {
    flex: 1,
    minWidth: 0,
  },
  helperGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    marginTop: Spacing.s3,
  },
  helperText: {
    fontSize: Typography.sizes.xs,
    flexShrink: 1,
  },
});
