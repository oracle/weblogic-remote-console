/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { useTooltip as usePreactTooltip } from '@oracle/oraclejet-preact/hooks/UNSAFE_useTooltip';
type Props = {
    /**
     * Determines if the hook is disabled or not
     * @default false
  ]   */
    isDisabled?: boolean;
    /**
     * Tooltip text
     */
    text?: string;
};
/**
 * A hook with Redwood tooltip implementation.
 * Returns event handlers that can enhance the target element with a tooltip displayed
 * on hover and focus.
 *
 * @param text tooltip text
 * @param isDisabled determines if the tooltip is disabled
 * @returns an object with the 'tooltipContent' and 'tooltipProps' properties.
 */
declare const useTooltip: ({ text, isDisabled }: Props) => ReturnType<typeof usePreactTooltip>;
export { useTooltip };
