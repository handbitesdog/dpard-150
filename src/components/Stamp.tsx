import { Image } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

type StampProps = {
  name: string;
  image: ImageSourcePropType;
  grayImage: ImageSourcePropType;
  collected: boolean;
  size: number;
};

/** A single park stamp — full color when collected, grayed out otherwise. */
export function Stamp({ name, image, grayImage, collected, size }: StampProps) {
  return (
    <Image
      source={collected ? image : grayImage}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${name} stamp, ${collected ? 'collected' : 'not yet collected'}`}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
