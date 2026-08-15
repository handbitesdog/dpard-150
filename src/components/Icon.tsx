import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';
import { palette } from '@/design/colors';
import { typography } from '@/design/typography';

type IconProps = {
  icon: ComponentType<SvgProps>;
  size?: number;
  color?: string;
};

export function Icon({ icon: SvgIcon, size = typography.headline.size, color = palette.navy }: IconProps) {
  return <SvgIcon width={size} height={size} color={color} />;
}
