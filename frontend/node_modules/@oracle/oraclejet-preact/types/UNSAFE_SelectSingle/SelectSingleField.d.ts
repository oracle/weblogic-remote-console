import { DropdownArrow } from "../PRIVATE_SelectCommon";
import { IconButton } from "../UNSAFE_IconButton";
import { TextField } from "../UNSAFE_TextField";
import { ComponentProps } from 'preact';
type PickedTextFieldProps = Pick<ComponentProps<typeof TextField>, 'columnSpan' | 'compactUserAssistance' | 'contentVariant' | 'endContent' | 'hasZeroStartMargin' | 'id' | 'inlineUserAssistance' | 'label' | 'labelEdge' | 'labelStartWidth' | 'mainFieldRef' | 'onBlur' | 'onFocus' | 'onKeyDown' | 'onMouseDown' | 'onMouseEnter' | 'onMouseLeave' | 'resize' | 'rootRef' | 'startContent' | 'statusVariant' | 'styleVariant' | 'testId'> & {
    children: ComponentProps<typeof TextField>['mainContent'];
};
type Props = PickedTextFieldProps & {
    hasInsideLabel?: boolean;
    isBackButtonShown?: boolean;
    isClearButtonShown?: boolean;
    isDropdownArrowShown?: boolean;
    onBackButtonClick?: ComponentProps<typeof IconButton>['onAction'];
    onClearButtonClick?: ComponentProps<typeof IconButton>['onAction'];
    onDropdownArrowClick?: ComponentProps<typeof DropdownArrow>['onClick'];
};
export declare function SelectSingleField({ children, hasInsideLabel, isBackButtonShown, isClearButtonShown, isDropdownArrowShown, onBackButtonClick, onClearButtonClick, onDropdownArrowClick, ...passThroughTextFieldProps }: Props): import("preact").JSX.Element;
export {};
