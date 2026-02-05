import { ComponentProps } from 'preact';
import { Button } from '../UNSAFE_Button';
type ButtonProps = ComponentProps<typeof Button>;
type Props = {
    onApply?: ButtonProps['onAction'];
};
export declare function MobileDropdownFooter({ onApply }: Props): import("preact").JSX.Element;
export {};
