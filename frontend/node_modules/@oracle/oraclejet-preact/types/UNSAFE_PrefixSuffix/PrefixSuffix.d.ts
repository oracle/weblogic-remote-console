type Props = {
    hasEndContent?: boolean;
    hasInsideLabel?: boolean;
    hasStartContent?: boolean;
    id: string;
    isDisabled?: boolean;
    isFocused?: boolean;
    text: string;
    variant: 'prefix' | 'suffix';
};
export declare function PrefixSuffix({ hasEndContent, hasInsideLabel, hasStartContent, id, isDisabled, isFocused, text, variant }: Props): import("preact").JSX.Element;
export {};
