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

import { StyleProp, TextStyle } from "react-native";
import { splitBoldText } from "../../utils/ui/richText";
import { AppText, TypographyType } from "./AppText";

type AppRichTextProps = Readonly<{
  // Bold parts between double asterisks: "Currency (**PHP, USD**)"
  text: string;
  typographyType: TypographyType;
  color: string;
  style?: StyleProp<TextStyle>;
}>;

/**
 * A text with **bold** parts, as marked in the translations.
 *
 * @example <AppRichText text={t("…description")} typographyType="body3" color={colors.textSecondary} />
 */
export function AppRichText({
  text,
  typographyType,
  color,
  style,
}: AppRichTextProps) {
  return (
    <AppText typographyType={typographyType} color={color} style={style}>
      {splitBoldText(text).map((part, index) =>
        part.bold ? (
          <AppText
            // The parts never change order, so their position is a stable key
            key={`${index}-${part.text}`}
            typographyType={typographyType}
            weight="bold"
            color={color}
          >
            {part.text}
          </AppText>
        ) : (
          part.text
        ),
      )}
    </AppText>
  );
}
