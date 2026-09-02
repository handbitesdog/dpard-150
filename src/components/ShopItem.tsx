import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, View } from 'react-native';
import { RemoteImage } from '@/components/RemoteImage';
import type { ImageAsset } from '@/data/assets';
import { palette } from '@/design/colors';
import { opacity } from '@/design/opacity';
import { radii } from '@/design/radii';

export const SHOP_ITEM_WIDTH = 160;

type ShopItemProps = {
  name: string;
  productUrl: string;
  photo?: ImageAsset;
};

/** Product card for the Shop carousel; opens the item's product page externally. */
export function ShopItem({ name, productUrl, photo }: ShopItemProps) {
  return (
    <Pressable
      onPress={() => Linking.openURL(productUrl)}
      accessibilityRole="link"
      accessibilityLabel={`${name}, opens in browser`}
      style={({ pressed }) => [{ width: SHOP_ITEM_WIDTH, opacity: pressed ? opacity.pressed : 1 }]}
    >
      {photo ? (
        <RemoteImage source={photo} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: SHOP_ITEM_WIDTH,
    height: SHOP_ITEM_WIDTH,
    borderRadius: radii.md,
  },
  placeholder: {
    backgroundColor: palette.grey,
  },
});
