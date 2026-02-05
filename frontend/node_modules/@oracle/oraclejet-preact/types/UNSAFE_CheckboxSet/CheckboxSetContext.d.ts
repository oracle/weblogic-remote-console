import { ValueUpdateDetail } from '../utils/UNSAFE_valueUpdateDetail';
type CheckboxSetContextValue = {
    name: string;
    value?: Set<string | number>;
    onCommit?: (detail: ValueUpdateDetail<Set<string | number>>) => void;
};
declare const CheckboxSetContext: import("preact").Context<CheckboxSetContextValue>;
declare const useCheckboxSetContext: () => CheckboxSetContextValue;
export { CheckboxSetContext, useCheckboxSetContext };
