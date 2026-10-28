/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-28
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { FC } from "react";
import { BeneficiaryCategory, TranslationKey } from "../../../../types";
import { SvgProps } from "react-native-svg";
import OwnAccountIcon from "../../../../../assets/icons/beneficiary/own-account.svg";
import CorporateIcon from "../../../../../assets/icons/beneficiary/corporate.svg";
import { useFormContext, useWatch } from "react-hook-form";
import { IndividualFormValues } from "../../../../schemas/beneficiary/individualBeneficiarySchema";
import { GradientText } from "../../../common/GradientText";
import { getInitials } from "../../../../utils/format/formatName";
import { BeneficiaryAvatar } from "../BeneficiaryAvatar";
import { StyleSheet, View } from "react-native";
import { CorporateFormValues } from "../../../../schemas/beneficiary/corporateBeneficiarySchema";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useAppTheme } from "../../../../hooks/useAppTheme";
import { Spacing } from "../../../../constants/spacing";
import { AppText } from "../../../common/AppText";
import { DEFAULT_BENEFICIARY_INITIALS } from "../../../../constants/beneficiary";

const AVATAR_SIZE = 50;
const AVATAR_ICON_SIZE = 24;

// Own account and corporate show an icon; individual shows the initials
const CATEGORY_ICONS: Readonly<
  Partial<Record<BeneficiaryCategory, FC<SvgProps>>>
> = {
  ownAccount: OwnAccountIcon,
  corporate: CorporateIcon,
};

// The form field shown under the avatar, and its text until one is typed
type CaptionField =
  | keyof Pick<IndividualFormValues, "beneAlias">
  | keyof Pick<CorporateFormValues, "companyName">;

const CATEGORY_CAPTIONS = {
  ownAccount: {
    field: "beneAlias",
    fallbackKey: "addBeneficiary.avatar.nickname",
  },
  individual: {
    field: "beneAlias",
    fallbackKey: "addBeneficiary.avatar.nickname",
  },
  corporate: {
    field: "companyName",
    fallbackKey: "addBeneficiary.avatar.company",
  },
} as const satisfies Record<
  BeneficiaryCategory,
  Readonly<{ field: CaptionField; fallbackKey: TranslationKey }>
>;

type BeneficiaryFormAvatarProps = Readonly<{
  category: BeneficiaryCategory;
}>;

// The initials of the name being typed (inside the individual form)
function TypedNameInitials() {
  const { control } = useFormContext<IndividualFormValues>();
  const [firstName, lastName] = useWatch({
    control,
    name: ["firstName", "lastName"],
  });

  const initials =
    getInitials(`${firstName} ${lastName}`) || DEFAULT_BENEFICIARY_INITIALS;

  return (
    // GradientText's mask keeps the size of its first layout: a new key
    // rebuilds it, so each change of letters is measured again
    <GradientText key={initials} typographyType="h4">
      {initials}
    </GradientText>
  );
}

/**
 * The top of the Add Beneficiary form: the category's avatar (an icon, or
 * the typed name's initials for an individual), and under it the typed
 * nickname or company name. Must be inside the form's FormProvider.
 *
 * @example <IndividualBeneficiaryForm avatar={<BeneficiaryFormAvatar category="individual" />} … />
 */
export function BeneficiaryFormAvatar({
  category,
}: BeneficiaryFormAvatarProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const CategoryIcon = CATEGORY_ICONS[category];
  const caption = CATEGORY_CAPTIONS[category];

  // Only this category's form has the field: unknown until checked
  const typedCaption: unknown = useWatch({ name: caption.field });
  const captionText =
    typeof typedCaption === "string" && typedCaption.trim()
      ? typedCaption.trim()
      : t(caption.fallbackKey);

  return (
    <View style={styles.container}>
      <BeneficiaryAvatar size={AVATAR_SIZE}>
        {CategoryIcon ? (
          <CategoryIcon width={AVATAR_ICON_SIZE} height={AVATAR_ICON_SIZE} />
        ) : (
          <TypedNameInitials />
        )}
      </BeneficiaryAvatar>

      <AppText
        typographyType="title3"
        color={colors.textPrimary}
        numberOfLines={1}
      >
        {captionText}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  // Centered above the fields
  container: {
    alignItems: "center",
    gap: Spacing.s3,
  },
  caption: {
    textAlign: "center",
  },
});
