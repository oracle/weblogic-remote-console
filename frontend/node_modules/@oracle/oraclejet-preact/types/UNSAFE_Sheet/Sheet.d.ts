import { JSX } from 'preact';
export type CloseDetail = {
    reason: 'pointerDismissed' | 'keyboardDismissed';
};
type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
type SheetProps = IntrinsicProps & {
    onClose?: (detail: CloseDetail) => void;
    isOpen?: boolean;
    initialFocus?: 'none' | 'firstFocusable';
};
export declare const Sheet: ({ children, onClose, isOpen, initialFocus }: SheetProps) => JSX.Element;
export {};
