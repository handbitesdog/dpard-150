import type { ImageSourcePropType } from 'react-native';
import { Card } from '@/components/Card';

export const FIGURE_CARD_WIDTH = 128;

type FigureCardProps = {
  name: string;
  era: string;
  portrait?: ImageSourcePropType;
  onPress: () => void;
};

export function FigureCard({ name, era, portrait, onPress }: FigureCardProps) {
  return (
    <Card
      image={portrait}
      imageSize={FIGURE_CARD_WIDTH}
      width={FIGURE_CARD_WIDTH}
      title={name}
      subtitle={era}
      onPress={onPress}
    />
  );
}
