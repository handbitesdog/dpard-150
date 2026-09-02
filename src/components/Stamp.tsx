import { RemoteImage } from '@/components/RemoteImage';
import type { ImageAsset } from '@/data/assets';

type StampProps = {
  name: string;
  image: ImageAsset;
  grayImage: ImageAsset;
  collected: boolean;
  size: number;
};

/** A single park stamp — full color when collected, grayed out otherwise. */
export function Stamp({ name, image, grayImage, collected, size }: StampProps) {
  return (
    <RemoteImage
      source={collected ? image : grayImage}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${name} stamp, ${collected ? 'collected' : 'not yet collected'}`}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
