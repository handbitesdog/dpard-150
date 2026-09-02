import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { RemoteImage } from '@/components/RemoteImage';
import type { ImageAsset } from '@/data/assets';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';

const DEFAULT_HEIGHT = 320;

type PhotoHeaderProps = {
  photo?: ImageAsset;
  onBack: () => void;
  onShare?: () => void;
  height?: number;
  /** Overlay content rendered over the photo, below the back/share controls. */
  children?: ReactNode;
};

/** Full-bleed photo banner for detail screens, with back/share controls over the image. */
export function PhotoHeader({ photo, onBack, onShare, height = DEFAULT_HEIGHT, children }: PhotoHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { height }]} testID="photo-header">
      {photo ? (
        <RemoteImage source={photo} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      {children}

      <View style={[styles.controls, { top: insets.top + spacing.base }]}>
        <Button variant="icon" icon="chevron-back" label="Back" onPress={onBack} />
        {onShare && <Button variant="icon" icon="share-outline" label="Share" onPress={onShare} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
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
