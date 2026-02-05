import type { TestIdProps } from "../hooks/UNSAFE_useTestId";
import { Button } from "../UNSAFE_Button";
import { ComponentProps } from 'preact/compat';
type ButtonOnAction = NonNullable<ComponentProps<typeof Button>['onAction']>;
type Props = TestIdProps & {
    /**
     * Accessible label for the today navigation button that is in the footer of the DatePicker
     * in small screens.
     *
     * Use this property to provide a screen reader aria-label for the
     * footer today navigation button.
     */
    todayNavigationAriaLabel: string;
    /**
     * Label for the today navigation button that is in the footer of the DatePicker in small screens.
     * Use this property to provide a label for the footer today navigation button.
     */
    todayNavigationLabel: string;
    /**
     * A callback function to be called when the today button is clicked. Only
     * applicable when `isTodayNavigationButtonHidden` is set to `false`.
     */
    onTodayNavigationAction?: ButtonOnAction;
};
/**
 * A Today button. The DatePicker puts this in its footer on small screens.
 * When a user presses the button, the DatePicker navigates to Today and sets focus on Today.
 */
export declare const TodayButton: ({ onTodayNavigationAction, testId, todayNavigationAriaLabel, todayNavigationLabel }: Props) => import("preact/compat").JSX.Element;
export {};
