import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
import type { FlexitemProps } from '../utils/UNSAFE_interpolations/flexitem';
type StyleProps = DimensionProps & Pick<FlexitemProps, 'flex'>;
type Props = StyleProps;
export declare const Spacer: ({ ...props }: Props) => import("preact").JSX.Element;
export {};
