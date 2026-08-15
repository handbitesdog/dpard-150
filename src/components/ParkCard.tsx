import type { ImageSourcePropType } from 'react-native';
import { Card } from '@/components/Card';

export const PARK_CARD_WIDTH = 240;

type ParkCardProps = {
  name: string;
  neighborhood: string;
  photo?: ImageSourcePropType;
  onPress: () => void;
};

export function ParkCard({ name, neighborhood, photo, onPress }: ParkCardProps) {
  return (
    <Card
      image={photo}
      imageSize={PARK_CARD_WIDTH}
      width={PARK_CARD_WIDTH}
      title={name}
      subtitle={neighborhood}
      onPress={onPress}
    />
  );
}
