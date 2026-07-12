declare module '@tabler/icons-react' {
  import type {
    ComponentPropsWithoutRef,
    ForwardRefExoticComponent,
    RefAttributes,
    SVGSVGElement,
  } from 'react';

  interface IconProps extends Partial<Omit<ComponentPropsWithoutRef<'svg'>, 'stroke'>> {
    size?: string | number;
    stroke?: string | number;
    title?: string;
  }

  export const IconFilter: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
}
