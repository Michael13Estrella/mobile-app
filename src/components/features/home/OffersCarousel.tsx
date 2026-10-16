/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { Offer } from "../../../types";
import { AppText } from "../../common/AppText";
import { Spacing } from "../../../constants/spacing";

// Must match AppScreen's content padding: the row scrolls edge to edge
const SCREEN_PADDING = Spacing.s7;
// How much of the next card shows, hinting that the row scrolls.
const NEXT_CARD_PEEK = Spacing.s9;
const CARD_GAP = Spacing.s5;
const CARD_HEIGHT = 136;
const CARD_RADIUS = Spacing.s4;
// Text column width; the rest of the image stays visible.
const TEXT_WIDTH_RATIO = "70%";

function OfferCard({
  offer,
  width,
}: Readonly<{ offer: Offer; width: number }>) {
  const { colors } = useAppTheme();

  return (
    <ImageBackground
      source={{ uri: offer.imageUrl }}
      resizeMode="cover"
      style={[styles.card, { width, backgroundColor: colors.primary }]}
      imageStyle={styles.image}
      accessibilityIgnoresInvertColors
    >
      <View style={styles.texts}>
        <AppText
          typographyType="title1"
          weight="bold"
          color={colors.textOnBrand}
          numberOfLines={3}
        >
          {offer.title}
        </AppText>
        <AppText
          typographyType="body3"
          color={colors.textOnBrand}
          numberOfLines={3}
        >
          {offer.description}
        </AppText>
      </View>
    </ImageBackground>
  );
}

type OffersCarouselProps = Readonly<{
  offers: readonly Offer[];
}>;

export function OffersCarousel({ offers }: OffersCarouselProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();

  // One card fills the screen width minus the padding and the next card's peek
  const cardWidth = screenWidth - SCREEN_PADDING * 2 - NEXT_CARD_PEEK;

  return (
    <View style={styles.container}>
      <AppText typographyType="h4" color={colors.textPrimary}>
        {t("home.offers.title")}
      </AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.row}
      >
        {offers.map((offer) => (
          <OfferCard key={offer.offerGuid} offer={offer} width={cardWidth} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.s4,
  },
  // Edge to edge: cancel the screen padding, then add it back inside.
  // flexGrow 0: ScrollView would otherwise grow to fill Home.
  scroll: {
    flexGrow: 0,
    marginHorizontal: -SCREEN_PADDING,
  },
  row: {
    alignItems: "flex-start",
    paddingHorizontal: SCREEN_PADDING,
    gap: CARD_GAP,
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    padding: Spacing.s5,
    overflow: "hidden",
    justifyContent: "center",
  },
  // The gets the card's rounded corners too.
  image: {
    borderRadius: CARD_RADIUS,
  },
  texts: {
    flex: 1,
    width: TEXT_WIDTH_RATIO,
    justifyContent: "space-between",
    gap: Spacing.s3,
  },
});
