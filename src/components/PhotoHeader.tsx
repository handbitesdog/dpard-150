import { Image, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';

const DEFAULT_HEIGHT = 320;

type PhotoHeaderProps = {
  photo?: ImageSourcePropType;
  onBack: () => void;
  onShare: () => void;
  height?: number;
};

/** Full-bleed photo banner for detail screens, with back/share controls over the image. */
export function PhotoHeader({ photo, onBack, onShare, height = DEFAULT_HEIGHT }: PhotoHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { height }]} testID="photo-header">
      {photo ? (
        <Image source={photo} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      <View style={[styles.controls, { top: insets.top + spacing.base }]}>
        <Button variant="icon" icon="chevron-back" label="Back" onPress={onBack} />
        <Button variant="icon" icon="share-outline" label="Share" onPress={onShare} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: palette.grey,
  },
  controls: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
